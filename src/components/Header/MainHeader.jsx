import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { categories } from '../../data/categories';

export const MainHeader = ({ onOpenMobileMenu }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('0');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { totalItemsCount, subtotal, toggleCart } = useCart();
  const { currentUser, isLoggedIn, openAuthDrawer, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      let url = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
      if (selectedCategory !== '0') {
        url += `&category=${selectedCategory}`;
      }
      navigate(url);
      setIsSearchFocused(false);
    }
  };

  const popularRequests = ['diecast toys', 'puzzles', 'building blocks', 'diy'];

  return (
    <div className="bg-toyNavy text-white py-4 px-4 sticky top-0 z-40 shadow-md">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-white hover:text-toyOrange transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu size={24} />
        </button>

        {/* Site Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center">
          <img
            src="https://toyculture.in/wp-content/uploads/2025/09/TOY-CULTURE-1.avif"
            alt="ToyCulture Logo"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8 relative">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full bg-white rounded-full overflow-hidden shadow-inner border-2 border-transparent focus-within:border-toyOrange"
          >
            {/* Category Filter Select */}
            <div className="relative flex items-center bg-gray-100 border-r border-gray-200 px-3 text-toyText-primary text-xs font-semibold cursor-pointer">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent pr-4 py-2 cursor-pointer focus:outline-none appearance-none"
              >
                <option value="0">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 text-gray-500 pointer-events-none" />
            </div>

            {/* Input field */}
            <input
              type="text"
              placeholder="Search for products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="flex-1 px-4 py-2 text-sm text-toyText-primary focus:outline-none placeholder-gray-400"
            />

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-toyOrange hover:bg-toyOrange-hover text-white px-6 py-2 font-semibold text-sm transition-colors flex items-center justify-center gap-1"
            >
              <Search size={16} />
              <span>Search</span>
            </button>
          </form>

          {/* Popular Requests Search Dropdown */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 text-toyText-primary z-50 animate-fadeIn">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Popular requests
              </div>
              <div className="flex flex-wrap gap-2">
                {popularRequests.map((req, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={() => {
                      setSearchTerm(req);
                      navigate(`/search?q=${encodeURIComponent(req)}`);
                    }}
                    className="text-xs bg-gray-100 hover:bg-toyOrange hover:text-white px-3 py-1.5 rounded-full transition-colors font-medium"
                  >
                    {req}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Tools (Account & Cart) */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* User Account */}
          {isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/account"
                className="flex items-center gap-2 text-xs font-bold uppercase hover:text-toyOrange transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-toyOrange/20 text-toyOrange flex items-center justify-center font-black text-xs">
                  {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span>{currentUser?.name || 'My Account'}</span>
              </Link>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-toyRed transition-colors p-1"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthDrawer('login')}
              className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase hover:text-toyOrange transition-colors cursor-pointer"
            >
              <User size={20} className="text-toyOrange" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Shopping Cart Trigger */}
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-3 bg-toyOrange hover:bg-toyOrange-hover px-3 py-2 rounded-full border border-gray-700 transition-colors"
            aria-label="View Shopping Cart"
          >
            <div className="relative bg">
              <span className="absolute -top-2 -right-2 bg-white text-toyOrange text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalItemsCount}
              </span>
              <ShoppingBag size={22} className="text-white" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white mt-0.5">
                ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
