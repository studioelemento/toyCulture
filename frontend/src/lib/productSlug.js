export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Legacy URLs ended with `-` + 8 hex chars (old id suffix). */
export const LEGACY_SLUG_SUFFIX = /-([a-f0-9]{8})$/i;

export function slugify(text) {
  return (
    String(text || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'product'
  );
}

/** Clean URL slug from product name only (e.g. `maisto-1-18-special-edition-ford-mustang`). */
export function buildProductSlug(name) {
  return slugify(name);
}

export function stripLegacySlugSuffix(slug) {
  return String(slug || '').replace(LEGACY_SLUG_SUFFIX, '');
}

export function getProductSlug(product) {
  const apiSlug = product?.slug;
  if (apiSlug && typeof apiSlug === 'string' && !UUID_REGEX.test(apiSlug)) {
    return stripLegacySlugSuffix(apiSlug);
  }
  return buildProductSlug(product?.name || product?.title);
}

export function productPath(productOrId, name) {
  if (productOrId && typeof productOrId === 'object') {
    return `/product/${getProductSlug(productOrId)}`;
  }
  if (productOrId && UUID_REGEX.test(String(productOrId))) {
    return `/product/${buildProductSlug(name || 'product')}`;
  }
  return `/product/${stripLegacySlugSuffix(productOrId)}`;
}

export function isUuid(value) {
  return UUID_REGEX.test(String(value || ''));
}
