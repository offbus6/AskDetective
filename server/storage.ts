import { db } from "@db";
import { 
  users, detectives, services, servicePackages, reviews, orders, favorites, 
  detectiveApplications, profileClaims, billingHistory, serviceCategories,
  type User, type InsertUser,
  type Detective, type InsertDetective,
  type Service, type InsertService,
  type Review, type InsertReview,
  type Order, type InsertOrder,
  type Favorite, type InsertFavorite,
  type DetectiveApplication, type InsertDetectiveApplication,
  type ProfileClaim, type InsertProfileClaim,
  type BillingHistory,
  type ServiceCategory, type InsertServiceCategory
} from "@shared/schema";
import { eq, and, desc, sql, count, avg, or, ilike, inArray } from "drizzle-orm";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  updateUserRole(id: string, role: User['role']): Promise<User | undefined>;

  // Detective operations
  getDetective(id: string): Promise<Detective | undefined>;
  getDetectiveByUserId(userId: string): Promise<Detective | undefined>;
  createDetective(detective: InsertDetective): Promise<Detective>;
  updateDetective(id: string, updates: Partial<Detective>): Promise<Detective | undefined>;
  updateDetectiveAdmin(id: string, updates: Partial<Detective>): Promise<Detective | undefined>;
  resetDetectivePassword(userId: string, newPassword: string): Promise<User | undefined>;
  getAllDetectives(limit?: number, offset?: number): Promise<Detective[]>;
  searchDetectives(filters: {
    country?: string;
    status?: string;
    plan?: string;
    searchQuery?: string;
  }, limit?: number, offset?: number): Promise<Detective[]>;

  // Service operations
  getService(id: string): Promise<Service | undefined>;
  getServicesByDetective(detectiveId: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, updates: Partial<Service>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
  searchServices(filters: {
    category?: string;
    country?: string;
    searchQuery?: string;
    minPrice?: number;
    maxPrice?: number;
  }, limit?: number, offset?: number, sortBy?: string): Promise<Array<Service & { detective: Detective, avgRating: number, reviewCount: number }>>;
  incrementServiceViews(id: string): Promise<void>;

  // Review operations
  getReview(id: string): Promise<Review | undefined>;
  getReviewsByService(serviceId: string, limit?: number): Promise<Review[]>;
  getReviewsByDetective(detectiveId: string, limit?: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined>;
  deleteReview(id: string): Promise<boolean>;
  getServiceStats(serviceId: string): Promise<{ avgRating: number, reviewCount: number }>;

  // Order operations
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUser(userId: string, limit?: number): Promise<Order[]>;
  getOrdersByDetective(detectiveId: string, limit?: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;

  // Favorite operations
  getFavoritesByUser(userId: string): Promise<Array<Favorite & { service: Service }>>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: string, serviceId: string): Promise<boolean>;
  isFavorite(userId: string, serviceId: string): Promise<boolean>;

  // Detective Application operations
  getDetectiveApplication(id: string): Promise<DetectiveApplication | undefined>;
  getAllDetectiveApplications(status?: string, limit?: number): Promise<DetectiveApplication[]>;
  createDetectiveApplication(application: InsertDetectiveApplication): Promise<DetectiveApplication>;
  updateDetectiveApplication(id: string, updates: Partial<DetectiveApplication>): Promise<DetectiveApplication | undefined>;

  // Profile Claim operations
  getProfileClaim(id: string): Promise<ProfileClaim | undefined>;
  getAllProfileClaims(status?: string, limit?: number): Promise<ProfileClaim[]>;
  createProfileClaim(claim: InsertProfileClaim): Promise<ProfileClaim>;
  updateProfileClaim(id: string, updates: Partial<ProfileClaim>): Promise<ProfileClaim | undefined>;
  approveProfileClaim(claimId: string, reviewedBy: string): Promise<{ claim: ProfileClaim; claimantUserId: string; wasNewUser: boolean }>;

  // Billing operations
  getBillingHistory(detectiveId: string, limit?: number): Promise<BillingHistory[]>;
  createBillingRecord(record: Omit<BillingHistory, 'id' | 'createdAt'>): Promise<BillingHistory>;

  // Analytics
  getDetectiveStats(detectiveId: string): Promise<{
    totalOrders: number;
    totalEarnings: string;
    avgRating: number;
    reviewCount: number;
  }>;

  // Service Category operations
  getServiceCategory(id: string): Promise<ServiceCategory | undefined>;
  getAllServiceCategories(activeOnly?: boolean): Promise<ServiceCategory[]>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  updateServiceCategory(id: string, updates: Partial<ServiceCategory>): Promise<ServiceCategory | undefined>;
  deleteServiceCategory(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, SALT_ROUNDS);
    const [user] = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
    }).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    // Whitelist only allowed fields - prevent modification of protected columns (role, email, password)
    const allowedFields: (keyof User)[] = ['name', 'avatar'];
    const safeUpdates: Partial<User> = {};
    
    for (const key of allowedFields) {
      if (key in updates) {
        (safeUpdates as any)[key] = updates[key];
      }
    }
    
    const [user] = await db.update(users)
      .set({ ...safeUpdates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Privileged method for updating user role - only for internal use by detective creation and admin operations
  async updateUserRole(id: string, role: User['role']): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Detective operations
  async getDetective(id: string): Promise<(Detective & { email?: string }) | undefined> {
    const [result] = await db.select({
      detective: detectives,
      email: users.email,
    })
    .from(detectives)
    .leftJoin(users, eq(detectives.userId, users.id))
    .where(eq(detectives.id, id))
    .limit(1);
    
    if (!result) return undefined;
    
    return {
      ...result.detective,
      email: result.email || undefined,
    };
  }

  async getDetectiveByUserId(userId: string): Promise<(Detective & { email?: string }) | undefined> {
    const [result] = await db.select({
      detective: detectives,
      email: users.email,
    })
    .from(detectives)
    .leftJoin(users, eq(detectives.userId, users.id))
    .where(eq(detectives.userId, userId))
    .limit(1);
    
    if (!result) return undefined;
    
    return {
      ...result.detective,
      email: result.email || undefined,
    };
  }

  async createDetective(insertDetective: InsertDetective): Promise<Detective> {
    const [detective] = await db.insert(detectives).values(insertDetective).returning();
    return detective;
  }

  async updateDetective(id: string, updates: Partial<Detective>): Promise<Detective | undefined> {
    // Whitelist only allowed fields - prevent modification of protected columns
    const allowedFields: (keyof Detective)[] = ['businessName', 'bio', 'location', 'phone', 'whatsapp', 'languages'];
    const safeUpdates: Partial<Detective> = {};
    
    for (const key of allowedFields) {
      if (key in updates) {
        (safeUpdates as any)[key] = updates[key];
      }
    }
    
    const [detective] = await db.update(detectives)
      .set({ ...safeUpdates, updatedAt: new Date() })
      .where(eq(detectives.id, id))
      .returning();
    return detective;
  }

  // Admin-only detective update - allows changing status, subscription plan, verification, etc.
  async updateDetectiveAdmin(id: string, updates: Partial<Detective>): Promise<Detective | undefined> {
    // Admin can update more fields including status, plan, verification
    const allowedFields: (keyof Detective)[] = [
      'businessName', 'bio', 'location', 'phone', 'whatsapp', 'languages',
      'status', 'subscriptionPlan', 'isVerified', 'country'
    ];
    const safeUpdates: Partial<Detective> = {};
    
    for (const key of allowedFields) {
      if (key in updates) {
        (safeUpdates as any)[key] = updates[key];
      }
    }
    
    const [detective] = await db.update(detectives)
      .set({ ...safeUpdates, updatedAt: new Date() })
      .where(eq(detectives.id, id))
      .returning();
    return detective;
  }

  // Reset detective password (admin only)
  async resetDetectivePassword(userId: string, newPassword: string): Promise<User | undefined> {
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const [user] = await db.update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getAllDetectives(limit: number = 50, offset: number = 0): Promise<Detective[]> {
    return await db.select()
      .from(detectives)
      .orderBy(desc(detectives.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async searchDetectives(filters: {
    country?: string;
    status?: string;
    plan?: string;
    searchQuery?: string;
  }, limit: number = 50, offset: number = 0): Promise<Detective[]> {
    let query = db.select().from(detectives);

    const conditions = [];
    if (filters.country) conditions.push(eq(detectives.country, filters.country));
    if (filters.status) conditions.push(eq(detectives.status, filters.status as any));
    if (filters.plan) conditions.push(eq(detectives.subscriptionPlan, filters.plan as any));
    if (filters.searchQuery) {
      const searchCondition = or(
        ilike(detectives.businessName, `%${filters.searchQuery}%`),
        ilike(detectives.bio, `%${filters.searchQuery}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query.orderBy(desc(detectives.createdAt)).limit(limit).offset(offset);
  }

  // Service operations
  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id)).limit(1);
    return service;
  }

  async getServicesByDetective(detectiveId: string): Promise<Service[]> {
    return await db.select()
      .from(services)
      .where(eq(services.detectiveId, detectiveId))
      .orderBy(desc(services.createdAt));
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | undefined> {
    // Whitelist only allowed fields - prevent modification of protected columns
    const allowedFields: (keyof Service)[] = ['title', 'description', 'category', 'basePrice', 'offerPrice', 'images', 'isActive'];
    const safeUpdates: Partial<Service> = {};
    
    for (const key of allowedFields) {
      if (key in updates) {
        (safeUpdates as any)[key] = updates[key];
      }
    }
    
    const [service] = await db.update(services)
      .set({ ...safeUpdates, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return result.rowCount! > 0;
  }

  async searchServices(filters: {
    category?: string;
    country?: string;
    searchQuery?: string;
    minPrice?: number;
    maxPrice?: number;
  }, limit: number = 50, offset: number = 0, sortBy: string = 'recent'): Promise<Array<Service & { detective: Detective, avgRating: number, reviewCount: number }>> {
    
    const conditions = [
      eq(services.isActive, true),
      eq(detectives.status, 'active')
    ];
    
    if (filters.category) {
      conditions.push(eq(services.category, filters.category));
    }
    
    if (filters.searchQuery) {
      const searchCondition = or(
        ilike(services.title, `%${filters.searchQuery}%`),
        ilike(services.description, `%${filters.searchQuery}%`),
        ilike(services.category, `%${filters.searchQuery}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    let query = db.select({
      service: services,
      detective: detectives,
      avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`.as('avg_rating'),
      reviewCount: count(reviews.id).as('review_count'),
    })
    .from(services)
    .innerJoin(detectives, eq(services.detectiveId, detectives.id))
    .leftJoin(reviews, and(eq(reviews.serviceId, services.id), eq(reviews.isPublished, true)))
    .where(and(...conditions))
    .groupBy(services.id, detectives.id);

    if (filters.country) {
      query = query.having(eq(detectives.country, filters.country)) as any;
    }

    // Sort
    if (sortBy === 'popular') {
      query = query.orderBy(desc(sql`${services.orderCount}`)) as any;
    } else if (sortBy === 'rating') {
      query = query.orderBy(desc(sql`avg_rating`)) as any;
    } else {
      query = query.orderBy(desc(services.createdAt)) as any;
    }

    const results = await query.limit(limit).offset(offset);
    
    return results.map((r: any) => ({
      ...r.service,
      detective: r.detective!,
      avgRating: Number(r.avgRating),
      reviewCount: Number(r.reviewCount)
    }));
  }

  async incrementServiceViews(id: string): Promise<void> {
    await db.update(services)
      .set({ viewCount: sql`${services.viewCount} + 1` })
      .where(eq(services.id, id));
  }

  // Review operations
  async getReview(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
    return review;
  }

  async getReviewsByService(serviceId: string, limit: number = 50): Promise<Review[]> {
    return await db.select()
      .from(reviews)
      .where(and(eq(reviews.serviceId, serviceId), eq(reviews.isPublished, true)))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
  }

  async getReviewsByDetective(detectiveId: string, limit: number = 50): Promise<Review[]> {
    return await db.select({
      review: reviews,
    })
    .from(reviews)
    .leftJoin(services, eq(reviews.serviceId, services.id))
    .where(and(eq(services.detectiveId, detectiveId), eq(reviews.isPublished, true)))
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .then((results: any) => results.map((r: any) => r.review));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined> {
    // Whitelist only allowed fields - prevent modification of protected columns
    const allowedFields: (keyof Review)[] = ['rating', 'comment', 'isPublished'];
    const safeUpdates: Partial<Review> = {};
    
    for (const key of allowedFields) {
      if (key in updates) {
        (safeUpdates as any)[key] = updates[key];
      }
    }
    
    const [review] = await db.update(reviews)
      .set(safeUpdates)
      .where(eq(reviews.id, id))
      .returning();
    return review;
  }

  async deleteReview(id: string): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id));
    return result.rowCount! > 0;
  }

  async getServiceStats(serviceId: string): Promise<{ avgRating: number, reviewCount: number }> {
    const [stats] = await db.select({
      avgRating: avg(reviews.rating),
      reviewCount: count(reviews.id),
    })
    .from(reviews)
    .where(and(eq(reviews.serviceId, serviceId), eq(reviews.isPublished, true)));

    return {
      avgRating: Number(stats.avgRating) || 0,
      reviewCount: Number(stats.reviewCount) || 0,
    };
  }

  // Order operations
  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return order;
  }

  async getOrdersByUser(userId: string, limit: number = 50): Promise<Order[]> {
    return await db.select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  }

  async getOrdersByDetective(detectiveId: string, limit: number = 50): Promise<Order[]> {
    return await db.select()
      .from(orders)
      .where(eq(orders.detectiveId, detectiveId))
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}`;
    const [order] = await db.insert(orders).values({
      ...insertOrder,
      orderNumber,
    }).returning();
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    // Whitelist only allowed fields - prevent modification of protected columns
    const allowedFields: (keyof Order)[] = ['status', 'requirements', 'deliveryDate'];
    const safeUpdates: Partial<Order> = {};
    
    for (const key of allowedFields) {
      if (key in updates) {
        // Convert ISO string dates to Date objects for deliveryDate
        if (key === 'deliveryDate' && typeof updates[key] === 'string') {
          (safeUpdates as any)[key] = new Date(updates[key] as string);
        } else {
          (safeUpdates as any)[key] = updates[key];
        }
      }
    }
    
    const [order] = await db.update(orders)
      .set({ ...safeUpdates, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async deleteOrder(id: string): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id));
    return result.rowCount! > 0;
  }

  // Favorite operations
  async getFavoritesByUser(userId: string): Promise<Array<Favorite & { service: Service }>> {
    const results = await db.select({
      favorite: favorites,
      service: services,
    })
    .from(favorites)
    .leftJoin(services, eq(favorites.serviceId, services.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));

    return results.map((r: any) => ({ ...r.favorite, service: r.service! }));
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db.insert(favorites).values(insertFavorite).returning();
    return favorite;
  }

  async removeFavorite(userId: string, serviceId: string): Promise<boolean> {
    const result = await db.delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.serviceId, serviceId)));
    return result.rowCount! > 0;
  }

  async isFavorite(userId: string, serviceId: string): Promise<boolean> {
    const [favorite] = await db.select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.serviceId, serviceId)))
      .limit(1);
    return !!favorite;
  }

  // Detective Application operations
  async getDetectiveApplication(id: string): Promise<DetectiveApplication | undefined> {
    const [application] = await db.select()
      .from(detectiveApplications)
      .where(eq(detectiveApplications.id, id))
      .limit(1);
    return application;
  }

  async getAllDetectiveApplications(status?: string, limit: number = 50): Promise<DetectiveApplication[]> {
    let query = db.select().from(detectiveApplications);
    
    if (status) {
      query = query.where(eq(detectiveApplications.status, status as any)) as any;
    }

    return await query.orderBy(desc(detectiveApplications.createdAt)).limit(limit);
  }

  async createDetectiveApplication(application: InsertDetectiveApplication): Promise<DetectiveApplication> {
    const [newApplication] = await db.insert(detectiveApplications)
      .values(application)
      .returning();
    return newApplication;
  }

  async updateDetectiveApplication(id: string, updates: Partial<DetectiveApplication>): Promise<DetectiveApplication | undefined> {
    const [application] = await db.update(detectiveApplications)
      .set(updates)
      .where(eq(detectiveApplications.id, id))
      .returning();
    return application;
  }

  // Profile Claim operations
  async getProfileClaim(id: string): Promise<ProfileClaim | undefined> {
    const [claim] = await db.select()
      .from(profileClaims)
      .where(eq(profileClaims.id, id))
      .limit(1);
    return claim;
  }

  async getAllProfileClaims(status?: string, limit: number = 50): Promise<ProfileClaim[]> {
    let query = db.select().from(profileClaims);
    
    if (status) {
      query = query.where(eq(profileClaims.status, status as any)) as any;
    }

    return await query.orderBy(desc(profileClaims.createdAt)).limit(limit);
  }

  async createProfileClaim(claim: InsertProfileClaim): Promise<ProfileClaim> {
    const [newClaim] = await db.insert(profileClaims)
      .values(claim)
      .returning();
    return newClaim;
  }

  async updateProfileClaim(id: string, updates: Partial<ProfileClaim>): Promise<ProfileClaim | undefined> {
    const [claim] = await db.update(profileClaims)
      .set(updates)
      .where(eq(profileClaims.id, id))
      .returning();
    return claim;
  }

  async approveProfileClaim(claimId: string, reviewedBy: string): Promise<{ claim: ProfileClaim; claimantUserId: string; wasNewUser: boolean }> {
    // Get the claim
    const claim = await this.getProfileClaim(claimId);
    if (!claim) {
      throw new Error("Claim not found");
    }

    // Get the detective profile
    const detective = await this.getDetective(claim.detectiveId);
    if (!detective) {
      throw new Error("Detective profile not found");
    }

    // Check if detective is claimable
    if (!detective.isClaimable || detective.isClaimed) {
      throw new Error("This profile cannot be claimed");
    }

    // Check if claimant already has a user account
    let claimantUser = await this.getUserByEmail(claim.claimantEmail);
    let wasNewUser = false;
    const originalRole = claimantUser?.role;
    
    // If not, create a user account for the claimant
    if (!claimantUser) {
      // Generate a temporary password (claimant will need to reset it)
      // TODO: Send password reset email to claimant so they can set their own password
      const tempPassword = Math.random().toString(36).slice(-12);
      
      claimantUser = await this.createUser({
        email: claim.claimantEmail,
        name: claim.claimantName,
        password: tempPassword,
        role: "detective",
      });

      wasNewUser = true;
      console.log(`Created user account for claimant: ${claim.claimantEmail}`);
      console.log(`IMPORTANT: Claimant needs password reset email to access account`);
    } else if (claimantUser.role !== "detective") {
      // Update user role to detective if they're not already
      const updatedUser = await this.updateUserRole(claimantUser.id, "detective");
      if (updatedUser) {
        claimantUser = updatedUser;
      }
      // NOTE: If claimant is currently logged in, they will need to log out and back in
      // to see the detective dashboard. Admin should notify them.
    }

    // Execute the ownership transfer and claim approval
    // Transfer detective ownership to claimant (bypass whitelist for claim approval)
    const [updatedDetective] = await db.update(detectives)
      .set({
        userId: claimantUser.id,
        isClaimed: true,
        isClaimable: false,
        updatedAt: new Date(),
      })
      .where(eq(detectives.id, detective.id))
      .returning();

    if (!updatedDetective) {
      // Rollback: Delete newly created user or revert role change
      if (wasNewUser) {
        await db.delete(users).where(eq(users.id, claimantUser.id));
        console.log(`Rolled back: Deleted newly created user ${claimantUser.id}`);
      } else if (originalRole && originalRole !== "detective") {
        await this.updateUserRole(claimantUser.id, originalRole);
        console.log(`Rolled back: Reverted user ${claimantUser.id} role to ${originalRole}`);
      }
      throw new Error("Failed to transfer detective ownership");
    }

    // Update claim status to approved
    const updatedClaim = await this.updateProfileClaim(claimId, {
      status: "approved",
      reviewedBy: reviewedBy,
      reviewedAt: new Date(),
    });

    if (!updatedClaim) {
      // Rollback: Revert detective ownership changes AND user account changes
      await db.update(detectives)
        .set({
          userId: detective.userId,
          isClaimed: detective.isClaimed,
          isClaimable: detective.isClaimable,
          updatedAt: new Date(),
        })
        .where(eq(detectives.id, detective.id));
      
      if (wasNewUser) {
        await db.delete(users).where(eq(users.id, claimantUser.id));
        console.log(`Rolled back: Deleted newly created user ${claimantUser.id}`);
      } else if (originalRole && originalRole !== "detective") {
        await this.updateUserRole(claimantUser.id, originalRole);
        console.log(`Rolled back: Reverted user ${claimantUser.id} role to ${originalRole}`);
      }
      
      throw new Error("Failed to update claim status - all changes rolled back");
    }

    console.log(`Transferred detective profile ${detective.id} to claimant ${claimantUser.id}`);
    if (!wasNewUser) {
      console.log(`NOTE: Claimant needs to log out and back in to access detective dashboard`);
    }

    return {
      claim: updatedClaim,
      claimantUserId: claimantUser.id,
      wasNewUser,
    };
  }

  // Billing operations
  async getBillingHistory(detectiveId: string, limit: number = 50): Promise<BillingHistory[]> {
    return await db.select()
      .from(billingHistory)
      .where(eq(billingHistory.detectiveId, detectiveId))
      .orderBy(desc(billingHistory.createdAt))
      .limit(limit);
  }

  async createBillingRecord(record: Omit<BillingHistory, 'id' | 'createdAt'>): Promise<BillingHistory> {
    const [billing] = await db.insert(billingHistory)
      .values(record as any)
      .returning();
    return billing;
  }

  // Analytics
  async getDetectiveStats(detectiveId: string): Promise<{
    totalOrders: number;
    totalEarnings: string;
    avgRating: number;
    reviewCount: number;
  }> {
    const [orderStats] = await db.select({
      totalOrders: count(orders.id),
      totalEarnings: sql<string>`COALESCE(SUM(${orders.amount}), 0)`,
    })
    .from(orders)
    .where(eq(orders.detectiveId, detectiveId));

    const serviceIds = await db.select({ id: services.id })
      .from(services)
      .where(eq(services.detectiveId, detectiveId));

    let avgRating = 0;
    let reviewCount = 0;

    if (serviceIds.length > 0) {
      const [reviewStats] = await db.select({
        avgRating: avg(reviews.rating),
        reviewCount: count(reviews.id),
      })
      .from(reviews)
      .where(and(
        inArray(reviews.serviceId, serviceIds.map((s: any) => s.id)),
        eq(reviews.isPublished, true)
      ));

      avgRating = Number(reviewStats.avgRating) || 0;
      reviewCount = Number(reviewStats.reviewCount) || 0;
    }

    return {
      totalOrders: Number(orderStats.totalOrders) || 0,
      totalEarnings: orderStats.totalEarnings || "0",
      avgRating,
      reviewCount,
    };
  }

  // Service Category operations
  async getServiceCategory(id: string): Promise<ServiceCategory | undefined> {
    const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id)).limit(1);
    return category;
  }

  async getAllServiceCategories(activeOnly: boolean = false): Promise<ServiceCategory[]> {
    let query = db.select().from(serviceCategories);
    
    if (activeOnly) {
      query = query.where(eq(serviceCategories.isActive, true)) as any;
    }

    return await query.orderBy(desc(serviceCategories.createdAt));
  }

  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const [newCategory] = await db.insert(serviceCategories).values(category).returning();
    return newCategory;
  }

  async updateServiceCategory(id: string, updates: Partial<ServiceCategory>): Promise<ServiceCategory | undefined> {
    const allowedFields: (keyof ServiceCategory)[] = ['name', 'description', 'isActive'];
    const safeUpdates: Partial<ServiceCategory> = {};
    
    for (const key of allowedFields) {
      if (key in updates) {
        (safeUpdates as any)[key] = updates[key];
      }
    }
    
    const [category] = await db.update(serviceCategories)
      .set({ ...safeUpdates, updatedAt: new Date() })
      .where(eq(serviceCategories.id, id))
      .returning();
    return category;
  }

  async deleteServiceCategory(id: string): Promise<boolean> {
    const [category] = await db.update(serviceCategories)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(serviceCategories.id, id))
      .returning();
    return !!category;
  }
}

export const storage = new DatabaseStorage();
