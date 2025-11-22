import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb, pgEnum, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["user", "detective", "admin"]);
export const subscriptionPlanEnum = pgEnum("subscription_plan", ["free", "pro", "agency"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "in_progress", "completed", "cancelled", "refunded"]);
export const claimStatusEnum = pgEnum("claim_status", ["pending", "under_review", "approved", "rejected"]);
export const detectiveStatusEnum = pgEnum("detective_status", ["pending", "active", "suspended", "inactive"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("user"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
  roleIdx: index("users_role_idx").on(table.role),
}));

export const detectives = pgTable("detectives", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  businessName: text("business_name"),
  bio: text("bio"),
  location: text("location"),
  country: text("country").notNull(),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  languages: text("languages").array().default(sql`ARRAY['English']::text[]`),
  memberSince: timestamp("member_since").notNull().defaultNow(),
  subscriptionPlan: subscriptionPlanEnum("subscription_plan").notNull().default("free"),
  status: detectiveStatusEnum("status").notNull().default("pending"),
  isVerified: boolean("is_verified").notNull().default(false),
  isClaimed: boolean("is_claimed").notNull().default(false),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).notNull().default("0"),
  avgResponseTime: integer("avg_response_time"),
  lastActive: timestamp("last_active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("detectives_user_id_idx").on(table.userId),
  countryIdx: index("detectives_country_idx").on(table.country),
  statusIdx: index("detectives_status_idx").on(table.status),
  planIdx: index("detectives_plan_idx").on(table.subscriptionPlan),
}));

export const serviceCategories = pgTable("service_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  nameIdx: index("service_categories_name_idx").on(table.name),
  activeIdx: index("service_categories_active_idx").on(table.isActive),
}));

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  detectiveId: varchar("detective_id").notNull().references(() => detectives.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  images: text("images").array().default(sql`ARRAY[]::text[]`),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  offerPrice: decimal("offer_price", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").notNull().default(true),
  viewCount: integer("view_count").notNull().default(0),
  orderCount: integer("order_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  detectiveIdIdx: index("services_detective_id_idx").on(table.detectiveId),
  categoryIdx: index("services_category_idx").on(table.category),
  activeIdx: index("services_active_idx").on(table.isActive),
  orderCountIdx: index("services_order_count_idx").on(table.orderCount),
}));

export const servicePackages = pgTable("service_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  offerPrice: decimal("offer_price", { precision: 10, scale: 2 }),
  features: text("features").array().notNull(),
  deliveryTime: integer("delivery_time"),
  isEnabled: boolean("is_enabled").notNull().default(true),
  tierLevel: integer("tier_level").notNull(),
}, (table) => ({
  serviceIdIdx: index("service_packages_service_id_idx").on(table.serviceId),
}));

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderId: varchar("order_id"),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  serviceIdIdx: index("reviews_service_id_idx").on(table.serviceId),
  userIdIdx: index("reviews_user_id_idx").on(table.userId),
  ratingIdx: index("reviews_rating_idx").on(table.rating),
}));

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  serviceId: varchar("service_id").notNull().references(() => services.id),
  packageId: varchar("package_id").references(() => servicePackages.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  detectiveId: varchar("detective_id").notNull().references(() => detectives.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  requirements: text("requirements"),
  deliveryDate: timestamp("delivery_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  orderNumberIdx: index("orders_order_number_idx").on(table.orderNumber),
  userIdIdx: index("orders_user_id_idx").on(table.userId),
  detectiveIdIdx: index("orders_detective_id_idx").on(table.detectiveId),
  statusIdx: index("orders_status_idx").on(table.status),
  createdAtIdx: index("orders_created_at_idx").on(table.createdAt),
}));

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  serviceId: varchar("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userServiceIdx: index("favorites_user_service_idx").on(table.userId, table.serviceId),
}));

export const detectiveApplications = pgTable("detective_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phoneCountryCode: text("phone_country_code"),
  phoneNumber: text("phone_number"),
  businessType: text("business_type").notNull(),
  companyName: text("company_name"),
  businessWebsite: text("business_website"),
  businessDocuments: text("business_documents").array().default(sql`ARRAY[]::text[]`),
  country: text("country"),
  state: text("state"),
  city: text("city"),
  yearsExperience: text("years_experience"),
  serviceCategories: text("service_categories").array().default(sql`ARRAY[]::text[]`),
  categoryPricing: jsonb("category_pricing"),
  about: text("about"),
  licenseNumber: text("license_number"),
  documents: text("documents").array().default(sql`ARRAY[]::text[]`),
  status: claimStatusEnum("status").notNull().default("pending"),
  reviewNotes: text("review_notes"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  emailIdx: index("detective_applications_email_idx").on(table.email),
  statusIdx: index("detective_applications_status_idx").on(table.status),
}));

export const profileClaims = pgTable("profile_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  detectiveId: varchar("detective_id").notNull().references(() => detectives.id),
  claimantName: text("claimant_name").notNull(),
  claimantEmail: text("claimant_email").notNull(),
  claimantPhone: text("claimant_phone"),
  documents: text("documents").array().default(sql`ARRAY[]::text[]`),
  details: text("details"),
  status: claimStatusEnum("status").notNull().default("pending"),
  reviewNotes: text("review_notes"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  detectiveIdIdx: index("profile_claims_detective_id_idx").on(table.detectiveId),
  statusIdx: index("profile_claims_status_idx").on(table.status),
}));

export const billingHistory = pgTable("billing_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  detectiveId: varchar("detective_id").notNull().references(() => detectives.id, { onDelete: "cascade" }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  plan: text("plan").notNull(),
  paymentMethod: text("payment_method"),
  status: text("status").notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  detectiveIdIdx: index("billing_history_detective_id_idx").on(table.detectiveId),
  invoiceNumberIdx: index("billing_history_invoice_number_idx").on(table.invoiceNumber),
}));

export const session = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
}, (table) => ({
  expireIdx: index("session_expire_idx").on(table.expire),
}));

// Zod Schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertDetectiveSchema = createInsertSchema(detectives, {
  country: z.string().min(2),
  phone: z.string().optional(),
  bio: z.string().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertServiceSchema = createInsertSchema(services, {
  title: z.string().min(10).max(200),
  description: z.string().min(50),
  category: z.string().min(3),
  basePrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
}).omit({ id: true, createdAt: true, updatedAt: true, viewCount: true, orderCount: true });

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).optional(),
}).omit({ id: true, createdAt: true });

export const insertOrderSchema = createInsertSchema(orders, {
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  requirements: z.string().optional(),
}).omit({ id: true, orderNumber: true, createdAt: true, updatedAt: true });

export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true, createdAt: true });

export const insertDetectiveApplicationSchema = createInsertSchema(detectiveApplications, {
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2),
  businessType: z.enum(["individual", "agency"]),
  phoneCountryCode: z.string().min(1),
  phoneNumber: z.string().min(1),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  yearsExperience: z.string().optional(),
  serviceCategories: z.array(z.string()).max(2).optional(),
  categoryPricing: z.array(z.object({
    category: z.string(),
    price: z.string(),
    currency: z.string(),
  })).max(2).optional(),
  about: z.string().optional(),
  companyName: z.string().optional(),
  businessWebsite: z.string().url().optional(),
  businessDocuments: z.array(z.string()).optional(),
}).omit({ id: true, createdAt: true, reviewedAt: true });

export const insertProfileClaimSchema = createInsertSchema(profileClaims, {
  claimantEmail: z.string().email(),
  claimantName: z.string().min(2),
}).omit({ id: true, createdAt: true, reviewedAt: true });

// Update schemas - whitelist only allowed fields for security
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().url().optional(),
}).strict();

export const updateDetectiveSchema = z.object({
  businessName: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  languages: z.array(z.string()).optional(),
}).strict();

export const updateServiceSchema = z.object({
  title: z.string().min(10).max(200).optional(),
  description: z.string().min(50).optional(),
  category: z.string().min(3).optional(),
  basePrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  offerPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  images: z.array(z.string().url()).optional(),
  isActive: z.boolean().optional(),
}).strict();

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10).optional(),
  isPublished: z.boolean().optional(),
}).strict();

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed", "cancelled", "refunded"]).optional(),
  requirements: z.string().optional(),
  deliveryDate: z.string().datetime().optional(),
}).strict();

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Detective = typeof detectives.$inferSelect;
export type InsertDetective = z.infer<typeof insertDetectiveSchema>;

export const insertServiceCategorySchema = createInsertSchema(serviceCategories, {
  name: z.string().min(3).max(100),
  description: z.string().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const updateServiceCategorySchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
}).strict();

export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type ServicePackage = typeof servicePackages.$inferSelect;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type DetectiveApplication = typeof detectiveApplications.$inferSelect;
export type InsertDetectiveApplication = z.infer<typeof insertDetectiveApplicationSchema>;

export type ProfileClaim = typeof profileClaims.$inferSelect;
export type InsertProfileClaim = z.infer<typeof insertProfileClaimSchema>;

export type BillingHistory = typeof billingHistory.$inferSelect;
