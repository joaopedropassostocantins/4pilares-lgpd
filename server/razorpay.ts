import Razorpay from "razorpay";
import crypto from "crypto";

// Lazy initialization - only create instance when needed
let razorpayInstance: Razorpay | null = null;

function getRazorpayInstance(): Razorpay {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required");
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
}

export interface RazorpayOrderOptions {
  amount: number; // in paise (1 INR = 100 paise)
  currency: "INR" | "BRL" | "USD";
  receipt: string;
  customer_notify?: number;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  card_id: string | null;
  bank: string | null;
  wallet: string | null;
  vpa: string | null;
  email: string;
  contact: string;
  notes: Record<string, string>;
  fee: number;
  tax: number;
  created_at: number;
  [key: string]: unknown;
}

/**
 * Create a Razorpay order
 */
export async function createRazorpayOrder(
  options: RazorpayOrderOptions
): Promise<RazorpayOrder> {
  try {
    const razorpay = getRazorpayInstance();

    const orderData: any = {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes || {},
    };

    if (options.customer_notify !== undefined) {
      orderData.customer_notify = options.customer_notify;
    }

    const order = (await razorpay.orders.create(orderData)) as unknown as RazorpayOrder;

    return order;
  } catch (error) {
    console.error("[Razorpay] Error creating order:", error);
    throw new Error(`Failed to create Razorpay order: ${String(error)}`);
  }
}

/**
 * Fetch a Razorpay payment by ID
 */
export async function getRazorpayPayment(paymentId: string): Promise<RazorpayPayment> {
  try {
    const razorpay = getRazorpayInstance();
    const payment = (await razorpay.payments.fetch(paymentId)) as unknown as RazorpayPayment;
    return payment;
  } catch (error) {
    console.error("[Razorpay] Error fetching payment:", error);
    throw new Error(`Failed to fetch Razorpay payment: ${String(error)}`);
  }
}

/**
 * Capture a Razorpay payment
 */
export async function captureRazorpayPayment(
  paymentId: string,
  amount: number
): Promise<RazorpayPayment> {
  try {
    const razorpay = getRazorpayInstance();
    // Note: Razorpay SDK capture method signature may vary
    // Using any to handle SDK type mismatches
    const payment = (await (razorpay.payments as any).capture(paymentId, amount)) as RazorpayPayment;
    return payment;
  } catch (error) {
    console.error("[Razorpay] Error capturing payment:", error);
    throw new Error(`Failed to capture Razorpay payment: ${String(error)}`);
  }
}

/**
 * Verify Razorpay webhook signature
 */
export function verifyRazorpayWebhookSignature(
  body: string,
  signature: string
): boolean {
  try {
    const keySecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!keySecret) {
      console.warn("[Razorpay] RAZORPAY_WEBHOOK_SECRET not configured");
      return false;
    }

    const hash = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    return hash === signature;
  } catch (error) {
    console.error("[Razorpay] Error verifying webhook signature:", error);
    return false;
  }
}

/**
 * Get Razorpay payment status
 */
export function getRazorpayPaymentStatus(
  payment: RazorpayPayment
): "pending" | "completed" | "failed" | "refunded" {
  if (payment.status === "captured") {
    return "completed";
  } else if (payment.status === "failed") {
    return "failed";
  } else if (payment.refund_status === "full_refunded") {
    return "refunded";
  }
  return "pending";
}

/**
 * Format amount for Razorpay (convert to paise)
 */
export function formatAmountForRazorpay(amount: number, currency: string): number {
  // Convert to paise for INR, cents for other currencies
  if (currency === "INR") {
    return Math.round(amount * 100);
  }
  return Math.round(amount * 100);
}

/**
 * Format amount from Razorpay (convert from paise)
 */
export function formatAmountFromRazorpay(amount: number, currency: string): number {
  // Convert from paise for INR, cents for other currencies
  if (currency === "INR") {
    return amount / 100;
  }
  return amount / 100;
}

/**
 * Get currency code for Razorpay
 */
export function getCurrencyForCountry(country: string): "INR" | "BRL" | "USD" {
  const currencyMap: Record<string, "INR" | "BRL" | "USD"> = {
    IN: "INR",
    BR: "BRL",
    US: "USD",
    // Default to USD for other countries
  };

  return currencyMap[country] || "USD";
}

/**
 * Check if Razorpay is available for a country
 */
export function isRazorpayAvailable(country: string): boolean {
  // Razorpay is primarily available in India
  // But can be used for international payments
  return true;
}
