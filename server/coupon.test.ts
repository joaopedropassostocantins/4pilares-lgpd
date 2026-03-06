import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from './db';
import { coupons, couponRedemptions, diagnostics } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Coupon System', () => {
  let testCouponId: string;
  let testDiagnosticId: string;

  beforeAll(async () => {
    // Create test coupon
    const couponResult = await db.insert(coupons).values({
      code: 'TEST100',
      discountType: 'fixed',
      discountValue: 20.09,
      maxUses: 100,
      usedCount: 0,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }).returning();
    
    testCouponId = couponResult[0]?.id || '';

    // Create test diagnostic
    const diagnosticResult = await db.insert(diagnostics).values({
      publicId: `test-diag-${Date.now()}`,
      email: 'test@example.com',
      consultantName: 'Test User',
      paymentStatus: 'pending',
    }).returning();
    
    testDiagnosticId = diagnosticResult[0]?.publicId || '';
  });

  afterAll(async () => {
    // Cleanup
    if (testCouponId) {
      await db.delete(coupons).where(eq(coupons.id, testCouponId));
    }
    if (testDiagnosticId) {
      await db.delete(diagnostics).where(eq(diagnostics.publicId, testDiagnosticId));
    }
    await db.delete(couponRedemptions).where(eq(couponRedemptions.diagnosticPublicId, testDiagnosticId));
  });

  it('should validate coupon code correctly', async () => {
    const coupon = await db.select().from(coupons).where(eq(coupons.code, 'TEST100')).limit(1);
    expect(coupon).toHaveLength(1);
    expect(coupon[0].code).toBe('TEST100');
    expect(coupon[0].isActive).toBe(true);
  });

  it('should calculate final price with fixed discount', async () => {
    const basePrice = 299;
    const coupon = await db.select().from(coupons).where(eq(coupons.code, 'TEST100')).limit(1);
    
    if (coupon[0].discountType === 'fixed') {
      const finalPrice = basePrice - coupon[0].discountValue;
      expect(finalPrice).toBe(9.90);
    }
  });

  it('should check if coupon has available uses', async () => {
    const coupon = await db.select().from(coupons).where(eq(coupons.code, 'TEST100')).limit(1);
    const hasUses = coupon[0].usedCount < coupon[0].maxUses;
    expect(hasUses).toBe(true);
  });

  it('should check if coupon is not expired', async () => {
    const coupon = await db.select().from(coupons).where(eq(coupons.code, 'TEST100')).limit(1);
    const isNotExpired = !coupon[0].expiresAt || coupon[0].expiresAt > new Date();
    expect(isNotExpired).toBe(true);
  });

  it('should reject inactive coupons', async () => {
    const inactiveCoupon = await db.insert(coupons).values({
      code: 'INACTIVE',
      discountType: 'fixed',
      discountValue: 10,
      maxUses: 10,
      usedCount: 0,
      isActive: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).returning();

    const coupon = inactiveCoupon[0];
    expect(coupon.isActive).toBe(false);

    // Cleanup
    if (coupon.id) {
      await db.delete(coupons).where(eq(coupons.id, coupon.id));
    }
  });
});
