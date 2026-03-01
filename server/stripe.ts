import Stripe from 'stripe';

// Initialize Stripe with secret key from environment
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not configured - Stripe payments will not work');
}

export const stripe = new Stripe(stripeSecretKey);

/**
 * Currency configuration for different countries
 */
export const currencyConfig = {
  BR: { code: 'BRL', name: 'Brasil', symbol: 'R$', minAmount: 100 }, // R$ 1.00
  IN: { code: 'INR', name: 'Índia', symbol: '₹', minAmount: 50 }, // ₹ 50
  KR: { code: 'KRW', name: 'Coreia do Sul', symbol: '₩', minAmount: 1000 }, // ₩ 1,000
  PH: { code: 'PHP', name: 'Filipinas', symbol: '₱', minAmount: 100 }, // ₱ 100
  TH: { code: 'THB', name: 'Tailândia', symbol: '฿', minAmount: 100 }, // ฿ 100
  VN: { code: 'VND', name: 'Vietnã', symbol: '₫', minAmount: 10000 }, // ₫ 10,000
  ID: { code: 'IDR', name: 'Indonésia', symbol: 'Rp', minAmount: 10000 }, // Rp 10,000
  MY: { code: 'MYR', name: 'Malásia', symbol: 'RM', minAmount: 10 }, // RM 10
  MX: { code: 'MXN', name: 'México', symbol: '$', minAmount: 100 }, // $ 100
  AR: { code: 'ARS', name: 'Argentina', symbol: '$', minAmount: 1000 }, // $ 1,000
  CO: { code: 'COP', name: 'Colômbia', symbol: '$', minAmount: 10000 }, // $ 10,000
  PE: { code: 'PEN', name: 'Peru', symbol: 'S/', minAmount: 100 }, // S/ 100
  CL: { code: 'CLP', name: 'Chile', symbol: '$', minAmount: 1000 }, // $ 1,000
  ES: { code: 'EUR', name: 'Espanha', symbol: '€', minAmount: 50 }, // € 0.50
  PT: { code: 'EUR', name: 'Portugal', symbol: '€', minAmount: 50 }, // € 0.50
  US: { code: 'USD', name: 'Estados Unidos', symbol: '$', minAmount: 50 }, // $ 0.50
  PK: { code: 'PKR', name: 'Paquistão', symbol: '₨', minAmount: 5000 }, // ₨ 5,000
  EG: { code: 'EGP', name: 'Egito', symbol: '£', minAmount: 500 }, // £ 500
  NG: { code: 'NGN', name: 'Nigéria', symbol: '₦', minAmount: 10000 }, // ₦ 10,000
};

/**
 * Pricing configuration for different countries
 * All prices are in the local currency's smallest unit (cents/paisa/etc)
 */
export const pricingConfig = {
  promotional: {
    BR: 1499, // R$ 14.99
    IN: 99900, // ₹ 999
    KR: 1490000, // ₩ 14,900
    PH: 49900, // ₱ 499
    TH: 39900, // ฿ 399
    VN: 9900000, // ₫ 99,000
    ID: 99000, // Rp 99,000
    MY: 4900, // RM 49
    MX: 19900, // $ 199
    AR: 49990, // $ 4,999
    CO: 49900, // $ 49,900
    PE: 4990, // S/ 49.90
    CL: 9990, // $ 9,990
    ES: 1299, // € 12.99
    PT: 1299, // € 12.99
    US: 1299, // $ 12.99
    PK: 39990, // ₨ 3,999
    EG: 49900, // £ 499
    NG: 99900, // ₦ 9,990
  },
  normal: {
    BR: 2999, // R$ 29.99
    IN: 199900, // ₹ 1,999
    KR: 2990000, // ₩ 29,900
    PH: 99900, // ₱ 999
    TH: 79900, // ฿ 799
    VN: 19900000, // ₫ 199,000
    ID: 199000, // Rp 199,000
    MY: 9900, // RM 99
    MX: 39900, // $ 399
    AR: 99990, // $ 9,999
    CO: 99900, // $ 99,900
    PE: 9990, // S/ 99.90
    CL: 19990, // $ 19,990
    ES: 2499, // € 24.99
    PT: 2499, // € 24.99
    US: 2499, // $ 24.99
    PK: 79990, // ₨ 7,999
    EG: 99900, // £ 999
    NG: 199900, // ₦ 19,990
  },
  lifetime: {
    BR: 29990, // R$ 299.90
    IN: 499900, // ₹ 4,999
    KR: 7490000, // ₩ 74,900
    PH: 249900, // ₱ 2,499
    TH: 199900, // ฿ 1,999
    VN: 49900000, // ₫ 499,000
    ID: 499000, // Rp 499,000
    MY: 24900, // RM 249
    MX: 99900, // $ 999
    AR: 249990, // $ 24,999
    CO: 249900, // $ 249,900
    PE: 24990, // S/ 249.90
    CL: 49990, // $ 49,990
    ES: 5999, // € 59.99
    PT: 5999, // € 59.99
    US: 5999, // $ 59.99
    PK: 199990, // ₨ 19,999
    EG: 249900, // £ 2,499
    NG: 499900, // ₦ 49,990
  },
};

/**
 * Get currency code for a country
 */
export function getCurrencyCode(countryCode: string): string {
  const config = currencyConfig[countryCode as keyof typeof currencyConfig];
  return config?.code || 'USD';
}

/**
 * Get price for a plan in a specific country
 */
export function getPrice(
  countryCode: string,
  plan: 'promotional' | 'normal' | 'lifetime'
): number {
  const price = pricingConfig[plan][countryCode as keyof typeof pricingConfig[typeof plan]];
  return price || pricingConfig[plan]['US']; // Fallback to USD
}

/**
 * Create a payment intent for Stripe
 */
export async function createPaymentIntent(
  amount: number,
  currency: string,
  countryCode: string,
  diagnosticId: string,
  userEmail?: string
) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      metadata: {
        country: countryCode,
        diagnosticId: diagnosticId,
        product: 'SAJO Astrology Analysis',
      },
      ...(userEmail && { receipt_email: userEmail }),
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Verify webhook signature from Stripe
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): any {
  try {
    return stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}

/**
 * Retrieve payment intent details
 */
export async function getPaymentIntent(paymentIntentId: string) {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw error;
  }
}
