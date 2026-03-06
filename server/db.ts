import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, diagnostics, InsertDiagnostic, Diagnostic, feedbacks, InsertFeedback, coupons, couponRedemptions } from "../drizzle/schema";
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
  // Return the created diagnostic by fetching it
  if (data.publicId) {
    return getDiagnosticByPublicId(data.publicId);
  }
  return undefined;
}

export async function getDiagnosticByPublicId(publicId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get diagnostic: database not available"); return undefined; }
  const result = await db.select().from(diagnostics).where(eq(diagnostics.publicId, publicId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateDiagnostic(publicId: string, data: Partial<InsertDiagnostic>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(diagnostics).set(data).where(eq(diagnostics.publicId, publicId));
  return getDiagnosticByPublicId(publicId);
}

export async function getAllDiagnostics(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get diagnostics: database not available"); return []; }
  return await db.select().from(diagnostics).limit(limit).offset(offset);
}

export async function getDiagnosticsCount() {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot count diagnostics: database not available"); return 0; }
  const result = await db.select().from(diagnostics);
  return result.length;
}

export async function getPaidDiagnosticsCount() {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot count paid diagnostics: database not available"); return 0; }
  const result = await db.select().from(diagnostics).where(eq(diagnostics.paymentStatus, "paid"));
  return result.length;
}

export async function getTotalRevenue() {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get revenue: database not available"); return 0; }
  const result = await db.select().from(diagnostics).where(eq(diagnostics.paymentStatus, "paid"));
  return result.reduce((sum, d) => sum + (parseFloat(d.amountPaid?.toString() || "0")), 0);
}

export async function createFeedback(data: InsertFeedback) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(feedbacks).values(data);
  return data;
}

export async function getFeedbackByDiagnosticId(diagnosticPublicId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get feedback: database not available"); return undefined; }
  // feedbacks.diagnosticId is an INT FK; we look up the diagnostic first
  const diag = await getDiagnosticByPublicId(diagnosticPublicId);
  if (!diag) return undefined;
  const result = await db.select().from(feedbacks).where(eq(feedbacks.diagnosticId, diag.id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAccuracyStats() {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get accuracy stats: database not available"); return { total: 0, accurate: 0 }; }
  const allFeedbacks = await db.select().from(feedbacks);
  const accurate = allFeedbacks.filter((f: any) => f.isAccurate).length;
  return { total: allFeedbacks.length, accurate };
}

export async function getCouponByCode(code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Base price constant — single source of truth
const BASE_PRICE = 299;

export async function applyCoupon(diagnosticPublicId: string, couponCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const coupon = await getCouponByCode(couponCode);
  if (!coupon) {
    return { valid: false, reason: "Cupom nao encontrado" };
  }

  if (!coupon.isActive) {
    return { valid: false, reason: "Cupom inativo" };
  }

  if (coupon.usedCount >= coupon.maxUses) {
    return { valid: false, reason: "Cupom expirado (limite atingido)" };
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return { valid: false, reason: "Cupom expirado" };
  }

  // Atomic transaction: increment count + insert redemption
  try {
    await db.update(coupons).set({ usedCount: coupon.usedCount + 1 }).where(eq(coupons.id, coupon.id));
    await db.insert(couponRedemptions).values({ couponId: coupon.id, diagnosticPublicId });
    await db.update(diagnostics).set({ couponApplied: couponCode }).where(eq(diagnostics.publicId, diagnosticPublicId));

    // Calculate final price based on discount type
    let finalPrice = BASE_PRICE;
    if (coupon.discountType === 'fixed') {
      finalPrice = BASE_PRICE - parseFloat(coupon.discountValue.toString());
    } else if (coupon.discountType === 'percentage') {
      finalPrice = BASE_PRICE * (1 - parseFloat(coupon.discountValue.toString()) / 100);
    }

    return { valid: true, finalPrice };
  } catch (error) {
    console.error("[Coupon] Error applying coupon:", error);
    return { valid: false, reason: "Erro ao aplicar cupom" };
  }
}
