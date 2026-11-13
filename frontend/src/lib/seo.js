const SITE_NAME = 'Toy Culture';
const DEFAULT_TITLE =
  'Toy Culture — Buy Toys Online in India | Maisto, Bburago, Smartivity, Ratnas & More';
const DEFAULT_DESCRIPTION =
  'Buy toys online in India from Toy Culture – genuine Maisto, Bburago, LEGO, Hot Wheels, Hasbro & more. Shop by age, category and brand with pan-India delivery.';

const DEFAULT_OG_IMAGE =
  'https://toyculture.in/wp-content/uploads/2025/09/cropped-Toy-Culture-Logo-work-1-32x32.avif';

export function getSiteOrigin() {
  const configured = String(import.meta.env.VITE_SITE_URL || '').trim().replace(/\/$/, '');
  if (configured) return configured;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://toyculture.in';
}

export function buildAbsoluteUrl(pathname = '/', search = '') {
  const path = `${pathname || '/'}${search || ''}`;
  return `${getSiteOrigin()}${path.startsWith('/') ? path : `/${path}`}`;
}

export function truncateDescription(text, max = 160) {
  const value = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

export function formatPageTitle(pageTitle) {
  if (!pageTitle) return DEFAULT_TITLE;
  const trimmed = String(pageTitle).trim();
  if (trimmed === SITE_NAME || trimmed === DEFAULT_TITLE) return DEFAULT_TITLE;
  return `${trimmed} | ${SITE_NAME}`;
}

export function shopListSeo({ category, brand, ageRange, query, productCount } = {}) {
  let titlePart = 'All Toys';
  const bits = [];

  if (query) {
    titlePart = `Search: ${query}`;
    bits.push(`Results for “${query}” on Toy Culture.`);
  } else if (category) {
    titlePart = category;
    bits.push(`Shop ${category} toys online in India.`);
  } else if (brand) {
    titlePart = `${brand} Toys`;
    bits.push(`Browse ${brand} toys – authentic models, games and collectibles.`);
  } else if (ageRange) {
    titlePart = `Toys for ${ageRange}`;
    bits.push(`Age-appropriate toys for ${ageRange}.`);
  } else {
    bits.push('Browse our full toy catalog – diecast, LEGO, action figures and more.');
  }

  if (typeof productCount === 'number' && productCount >= 0) {
    bits.push(`${productCount} product${productCount === 1 ? '' : 's'} available.`);
  }

  return {
    title: `Shop ${titlePart}`,
    description: truncateDescription(bits.join(' ')),
  };
}

export function productSeoFromRecord(product) {
  if (!product) {
    return {
      title: 'Product',
      description: DEFAULT_DESCRIPTION,
    };
  }

  const name = product.name || 'Toy';
  const brand = product.brand ? `${product.brand} ` : '';
  const category = product.category ? ` in ${product.category}` : '';
  const price = Number(product.sellingPrice ?? product.price);
  const priceText = Number.isFinite(price) && price > 0 ? ` From ₹${price.toLocaleString('en-IN')}.` : '';

  return {
    title: name,
    description: truncateDescription(
      product.small_description ||
        product.description ||
        `Buy ${brand}${name}${category} online at Toy Culture.${priceText} Genuine toys, secure checkout, fast delivery across India.`
    ),
  };
}

export function buildProductJsonLd(product, canonicalUrl) {
  if (!product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const absoluteImages = images
    .filter(Boolean)
    .map((src) => (String(src).startsWith('http') ? src : buildAbsoluteUrl(src)));

  const price = Number(product.sellingPrice ?? product.price);
  const inStock = Number(product.stock ?? product.quantity ?? 1) > 0;

  const json = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: truncateDescription(product.small_description || product.description || product.name, 5000),
    image: absoluteImages.length > 0 ? absoluteImages : undefined,
    sku: product.sku || product.id,
    url: canonicalUrl,
  };

  if (product.brand) {
    json.brand = { '@type': 'Brand', name: product.brand };
  }

  if (Number.isFinite(price) && price > 0) {
    json.offers = {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'INR',
      price: price.toFixed(2),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    };
  }

  if (product.avg_rating || product.rating) {
    const ratingValue = Number(product.avg_rating ?? product.rating);
    const count = Number(product.review_count ?? product.reviews_count ?? 0);
    if (ratingValue > 0 && count > 0) {
      json.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: ratingValue.toFixed(1),
        reviewCount: count,
      };
    }
  }

  return json;
}

export function buildBreadcrumbJsonLd(items) {
  if (!items?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? buildAbsoluteUrl(item.url) : undefined,
    })),
  };
}

export const SEO_DEFAULTS = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  image: DEFAULT_OG_IMAGE,
  siteName: SITE_NAME,
  type: 'website',
};

/** Combine multiple schema.org nodes into one script tag. */
export function buildJsonLdGraph(...schemas) {
  const nodes = schemas
    .filter(Boolean)
    .map((schema) => {
      const { '@context': _ctx, ...rest } = schema;
      return rest;
    });
  if (nodes.length === 0) return null;
  if (nodes.length === 1) {
    return { '@context': 'https://schema.org', ...nodes[0] };
  }
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME };
