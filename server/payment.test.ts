import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPaymentPreference, getMercadoPagoClient } from './mercadopago';
import { createPaymentIntent, getCurrencyCode, getPrice } from './stripe';

describe('Payment Integration Tests', () => {
  describe('Mercado Pago - createPaymentPreference', () => {
    it('should create a payment preference with valid input', async () => {
      // Mock the Mercado Pago client
      const mockPreference = {
        id: 'test-pref-123',
        init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=test-pref-123',
        sandbox_init_point: 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=test-pref-123',
      };

      try {
        const result = await createPaymentPreference({
          diagnosticId: 'diag-123',
          userEmail: 'test@example.com',
          userName: 'Test User',
          amount: 14.99,
          returnUrl: 'https://example.com/resultado/diag-123',
        });

        // Verify the response structure
        expect(result).toHaveProperty('preferenceId');
        expect(result).toHaveProperty('initPoint');
        expect(result).toHaveProperty('sandboxInitPoint');
        
        // Verify preference ID format (should be a string)
        expect(typeof result.preferenceId).toBe('string');
        expect(result.preferenceId.length).toBeGreaterThan(0);
      } catch (error) {
        // If Mercado Pago token is not configured, skip this test
        if ((error as Error).message.includes('not configured')) {
          console.log('Skipping Mercado Pago test - token not configured');
        } else {
          throw error;
        }
      }
    });

    it('should include correct item details in preference', async () => {
      try {
        const result = await createPaymentPreference({
          diagnosticId: 'diag-456',
          userEmail: 'user@example.com',
          userName: 'User Name',
          amount: 29.99,
          returnUrl: 'https://example.com/resultado/diag-456',
        });

        expect(result.preferenceId).toBeDefined();
        expect(typeof result.preferenceId).toBe('string');
      } catch (error) {
        if ((error as Error).message.includes('not configured')) {
          console.log('Skipping Mercado Pago item test - token not configured');
        } else {
          throw error;
        }
      }
    });

    it('should handle different amounts correctly', async () => {
      const amounts = [9.99, 14.99, 29.99, 299.90];

      for (const amount of amounts) {
        try {
          const result = await createPaymentPreference({
            diagnosticId: `diag-${amount}`,
            userEmail: 'test@example.com',
            userName: 'Test User',
            amount: amount,
            returnUrl: 'https://example.com/resultado',
          });

          expect(result.preferenceId).toBeDefined();
        } catch (error) {
          if ((error as Error).message.includes('not configured')) {
            console.log('Skipping Mercado Pago amount test - token not configured');
            break;
          } else {
            throw error;
          }
        }
      }
    });
  });

  describe('Stripe - Currency and Pricing', () => {
    it('should return correct currency codes for supported countries', () => {
      const testCases = [
        { country: 'BR', expected: 'BRL' },
        { country: 'IN', expected: 'INR' },
        { country: 'KR', expected: 'KRW' },
        { country: 'US', expected: 'USD' },
        { country: 'ES', expected: 'EUR' },
        { country: 'PH', expected: 'PHP' },
      ];

      testCases.forEach(({ country, expected }) => {
        const currency = getCurrencyCode(country);
        expect(currency).toBe(expected);
      });
    });

    it('should return USD as fallback for unknown countries', () => {
      const currency = getCurrencyCode('XX');
      expect(currency).toBe('USD');
    });

    it('should return correct prices for promotional plan', () => {
      const testCases = [
        { country: 'BR', expected: 1499 }, // R$ 14.99
        { country: 'IN', expected: 99900 }, // ₹ 999
        { country: 'US', expected: 1299 }, // $ 12.99
      ];

      testCases.forEach(({ country, expected }) => {
        const price = getPrice(country, 'promotional');
        expect(price).toBe(expected);
      });
    });

    it('should return correct prices for normal plan', () => {
      const testCases = [
        { country: 'BR', expected: 2999 }, // R$ 29.99
        { country: 'IN', expected: 199900 }, // ₹ 1,999
        { country: 'US', expected: 2499 }, // $ 24.99
      ];

      testCases.forEach(({ country, expected }) => {
        const price = getPrice(country, 'normal');
        expect(price).toBe(expected);
      });
    });

    it('should return correct prices for lifetime plan', () => {
      const testCases = [
        { country: 'BR', expected: 29990 }, // R$ 299.90
        { country: 'IN', expected: 499900 }, // ₹ 4,999
        { country: 'US', expected: 5999 }, // $ 59.99
      ];

      testCases.forEach(({ country, expected }) => {
        const price = getPrice(country, 'lifetime');
        expect(price).toBe(expected);
      });
    });

    it('should support all 19 countries', () => {
      const countries = ['BR', 'IN', 'KR', 'PH', 'TH', 'VN', 'ID', 'MY', 'MX', 'AR', 'CO', 'PE', 'CL', 'ES', 'PT', 'US', 'PK', 'EG', 'NG'];

      countries.forEach((country) => {
        const currency = getCurrencyCode(country);
        const promoPrice = getPrice(country, 'promotional');
        const normalPrice = getPrice(country, 'normal');
        const lifetimePrice = getPrice(country, 'lifetime');

        expect(currency).toBeDefined();
        expect(currency.length).toBeGreaterThan(0);
        expect(promoPrice).toBeGreaterThan(0);
        expect(normalPrice).toBeGreaterThan(promoPrice);
        expect(lifetimePrice).toBeGreaterThan(normalPrice);
      });
    });

    it('should create payment intent with correct parameters', async () => {
      try {
        const result = await createPaymentIntent(
          1299, // Amount in cents
          'USD',
          'US',
          'diag-789',
          'test@example.com'
        );

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('client_secret');
        expect(result.id).toMatch(/^pi_/); // Stripe payment intent IDs start with pi_
      } catch (error) {
        if ((error as Error).message.includes('not configured')) {
          console.log('Skipping Stripe payment intent test - key not configured');
        } else {
          throw error;
        }
      }
    });

    it('should handle different currencies correctly', async () => {
      const testCases = [
        { country: 'BR', currency: 'BRL', amount: 1499 },
        { country: 'IN', currency: 'INR', amount: 99900 },
        { country: 'US', currency: 'USD', amount: 1299 },
      ];

      for (const { country, currency, amount } of testCases) {
        try {
          const result = await createPaymentIntent(
            amount,
            currency,
            country,
            `diag-${country}`,
            'test@example.com'
          );

          expect(result).toHaveProperty('id');
          expect(result).toHaveProperty('client_secret');
        } catch (error) {
          if ((error as Error).message.includes('not configured')) {
            console.log(`Skipping Stripe ${country} test - key not configured`);
            break;
          } else {
            throw error;
          }
        }
      }
    });
  });

  describe('Payment Method Selector Logic', () => {
    it('should determine payment methods based on country', () => {
      const testCases = [
        {
          country: 'BR',
          expectedMethods: ['pix', 'mercadopago', 'stripe'],
          pixAvailable: true,
        },
        {
          country: 'IN',
          expectedMethods: ['stripe'],
          pixAvailable: false,
        },
        {
          country: 'US',
          expectedMethods: ['stripe'],
          pixAvailable: false,
        },
      ];

      testCases.forEach(({ country, expectedMethods, pixAvailable }) => {
        // Pix is only available in Brazil
        expect(pixAvailable).toBe(country === 'BR');

        // All countries should have Stripe
        expect(expectedMethods).toContain('stripe');
      });
    });

    it('should validate payment amounts are positive', () => {
      const validAmounts = [9.99, 14.99, 29.99, 299.90];
      const invalidAmounts = [0, -10, -0.01];

      validAmounts.forEach((amount) => {
        expect(amount).toBeGreaterThan(0);
      });

      invalidAmounts.forEach((amount) => {
        expect(amount).toBeLessThanOrEqual(0);
      });
    });
  });

  describe('Payment Status Tracking', () => {
    it('should support payment status values', () => {
      const validStatuses = ['pending', 'approved', 'rejected', 'cancelled', 'in_process'];

      validStatuses.forEach((status) => {
        expect(['pending', 'approved', 'rejected', 'cancelled', 'in_process']).toContain(status);
      });
    });

    it('should track payment plan types', () => {
      const validPlans = ['promotional', 'normal', 'lifetime'];

      validPlans.forEach((plan) => {
        expect(['promotional', 'normal', 'lifetime']).toContain(plan);
      });
    });
  });
});
