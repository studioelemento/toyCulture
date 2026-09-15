import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Search, ChevronRight, User, ShoppingBag } from 'lucide-react';
import { categories } from '../../data/categories';

export const MobileNavDrawer = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
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
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold hover:bg-toyOrange/10 hover:text-toyOrange transition-colors"
            >
              <span>{cat.name}</span>
              <ChevronRight size={14} className="text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Footer Account & Links */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
          <Link
            to="/account"
            onClick={onClose}
            className="flex items-center gap-3 bg-toyNavy text-white px-4 py-2.5 rounded-lg text-xs font-bold justify-center hover:bg-toyNavy-light transition-colors"
          >
            <User size={16} className="text-toyOrange" />
            <span>Login / Register</span>
          </Link>
          <Link
            to="/affiliate-registration"
            onClick={onClose}
            className="block text-center text-xs font-bold text-toyOrange border border-toyOrange py-2 rounded-lg hover:bg-toyOrange hover:text-white transition-colors"
          >
            Affiliate Program
          </Link>
        </div>
      </div>
    </div>
  );
};
