import fs from "node:fs";
import pkg from "pg";
const { Pool } = pkg;

async function main() {
  const url = process.env.DATABASE_URL!;
  const file = process.env.MIGRATION_FILE || "migrations/0000_foamy_cammi.sql";
  const sql = await fs.promises.readFile(file, "utf-8");
  const statements = sql.split("--> statement-breakpoint").map(s => s.trim()).filter(Boolean);
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  const client = await pool.connect();
  try {
    for (const stmt of statements) {
      await client.query(stmt);
    }
    console.log("Applied migration:", file);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

