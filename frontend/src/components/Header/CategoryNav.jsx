import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';

export const CategoryNav = () => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  return (
    <div className="hidden lg:block bg-toyNavy border-t border-gray-800 text-white relative z-30">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Browse Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              className="bg-toyOrange hover:bg-toyOrange-hover text-white px-5 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-3 rounded-t-md transition-colors"
            >
              <Menu size={18} />
              <span>Browse Categories</span>
              <ChevronDown size={14} />
            </button>

            {/* Categories Dropdown Menu */}
            {isCategoryMenuOpen && (
              <div
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
                className="absolute top-full left-0 w-64 bg-white text-toyText-primary shadow-2xl rounded-b-md border border-gray-100 py-2 z-50 animate-fadeIn"
              >
                {categories.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-gray-400">Loading categories...</div>
                ) : (
                  categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold hover:bg-toyBg hover:text-toyOrange transition-colors"
                      onClick={() => setIsCategoryMenuOpen(false)}
                    >
                      <span>{cat.name}</span>
                      {cat.productCount > 0 && (
                        <span className="text-[10px] text-gray-400">({cat.productCount})</span>
                      )}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider hover:text-toyOrange transition-colors py-3"
          >
            All Toys
          </Link>
          <Link
            to="/shop-by-age"
            className="text-xs font-bold uppercase tracking-wider hover:text-toyOrange transition-colors py-3"
          >
            Shop By Age
          </Link>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider hover:text-toyOrange transition-colors py-3"
          >
            Categories
          </Link>
        </div>

        {/* Live Shop Indicator */}
        <div>
          <span className="text-xs font-semibold text-toyOrange uppercase tracking-wider">
            100% Genuine Toys
          </span>
        </div>
      </div>
    </div>
  );
};
