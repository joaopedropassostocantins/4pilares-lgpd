import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { coupons, capabilities } from "./drizzle/schema.ts";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

async function seed() {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  console.log("🌱 Seeding coupons and capabilities...");

  // Seed coupon PRIMEIRAS100
  try {
    await db.insert(coupons).values({
      code: "PRIMEIRAS100",
      fixedPrice: 9.90,
      maxRedemptions: 100,
      redeemedCount: 0,
      active: true,
    });
    console.log("✅ Coupon PRIMEIRAS100 created");
  } catch (err) {
    console.log("⚠️  Coupon PRIMEIRAS100 already exists or error:", err.message);
  }

  // Seed capabilities
  try {
    await db.insert(capabilities).values([
      {
        key: "payments.pix_direct",
        name: "PIX Direto (Sem WhatsApp Automático)",
        status: "enabled",
        version: "1.0.0",
        metadata: { whatsapp_redirect_removed: true, pix_payload_local: true },
      },
      {
        key: "pricing.coupon_first100",
        name: "Cupom PRIMEIRAS100",
        status: "enabled",
        version: "1.0.0",
        metadata: { coupon_code: "PRIMEIRAS100", max_redemptions: 100, price: 9.90 },
      },
    ]);
    console.log("✅ Capabilities created");
  } catch (err) {
    console.log("⚠️  Capabilities already exist or error:", err.message);
  }

  console.log("✅ Seed completed!");
  await connection.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
