import { drizzle } from 'drizzle-orm/mysql2/promise';
import mysql from 'mysql2/promise';
import { coupons } from './drizzle/schema.js';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

async function seedCoupons() {
  try {
    console.log('🌱 Seeding coupons...');

    // Parse DATABASE_URL
    const url = new URL(DATABASE_URL);
    const connection = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: url.port || 3306,
    });

    const db = drizzle(connection);

    // Create PRIMEIRAS100 coupon
    const result = await db.insert(coupons).values({
      code: 'PRIMEIRAS100',
      discountType: 'fixed',
      discountValue: 20.09, // 29.99 - 9.90
      maxUses: 100,
      usedCount: 0,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      createdAt: new Date(),
    });

    console.log('✅ Coupon PRIMEIRAS100 created successfully');
    console.log(`   - Discount: R$ 20.09 (29.99 → 9.90)`);
    console.log(`   - Max uses: 100`);
    console.log(`   - Expires in: 30 days`);

    // Create AMIGO10 coupon for referrals (10% off)
    const result2 = await db.insert(coupons).values({
      code: 'AMIGO10',
      discountType: 'percentage',
      discountValue: 10,
      maxUses: 1000,
      usedCount: 0,
      isActive: true,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      createdAt: new Date(),
    });

    console.log('✅ Coupon AMIGO10 created successfully');
    console.log(`   - Discount: 10% off`);
    console.log(`   - Max uses: 1000`);
    console.log(`   - Expires in: 90 days`);

    await connection.end();
    console.log('\n🎉 Seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding coupons:', error);
    process.exit(1);
  }
}

seedCoupons();
