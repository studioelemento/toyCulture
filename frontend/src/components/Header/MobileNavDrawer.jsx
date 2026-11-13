import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Search, ChevronRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { buildCategoryCards } from '../../lib/categories';

export const MobileNavDrawer = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const { currentUser, isLoggedIn, openAuthDrawer, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetch('/api/categories')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setCategories(buildCategoryCards(data.data, { requireProducts: true }));
          }
        })
        .catch((err) => console.error('Failed to load categories:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-4/5 max-w-sm bg-white text-toyText-primary h-full shadow-2xl flex flex-col z-50 animate-slideRight">
        {/* Header section */}
        <div className="bg-toyNavy text-white p-4 flex items-center justify-between">
          <img
            src="https://toyculture.in/wp-content/uploads/2025/09/TOY-CULTURE-1.avif"
            alt="ToyCulture"
            className="h-8 w-auto object-contain"
          />
          <button
            onClick={onClose}
            className="p-1 hover:text-toyOrange transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-toyOrange"
            />
            <button
              type="submit"
              className="bg-toyOrange text-white p-2 rounded-md hover:bg-toyOrange-hover transition-colors"
            >
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Category Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-extrabold uppercase text-gray-400 mb-2 px-2">
            Categories
          </div>
          {categories.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-400">Loading categories...</div>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.link}
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold hover:bg-toyOrange/10 hover:text-toyOrange transition-colors"
              >
                <span>{cat.title}</span>
                {cat.productCount > 0 && (
                  <span className="text-[10px] text-gray-400">({cat.productCount})</span>
                )}
                <ChevronRight size={14} className="text-gray-400" />
              </Link>
            ))
          )}
        </div>

        {/* Footer Account & Links */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
          {isLoggedIn ? (
            <div className="flex items-center justify-between bg-toyNavy text-white px-4 py-2.5 rounded-lg">
              <Link
                to="/account"
                onClick={onClose}
                className="flex items-center gap-3 text-xs font-bold hover:text-toyOrange transition-colors flex-1"
              >
                <User size={16} className="text-toyOrange" />
                <span>{currentUser?.name || 'My Account'}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="text-gray-400 hover:text-toyRed transition-colors p-1"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                openAuthDrawer('login');
              }}
              className="w-full flex items-center gap-3 bg-toyNavy text-white px-4 py-2.5 rounded-lg text-xs font-bold justify-center hover:bg-toyNavy-light transition-colors"
            >
              <User size={16} className="text-toyOrange" />
              <span>Login / Register</span>
            </button>
          )}
          <Link
            to="/shop"
            onClick={onClose}
            className="block text-center text-xs font-bold text-gray-600 hover:text-toyOrange transition-colors"
          >
            All Toys Store
          </Link>
        </div>
      </div>
    </div>
  );
};
