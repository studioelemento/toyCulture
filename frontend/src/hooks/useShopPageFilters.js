import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buildAgeGroupStats, getAgeGroupById } from '../lib/ageGroups';
import { buildBrandCards } from '../lib/brands';
import { buildCategoryCards } from '../lib/categories';
import { buildPriceBucketCounts, filterStorefrontProducts } from '../lib/shopFilters';

export function useShopPageFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterBrands, setFilterBrands] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);

  const ageFilterId = searchParams.get('age') || '';
  const categoryFilter = searchParams.get('category') || '';
  const brandFilter = searchParams.get('brand') || '';
  const priceFilter = searchParams.get('price') || '';
  const query = searchParams.get('q') || '';

  const activeAgeGroup = getAgeGroupById(ageFilterId);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setErrorProducts(null);
        const [prodRes, catRes, brandRes] = await Promise.all([
          fetch('/api/v1/products?limit=100'),
          fetch('/api/categories'),
          fetch('/api/brands'),
        ]);

        if (!prodRes.ok) throw new Error('Failed to fetch products');

        const prodJson = await prodRes.json();
        const catJson = catRes.ok ? await catRes.json() : { data: [] };
        const brandJson = brandRes.ok ? await brandRes.json() : { data: [] };

        if (!alive) return;

        setProducts(prodJson.success ? prodJson.data : []);
        setFilterCategories(
          buildCategoryCards(catJson.success ? catJson.data : [], { requireProducts: true })
        );
        setFilterBrands(buildBrandCards(brandJson.success ? brandJson.data : []));
      } catch (err) {
        if (alive) {
          setErrorProducts(err.message);
          setProducts([]);
          setFilterCategories([]);
          setFilterBrands([]);
        }
      } finally {
        if (alive) setLoadingProducts(false);
      }
    };

    load();
    return () => { alive = false; };
  }, []);

  const filterAges = useMemo(
    () => buildAgeGroupStats(products)
      .filter((a) => a.count > 0)
      .map((a) => ({ id: a.id, name: a.range, count: a.count })),
    [products]
  );

  const filterPrices = useMemo(() => buildPriceBucketCounts(products), [products]);

  const visibleProducts = useMemo(
    () => filterStorefrontProducts(products, {
      ageId: ageFilterId,
      category: categoryFilter,
      brand: brandFilter,
      priceId: priceFilter,
      query,
    }),
    [products, ageFilterId, categoryFilter, brandFilter, priceFilter, query]
  );

  const toggleFilterParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    const current = next.get(key);
    if (current === value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const clearFilterParam = (key) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const clearAllFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('age');
    next.delete('category');
    next.delete('brand');
    next.delete('price');
    next.delete('q');
    setSearchParams(next, { replace: true });
  };

  return {
    products,
    loadingProducts,
    errorProducts,
    visibleProducts,
    filterCategories,
    filterBrands,
    filterAges,
    filterPrices,
    ageFilterId,
    categoryFilter,
    brandFilter,
    priceFilter,
    query,
    activeAgeGroup,
    toggleFilterParam,
    clearFilterParam,
    clearAllFilters,
  };
}
