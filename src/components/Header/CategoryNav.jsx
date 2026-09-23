import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { categories } from '../../data/categories';

export const CategoryNav = () => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

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
                onMouseLeave={() => {
                  setIsCategoryMenuOpen(false);
                  setActiveSubMenu(null);
                }}
                className="absolute top-full left-0 w-64 bg-white text-toyText-primary shadow-2xl rounded-b-md border border-gray-100 py-2 z-50 animate-fadeIn"
              >
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="relative group"
                    onMouseEnter={() => setActiveSubMenu(cat.id)}
                  >
                    <Link
                      to={`/category/${cat.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold hover:bg-toyBg hover:text-toyOrange transition-colors"
                      onClick={() => setIsCategoryMenuOpen(false)}
                    >
                      <span>{cat.name}</span>
                      {cat.subcategories && <ChevronRight size={14} className="text-gray-400" />}
                    </Link>

                    {/* Subcategories Flyout Menu */}
                    {cat.subcategories && activeSubMenu === cat.id && (
                      <div className="absolute top-0 left-full w-56 bg-white text-toyText-primary shadow-xl rounded-md border border-gray-100 py-2 ml-1 z-50">
                        {cat.subcategories.map((sub, idx) => (
                          <Link
                            key={idx}
                            to={`/category/${sub.slug}`}
                            className="block px-4 py-2 text-xs font-medium hover:bg-toyBg hover:text-toyOrange transition-colors"
                            onClick={() => setIsCategoryMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Affiliate Program Button */}
        <div>
          <Link
            to="/affiliate-registration"
            className="border-2 border-toyOrange text-toyOrange hover:bg-toyOrange hover:text-white text-xs font-bold px-4 py-1.5 rounded-full transition-all inline-block"
          >
            Affiliate Program
          </Link>
        </div>
      </div>
    </div>
  );
};
