import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid/ProductGrid';
import { products } from '../data/products';
import { Search } from 'lucide-react';

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';

  const matchedProducts = useMemo(() => {
    if (!query.trim()) return [];
    const qLower = query.toLowerCase();

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(qLower);
      const matchBrand = p.brand.toLowerCase().includes(qLower);
      const matchCategory = p.category.toLowerCase().includes(qLower);
      const matchTags = p.tags && p.tags.some((t) => t.toLowerCase().includes(qLower));

      const matchesQuery = matchName || matchBrand || matchCategory || matchTags;

      if (categoryFilter && categoryFilter !== '0') {
        return matchesQuery && p.categorySlug === categoryFilter;
      }
      return matchesQuery;
    });
  }, [query, categoryFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-toyOrange mb-1 uppercase tracking-wider">
            <Search size={14} /> Search Results
          </div>
          <h1 className="text-xl md:text-2xl font-black text-toyNavy">
            Results for "{query}"
          </h1>
        </div>
        <div className="text-xs font-bold text-gray-500 bg-toyBg-single px-4 py-2 rounded-full border border-gray-200">
          <span className="text-toyOrange font-extrabold">{matchedProducts.length}</span> Products Found
        </div>
      </div>

      <ProductGrid products={matchedProducts} columns={5} />
    </div>
  );
};
