import { productMatchesAgeBucket } from './ageGroups';
import { productMatchesBrand } from './brands';
import { productMatchesCategory } from './categories';

export const PRICE_BUCKETS = [
  { id: 'under-500', label: 'Under ₹500', min: 0, max: 500 },
  { id: '500-1000', label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { id: '1000-2000', label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
  { id: '2000-5000', label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
  { id: '5000-plus', label: '₹5,000+', min: 5000, max: null },
];

export function buildPriceBucketCounts(products = []) {
  return PRICE_BUCKETS.map((bucket) => ({
    ...bucket,
    count: products.filter((p) => productMatchesPriceBucket(Number(p.price) || 0, bucket.id)).length,
  })).filter((b) => b.count > 0);
}

export function productMatchesPriceBucket(price, bucketId) {
  if (!bucketId) return true;
  const bucket = PRICE_BUCKETS.find((b) => b.id === bucketId);
  if (!bucket) return true;
  if (price < bucket.min) return false;
  if (bucket.max == null) return true;
  return price < bucket.max;
}

export function productMatchesSearch(product, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [product.name, product.brand, product.category, product.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export function filterStorefrontProducts(products, filters) {
  const { ageId, category, brand, priceId, query } = filters;
  return (products || []).filter((p) => (
    productMatchesAgeBucket(p.ageGroup, ageId)
    && productMatchesCategory(p.category, category)
    && productMatchesBrand(p.brand, brand)
    && productMatchesPriceBucket(Number(p.price) || 0, priceId)
    && productMatchesSearch(p, query)
  ));
}
