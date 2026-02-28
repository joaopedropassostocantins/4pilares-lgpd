/**
 * Tracking IDs and pixel configuration for marketing campaigns
 */

export const TRACKING_CONFIG = {
  // Google Ads Conversion Tracking
  googleAds: {
    conversionId: process.env.VITE_GOOGLE_ADS_CONVERSION_ID || "AW-XXXXXXXXXX",
    conversionLabel: {
      diagnosticCreated: process.env.VITE_GOOGLE_ADS_LABEL_DIAGNOSTIC || "XXXXXXXXX",
      paymentCompleted: process.env.VITE_GOOGLE_ADS_LABEL_PAYMENT || "XXXXXXXXX",
    },
  },

  // Meta Pixel (Facebook)
  metaPixel: {
    pixelId: process.env.VITE_META_PIXEL_ID || "XXXXXXXXXXXXXXXXX",
    events: {
      pageView: "PageView",
      viewContent: "ViewContent",
      addToCart: "AddToCart",
      purchase: "Purchase",
      lead: "Lead",
    },
  },

  // TikTok Pixel
  tikTok: {
    pixelId: process.env.VITE_TIKTOK_PIXEL_ID || "XXXXXXXXXXXXXXXXX",
  },

  // Hotjar
  hotjar: {
    siteId: process.env.VITE_HOTJAR_SITE_ID || "XXXXXXXXX",
  },

  // Segment (if using)
  segment: {
    writeKey: process.env.VITE_SEGMENT_WRITE_KEY || "",
  },
};

/**
 * Track diagnostic creation event
 */
export function trackDiagnosticCreated(data: {
  publicId: string;
  abTestVariant: "A" | "B";
  archetype?: string;
}) {
  // Google Ads
  if (window.gtag) {
    window.gtag("event", "conversion", {
      send_to: `${TRACKING_CONFIG.googleAds.conversionId}/${TRACKING_CONFIG.googleAds.conversionLabel.diagnosticCreated}`,
      value: 0,
      currency: "BRL",
      transaction_id: data.publicId,
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq("track", "Lead", {
      content_name: "Diagnostic Created",
      content_category: "Astrology",
      value: 0,
      currency: "BRL",
    });
  }

  // TikTok
  if (window.ttq) {
    window.ttq.track("Lead", {
      content_id: data.publicId,
      content_name: "Diagnostic Created",
      content_category: "Astrology",
    });
  }

  console.log("[Analytics] Diagnostic created tracked:", data);
}

/**
 * Track payment completion event
 */
export function trackPaymentCompleted(data: {
  publicId: string;
  amount: number;
  plan: "promo" | "normal" | "lifetime";
  abTestVariant: "A" | "B";
}) {
  // Google Ads
  if (window.gtag) {
    window.gtag("event", "conversion", {
      send_to: `${TRACKING_CONFIG.googleAds.conversionId}/${TRACKING_CONFIG.googleAds.conversionLabel.paymentCompleted}`,
      value: data.amount,
      currency: "BRL",
      transaction_id: data.publicId,
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq("track", "Purchase", {
      content_name: `${data.plan} Plan`,
      content_category: "Astrology",
      value: data.amount,
      currency: "BRL",
      content_id: data.publicId,
    });
  }

  // TikTok
  if (window.ttq) {
    window.ttq.track("Purchase", {
      content_id: data.publicId,
      content_name: `${data.plan} Plan`,
      content_category: "Astrology",
      value: data.amount,
      currency: "BRL",
    });
  }

  console.log("[Analytics] Payment completed tracked:", data);
}

/**
 * Track page view with A/B variant
 */
export function trackPageView(pageName: string, abTestVariant: "A" | "B") {
  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_title: pageName,
      page_path: window.location.pathname,
      custom_map: {
        dimension1: "ab_test_variant",
      },
      ab_test_variant: abTestVariant,
    });
  }

  if (window.fbq) {
    window.fbq("track", "PageView", {
      page_title: pageName,
    });
  }

  console.log("[Analytics] Page view tracked:", { pageName, abTestVariant });
}

/**
 * Global type declarations for tracking pixels
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, data: Record<string, unknown>) => void;
    };
  }
}
