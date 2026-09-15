import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid/ProductGrid';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';

export const Category = () => {
  const { categorySlug } = useParams();
  const [sortBy, setSortBy] = useState('featured');

  // Find category metadata
  const currentCategory = categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  );

  const categoryName = currentCategory
    ? currentCategory.name
    : categorySlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

  const categoryProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (!categorySlug) return true;
      const slugLower = categorySlug.toLowerCase();
      return (
        p.categorySlug.toLowerCase() === slugLower ||
        p.category.toLowerCase().replace(/\s+/g, '-').includes(slugLower) ||
        slugLower.includes(p.categorySlug.toLowerCase())
      );
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [categorySlug, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-6">
        <Link to="/" className="hover:text-toyOrange transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-toyOrange transition-colors">Categories</Link>
        <ChevronRight size={14} />
        <span className="text-toyNavy font-extrabold">{categoryName}</span>
      </nav>

      {/* Category Header Banner */}
      <div className="bg-white rounded-2xl p-6 md:p-8 mb-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <span className="text-xs font-extrabold text-toyOrange uppercase tracking-widest">
            Collection
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-toyNavy">
            {categoryName}
          </h1>
          <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
            {currentCategory?.description ||
              `Discover our premium range of ${categoryName} designed for kids and collectors across India.`}
          </p>
        </div>

        {currentCategory?.image && (
          <div className="w-28 h-28 md:w-36 md:h-36 bg-toyBg-single rounded-xl p-2 flex-shrink-0 flex items-center justify-center">
            <img
              src={currentCategory.image}
              alt={categoryName}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Sorting & Count Bar */}
      <div className="bg-white rounded-2xl p-4 mb-8 border border-gray-100 shadow-sm flex items-center justify-between gap-4 text-xs">
        <div className="font-bold text-gray-600">
          Found <span className="text-toyOrange font-extrabold">{categoryProducts.length}</span> items
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-toyOrange" />
          <span className="font-bold text-toyNavy">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-toyText-primary font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-toyOrange"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid products={categoryProducts} columns={5} />
    </div>
  );
};
