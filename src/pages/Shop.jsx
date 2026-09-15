import React, { useState, useMemo } from 'react';
import { ProductGrid } from '../components/ProductGrid/ProductGrid';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { Filter, SlidersHorizontal } from 'lucide-react';

export const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.categorySlug === selectedCategory || p.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, sortBy, inStockOnly]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 mb-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-toyNavy uppercase">
            Shop All Toys
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Browse our complete catalog of authentic diecast models, educational puzzles, and construction toys.
          </p>
        </div>
        <div className="text-xs font-bold text-gray-500 bg-toyBg-single px-4 py-2 rounded-full border border-gray-200 self-start md:self-auto">
          Showing <span className="text-toyOrange font-extrabold">{filteredProducts.length}</span> Products
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white rounded-2xl p-4 mb-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-toyOrange" />
            <span className="font-bold text-toyNavy">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-toyText-primary font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-toyOrange"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* In Stock Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-toyOrange focus:ring-toyOrange"
            />
            <span className="font-semibold text-gray-700">In Stock Only</span>
          </label>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <SlidersHorizontal size={16} className="text-toyOrange" />
          <span className="font-bold text-toyNavy">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-toyText-primary font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-toyOrange"
          >
            <option value="featured">Featured / Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={filteredProducts} columns={5} />
    </div>
  );
};
