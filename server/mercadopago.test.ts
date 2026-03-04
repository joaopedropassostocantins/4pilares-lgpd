import { describe, it, expect, beforeAll } from "vitest";
import { initMercadoPago } from "./mercadopago";

describe("Mercado Pago Integration", () => {
  beforeAll(() => {
    // Ensure environment variables are set
    expect(process.env.MERCADO_PAGO_ACCESS_TOKEN).toBeDefined();
  });

  it("should initialize Mercado Pago SDK with valid credentials", async () => {
    const result = initMercadoPago();
    expect(result).toBe(true);
  });

  it("should have valid access token format", () => {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    expect(token).toBeDefined();
    expect(token).toContain("APP_USR-");
  });

  it("should have valid public key format", () => {
    const publicKey = process.env.MERCADO_PAGO_PUBLIC_KEY;
    expect(publicKey).toBeDefined();
    expect(publicKey).toContain("APP_USR-");
  });

  it("should have valid client ID", () => {
    const clientId = process.env.MERCADO_PAGO_CLIENT_ID;
    expect(clientId).toBeDefined();
    expect(clientId).toMatch(/^\d+$/);
  });

  it("should have valid client secret", () => {
    const clientSecret = process.env.MERCADO_PAGO_CLIENT_SECRET;
    expect(clientSecret).toBeDefined();
    expect(clientSecret?.length).toBeGreaterThan(20);
  });
});
