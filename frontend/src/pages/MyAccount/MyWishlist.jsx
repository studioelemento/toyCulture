import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MapPin,
  User,
  Heart,
  Tag,
  Headphones,
  LogOut,
  ChevronLeft,
  Star,
  ShoppingCart,
  Bell,
  Check,
  ChevronDown,
  LayoutGrid,
  List
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function MyWishlist() {
  const { currentUser, logout } = useAuth();
  const { addToCart, totalItemsCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const displayName = currentUser?.name || 'Anand R V';
  const displayEmail = currentUser?.email || 'anandrv@example.com';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join('') || 'AR';

  // Desktop sidebar navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/account' },
    { id: 'orders', label: 'My Orders', icon: Package, path: '/account/orders' },
    { id: 'addresses', label: 'My Addresses', icon: MapPin, path: '/account/addresses' },
    { id: 'personal', label: 'Personal Details', icon: User, path: '/account/personal' },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart, path: '/account/wishlist' },
    { id: 'coupons', label: 'Coupons & Rewards', icon: Tag, path: '/account/coupons' },
    { id: 'support', label: 'Help & Support', icon: Headphones, path: '/account/support' },
  ];

  // Wishlist products matching the reference design exactly
  const initialWishlistItems = [
    {
      id: 'wl-1',
      name: 'Lamborghini Huracán LP 610-4',
      price: 2399,
      rating: 4.8,
      reviews: 124,
      inStock: true,
      image: '/product-lamborghini.jpg',
      badge: 'In Stock',
      category: 'Die-cast Vehicles',
    },
    {
      id: 'wl-2',
      name: 'LEGO Classic Creative Bricks Box',
      price: 1499,
      rating: 4.6,
      reviews: 89,
      inStock: true,
      image: '/product-lego.jpg',
      badge: 'In Stock',
      category: 'Building Blocks',
    },
    {
      id: 'wl-3',
      name: 'Barbie Fashion Doll',
      price: 999,
      rating: 4.7,
      reviews: 112,
      inStock: true,
      image: '/product-barbie.jpg',
      badge: 'In Stock',
      category: 'Dolls',
    },
    {
      id: 'wl-4',
      name: 'Remote Control Jeep 4x4',
      price: 1899,
      rating: 4.5,
      reviews: 76,
      inStock: true,
      image: '/product-jeep.jpg',
      badge: 'In Stock',
      category: 'Remote Control',
    },
    {
      id: 'wl-5',
      name: 'Hot Wheels 5 Car Pack',
      price: 799,
      rating: 4.6,
      reviews: 95,
      inStock: true,
      image: '/product-hotwheels.jpg',
      badge: 'In Stock',
      category: 'Die-cast Vehicles',
    },
    {
      id: 'wl-6',
      name: 'Dinosaur Action Figure Set',
      price: 1299,
      rating: 4.4,
      reviews: 68,
      inStock: false,
      image: '/product-dinosaur.jpg',
      badge: 'Out of Stock',
      category: 'Action Figures',
    },
    {
      id: 'wl-7',
      name: 'STEM Robot Building Kit',
      price: 1699,
      rating: 4.6,
      reviews: 73,
      inStock: true,
      image: '/product-robot.jpg',
      badge: 'In Stock',
      category: 'Learning & STEM',
    },
    {
      id: 'wl-8',
      name: 'Soft Teddy Bear (40 cm)',
      price: 1099,
      rating: 4.8,
      reviews: 101,
      inStock: true,
      image: '/product-teddy.jpg',
      badge: 'In Stock',
      category: 'Soft Toys',
    },
  ];

  const [items, setItems] = useState(initialWishlistItems);
  const [filter, setFilter] = useState('all'); // 'all', 'in-stock', 'out-of-stock'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'price-low', 'price-high'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (default matching mockup) or 'list'
  const [notifiedItems, setNotifiedItems] = useState({});
  const [addedItems, setAddedItems] = useState({});

  const totalCount = items.length;
  const inStockCount = items.filter((i) => i.inStock).length;
  const outOfStockCount = items.filter((i) => !i.inStock).length;

  const handleToggleHeart = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item) => {
    if (!item.inStock) return;
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      inStock: true,
    });
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const handleNotifyMe = (id) => {
    setNotifiedItems((prev) => ({ ...prev, [id]: true }));
    alert('You will be notified when this item is back in stock!');
  };

  // Filter & Sort
  const filteredItems = items
    .filter((item) => {
      if (filter === 'in-stock') return item.inStock;
      if (filter === 'out-of-stock') return !item.inStock;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-3 sm:py-6 px-3 sm:px-6 md:px-8 font-sans">
      <div className="max-w-[1340px] mx-auto">

        {/* ================= MOBILE HEADER TOP BAR (Matching Mockup) ================= */}
        <div className="flex lg:hidden items-center justify-between pt-1 pb-3 px-1">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/account')}
              className="p-1 -ml-1 text-[#0B1B3D] hover:text-[#4F46E5] transition-colors"
              aria-label="Back to account"
            >
              <ChevronLeft size={28} className="stroke-[2.8]" />
            </button>
            <h1 className="text-xl font-black text-[#0B1B3D] tracking-tight">
              My Wishlist
            </h1>
          </div>

          {/* Cart Icon with Badge */}
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 text-[#0B1B3D] hover:text-[#4F46E5] transition-colors"
            aria-label="View Cart"
          >
            <ShoppingCart size={24} className="stroke-[2.2]" />
            <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-[#F96515] text-white text-[11px] font-black flex items-center justify-center shadow-xs">
              {totalItemsCount || 3}
            </span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ================= LEFT SIDEBAR (Desktop Only) ================= */}
          <aside className="w-full lg:w-[280px] flex-shrink-0 hidden lg:flex flex-col lg:sticky lg:top-6 self-start">
            {/* Unified Sidebar Card Matching Reference Mockup */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
              <div className="p-6 pb-2">
                {/* User Avatar Initials */}
                <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-xl font-bold mb-4 shadow-inner">
                  {initials}
                </div>
                <h2 className="text-lg font-black text-slate-800 tracking-tight leading-tight">
                  {displayName}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-medium truncate">
                  {displayEmail}
                </p>

                {/* Navigation Menu Links */}
                <nav className="mt-6 flex flex-col gap-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === 'wishlist';
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                          isActive
                            ? 'bg-[#EEF2FF] text-[#2563EB] shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon
                          size={18}
                          className={isActive ? 'text-[#2563EB]' : 'text-slate-400'}
                        />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                  <button
                    onClick={handleLogout}
                    className="w-full mt-3 flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all text-left"
                  >
                    <LogOut size={18} className="text-rose-500" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>

              {/* Bottom Sidebar Background Toys Illustration (Teddy, Car, Blocks, Rings) */}
              <div className="relative w-full overflow-hidden rounded-b-3xl mt-1">
                <img
                  src="/wishlist-sidebar-toys.jpg"
                  alt="Toy Collection"
                  className="w-full h-auto object-contain object-bottom block"
                />
              </div>
            </div>
          </aside>

          {/* ================= RIGHT MAIN CONTENT ================= */}
          <main className="flex-1 w-full space-y-4 sm:space-y-6">

            {/* Header Greeting Banner with Top-Corner Mascot Boy (Desktop Only) */}
            <div className="hidden lg:flex relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm items-center justify-between min-h-[148px]">
              <div className="relative z-10 max-w-xl py-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                  <Link to="/account" className="hover:text-slate-700 transition-colors">
                    My Account
                  </Link>
                  <span>&gt;</span>
                  <span className="text-[#0B1B3D] font-bold">My Wishlist</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#0B1B3D] tracking-tight mt-1 mb-1.5">
                  My Wishlist
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Your favourite toys, all in one place. Save items you love and shop them anytime.
                </p>
              </div>

              {/* Top Corner Mascot Boy Hugging Red Heart */}
              <div className="absolute top-0 right-0 bottom-0 h-full w-[360px] sm:w-[420px] flex items-center justify-end pointer-events-none overflow-hidden rounded-r-3xl">
                <img
                  src="/wishlist-boy-heart.jpg"
                  alt="My Wishlist Mascot Boy"
                  className="h-full w-full object-cover object-right"
                />
              </div>
            </div>

            {/* Filter Tabs & Sort Row (Matching Reference Layout) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 px-1 pb-1 sm:pb-0">
              <div className="flex items-center gap-5 sm:gap-8 overflow-x-auto scrollbar-none pb-0">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex items-center gap-2 pb-3 text-sm sm:text-base font-bold transition-all relative whitespace-nowrap ${
                    filter === 'all'
                      ? 'text-[#F96515]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>All Items</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                      filter === 'all'
                        ? 'bg-[#F96515] text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {totalCount}
                  </span>
                  {filter === 'all' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F96515] rounded-full"></div>
                  )}
                </button>

                <button
                  onClick={() => setFilter('in-stock')}
                  className={`flex items-center gap-2 pb-3 text-sm sm:text-base font-bold transition-all relative whitespace-nowrap ${
                    filter === 'in-stock'
                      ? 'text-[#2563EB]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>In Stock</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                      filter === 'in-stock'
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-blue-50 text-[#2563EB]'
                    }`}
                  >
                    {inStockCount}
                  </span>
                  {filter === 'in-stock' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full"></div>
                  )}
                </button>

                <button
                  onClick={() => setFilter('out-of-stock')}
                  className={`flex items-center gap-2 pb-3 text-sm sm:text-base font-bold transition-all relative whitespace-nowrap ${
                    filter === 'out-of-stock'
                      ? 'text-[#2563EB]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>Out of Stock</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                      filter === 'out-of-stock'
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-blue-50 text-[#2563EB]'
                    }`}
                  >
                    {outOfStockCount}
                  </span>
                  {filter === 'out-of-stock' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full"></div>
                  )}
                </button>
              </div>

              {/* Sort Dropdown & View Mode Switcher */}
              <div className="flex items-center gap-3 pb-2 sm:pb-3 flex-shrink-0 self-end sm:self-auto">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                    Sort by:
                  </span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:border-indigo-400 cursor-pointer shadow-xs"
                    >
                      <option value="recent">Recently Added</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none stroke-[2.2]"
                    />
                  </div>
                </div>

                {/* View Toggle Icons (Grid / List) */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-blue-50 border-blue-200 text-[#2563EB]'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    aria-label="Grid view"
                    title="Grid view"
                  >
                    <LayoutGrid size={15} className="stroke-[2.2]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${
                      viewMode === 'list'
                        ? 'bg-blue-50 border-blue-200 text-[#2563EB]'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    aria-label="List view"
                    title="List view"
                  >
                    <List size={16} className="stroke-[2.2]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Wishlist Items List (Empty / List / Grid) */}
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-400 flex items-center justify-center mb-4">
                  <Heart size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-800">No items found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  You don't have any items in this wishlist category. Explore our toy shop to save your favorites!
                </p>
                <Link
                  to="/shop"
                  className="mt-5 bg-[#F96515] hover:bg-[#EA580C] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors"
                >
                  Explore Toys
                </Link>
              </div>
            ) : viewMode === 'list' ? (
              /* ================= MOBILE HORIZONTAL LIST CARD VIEW ================= */
              <div className="space-y-3.5">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-100/90 shadow-sm flex items-center gap-3.5 relative"
                  >
                    {/* Square Image Box */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#F8FAFC] border border-slate-100 p-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/lamborghini.jpg';
                        }}
                      />
                    </div>

                    {/* Middle Details Column */}
                    <div className="flex-1 min-w-0 pr-8">
                      {/* Title */}
                      <h4 className="text-sm font-black text-[#0B1B3D] tracking-tight leading-snug line-clamp-2">
                        {item.name}
                      </h4>

                      {/* Rating & Review Count */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-black text-[#0B1B3D]">
                          {item.rating}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          ({item.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="text-base font-black text-[#0B1B3D] tracking-tight mt-1">
                        ₹{item.price.toLocaleString()}
                      </div>

                      {/* Stock Pill Badge */}
                      <div className="mt-1">
                        {item.inStock ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#10B981] border border-emerald-100">
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF1F2] text-[#E11D48] border border-rose-100">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Top Right Heart Icon */}
                    <button
                      onClick={() => handleToggleHeart(item.id)}
                      className="absolute top-3.5 right-3.5 p-1 text-rose-500 hover:scale-110 transition-transform"
                      title={item.inStock ? "Remove from wishlist" : "Wishlist item"}
                    >
                      {item.inStock ? (
                        <Heart size={20} className="fill-rose-500 text-rose-500" />
                      ) : (
                        <Heart size={20} className="text-[#2563EB] stroke-[2]" />
                      )}
                    </button>

                    {/* Bottom Right Action Button: Add to Cart OR Notify Me */}
                    <div className="absolute bottom-3.5 right-3.5">
                      {item.inStock ? (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="h-9 px-3.5 sm:px-4 bg-[#F96515] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
                        >
                          {addedItems[item.id] ? (
                            <>
                              <Check size={14} className="stroke-[3]" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={13} className="stroke-[2.5]" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleNotifyMe(item.id)}
                          className="h-9 px-3.5 sm:px-4 bg-white hover:bg-blue-50/50 text-[#2563EB] border border-[#2563EB] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
                        >
                          {notifiedItems[item.id] ? (
                            <>
                              <Check size={14} className="stroke-[3]" />
                              <span>Notified</span>
                            </>
                          ) : (
                            <>
                              <Bell size={13} className="stroke-[2.5]" />
                              <span>Notify Me</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* ================= GRID VIEW (Matching Reference Mockup Exactly) ================= */
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative"
                  >
                    <div>
                      {/* Product Image Area */}
                      <div className="relative aspect-square w-full rounded-2xl bg-[#F8FAFC] p-3 flex items-center justify-center overflow-hidden mb-3">
                        {/* Top-Right Heart Icon matching reference mockup */}
                        <button
                          onClick={() => handleToggleHeart(item.id)}
                          className="absolute top-2.5 right-2.5 z-10 p-1 text-rose-500 hover:scale-110 transition-transform"
                          aria-label="Wishlist Heart"
                        >
                          {item.inStock ? (
                            <Heart size={20} className="fill-rose-500 text-rose-500" />
                          ) : (
                            <Heart size={20} className="text-[#2563EB] stroke-[2]" />
                          )}
                        </button>

                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/product-lamborghini.jpg';
                          }}
                        />
                      </div>

                      {/* Title */}
                      <h4 className="text-xs sm:text-sm font-black text-[#0B1B3D] line-clamp-2 leading-snug tracking-tight mb-1.5 h-9 sm:h-10">
                        {item.name}
                      </h4>

                      {/* Ratings */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span className="text-[11px] sm:text-xs font-black text-slate-700">
                          {item.rating}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({item.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="text-sm sm:text-base font-black text-[#0B1B3D] tracking-tight mb-2">
                        ₹{item.price.toLocaleString()}
                      </div>

                      {/* Stock Badge */}
                      <div className="mb-3.5">
                        {item.inStock ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#10B981] border border-emerald-100">
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF1F2] text-[#E11D48] border border-rose-100">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {item.inStock ? (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full h-10 sm:h-11 bg-[#F96515] hover:bg-[#EA580C] text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98"
                        >
                          {addedItems[item.id] ? (
                            <>
                              <Check size={16} className="stroke-[3]" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={15} className="stroke-[2.5]" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleNotifyMe(item.id)}
                          className="w-full h-10 sm:h-11 bg-white hover:bg-blue-50/50 text-[#2563EB] border border-[#2563EB] font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98"
                        >
                          {notifiedItems[item.id] ? (
                            <>
                              <Check size={16} className="stroke-[3]" />
                              <span>Notified!</span>
                            </>
                          ) : (
                            <>
                              <Bell size={15} className="stroke-[2.2]" />
                              <span>Notify Me</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
