import { buildProductSlug } from './productSlug';

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600';

function labelFromRef(value, fallback = '') {
  if (value == null || value === '') return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.name) return String(value.name);
  return fallback;
}

function resolveProductImage(p) {
  if (typeof p.image === 'string' && p.image) return p.image;
  if (!Array.isArray(p.images) || !p.images.length) return DEFAULT_PRODUCT_IMAGE;
  const first = p.images[0];
  if (typeof first === 'string' && first) return first;
  if (first?.url) return first.url;
  return DEFAULT_PRODUCT_IMAGE;
}

function formatDiscountLabel(discount, originalPrice, price) {
  if (typeof discount === 'string' && discount.trim()) return discount;
  if (typeof discount === 'number' && discount > 0) return `${discount}%`;
  if (originalPrice && price && originalPrice > price) {
    return `${Math.round(((originalPrice - price) / originalPrice) * 100)}%`;
  }
  return null;
}

export function mapApiProductCard(p) {
  if (!p) return null;

  const price = Number(p.sellingPrice ?? p.price ?? 0);
  const mrp = p.mrp != null ? Number(p.mrp) : null;
  const originalPrice = p.originalPrice != null
    ? Number(p.originalPrice)
    : (mrp != null && mrp > price ? mrp : null);

  const brand = labelFromRef(p.brand, p.brand_name || 'ToyCulture');
  const category = labelFromRef(p.category, p.category_name || '');
  const image = resolveProductImage(p);
  const reviewsCount = Number(p.reviews) || (Array.isArray(p.reviews) ? p.reviews.length : 0);
  const discount = formatDiscountLabel(p.discount, originalPrice, price);

  return {
    id: p.id || p._id,
    name: p.name || p.title,
    slug: p.slug || buildProductSlug(p.name || p.title),
    brand,
    category,
    price,
    originalPrice,
    discount,
    rating: Number(p.rating) || 0,
    reviewsCount,
    image,
    ageGroup: p.ageGroup,
    inStock: (p.stockQTY ?? p.stock ?? 0) > 0,
    badge: discount ? 'discount' : 'new',
    stock: p.stockQTY ?? p.stock ?? 0,
    onOffer: Boolean(p.onOffer),
  };
}

export function mapHomeServiceProduct(p) {
  return mapApiProductCard({
    ...p,
    id: p.id || p._id,
    brand_name: p.brand_name,
    category_name: p.category_name,
  });
}

export function pickDealOfTheDay(products = []) {
  let best = null;
  let bestScore = -1;

  for (const raw of products) {
    const p = mapApiProductCard(raw);
    if (!p?.id) continue;
    const discountPct = p.originalPrice && p.price
      ? ((p.originalPrice - p.price) / p.originalPrice) * 100
      : Number(String(p.discount || '').replace('%', '')) || 0;
    const score = discountPct + (p.onOffer ? 5 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }

  return best;
}
