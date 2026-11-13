export const SHOP_AGE_GROUPS = [
  {
    id: '0-2',
    range: '0 – 2 Years',
    subtitle: 'Early Learning',
    bgColor: 'bg-[#FDF0F0]',
    borderColor: 'border-[#F9DCDC]',
  },
  {
    id: '3-5',
    range: '3 – 5 Years',
    subtitle: 'Imagination & Play',
    bgColor: 'bg-[#EDF7EE]',
    borderColor: 'border-[#DAEFDC]',
  },
  {
    id: '6-8',
    range: '6 – 8 Years',
    subtitle: 'Explore & Build',
    bgColor: 'bg-[#EAF3FC]',
    borderColor: 'border-[#D4E6F9]',
  },
  {
    id: '9-12',
    range: '9 – 12 Years',
    subtitle: 'Create & Discover',
    bgColor: 'bg-[#F0EDFC]',
    borderColor: 'border-[#DFD7FB]',
  },
  {
    id: '13-plus',
    range: '13+ Years',
    subtitle: 'Advanced Play',
    bgColor: 'bg-[#FDF6E2]',
    borderColor: 'border-[#F8ECC2]',
  },
];

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600';

/**
 * Map admin/catalog age strings (e.g. "3-5 years", "8+ years") to a shop bucket id.
 */
export function getAgeBucketId(ageGroup) {
  if (!ageGroup || typeof ageGroup !== 'string') return null;
  if (/all\s*ages/i.test(ageGroup)) return null;

  const numbers = ageGroup.match(/\d+/g)?.map(Number) || [];
  if (!numbers.length) return null;

  const minAge = Math.min(...numbers);
  if (minAge <= 2) return '0-2';
  if (minAge <= 5) return '3-5';
  if (minAge <= 8) return '6-8';
  if (minAge <= 12) return '9-12';
  return '13-plus';
}

export function productMatchesAgeBucket(ageGroup, bucketId) {
  if (!bucketId) return true;
  return getAgeBucketId(ageGroup) === bucketId;
}

export function getAgeGroupById(bucketId) {
  return SHOP_AGE_GROUPS.find((g) => g.id === bucketId) || null;
}

export function shopLinkForAgeBucket(bucketId) {
  return `/shop?age=${encodeURIComponent(bucketId)}`;
}

/**
 * Build counts and a representative product image per age bucket from live products.
 */
export function buildAgeGroupStats(products = []) {
  const stats = Object.fromEntries(
    SHOP_AGE_GROUPS.map((g) => [g.id, { count: 0, image: null }])
  );

  for (const product of products) {
    const bucketId = getAgeBucketId(product.ageGroup);
    if (!bucketId || !stats[bucketId]) continue;
    stats[bucketId].count += 1;
    if (!stats[bucketId].image && product.image) {
      stats[bucketId].image = product.image;
    }
  }

  return SHOP_AGE_GROUPS.map((group) => ({
    ...group,
    count: stats[group.id].count,
    image: stats[group.id].image || FALLBACK_PRODUCT_IMAGE,
    link: shopLinkForAgeBucket(group.id),
  }));
}
