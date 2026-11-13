export const CATEGORY_COLOR_PALETTES = [
  { bgColor: 'bg-[#FDF0F0]', borderColor: 'border-[#FADCDC]' },
  { bgColor: 'bg-[#EDF7FC]', borderColor: 'border-[#D6ECFA]' },
  { bgColor: 'bg-[#FDF8EE]', borderColor: 'border-[#FBEECF]' },
  { bgColor: 'bg-[#FCF1EE]', borderColor: 'border-[#FADCD4]' },
  { bgColor: 'bg-[#EEF8F3]', borderColor: 'border-[#D2EFE0]' },
  { bgColor: 'bg-[#F2EFFC]', borderColor: 'border-[#E1DAF9]' },
  { bgColor: 'bg-[#FDF6EB]', borderColor: 'border-[#FBE8C8]' },
  { bgColor: 'bg-[#EDF7F4]', borderColor: 'border-[#D1EFE7]' },
  { bgColor: 'bg-[#EDF4FC]', borderColor: 'border-[#D4E7F9]' },
  { bgColor: 'bg-[#FDF0EE]', borderColor: 'border-[#FBD9D4]' },
];

const JUNK_NAME_PATTERNS = [
  /^test\b/i,
  /^kkk/i,
  /^main\s*ct/i,
  /^[a-z]{8,}$/i, // long lowercase blobs with no spaces (e.g. kkkmmmnnn)
];

export function isJunkCategoryName(name) {
  const label = String(name || '').trim();
  if (!label || label.length < 2) return true;
  return JUNK_NAME_PATTERNS.some((pattern) => pattern.test(label));
}

export function shopLinkForCategory(categoryName) {
  return `/shop?category=${encodeURIComponent(categoryName)}`;
}

export function productMatchesCategory(productCategory, filterName) {
  if (!filterName) return true;
  return String(productCategory || '').trim().toLowerCase() === String(filterName).trim().toLowerCase();
}

export function attachCategoryPreviewImages(categories, products = []) {
  const imageByCategory = {};

  for (const product of products) {
    const categoryName = product?.category;
    if (!categoryName || imageByCategory[categoryName]) continue;
    if (product.image) imageByCategory[categoryName] = product.image;
  }

  return categories.map((category) => ({
    ...category,
    image: imageByCategory[category.name] || null,
  }));
}

export function buildCategoryCards(categories, { requireProducts = false, maxItems = null } = {}) {
  let list = (categories || []).filter((c) => c?.name && !isJunkCategoryName(c.name));

  if (requireProducts) {
    list = list.filter((c) => Number(c.productCount || 0) > 0);
  }

  list.sort((a, b) => {
    const countDiff = Number(b.productCount || 0) - Number(a.productCount || 0);
    if (countDiff !== 0) return countDiff;
    return String(a.name).localeCompare(String(b.name));
  });

  if (maxItems && maxItems > 0) {
    list = list.slice(0, maxItems);
  }

  return list.map((c, idx) => {
    const palette = CATEGORY_COLOR_PALETTES[idx % CATEGORY_COLOR_PALETTES.length];
    return {
      id: c.id,
      title: c.name,
      productCount: Number(c.productCount || 0),
      image: c.image || null,
      bgColor: palette.bgColor,
      borderColor: palette.borderColor,
      link: shopLinkForCategory(c.name),
    };
  });
}
