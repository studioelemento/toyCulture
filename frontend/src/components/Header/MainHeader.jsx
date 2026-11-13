import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const MainHeader = ({ onOpenMobileMenu }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('0');
  const [categories, setCategories] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { totalItemsCount, subtotal, toggleCart } = useCart();
  const { currentUser, isLoggedIn, openAuthDrawer, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      let url = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
      if (selectedCategory !== '0') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
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
                <option value="0">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="text-gray-500 pointer-events-none -ml-3" />
            </div>

            {/* Keyword Input */}
            <input
              type="text"
              placeholder="Search for toys, brands, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full py-2.5 px-4 text-xs md:text-sm text-toyText-primary placeholder-gray-400 focus:outline-none"
            />

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-toyOrange hover:bg-toyOrange-hover text-white px-6 flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Submit search"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Popular Searches Dropdown Suggestion */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white text-toyText-primary shadow-2xl rounded-2xl p-4 border border-gray-100 z-50 animate-fadeIn">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {popularRequests.map((req, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={() => {
                      setSearchTerm(req);
                      navigate(`/search?q=${encodeURIComponent(req)}`);
                    }}
                    className="text-xs bg-toyBg hover:bg-toyOrange hover:text-white px-3 py-1 rounded-full text-toyText-heading font-medium transition-colors"
                  >
                    {req}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* User Account Button */}
          {isLoggedIn ? (
            <div className="relative group">
              <Link
                to="/account"
                className="flex items-center gap-2 text-white hover:text-toyOrange transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-toyNavy-light border border-gray-700 flex items-center justify-center">
                  <User size={18} className="text-toyOrange" />
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[10px] text-gray-400 leading-tight">Welcome,</span>
                  <span className="text-xs font-bold leading-tight truncate max-w-[100px]">
                    {currentUser?.name || 'My Account'}
                  </span>
                </div>
              </Link>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white text-toyText-primary rounded-xl shadow-xl border border-gray-100 py-2 hidden group-hover:block z-50">
                <Link
                  to="/account"
                  className="block px-4 py-2 text-xs font-medium hover:bg-toyBg hover:text-toyOrange"
                >
                  Dashboard
                </Link>
                <Link
                  to="/account/orders"
                  className="block px-4 py-2 text-xs font-medium hover:bg-toyBg hover:text-toyOrange"
                >
                  My Orders
                </Link>
                <Link
                  to="/account/wishlist"
                  className="block px-4 py-2 text-xs font-medium hover:bg-toyBg hover:text-toyOrange"
                >
                  Wishlist
                </Link>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-toyRed hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openAuthDrawer('login')}
              className="flex items-center gap-2 text-white hover:text-toyOrange transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-toyNavy-light border border-gray-700 flex items-center justify-center">
                <User size={18} />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-[10px] text-gray-400 leading-tight">Account</span>
                <span className="text-xs font-bold leading-tight">Login / Register</span>
              </div>
            </button>
          )}

          {/* Shopping Cart Trigger */}
          <button
            onClick={toggleCart}
            className="flex items-center gap-3 bg-toyNavy-light hover:bg-toyNavy-dark border border-gray-700 p-2 sm:px-3 sm:py-2 rounded-xl text-white transition-colors relative"
            aria-label="View Cart"
          >
            <div className="relative">
              <ShoppingBag size={20} className="text-toyOrange" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-toyRed text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-gray-400 uppercase leading-none font-semibold">
                Cart
              </span>
              <span className="text-xs font-bold text-white leading-none mt-1">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
