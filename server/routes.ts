import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { 
  insertUserSchema, 
  insertDetectiveSchema, 
  insertServiceSchema, 
  insertReviewSchema,
  insertOrderSchema,
  insertFavoriteSchema,
  insertDetectiveApplicationSchema,
  insertProfileClaimSchema,
  insertServiceCategorySchema,
  updateUserSchema,
  updateDetectiveSchema,
  updateServiceSchema,
  updateReviewSchema,
  updateOrderSchema,
  updateServiceCategorySchema,
  type User
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

// Extend Express Session
declare module "express-session" {
  interface SessionData {
    userId: string;
    userRole: string;
  }
}

// Middleware to check if user is authenticated
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized - Please log in" });
  }
  next();
};

// Middleware to check for specific roles
const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized - Please log in" });
    }
    if (!roles.includes(req.session.userRole || "")) {
      return res.status(403).json({ error: "Forbidden - Insufficient permissions" });
    }
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============== AUTHENTICATION ROUTES ==============
  
  // Register new user
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const user = await storage.createUser(validatedData);
      
      // Set session
      req.session.userId = user.id;
      req.session.userRole = user.role;

      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Set session
      req.session.userId = user.id;
      req.session.userRole = user.role;

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to log in" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // ============== DETECTIVE ROUTES ==============

  // Get all detectives (public)
  app.get("/api/detectives", async (req: Request, res: Response) => {
    try {
      const { country, status, plan, search, limit = "50", offset = "0" } = req.query;

      const detectives = await storage.searchDetectives({
        country: country as string,
        status: status as string,
        plan: plan as string,
        searchQuery: search as string,
      }, parseInt(limit as string), parseInt(offset as string));

      res.json({ detectives });
    } catch (error) {
      console.error("Get detectives error:", error);
      res.status(500).json({ error: "Failed to get detectives" });
    }
  });

  // Get detective by ID (public)
  app.get("/api/detectives/:id", async (req: Request, res: Response) => {
    try {
      const detective = await storage.getDetective(req.params.id);
      if (!detective) {
        return res.status(404).json({ error: "Detective not found" });
      }
      res.json({ detective });
    } catch (error) {
      console.error("Get detective error:", error);
      res.status(500).json({ error: "Failed to get detective" });
    }
  });

  // Create detective profile (requires authentication)
  app.post("/api/detectives", requireAuth, async (req: Request, res: Response) => {
    try {
      const validatedData = insertDetectiveSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });

      // Check if user already has a detective profile
      const existing = await storage.getDetectiveByUserId(req.session.userId!);
      if (existing) {
        return res.status(400).json({ error: "Detective profile already exists" });
      }

      const detective = await storage.createDetective(validatedData);
      
      // Update user role to detective using privileged method
      await storage.updateUserRole(req.session.userId!, "detective");
      req.session.userRole = "detective";

      res.status(201).json({ detective });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Create detective error:", error);
      res.status(500).json({ error: "Failed to create detective profile" });
    }
  });

  // Update detective profile (requires detective role)
  app.patch("/api/detectives/:id", requireRole("detective", "admin"), async (req: Request, res: Response) => {
    try {
      const detective = await storage.getDetective(req.params.id);
      if (!detective) {
        return res.status(404).json({ error: "Detective not found" });
      }

      // Check ownership unless admin
      if (req.session.userRole !== "admin" && detective.userId !== req.session.userId) {
        return res.status(403).json({ error: "Cannot update another detective's profile" });
      }

      // Validate request body - only allow whitelisted fields
      const validatedData = updateDetectiveSchema.parse(req.body);
      const updatedDetective = await storage.updateDetective(req.params.id, validatedData);
      res.json({ detective: updatedDetective });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Update detective error:", error);
      res.status(500).json({ error: "Failed to update detective" });
    }
  });

  // Get detective stats (requires detective role)
  app.get("/api/detectives/:id/stats", requireRole("detective", "admin"), async (req: Request, res: Response) => {
    try {
      const detective = await storage.getDetective(req.params.id);
      if (!detective) {
        return res.status(404).json({ error: "Detective not found" });
      }

      // Check ownership unless admin
      if (req.session.userRole !== "admin" && detective.userId !== req.session.userId) {
        return res.status(403).json({ error: "Cannot view another detective's stats" });
      }

      const stats = await storage.getDetectiveStats(req.params.id);
      res.json({ stats });
    } catch (error) {
      console.error("Get detective stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  // ============== SERVICE ROUTES ==============

  // Search services (public)
  app.get("/api/services", async (req: Request, res: Response) => {
    try {
      const { category, country, search, minPrice, maxPrice, sortBy, limit = "50", offset = "0" } = req.query;

      const services = await storage.searchServices({
        category: category as string,
        country: country as string,
        searchQuery: search as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      }, parseInt(limit as string), parseInt(offset as string), sortBy as string);

      res.json({ services });
    } catch (error) {
      console.error("Search services error:", error);
      res.status(500).json({ error: "Failed to search services" });
    }
  });

  // Get service by ID (public)
  app.get("/api/services/:id", async (req: Request, res: Response) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Increment view count
      await storage.incrementServiceViews(req.params.id);

      // Get detective info
      const detective = await storage.getDetective(service.detectiveId);

      // Get stats
      const stats = await storage.getServiceStats(req.params.id);

      res.json({ 
        service,
        detective,
        avgRating: stats.avgRating,
        reviewCount: stats.reviewCount
      });
    } catch (error) {
      console.error("Get service error:", error);
      res.status(500).json({ error: "Failed to get service" });
    }
  });

  // Create service (requires detective role)
  app.post("/api/services", requireRole("detective"), async (req: Request, res: Response) => {
    try {
      const detective = await storage.getDetectiveByUserId(req.session.userId!);
      if (!detective) {
        return res.status(400).json({ error: "Must create detective profile first" });
      }

      const validatedData = insertServiceSchema.parse({
        ...req.body,
        detectiveId: detective.id,
      });

      // Validate that the category exists and is active
      const categories = await storage.getAllServiceCategories(true);
      const categoryExists = categories.some(cat => cat.name === validatedData.category);
      if (!categoryExists) {
        return res.status(400).json({ error: "Invalid service category. Please select a valid category from the admin-managed list." });
      }

      const service = await storage.createService(validatedData);
      res.status(201).json({ service });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Create service error:", error);
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  // Update service (requires detective role)
  app.patch("/api/services/:id", requireRole("detective", "admin"), async (req: Request, res: Response) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Check ownership unless admin
      if (req.session.userRole !== "admin") {
        const detective = await storage.getDetectiveByUserId(req.session.userId!);
        if (!detective || service.detectiveId !== detective.id) {
          return res.status(403).json({ error: "Cannot update another detective's service" });
        }
      }

      // Validate request body - only allow whitelisted fields
      const validatedData = updateServiceSchema.parse(req.body);

      // Validate category if it's being updated
      if (validatedData.category) {
        const categories = await storage.getAllServiceCategories(true);
        const categoryExists = categories.some(cat => cat.name === validatedData.category);
        if (!categoryExists) {
          return res.status(400).json({ error: "Invalid service category. Please select a valid category from the admin-managed list." });
        }
      }

      const updatedService = await storage.updateService(req.params.id, validatedData);
      res.json({ service: updatedService });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Update service error:", error);
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  // Delete service (requires detective role)
  app.delete("/api/services/:id", requireRole("detective", "admin"), async (req: Request, res: Response) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Check ownership unless admin
      if (req.session.userRole !== "admin") {
        const detective = await storage.getDetectiveByUserId(req.session.userId!);
        if (!detective || service.detectiveId !== detective.id) {
          return res.status(403).json({ error: "Cannot delete another detective's service" });
        }
      }

      await storage.deleteService(req.params.id);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Delete service error:", error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // ============== REVIEW ROUTES ==============

  // Get reviews for a service (public)
  app.get("/api/services/:id/reviews", async (req: Request, res: Response) => {
    try {
      const { limit = "50" } = req.query;
      const reviews = await storage.getReviewsByService(req.params.id, parseInt(limit as string));
      res.json({ reviews });
    } catch (error) {
      console.error("Get reviews error:", error);
      res.status(500).json({ error: "Failed to get reviews" });
    }
  });

  // Create review (requires authentication)
  app.post("/api/reviews", requireAuth, async (req: Request, res: Response) => {
    try {
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });

      const review = await storage.createReview(validatedData);
      res.status(201).json({ review });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Create review error:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Update review (requires user ownership)
  app.patch("/api/reviews/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const review = await storage.getReview(req.params.id);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      // Check ownership unless admin
      if (req.session.userRole !== "admin" && review.userId !== req.session.userId) {
        return res.status(403).json({ error: "Cannot update another user's review" });
      }

      // Validate request body - only allow whitelisted fields
      const validatedData = updateReviewSchema.parse(req.body);
      const updatedReview = await storage.updateReview(req.params.id, validatedData);
      res.json({ review: updatedReview });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Update review error:", error);
      res.status(500).json({ error: "Failed to update review" });
    }
  });

  // ============== ORDER ROUTES ==============

  // Get user's orders
  app.get("/api/orders/user", requireAuth, async (req: Request, res: Response) => {
    try {
      const { limit = "50" } = req.query;
      const orders = await storage.getOrdersByUser(req.session.userId!, parseInt(limit as string));
      res.json({ orders });
    } catch (error) {
      console.error("Get user orders error:", error);
      res.status(500).json({ error: "Failed to get orders" });
    }
  });

  // Get detective's orders
  app.get("/api/orders/detective", requireRole("detective"), async (req: Request, res: Response) => {
    try {
      const detective = await storage.getDetectiveByUserId(req.session.userId!);
      if (!detective) {
        return res.status(400).json({ error: "Detective profile not found" });
      }

      const { limit = "50" } = req.query;
      const orders = await storage.getOrdersByDetective(detective.id, parseInt(limit as string));
      res.json({ orders });
    } catch (error) {
      console.error("Get detective orders error:", error);
      res.status(500).json({ error: "Failed to get orders" });
    }
  });

  // Create order (requires authentication)
  app.post("/api/orders", requireAuth, async (req: Request, res: Response) => {
    try {
      const service = await storage.getService(req.body.serviceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      const validatedData = insertOrderSchema.parse({
        ...req.body,
        userId: req.session.userId,
        detectiveId: service.detectiveId,
      });

      const order = await storage.createOrder(validatedData);
      res.status(201).json({ order });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Create order error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Update order
  app.patch("/api/orders/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Check if user is buyer or seller
      const detective = await storage.getDetectiveByUserId(req.session.userId!);
      const isOwner = order.userId === req.session.userId;
      const isDetective = detective && order.detectiveId === detective.id;

      if (!isOwner && !isDetective && req.session.userRole !== "admin") {
        return res.status(403).json({ error: "Cannot update this order" });
      }

      // Validate request body - only allow whitelisted fields
      const validatedData = updateOrderSchema.parse(req.body);
      // Type assertion is safe because storage.updateOrder handles string-to-Date conversion internally
      const updatedOrder = await storage.updateOrder(req.params.id, validatedData as any);
      res.json({ order: updatedOrder });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Update order error:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // ============== FAVORITE ROUTES ==============

  // Get user's favorites
  app.get("/api/favorites", requireAuth, async (req: Request, res: Response) => {
    try {
      const favorites = await storage.getFavoritesByUser(req.session.userId!);
      res.json({ favorites });
    } catch (error) {
      console.error("Get favorites error:", error);
      res.status(500).json({ error: "Failed to get favorites" });
    }
  });

  // Add favorite
  app.post("/api/favorites", requireAuth, async (req: Request, res: Response) => {
    try {
      const validatedData = insertFavoriteSchema.parse({
        userId: req.session.userId,
        serviceId: req.body.serviceId,
      });

      const favorite = await storage.addFavorite(validatedData);
      res.status(201).json({ favorite });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Add favorite error:", error);
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  // Remove favorite
  app.delete("/api/favorites/:serviceId", requireAuth, async (req: Request, res: Response) => {
    try {
      await storage.removeFavorite(req.session.userId!, req.params.serviceId);
      res.json({ message: "Favorite removed successfully" });
    } catch (error) {
      console.error("Remove favorite error:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  // ============== DETECTIVE APPLICATION ROUTES ==============

  // Submit detective application (public)
  app.post("/api/applications", async (req: Request, res: Response) => {
    try {
      const validatedData = insertDetectiveApplicationSchema.parse(req.body);
      const application = await storage.createDetectiveApplication(validatedData);
      res.status(201).json({ application });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Create application error:", error);
      res.status(500).json({ error: "Failed to create application" });
    }
  });

  // Get all applications (admin only)
  app.get("/api/applications", requireRole("admin"), async (req: Request, res: Response) => {
    try {
      const { status, limit = "50" } = req.query;
      const applications = await storage.getAllDetectiveApplications(status as string, parseInt(limit as string));
      res.json({ applications });
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ error: "Failed to get applications" });
    }
  });

  // Update application (admin only)
  app.patch("/api/applications/:id", requireRole("admin"), async (req: Request, res: Response) => {
    try {
      // Only allow status and reviewNotes to be updated
      const allowedData = z.object({
        status: z.enum(["pending", "under_review", "approved", "rejected"]).optional(),
        reviewNotes: z.string().optional(),
      }).strict().parse(req.body);

      const application = await storage.updateDetectiveApplication(req.params.id, {
        ...allowedData,
        reviewedBy: req.session.userId,
        reviewedAt: new Date(),
      });
      res.json({ application });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Update application error:", error);
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  // ============== PROFILE CLAIM ROUTES ==============

  // Submit profile claim (public)
  app.post("/api/claims", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProfileClaimSchema.parse(req.body);
      const claim = await storage.createProfileClaim(validatedData);
      res.status(201).json({ claim });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Create claim error:", error);
      res.status(500).json({ error: "Failed to create claim" });
    }
  });

  // Get all claims (admin only)
  app.get("/api/claims", requireRole("admin"), async (req: Request, res: Response) => {
    try {
      const { status, limit = "50" } = req.query;
      const claims = await storage.getAllProfileClaims(status as string, parseInt(limit as string));
      res.json({ claims });
    } catch (error) {
      console.error("Get claims error:", error);
      res.status(500).json({ error: "Failed to get claims" });
    }
  });

  // Update claim (admin only)
  app.patch("/api/claims/:id", requireRole("admin"), async (req: Request, res: Response) => {
    try {
      // Only allow status and reviewNotes to be updated
      const allowedData = z.object({
        status: z.enum(["pending", "under_review", "approved", "rejected"]).optional(),
        reviewNotes: z.string().optional(),
      }).strict().parse(req.body);

      const claim = await storage.updateProfileClaim(req.params.id, {
        ...allowedData,
        reviewedBy: req.session.userId,
        reviewedAt: new Date(),
      });
      res.json({ claim });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Update claim error:", error);
      res.status(500).json({ error: "Failed to update claim" });
    }
  });

  // ============== BILLING ROUTES ==============

  // Get billing history (detective only)
  app.get("/api/billing", requireRole("detective"), async (req: Request, res: Response) => {
    try {
      const detective = await storage.getDetectiveByUserId(req.session.userId!);
      if (!detective) {
        return res.status(400).json({ error: "Detective profile not found" });
      }

      const { limit = "50" } = req.query;
      const billingHistory = await storage.getBillingHistory(detective.id, parseInt(limit as string));
      res.json({ billingHistory });
    } catch (error) {
      console.error("Get billing history error:", error);
      res.status(500).json({ error: "Failed to get billing history" });
    }
  });

  // ============== SERVICE CATEGORY ROUTES ==============

  // Get all service categories (public, with optional active filter)
  app.get("/api/service-categories", async (req: Request, res: Response) => {
    try {
      const { activeOnly } = req.query;
      const categories = await storage.getAllServiceCategories(activeOnly === "true");
      res.json({ categories });
    } catch (error) {
      console.error("Get service categories error:", error);
      res.status(500).json({ error: "Failed to get service categories" });
    }
  });

  // Get service category by ID (public)
  app.get("/api/service-categories/:id", async (req: Request, res: Response) => {
    try {
      const category = await storage.getServiceCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Service category not found" });
      }
      res.json({ category });
    } catch (error) {
      console.error("Get service category error:", error);
      res.status(500).json({ error: "Failed to get service category" });
    }
  });

  // Create service category (admin only)
  app.post("/api/service-categories", requireRole("admin"), async (req: Request, res: Response) => {
    try {
      const validatedData = insertServiceCategorySchema.parse(req.body);
      const category = await storage.createServiceCategory(validatedData);
      res.status(201).json({ category });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Create service category error:", error);
      res.status(500).json({ error: "Failed to create service category" });
    }
  });

  // Update service category (admin only)
  app.patch("/api/service-categories/:id", requireRole("admin"), async (req: Request, res: Response) => {
    try {
      const category = await storage.getServiceCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Service category not found" });
      }

      const validatedData = updateServiceCategorySchema.parse(req.body);
      const updatedCategory = await storage.updateServiceCategory(req.params.id, validatedData);
      res.json({ category: updatedCategory });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Update service category error:", error);
      res.status(500).json({ error: "Failed to update service category" });
    }
  });

  // Delete service category (admin only) - soft delete by marking as inactive
  app.delete("/api/service-categories/:id", requireRole("admin"), async (req: Request, res: Response) => {
    try {
      const category = await storage.getServiceCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Service category not found" });
      }

      await storage.deleteServiceCategory(req.params.id);
      res.json({ message: "Service category deleted successfully" });
    } catch (error) {
      console.error("Delete service category error:", error);
      res.status(500).json({ error: "Failed to delete service category" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
