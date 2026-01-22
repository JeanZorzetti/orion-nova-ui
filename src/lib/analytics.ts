// Google Analytics event tracking utilities

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: Array<unknown>;
  }
}

// Track page view
export const trackPageView = (url: string) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
      page_path: url,
    });
  }
};

// Track custom event
export const trackEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Predefined event tracking functions

export const trackSignUp = (method: string) => {
  trackEvent({
    action: "sign_up",
    category: "engagement",
    label: method,
  });
};

export const trackLogin = (method: string) => {
  trackEvent({
    action: "login",
    category: "engagement",
    label: method,
  });
};

export const trackPurchase = ({
  transactionId,
  value,
  currency = "BRL",
  items,
}: {
  transactionId: string;
  value: number;
  currency?: string;
  items?: Array<{ item_id: string; item_name: string; price: number }>;
}) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", "purchase", {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  }
};

export const trackBeginCheckout = ({
  value,
  currency = "BRL",
  items,
}: {
  value: number;
  currency?: string;
  items?: Array<{ item_id: string; item_name: string; price: number }>;
}) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", "begin_checkout", {
      value: value,
      currency: currency,
      items: items,
    });
  }
};

export const trackAddToCart = ({
  itemId,
  itemName,
  value,
  currency = "BRL",
}: {
  itemId: string;
  itemName: string;
  value: number;
  currency?: string;
}) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", "add_to_cart", {
      currency: currency,
      value: value,
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          price: value,
        },
      ],
    });
  }
};

export const trackSearch = (searchTerm: string) => {
  trackEvent({
    action: "search",
    category: "engagement",
    label: searchTerm,
  });
};

export const trackDownload = (fileName: string) => {
  trackEvent({
    action: "download",
    category: "engagement",
    label: fileName,
  });
};

export const trackVideoPlay = (videoTitle: string) => {
  trackEvent({
    action: "video_play",
    category: "engagement",
    label: videoTitle,
  });
};

export const trackFormSubmit = (formName: string) => {
  trackEvent({
    action: "form_submit",
    category: "engagement",
    label: formName,
  });
};

export const trackButtonClick = (buttonName: string) => {
  trackEvent({
    action: "button_click",
    category: "engagement",
    label: buttonName,
  });
};

export const trackOutboundLink = (url: string) => {
  trackEvent({
    action: "outbound_link",
    category: "engagement",
    label: url,
  });
};

export const trackShare = (method: string, contentType: string) => {
  trackEvent({
    action: "share",
    category: "engagement",
    label: `${method} - ${contentType}`,
  });
};

// E-commerce tracking
export const trackViewItem = ({
  itemId,
  itemName,
  price,
  category,
}: {
  itemId: string;
  itemName: string;
  price: number;
  category?: string;
}) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", "view_item", {
      currency: "BRL",
      value: price,
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          price: price,
          item_category: category,
        },
      ],
    });
  }
};

export const trackSelectItem = ({
  itemId,
  itemName,
  price,
}: {
  itemId: string;
  itemName: string;
  price: number;
}) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", "select_item", {
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          price: price,
        },
      ],
    });
  }
};

// Product page specific tracking (Phase 5)
export const trackProductPageView = () => {
  trackEvent({
    action: "product_page_view",
    category: "engagement",
  });
};

export const trackDemoInteraction = (stepId: string) => {
  trackEvent({
    action: "demo_interaction",
    category: "engagement",
    label: stepId,
  });
};

export const trackComparisonSliderUsed = () => {
  trackEvent({
    action: "comparison_slider_used",
    category: "engagement",
  });
};

export const trackModuleCardClick = (moduleName: string) => {
  trackEvent({
    action: "module_card_clicked",
    category: "engagement",
    label: moduleName,
  });
};

export const trackTestimonialViewed = (authorName: string, index: number) => {
  trackEvent({
    action: "testimonial_viewed",
    category: "engagement",
    label: `${authorName} - Position ${index}`,
    value: index,
  });
};

export const trackCTAClick = (location: "hero" | "bottom" | "testimonials") => {
  trackEvent({
    action: "cta_clicked",
    category: "conversion",
    label: location,
  });
};

export const trackScrollDepth = (percentage: 25 | 50 | 75 | 100) => {
  trackEvent({
    action: "scroll_depth",
    category: "engagement",
    value: percentage,
  });
};

export const trackTimeOnPage = (seconds: 30 | 60 | 120 | 180) => {
  trackEvent({
    action: "time_on_page_milestone",
    category: "engagement",
    value: seconds,
  });
};
