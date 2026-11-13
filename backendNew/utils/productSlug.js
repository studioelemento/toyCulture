export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

export function buildProductSlug(name) {
  return slugify(name);
}

export function stripLegacySlugSuffix(slug) {
  return String(slug || '').replace(LEGACY_SLUG_SUFFIX, '');
}

export function parseProductSlugParam(param) {
  if (!param) return { kind: "empty" };
  if (UUID_REGEX.test(param)) return { kind: "uuid", id: param };

  const legacy = param.match(LEGACY_SLUG_SUFFIX);
  if (legacy) {
    return {
      kind: "slug",
      slug: param.toLowerCase(),
      cleanSlug: stripLegacySlugSuffix(param).toLowerCase(),
      idPrefix: legacy[1].toLowerCase(),
    };
  }

  return { kind: "slug", slug: param.toLowerCase(), cleanSlug: param.toLowerCase() };
}
