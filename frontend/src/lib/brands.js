export function shopLinkForBrand(brandName) {
  return `/shop?brand=${encodeURIComponent(brandName)}`;
}

export function productMatchesBrand(productBrand, filterName) {
  if (!filterName) return true;
  return String(productBrand || '').trim().toLowerCase() === String(filterName).trim().toLowerCase();
}

export function buildBrandCards(brands = [], { requireProducts = true } = {}) {
  let list = Array.isArray(brands) ? brands : [];
  if (requireProducts) {
    list = list.filter((b) => Number(b.productCount || 0) > 0);
  }

  return list
    .sort((a, b) => Number(b.productCount || 0) - Number(a.productCount || 0) || String(a.name).localeCompare(String(b.name)))
    .map((b) => ({
      id: b.id,
      name: b.name,
      count: Number(b.productCount || 0),
      link: shopLinkForBrand(b.name),
    }));
}
