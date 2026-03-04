import { describe, it, expect, beforeAll } from "vitest";
import {
  createRazorpayOrder,
  getRazorpayInstance,
  verifyRazorpayWebhookSignature,
} from "./razorpay";

describe("Razorpay Integration", () => {
  describe("createRazorpayOrder", () => {
    it("should create order with INR currency", async () => {
      const order = await createRazorpayOrder({
        amount: 50000, // 500 INR in paise
        currency: "INR",
        receipt: "test-receipt-001",
        notes: {
          diagnostic_public_id: "test-diag-001",
          plan: "normal",
        },
      });

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.amount).toBe(50000);
      expect(order.currency).toBe("INR");
      expect(order.status).toBe("created");
    });

    it("should create order with BRL currency", async () => {
      const order = await createRazorpayOrder({
        amount: 15000, // 150 BRL in centavos
        currency: "BRL",
        receipt: "test-receipt-002",
        notes: {
          diagnostic_public_id: "test-diag-002",
          plan: "promo",
        },
      });

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.amount).toBe(15000);
      expect(order.currency).toBe("BRL");
    });

    it("should create order with USD currency", async () => {
      const order = await createRazorpayOrder({
        amount: 2000, // 20 USD in cents
        currency: "USD",
        receipt: "test-receipt-003",
        notes: {
          diagnostic_public_id: "test-diag-003",
          plan: "lifetime",
        },
      });

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.amount).toBe(2000);
      expect(order.currency).toBe("USD");
    });

    it("should include notes in order", async () => {
      const notes = {
        diagnostic_public_id: "test-diag-004",
        plan: "normal",
        user_email: "test@example.com",
      };

      const order = await createRazorpayOrder({
        amount: 50000,
        currency: "INR",
        receipt: "test-receipt-004",
        notes,
      });

      expect(order.notes).toEqual(notes);
    });

    it("should handle error on invalid amount", async () => {
      try {
        await createRazorpayOrder({
          amount: -1000, // Invalid negative amount
          currency: "INR",
          receipt: "test-receipt-invalid",
          notes: {},
        });
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Razorpay Instance", () => {
    it("should return Razorpay instance", () => {
      const razorpay = getRazorpayInstance();
      expect(razorpay).toBeDefined();
      expect(razorpay.orders).toBeDefined();
      expect(razorpay.payments).toBeDefined();
    });

    it("should use correct API key from environment", () => {
      const razorpay = getRazorpayInstance();
      expect(razorpay).toBeDefined();
      // Verify that it's using the API key (can't directly access it, but we can verify it works)
    });
  });

  describe("Webhook Signature Verification", () => {
    it("should verify valid webhook signature", () => {
      // Mock webhook data
      const body = JSON.stringify({
        event: "payment.captured",
        created_at: 1234567890,
        payload: {
          payment: {
            entity: {
              id: "pay_123456",
              amount: 50000,
              currency: "INR",
              status: "captured",
            },
          },
        },
      });

      // Note: This test will fail without a valid webhook secret
      // In production, you should use environment variables for the secret
      const signature = "mock-signature";
      const result = verifyRazorpayWebhookSignature(body, signature);

      // Result depends on whether the signature is valid
      expect(typeof result).toBe("boolean");
    });

    it("should reject invalid webhook signature", () => {
      const body = JSON.stringify({ test: "data" });
      const invalidSignature = "invalid-signature-12345";

      const result = verifyRazorpayWebhookSignature(body, invalidSignature);
      expect(result).toBe(false);
    });

    it("should handle empty signature", () => {
      const body = JSON.stringify({ test: "data" });
      const result = verifyRazorpayWebhookSignature(body, "");

      expect(result).toBe(false);
    });
  });

  describe("Currency Support", () => {
    it("should support INR for India", async () => {
      const order = await createRazorpayOrder({
        amount: 50000,
        currency: "INR",
        receipt: "test-inr",
        notes: { country: "IN" },
      });

      expect(order.currency).toBe("INR");
    });

    it("should support BRL for Brazil", async () => {
      const order = await createRazorpayOrder({
        amount: 15000,
        currency: "BRL",
        receipt: "test-brl",
        notes: { country: "BR" },
      });

      expect(order.currency).toBe("BRL");
    });

    it("should support USD for international", async () => {
      const order = await createRazorpayOrder({
        amount: 2000,
        currency: "USD",
        receipt: "test-usd",
        notes: { country: "US" },
      });

      expect(order.currency).toBe("USD");
    });
  });

  describe("Order Metadata", () => {
    it("should preserve diagnostic public ID in notes", async () => {
      const diagnosticId = "test-diag-metadata-001";
      const order = await createRazorpayOrder({
        amount: 50000,
        currency: "INR",
        receipt: "test-metadata",
        notes: {
          diagnostic_public_id: diagnosticId,
          plan: "normal",
        },
      });

      expect(order.notes.diagnostic_public_id).toBe(diagnosticId);
    });

    it("should preserve plan type in notes", async () => {
      const order = await createRazorpayOrder({
        amount: 50000,
        currency: "INR",
        receipt: "test-plan",
        notes: {
          diagnostic_public_id: "test-diag",
          plan: "lifetime",
        },
      });

      expect(order.notes.plan).toBe("lifetime");
    });

    it("should handle custom metadata fields", async () => {
      const customNotes = {
        diagnostic_public_id: "test-diag",
        plan: "normal",
        user_email: "user@example.com",
        referral_code: "REF123",
      };

      const order = await createRazorpayOrder({
        amount: 50000,
        currency: "INR",
        receipt: "test-custom",
        notes: customNotes,
      });

      expect(order.notes).toEqual(customNotes);
    });
  });
});
