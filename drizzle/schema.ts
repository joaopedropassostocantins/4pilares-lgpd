import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const diagnostics = mysqlTable("diagnostics", {
  id: int("id").autoincrement().primaryKey(),
  publicId: varchar("publicId", { length: 32 }).notNull().unique(),
  consultantName: varchar("consultantName", { length: 128 }),
  email: varchar("email", { length: 320 }),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  birthDate: varchar("birthDate", { length: 20 }).notNull(),
  birthTime: varchar("birthTime", { length: 10 }),
  birthPlace: varchar("birthPlace", { length: 256 }),
  hasDst: int("hasDst").default(0).notNull(),
  pillarsData: json("pillarsData"),
  tastingAnalysis: text("tastingAnalysis"),
  basicAnalysis: text("basicAnalysis"),
  fullAnalysis: text("fullAnalysis"),
  paymentId: varchar("paymentId", { length: 64 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid"]).default("pending").notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["pix", "card"]),
  pixPayload: text("pixPayload"),
  pixTxid: varchar("pixTxid", { length: 64 }),
  amountPaid: decimal("amountPaid", { precision: 10, scale: 2 }),
  couponApplied: varchar("couponApplied", { length: 64 }),
  analysisVariant: mysqlEnum("analysisVariant", ["epic", "predictive"]).default("predictive").notNull(),
  archetype: varchar("archetype", { length: 64 }),
  whatsappPhone: varchar("whatsappPhone", { length: 20 }),
  whatsappSentAt: timestamp("whatsappSentAt"),
  emailSentAt: timestamp("emailSentAt"),
  abTestVariant: mysqlEnum("abTestVariant", ["A", "B"]).default("A").notNull(),
  selectedPlan: mysqlEnum("selectedPlan", ["promo", "normal", "lifetime"]),
  selectedHooks: json("selectedHooks"),
  selectedVariants: json("selectedVariants"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Diagnostic = typeof diagnostics.$inferSelect;
export type InsertDiagnostic = typeof diagnostics.$inferInsert;

export const feedbacks = mysqlTable("feedbacks", {
  id: int("id").autoincrement().primaryKey(),
  diagnosticId: int("diagnosticId").notNull(),
  accuracy: mysqlEnum("accuracy", ["very_accurate", "accurate", "neutral", "inaccurate", "very_inaccurate"]).notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Feedback = typeof feedbacks.$inferSelect;
export type InsertFeedback = typeof feedbacks.$inferInsert;

export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  discountType: mysqlEnum("discountType", ["fixed", "percentage"]).notNull(),
  discountValue: decimal("discountValue", { precision: 10, scale: 2 }).notNull(),
  maxUses: int("maxUses").notNull(),
  usedCount: int("usedCount").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;

export const couponRedemptions = mysqlTable("coupon_redemptions", {
  id: int("id").autoincrement().primaryKey(),
  couponId: int("couponId").notNull(),
  diagnosticPublicId: varchar("diagnosticPublicId", { length: 32 }).notNull(),
  appliedAt: timestamp("appliedAt").defaultNow().notNull(),
});

export type CouponRedemption = typeof couponRedemptions.$inferSelect;
export type InsertCouponRedemption = typeof couponRedemptions.$inferInsert;

export const capabilities = mysqlTable("capabilities", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  status: mysqlEnum("status", ["enabled", "disabled", "beta"]).default("enabled").notNull(),
  version: varchar("version", { length: 32 }).default("1.0.0").notNull(),
  metadata: json("metadata"),
  enabledAt: timestamp("enabledAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Capability = typeof capabilities.$inferSelect;
export type InsertCapability = typeof capabilities.$inferInsert;
