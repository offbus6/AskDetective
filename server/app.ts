import { type Server } from "node:http";

import express, { type Express, type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { randomBytes } from "node:crypto";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";
import { registerRoutes } from "./routes";

const PgSession = connectPgSimple(session);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  limit: '50mb',
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
if (process.env.NODE_ENV === 'production') {
  app.use("/api/auth/", authLimiter);
}

const useMemorySession = process.env.NODE_ENV === 'development' || (process.env.SESSION_USE_MEMORY === 'true' && process.env.NODE_ENV !== 'production');
const sessionStore = useMemorySession
  ? new (session as any).MemoryStore()
  : new PgSession({
      pool: new Pool({ connectionString: process.env.DATABASE_URL }),
      tableName: "session",
      createTableIfMissing: true,
    });

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || (process.env.NODE_ENV === 'development' ? "finddetectives-secret-key-change-in-production" : randomBytes(32).toString('hex')),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  const redact = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;
    const maskKeys = new Set(["password", "temporaryPassword", "token", "apiKey", "smtpPass"]);
    if (Array.isArray(obj)) return obj.map(redact);
    const out: any = {};
    for (const k of Object.keys(obj)) {
      const v = (obj as any)[k];
      out[k] = maskKeys.has(k) ? "***redacted***" : (typeof v === 'object' ? redact(v) : v);
    }
    return out;
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse && process.env.NODE_ENV !== 'production') {
        logLine += ` :: ${JSON.stringify(redact(capturedJsonResponse))}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>,
) {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly run the final setup after setting up all the other routes so
  // the catch-all route doesn't interfere with the other routes
  await setup(app, server);

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const host = process.env.HOST || '127.0.0.1';
  server.listen({
    port,
    host,
  }, () => {
    log(`serving on port ${port}`);
  });
}
