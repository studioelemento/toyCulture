import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  LayoutGrid,
  Gift,
  Star,
  Home,
  ShoppingBag,
  Baby,
  Tag,
  Percent,
  BookOpen,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { categories } from '../../data/categories';

/* 3D Toy Brick Logo Icon */
export const ToyBrickLogo = () => (
  <svg
    viewBox="0 0 44 44"
    className="w-9 h-9 md:w-10 md:h-10 shrink-0 drop-shadow-md"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Top Cube (Yellow) */}
    <path d="M22 2L34 8.5L22 15L10 8.5L22 2Z" fill="#FBBF24" />
    <path d="M10 8.5L22 15V27L10 20.5V8.5Z" fill="#0284C7" />
    <path d="M34 8.5L22 15V27L34 20.5V8.5Z" fill="#EA580C" />

    {/* Top Studs on isometric face */}
    <ellipse cx="22" cy="6" rx="3" ry="1.5" fill="#FDE68A" />
    <ellipse cx="16" cy="9.5" rx="2.5" ry="1.2" fill="#FDE68A" />
    <ellipse cx="28" cy="9.5" rx="2.5" ry="1.2" fill="#FDE68A" />

    {/* Lower Left Accent Cube */}
    <path d="M10 21L22 27.5L10 34L-2 27.5L10 21Z" fill="#38BDF8" opacity="0.9" />
    <path d="M10 34L22 27.5V39L10 44V34Z" fill="#0369A1" />

    {/* Lower Right Accent Cube */}
    <path d="M34 21L46 27.5L34 34L22 27.5L34 21Z" fill="#FB923C" opacity="0.9" />
    <path d="M22 27.5L34 34V44L22 39V27.5Z" fill="#C2410C" />
  </svg>
);

/* Top Notice Bar */
export const TopNoticeBar = () => {
  return (
    <div className="bg-[#071626] text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800/80 hidden lg:block">
      <div className="max-w-[1380px] mx-auto flex items-center justify-between">
        {/* Left Side: Value Props */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Truck size={13} className="text-slate-300" />
            <span>Free shipping above ₹2,000</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck size={13} className="text-slate-300" />
            <span>100% Authentic Products</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <RotateCcw size={13} className="text-slate-300" />
            <span>Easy Returns</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Headphones size={13} className="text-slate-300" />
            <span>Need Help? +91 79070 12345</span>
          </div>
        </div>

        {/* Right Side: Quick Links */}
        <div className="flex items-center gap-3 text-slate-300 font-medium">
          <Link to="/track-order" className="hover:text-white transition">
            Track Order
          </Link>
          <span className="text-slate-600">|</span>
          <Link to="/help-center" className="hover:text-white transition">
            Help Center
          </Link>
          <span className="text-slate-600">|</span>
          <Link to="/contact" className="hover:text-white transition">
            Sell With Us
          </Link>
          <span className="text-slate-600">|</span>
          <Link to="/affiliate-program" className="hover:text-white transition">
            Affiliate Program
          </Link>
        </div>
      </div>
    </div>
  );
};

/* Mock search autocomplete data matching the reference screenshot */
const searchSuggestions = [
  'maisto',
  'maisto cars',
  'maisto 1:18',
  'maisto 1:24',
  'maisto lamborghini',
  'maisto ferrari',
];

const searchProducts = [
  {
    id: 'lambo-huracan',
    title: 'Maisto Lamborghini Huracán 1:18 Diecast Model',
    price: '₹2,399',
    image: '/lamborghini.jpg',
    url: '/shop?search=lamborghini',
  },
  {
    id: 'ferrari-sf90',
    title: 'Maisto Ferrari SF90 1:24 Diecast Model',
    price: '₹1,499',
    image: '/ferrari.jpg',
    url: '/shop?search=ferrari',
  },
  {
    id: 'bmw-m4',
    title: 'Maisto BMW M4 1:24 Diecast Model',
    price: '₹1,299',
    image: '/blue-bmw-m4.jpg',
    url: '/shop?search=bmw',
  },
];

/* Mega Menu Subcategories mapping */
const megaMenuData = {
  'diecast-toys': {
    name: 'Diecast Toys',
    subcategories: [
      { name: 'Cars', slug: 'diecast-cars' },
      { name: 'Bikes', slug: 'diecast-bikes' },
      { name: 'Trucks & Commercial Vehicles', slug: 'trucks' },
      { name: 'Collections & Sets', slug: 'collections' },
      { name: 'Remote Control', slug: 'rc-cars' },
      { name: 'Playsets & Tracks', slug: 'tracks' },
    ],
    tag: 'DIECAST TOYS',
    title: 'Small details.\nBig adventures.',
    desc: 'Explore premium diecast models from top brands.',
    buttonText: 'Shop Diecast Toys',
    brand: 'Maisto',
    image: '/yellow-lamborghini.jpg',
  },
  'construction-toys': {
    name: 'Construction Toys',
    subcategories: [
      { name: 'Building Blocks', slug: 'building-blocks' },
      { name: 'Metal-Construction Sets', slug: 'metal-construction' },
      { name: 'Architectural Sets', slug: 'architectural' },
      { name: 'Magnetic Tiles', slug: 'magnetic-tiles' },
      { name: 'Engineering Kits', slug: 'engineering' },
    ],
    tag: 'CONSTRUCTION',
    title: 'Build without\nlimits today.',
    desc: 'Encourage spatial thinking with durable construction blocks.',
    buttonText: 'Shop Construction',
    brand: 'Lego',
    image: '/lego.jpg',
  },
  'puzzles': {
    name: 'Puzzles',
    subcategories: [
      { name: 'Jigsaw Puzzles', slug: 'jigsaw' },
      { name: '3D Wooden Puzzles', slug: '3d-puzzles' },
      { name: 'Brain Teasers', slug: 'brain-teasers' },
      { name: 'Floor Puzzles', slug: 'floor-puzzles' },
    ],
    tag: 'PUZZLES',
    title: 'Sharpen logic,\none piece at a time.',
    desc: 'Engaging puzzles designed for every curious mind.',
    buttonText: 'Shop Puzzles',
    brand: 'Smartivity',
    image: '/stacker.jpg',
  },
};

export const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState('diecast-toys');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);

  const { totalItemsCount } = useCart();
  const { currentUser, isLoggedIn, openAuthDrawer } = useAuth();
  const navigate = useNavigate();

  const searchContainerRef = useRef(null);
  const megaMenuRef = useRef(null);

  // Close search autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchActive(false);
      }
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchActive(false);
      setMobileSearchActive(false);
    }
  };

  const handleSuggestionClick = (query) => {
    setSearchTerm(query);
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setIsSearchActive(false);
    setMobileSearchActive(false);
  };

  const currentMegaData =
    megaMenuData[activeMegaCategory] || megaMenuData['diecast-toys'];

  const toggleMobileSection = (section) => {
    setMobileExpandedSection((prev) => (prev === section ? null : section));
  };

  return (
    <header className="w-full font-sans sticky top-0 z-50 shadow-md">
      {/* 1. TOP NOTICE ANNOUNCEMENT BAR */}
      <TopNoticeBar />

      {/* 2. DESKTOP & TABLET MAIN HEADER BAR (Dark Navy) */}
      <div className="bg-[#08182B] text-white py-3.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-[1380px] mx-auto flex items-center justify-between gap-4 lg:gap-8">
          {/* Mobile Menu Hamburger Button (< lg) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1.5 text-white hover:text-toyOrange transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>

          {/* Site Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <ToyBrickLogo />
            <div>
              <span className="text-lg lg:text-xl font-black text-white tracking-wider block leading-none font-sans">
                TOY CULTURE
              </span>
              <span className="hidden sm:block text-[9.5px] uppercase font-semibold text-slate-400 tracking-[0.22em] mt-0.5">
                Play • Learn • Grow
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar with Category Selector & Autocomplete (hidden on mobile) */}
          <div
            ref={searchContainerRef}
            className="hidden lg:flex flex-1 max-w-2xl relative mx-2"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="w-full bg-white rounded-full flex items-center pl-4 pr-1 py-1 shadow-sm border-2 border-transparent focus-within:border-toyOrange transition-all"
            >
              {/* Text Input */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchActive(true);
                }}
                onFocus={() => setIsSearchActive(true)}
                placeholder="Search for toys, brands or categories..."
                className="flex-1 text-xs md:text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none pr-2 font-normal"
              />

              {/* Clear button if search term exists */}
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-slate-400 hover:text-slate-600 transition mr-2"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}

              {/* Category dropdown inside search pill */}
              <div className="relative border-l border-slate-200 pl-3 pr-2 flex items-center">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-600 pr-4 py-1 outline-none cursor-pointer appearance-none"
                >
                  <option value="All Categories">All Categories</option>
                  <option value="Diecast Toys">Diecast Toys</option>
                  <option value="Construction Toys">Construction Toys</option>
                  <option value="Puzzles">Puzzles</option>
                  <option value="Role Play Toys">Role Play Toys</option>
                  <option value="STEM & DIY">STEM & DIY</option>
                  <option value="Activity Toys">Activity Toys</option>
                  <option value="Arts & Crafts">Arts & Crafts</option>
                  <option value="Outdoor & Sports">Outdoor & Sports</option>
                  <option value="Baby Toys">Baby Toys</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-1 text-slate-500 pointer-events-none"
                />
              </div>

              {/* Orange round submit button */}
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-[#F96515] hover:bg-[#EA580C] text-white flex items-center justify-center transition shrink-0 shadow-sm cursor-pointer ml-1"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </form>

            {/* DESKTOP SEARCH AUTOCOMPLETE DROPDOWN (Panel 2) */}
            {isSearchActive && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 text-slate-800 z-50 animate-fadeIn">
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Column: Search Suggestions */}
                  <div className="col-span-5 space-y-2 border-r border-slate-100 pr-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Suggestions
                    </div>
                    {searchSuggestions.map((query, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSuggestionClick(query)}
                        className="w-full flex items-center gap-2.5 text-left text-xs font-semibold text-slate-700 hover:text-toyOrange hover:bg-slate-50 py-1.5 px-2 rounded-lg transition"
                      >
                        <Search size={13} className="text-slate-400 shrink-0" />
                        <span>{query}</span>
                      </button>
                    ))}
                  </div>

                  {/* Right Column: Matching Products */}
                  <div className="col-span-7 pl-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-900 tracking-wide">
                        Products
                      </span>
                      <Link
                        to="/shop?filter=maisto"
                        onClick={() => setIsSearchActive(false)}
                        className="text-xs font-bold text-slate-800 hover:text-toyOrange flex items-center gap-1 transition"
                      >
                        <span>View All Results</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div className="space-y-2.5">
                      {searchProducts.map((item) => (
                        <Link
                          key={item.id}
                          to={item.url}
                          onClick={() => setIsSearchActive(false)}
                          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition group"
                        >
                          <div className="w-12 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1 border border-slate-200/60">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-contain group-hover:scale-105 transition"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-toyOrange transition">
                              {item.title}
                            </h4>
                            <p className="text-xs font-extrabold text-[#0D233A] mt-0.5">
                              {item.price}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Header Icons (Account, Wishlist, Cart) */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Account Link (Desktop) */}
            <div className="hidden lg:flex items-center">
              {isLoggedIn ? (
                <Link
                  to="/account"
                  className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-toyOrange transition"
                >
                  <User size={19} className="text-white shrink-0" />
                  <span>{currentUser?.name || 'Account'}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthDrawer('login')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-toyOrange transition cursor-pointer"
                >
                  <User size={19} className="text-white shrink-0" />
                  <span>Account</span>
                </button>
              )}
            </div>

            {/* Wishlist Link (Desktop & Mobile) */}
            <Link
              to="/wishlist"
              className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-toyOrange transition"
              aria-label="Wishlist"
            >
              <Heart size={20} className="text-white shrink-0" />
              <span className="hidden lg:inline">Wishlist</span>
            </Link>

            {/* Shopping Cart Trigger */}
            <Link
              to="/cart"
              className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-toyOrange transition relative"
              aria-label="View Cart"
            >
              <div className="relative flex items-center">
                <ShoppingCart size={21} className="text-white shrink-0" />
                <span className="absolute -top-2 -right-2 bg-[#F96515] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItemsCount || 0}
                </span>
              </div>
              <span className="hidden lg:inline ml-0.5">Cart</span>
            </Link>
          </div>
        </div>

        {/* 3. MOBILE SEARCH BAR (Row 2 on Mobile screens) */}
        <div className="lg:hidden mt-3 pt-1 relative">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full bg-white rounded-full flex items-center pl-4 pr-1 py-1 shadow-xs border border-slate-200"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setMobileSearchActive(true);
              }}
              onFocus={() => setMobileSearchActive(true)}
              placeholder="Search for toys, brands or categories..."
              className="flex-1 text-xs text-slate-800 placeholder-slate-400 bg-transparent outline-none pr-2 font-normal"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="p-1 text-slate-400 hover:text-slate-600 transition mr-1"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}

            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-[#F96515] hover:bg-[#EA580C] text-white flex items-center justify-center transition shrink-0"
              aria-label="Search"
            >
              <Search size={15} />
            </button>
          </form>

          {/* MOBILE SEARCH AUTOCOMPLETE (Panel 5) */}
          {mobileSearchActive && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 text-slate-800 z-50 animate-fadeIn">
              {/* Search suggestions */}
              <div className="space-y-1.5 pb-3 border-b border-slate-100">
                {searchSuggestions.slice(0, 4).map((query, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(query)}
                    className="w-full flex items-center gap-2 text-left text-xs font-semibold text-slate-700 hover:text-toyOrange py-1"
                  >
                    <Search size={13} className="text-slate-400" />
                    <span>{query}</span>
                  </button>
                ))}
              </div>

              {/* Matching products list */}
              <div className="pt-3 space-y-2.5">
                {searchProducts.map((item) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    onClick={() => setMobileSearchActive(false)}
                    className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="w-10 h-9 bg-slate-100 rounded-md overflow-hidden shrink-0 flex items-center justify-center p-1 border border-slate-200/50">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs font-extrabold text-[#0D233A] mt-0.5">
                        {item.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Bottom View All Link */}
              <div className="pt-3 mt-2 border-t border-slate-100">
                <Link
                  to={`/shop?search=${encodeURIComponent(searchTerm || 'maisto')}`}
                  onClick={() => setMobileSearchActive(false)}
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 hover:text-toyOrange transition"
                >
                  <span>View all results for "{searchTerm || 'maisto'}"</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. CATEGORY NAVIGATION BAR (White Bar below Main Header) */}
      <div
        ref={megaMenuRef}
        className="hidden lg:block bg-white border-b border-slate-200/90 shadow-2xs relative z-40"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2">
          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-xs font-bold text-slate-800">
            {/* All Categories Button Trigger (Toggles Mega Menu) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                className={`flex items-center gap-2 py-1.5 px-3 rounded-lg font-bold text-xs transition cursor-pointer ${
                  isCategoryMenuOpen
                    ? 'text-toyOrange bg-orange-50'
                    : 'text-slate-800 hover:text-toyOrange hover:bg-slate-50'
                }`}
              >
                <LayoutGrid size={15} />
                <span>All Categories</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isCategoryMenuOpen ? 'rotate-180 text-toyOrange' : ''
                  }`}
                />
              </button>
            </div>

            {/* Shop Link with dropdown indicator */}
            <div className="relative group">
              <Link
                to="/shop"
                className="flex items-center gap-1.5 py-1.5 hover:text-toyOrange transition"
              >
                <span>Shop</span>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-toyOrange" />
              </Link>
              {/* Flyout for Shop */}
              <div className="absolute top-full left-0 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block animate-fadeIn z-50">
                <Link to="/shop" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  All Toys
                </Link>
                <Link to="/shop?filter=new" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  New Arrivals
                </Link>
                <Link to="/shop?filter=bestsellers" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  Best Sellers
                </Link>
                <Link to="/shop?filter=offers" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  Offers
                </Link>
              </div>
            </div>

            {/* Shop by Age */}
            <div className="relative group">
              <Link
                to="/shop-by-age"
                className="flex items-center gap-1.5 py-1.5 hover:text-toyOrange transition"
              >
                <span>Shop by Age</span>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-toyOrange" />
              </Link>
              {/* Flyout for Shop by Age */}
              <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block animate-fadeIn z-50">
                <Link to="/shop-by-age" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  0-12 Months
                </Link>
                <Link to="/shop-by-age" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  1-2 Years
                </Link>
                <Link to="/shop-by-age" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  3-4 Years
                </Link>
                <Link to="/shop-by-age" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  5-7 Years
                </Link>
                <Link to="/shop-by-age" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  8-11 Years
                </Link>
                <Link to="/shop-by-age" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  12+ Years
                </Link>
              </div>
            </div>

            {/* Brands */}
            <div className="relative group">
              <Link
                to="/brands"
                className="flex items-center gap-1.5 py-1.5 hover:text-toyOrange transition"
              >
                <span>Brands</span>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-toyOrange" />
              </Link>
              <div className="absolute top-full left-0 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block animate-fadeIn z-50">
                <Link to="/shop?brand=Maisto" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  Maisto
                </Link>
                <Link to="/shop?brand=Bburago" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  Bburago
                </Link>
                <Link to="/shop?brand=Ratnas" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  Ratnas
                </Link>
                <Link to="/shop?brand=Smartivity" className="block px-4 py-2 hover:bg-slate-50 hover:text-toyOrange">
                  Smartivity
                </Link>
              </div>
            </div>

            {/* Offers Link */}
            <Link
              to="/shop?filter=offers"
              className="py-1.5 hover:text-toyOrange transition"
            >
              Offers
            </Link>

            {/* Learn Link */}
            <Link
              to="/about"
              className="py-1.5 hover:text-toyOrange transition"
            >
              Learn
            </Link>
          </div>

          {/* Right Highlight Button: Find a Toy */}
          <div>
            <Link
              to="/shop"
              className="border border-orange-200 bg-orange-50/80 hover:bg-[#F96515] hover:text-white text-[#F96515] font-bold text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-2xs"
            >
              <Gift size={15} />
              <span>Find a Toy</span>
            </Link>
          </div>
        </div>

        {/* 5. MEGA MENU DROPDOWN (Panel 3: Category Mega Menu) */}
        {isCategoryMenuOpen && (
          <div
            onMouseLeave={() => setIsCategoryMenuOpen(false)}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-2xl py-8 px-6 lg:px-12 animate-fadeIn z-50"
          >
            <div className="max-w-[1380px] mx-auto grid grid-cols-12 gap-8">
              {/* Col 1: Categories List */}
              <div className="col-span-3 space-y-1 border-r border-slate-100 pr-4">
                <button
                  type="button"
                  onMouseEnter={() => setActiveMegaCategory('diecast-toys')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    activeMegaCategory === 'diecast-toys'
                      ? 'bg-orange-50 text-[#F96515]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-toyOrange'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">🏎️</span>
                    <span>Diecast Toys</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>

                <button
                  type="button"
                  onMouseEnter={() => setActiveMegaCategory('construction-toys')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    activeMegaCategory === 'construction-toys'
                      ? 'bg-orange-50 text-[#F96515]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-toyOrange'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">🧱</span>
                    <span>Construction Toys</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>

                <button
                  type="button"
                  onMouseEnter={() => setActiveMegaCategory('puzzles')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    activeMegaCategory === 'puzzles'
                      ? 'bg-orange-50 text-[#F96515]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-toyOrange'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">🧩</span>
                    <span>Puzzles</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>

                <Link
                  to="/category/role-play-toys"
                  onClick={() => setIsCategoryMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-toyOrange transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">🎭</span>
                    <span>Role Play Toys</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>

                <Link
                  to="/category/stem-diy"
                  onClick={() => setIsCategoryMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-toyOrange transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">🔬</span>
                    <span>STEM & DIY</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>

                <Link
                  to="/category/activity-toys-for-kids"
                  onClick={() => setIsCategoryMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-toyOrange transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">🎯</span>
                    <span>Activity Toys</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>

                <Link
                  to="/category/art-and-craft-for-kids"
                  onClick={() => setIsCategoryMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-toyOrange transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">🎨</span>
                    <span>Arts & Crafts</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>

                <Link
                  to="/shop?category=outdoor"
                  onClick={() => setIsCategoryMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-toyOrange transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">⚽</span>
                    <span>Outdoor & Sports</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>

                <Link
                  to="/shop?category=baby"
                  onClick={() => setIsCategoryMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-toyOrange transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">👶</span>
                    <span>Baby Toys</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>

                {/* Bottom link: View All Categories */}
                <div className="pt-3 border-t border-slate-100">
                  <Link
                    to="/shop-by-category"
                    onClick={() => setIsCategoryMenuOpen(false)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-toyOrange transition px-2"
                  >
                    <span>View All Categories</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Col 2: Subcategories List */}
              <div className="col-span-3 space-y-3.5 border-r border-slate-100 pr-4">
                <h3 className="text-sm font-bold text-slate-900 tracking-wide font-sans">
                  {currentMegaData.name}
                </h3>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
                  {currentMegaData.subcategories.map((sub, idx) => (
                    <li key={idx}>
                      <Link
                        to={`/shop?category=${sub.slug}`}
                        onClick={() => setIsCategoryMenuOpen(false)}
                        className="hover:text-toyOrange transition block py-0.5"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={`/category/${activeMegaCategory}`}
                    onClick={() => setIsCategoryMenuOpen(false)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-toyOrange transition"
                  >
                    <span>View All {currentMegaData.name}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Col 3: Featured Promo Card + Trust Badges */}
              <div className="col-span-6 flex flex-col justify-between">
                {/* Promo Card with Sky Blue Background */}
                <div className="bg-[#EBF7FC] border border-[#D3EBF5] rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
                  <div className="max-w-[240px] z-10 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      {currentMegaData.tag}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight font-title whitespace-pre-line">
                      {currentMegaData.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed">
                      {currentMegaData.desc}
                    </p>
                    <div className="pt-2">
                      <Link
                        to={`/category/${activeMegaCategory}`}
                        onClick={() => setIsCategoryMenuOpen(false)}
                        className="bg-[#F96515] hover:bg-[#EA580C] text-white font-bold text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 shadow-sm transition active:scale-[0.98]"
                      >
                        <span>{currentMegaData.buttonText}</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>

                  {/* Brand badge & Car / Toy Image */}
                  <div className="relative shrink-0 flex flex-col items-end">
                    {/* Brand Pill */}
                    <div className="bg-white px-2.5 py-0.5 rounded-md border border-red-200 shadow-xs mb-1">
                      <span className="text-[#DD1D21] font-black italic text-xs tracking-wider">
                        {currentMegaData.brand}
                      </span>
                    </div>

                    {/* Yellow Lamborghini / Supercar */}
                    <div className="w-56 h-36 flex items-center justify-center">
                      <img
                        src={currentMegaData.image}
                        alt="Featured Diecast Model"
                        className="w-full h-full object-contain filter drop-shadow-md select-none pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3 Trust Badges below Promo Card */}
                <div className="flex items-center justify-between pt-5 px-2 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <Star size={15} className="text-slate-400" />
                    <span>Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-slate-400" />
                    <span>Top Brands</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift size={15} className="text-slate-400" />
                    <span>Great for Gifting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. MOBILE MENU (OPEN) DRAWER (Panel 6) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-over Drawer */}
          <div className="relative w-4/5 max-w-sm bg-white text-slate-800 h-full shadow-2xl flex flex-col z-50 animate-slideRight">
            {/* Dark Navy Header with Logo & Close button */}
            <div className="bg-[#08182B] text-white p-4 flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <ToyBrickLogo />
                <span className="text-base font-black text-white tracking-wider">
                  TOY CULTURE
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-white hover:text-toyOrange transition cursor-pointer"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Menu Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {/* Home */}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-toyOrange transition"
              >
                <Home size={18} className="text-slate-500" />
                <span>Home</span>
              </Link>

              {/* All Categories Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('categories')}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-toyOrange transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid size={18} className="text-slate-500" />
                    <span>All Categories</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-slate-400 transition-transform ${
                      mobileExpandedSection === 'categories' ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {mobileExpandedSection === 'categories' && (
                  <div className="pl-9 pr-3 py-2 space-y-2 text-xs font-semibold text-slate-600 animate-fadeIn">
                    <Link
                      to="/category/diecast-toys"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 hover:text-toyOrange"
                    >
                      Diecast Toys
                    </Link>
                    <Link
                      to="/category/construction-toys"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 hover:text-toyOrange"
                    >
                      Construction Toys
                    </Link>
                    <Link
                      to="/category/puzzles"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 hover:text-toyOrange"
                    >
                      Puzzles
                    </Link>
                    <Link
                      to="/category/role-play-toys"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 hover:text-toyOrange"
                    >
                      Role Play Toys
                    </Link>
                    <Link
                      to="/category/stem-diy"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 hover:text-toyOrange"
                    >
                      STEM & DIY
                    </Link>
                    <Link
                      to="/category/activity-toys-for-kids"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 hover:text-toyOrange"
                    >
                      Activity Toys
                    </Link>
                    <Link
                      to="/category/art-and-craft-for-kids"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 hover:text-toyOrange"
                    >
                      Arts & Crafts
                    </Link>
                    <Link
                      to="/shop?category=outdoor"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 hover:text-toyOrange"
                    >
                      Outdoor & Sports
                    </Link>
                    <Link
                      to="/shop?category=baby"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 hover:text-toyOrange"
                    >
                      Baby Toys
                    </Link>
                  </div>
                )}
              </div>

              {/* Shop Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('shop')}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-toyOrange transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={18} className="text-slate-500" />
                    <span>Shop</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${
                      mobileExpandedSection === 'shop' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileExpandedSection === 'shop' && (
                  <div className="pl-9 pr-3 py-2 space-y-2 text-xs font-semibold text-slate-600 animate-fadeIn">
                    <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      All Toys
                    </Link>
                    <Link to="/shop?filter=new" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      New Arrivals
                    </Link>
                    <Link to="/shop?filter=bestsellers" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      Best Sellers
                    </Link>
                    <Link to="/shop?filter=offers" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      Special Offers
                    </Link>
                  </div>
                )}
              </div>

              {/* Shop by Age Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('age')}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-toyOrange transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Baby size={18} className="text-slate-500" />
                    <span>Shop by Age</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${
                      mobileExpandedSection === 'age' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileExpandedSection === 'age' && (
                  <div className="pl-9 pr-3 py-2 space-y-2 text-xs font-semibold text-slate-600 animate-fadeIn">
                    <Link to="/shop-by-age" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      0-12 Months
                    </Link>
                    <Link to="/shop-by-age" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      1-2 Years
                    </Link>
                    <Link to="/shop-by-age" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      3-4 Years
                    </Link>
                    <Link to="/shop-by-age" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      5-7 Years
                    </Link>
                    <Link to="/shop-by-age" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      8-11 Years
                    </Link>
                    <Link to="/shop-by-age" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      12+ Years
                    </Link>
                  </div>
                )}
              </div>

              {/* Brands Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('brands')}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-toyOrange transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Tag size={18} className="text-slate-500" />
                    <span>Brands</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${
                      mobileExpandedSection === 'brands' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileExpandedSection === 'brands' && (
                  <div className="pl-9 pr-3 py-2 space-y-2 text-xs font-semibold text-slate-600 animate-fadeIn">
                    <Link to="/shop?brand=Maisto" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      Maisto
                    </Link>
                    <Link to="/shop?brand=Bburago" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      Bburago
                    </Link>
                    <Link to="/shop?brand=Ratnas" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      Ratnas
                    </Link>
                    <Link to="/shop?brand=Smartivity" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-toyOrange">
                      Smartivity
                    </Link>
                  </div>
                )}
              </div>

              {/* Offers */}
              <Link
                to="/shop?filter=offers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-toyOrange transition"
              >
                <Percent size={18} className="text-slate-500" />
                <span>Offers</span>
              </Link>

              {/* Learn */}
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-toyOrange transition"
              >
                <BookOpen size={18} className="text-slate-500" />
                <span>Learn</span>
              </Link>
            </div>

            {/* Bottom Actions: Account, Wishlist, Cart */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
              {isLoggedIn ? (
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-white transition"
                >
                  <User size={18} className="text-slate-500" />
                  <span>Account ({currentUser?.name})</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthDrawer('login');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-white transition text-left cursor-pointer"
                >
                  <User size={18} className="text-slate-500" />
                  <span>Account / Login</span>
                </button>
              )}

              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-white transition"
              >
                <Heart size={18} className="text-slate-500" />
                <span>Wishlist</span>
              </Link>

              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-white transition"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={18} className="text-slate-500" />
                  <span>Cart</span>
                </div>
                <span className="bg-[#F96515] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {totalItemsCount || 0}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
