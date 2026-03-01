import { Router } from "express";
import { getDb } from "../db";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import { diagnostics } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Initialize Stripe
const stripe = new Stripe(ENV.stripeSecretKey || "", {
  apiVersion: "2026-02-25.clover",
});

/**
 * Stripe Webhook Handler
 * Processes payment events from Stripe
 */
router.post("/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = ENV.stripeWebhookSecret;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return res.status(400).json({ error: "Webhook secret not configured" });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    ) as Stripe.Event;
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook signature verification failed: ${error.message}`);
    return res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }

  try {
    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          `✅ Payment succeeded: ${paymentIntent.id} - ${paymentIntent.amount}`
        );

        // Update diagnostic payment status
        if (paymentIntent.metadata?.diagnosticPublicId) {
          const db = await getDb();
          if (db) {
            await db.update(diagnostics).set({
              paymentStatus: "paid",
              paymentId: paymentIntent.id,
            }).where(eq(diagnostics.publicId, paymentIntent.metadata.diagnosticPublicId));
            console.log(
              `✅ Updated diagnostic: ${paymentIntent.metadata.diagnosticPublicId}`
            );
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          `❌ Payment failed: ${paymentIntent.id} - ${paymentIntent.last_payment_error?.message}`
        );

        // Update diagnostic payment status
        if (paymentIntent.metadata?.diagnosticPublicId) {
          const db = await getDb();
          if (db) {
            await db.update(diagnostics).set({
              paymentStatus: "pending",
              paymentId: paymentIntent.id,
            }).where(eq(diagnostics.publicId, paymentIntent.metadata.diagnosticPublicId));
            console.log(
              `❌ Updated diagnostic: ${paymentIntent.metadata.diagnosticPublicId}`
            );
          }
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log(`🔄 Charge refunded: ${charge.id} - ${charge.amount}`);

        // Update diagnostic payment status
        if (charge.metadata?.diagnosticPublicId) {
          const db = await getDb();
          if (db) {
            await db.update(diagnostics).set({
              paymentStatus: "pending",
              paymentId: charge.payment_intent as string,
            }).where(eq(diagnostics.publicId, charge.metadata.diagnosticPublicId));
            console.log(
              `🔄 Updated diagnostic: ${charge.metadata.diagnosticPublicId}`
            );
          }
        }
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        console.log(`⚠️ Dispute created: ${dispute.id} - ${dispute.amount}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Acknowledge receipt of event
    res.json({ received: true });
  } catch (error) {
    const err = error as Error;
    console.error(`Webhook processing error: ${err.message}`);
    res.status(500).json({ error: `Webhook processing failed: ${err.message}` });
  }
});

export default router;
