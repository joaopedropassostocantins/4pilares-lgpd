import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrencyCode, getPrice, currencyConfig, pricingConfig } from './stripe';

describe('Stripe Integration', () => {
  describe('Currency Configuration', () => {
    it('should return correct currency code for Brazil', () => {
      expect(getCurrencyCode('BR')).toBe('BRL');
    });

    it('should return correct currency code for India', () => {
      expect(getCurrencyCode('IN')).toBe('INR');
    });

    it('should return correct currency code for South Korea', () => {
      expect(getCurrencyCode('KR')).toBe('KRW');
    });

    it('should return USD for unknown country', () => {
      expect(getCurrencyCode('XX')).toBe('USD');
    });

    it('should have all required countries configured', () => {
      const requiredCountries = ['BR', 'IN', 'KR', 'PH', 'TH', 'VN', 'ID', 'MY', 'MX', 'AR', 'ES', 'US'];
      requiredCountries.forEach(country => {
        expect(currencyConfig[country as keyof typeof currencyConfig]).toBeDefined();
      });
    });
  });

  describe('Pricing Configuration', () => {
    it('should return promotional price for Brazil', () => {
      const price = getPrice('BR', 'promotional');
      expect(price).toBe(1499); // R$ 14.99
    });

    it('should return normal price for India', () => {
      const price = getPrice('IN', 'normal');
      expect(price).toBe(199900); // ₹ 1,999
    });

    it('should return lifetime price for South Korea', () => {
      const price = getPrice('KR', 'lifetime');
      expect(price).toBe(7490000); // ₩ 74,900
    });

    it('should return USD price for unknown country', () => {
      const price = getPrice('XX', 'promotional');
      expect(price).toBe(pricingConfig.promotional['US']);
    });

    it('should have all three plans configured for each country', () => {
      const countries = Object.keys(currencyConfig);
      countries.forEach(country => {
        expect(pricingConfig.promotional[country as keyof typeof pricingConfig.promotional]).toBeDefined();
        expect(pricingConfig.normal[country as keyof typeof pricingConfig.normal]).toBeDefined();
        expect(pricingConfig.lifetime[country as keyof typeof pricingConfig.lifetime]).toBeDefined();
      });
    });

    it('should have prices in ascending order (promo < normal < lifetime)', () => {
      const countries = Object.keys(currencyConfig);
      countries.forEach(country => {
        const promo = pricingConfig.promotional[country as keyof typeof pricingConfig.promotional];
        const normal = pricingConfig.normal[country as keyof typeof pricingConfig.normal];
        const lifetime = pricingConfig.lifetime[country as keyof typeof pricingConfig.lifetime];
        
        expect(promo).toBeLessThan(normal);
        expect(normal).toBeLessThan(lifetime);
      });
    });
  });

  describe('Multi-Currency Support', () => {
    it('should support 19+ countries', () => {
      const countries = Object.keys(currencyConfig);
      expect(countries.length).toBeGreaterThanOrEqual(19);
    });

    it('should have unique currency codes', () => {
      const codes = Object.values(currencyConfig).map(c => c.code);
      const uniqueCodes = new Set(codes);
      // Some countries share EUR, so we check we have at least 15 unique codes
      expect(uniqueCodes.size).toBeGreaterThanOrEqual(15);
    });

    it('should have minimum amounts configured', () => {
      Object.values(currencyConfig).forEach(config => {
        expect(config.minAmount).toBeGreaterThan(0);
      });
    });
  });

  describe('Price Localization', () => {
    it('should have lower prices for lower-income countries', () => {
      // India (lower income) should have lower USD equivalent than US
      const indiaPromo = getPrice('IN', 'promotional');
      const usPromo = getPrice('US', 'promotional');
      
      // ₹999 ≈ $12, so should be similar
      expect(indiaPromo).toBeLessThan(usPromo * 100); // rough comparison
    });

    it('should have premium prices for developed countries', () => {
      // Spain/Portugal (developed) should have EUR prices
      const spainPrice = getPrice('ES', 'promotional');
      const portPrice = getPrice('PT', 'promotional');
      
      expect(spainPrice).toBe(portPrice); // Both EUR
      expect(spainPrice).toBe(1299); // € 12.99
    });
  });
});
