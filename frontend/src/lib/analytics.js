const GA_ID = String(import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();

export function isAnalyticsEnabled() {
  return Boolean(GA_ID) && typeof window !== 'undefined';
}

export function initAnalytics() {
  if (!isAnalyticsEnabled()) return;

  if (window.gtag) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { send_page_view: false });
}

export function trackPageView(path) {
  if (!isAnalyticsEnabled() || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
  });
}

export function trackEvent(name, params = {}) {
  if (!isAnalyticsEnabled() || !window.gtag) return;
  window.gtag('event', name, params);
}

export function trackPurchase({ transactionId, value, currency = 'INR', items = [] }) {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value,
    currency,
    items,
  });
}

export function trackAddToCart({ id, name, price, quantity = 1 }) {
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: (Number(price) || 0) * quantity,
    items: [
      {
        item_id: id,
        item_name: name,
        price: Number(price) || 0,
        quantity,
      },
    ],
  });
}

export function trackBeginCheckout({ value, items = [] }) {
  trackEvent('begin_checkout', {
    currency: 'INR',
    value: Number(value) || 0,
    items,
  });
}
