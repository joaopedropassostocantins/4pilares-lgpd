import { eq, desc, and, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, diagnostics, InsertDiagnostic, feedbacks, InsertFeedback, coupons, couponRedemptions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDiagnostic(data: InsertDiagnostic) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(diagnostics).values(data);
  const result = await db.select().from(diagnostics).where(eq(diagnostics.publicId, data.publicId!)).limit(1);
  return result[0];
}

export async function getDiagnosticByPublicId(publicId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(diagnostics).where(eq(diagnostics.publicId, publicId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateDiagnostic(publicId: string, data: Partial<InsertDiagnostic>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(diagnostics).set(data).where(eq(diagnostics.publicId, publicId));
}

// Admin queries
export async function getAllDiagnostics(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .select()
    .from(diagnostics)
    .orderBy(desc(diagnostics.createdAt))
    .limit(limit)
    .offset(offset);
  return result;
}

export async function getDiagnosticsCount() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select({ count: diagnostics.id }).from(diagnostics);
  return result[0]?.count || 0;
}

export async function getPaidDiagnosticsCount() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .select({ count: diagnostics.id })
    .from(diagnostics)
    .where(eq(diagnostics.paymentStatus, "paid"));
  return result[0]?.count || 0;
}

export async function getTotalRevenue() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Each paid diagnostic = R$ 14.99
  const paidCount = await getPaidDiagnosticsCount();
  return paidCount * 14.99;
}

// Feedback queries
export async function createFeedback(data: InsertFeedback) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(feedbacks).values(data);
  const result = await db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt)).limit(1);
  return result[0];
}

export async function getFeedbackByDiagnosticId(diagnosticId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(feedbacks).where(eq(feedbacks.diagnosticId, diagnosticId));
  return result.length > 0 ? result[0] : null;
}

export async function getAccuracyStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select({ accuracy: feedbacks.accuracy, count: feedbacks.id }).from(feedbacks).groupBy(feedbacks.accuracy);
  return result;
}

// Coupon queries
export async function getCouponByCode(code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function applyCoupon(diagnosticId: number, couponCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const coupon = await getCouponByCode(couponCode);
  if (!coupon) {
    return { valid: false, reason: "Cupom nao encontrado" };
  }
  
  if (!coupon.active) {
    return { valid: false, reason: "Cupom inativo" };
  }
  
  if (coupon.redeemedCount >= coupon.maxRedemptions) {
    return { valid: false, reason: "Cupom expirado (limite atingido)" };
  }
  
  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return { valid: false, reason: "Cupom expirado" };
  }
  
  // Atomic transaction: increment count + insert redemption
  try {
    await db.update(coupons).set({ redeemedCount: coupon.redeemedCount + 1 }).where(eq(coupons.id, coupon.id));
    await db.insert(couponRedemptions).values({ couponId: coupon.id, diagnosticId });
    await db.update(diagnostics).set({ couponApplied: couponCode }).where(eq(diagnostics.id, diagnosticId));
    return { valid: true, finalPrice: parseFloat(coupon.fixedPrice.toString()) };
  } catch (error) {
    console.error("[Coupon] Error applying coupon:", error);
    return { valid: false, reason: "Erro ao aplicar cupom" };
  }
}
