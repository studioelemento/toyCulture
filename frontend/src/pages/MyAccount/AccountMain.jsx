import React, { useState } from 'react';
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
  ChevronRight,
  MoreVertical,
  Plus,
  ArrowRight,
  Truck,
  Gift
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AccountMain() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const displayName = currentUser?.name || 'Anand R V';
  const displayEmail = currentUser?.email || 'anandrv@example.com';
  const displayFirstName = displayName.split(' ')[0] || 'Anand';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join('') || 'AR';

  // Desktop navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/account' },
    { id: 'orders', label: 'My Orders', icon: Package, path: '/account/orders' },
    { id: 'addresses', label: 'My Addresses', icon: MapPin, path: '/account/addresses' },
    { id: 'personal', label: 'Personal Details', icon: User, path: '/account/personal' },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart, path: '/account/wishlist' },
    { id: 'coupons', label: 'Coupons & Rewards', icon: Tag, path: '/account/coupons' },
    { id: 'support', label: 'Help & Support', icon: Headphones, path: '/account/support' },
  ];

  // Mobile navigation list items with colored badge icons & subtitle descriptions
  const mobileNavList = [
    {
      id: 'orders',
      title: 'My Orders',
      subtitle: 'Track and manage purchases',
      icon: Package,
      iconBg: 'bg-[#FFF7ED]',
      iconColor: 'text-[#EA580C]',
      action: () => navigate('/account/orders'),
    },
    {
      id: 'addresses',
      title: 'My Addresses',
      subtitle: 'Manage delivery addresses',
      icon: MapPin,
      iconBg: 'bg-[#EFF6FF]',
      iconColor: 'text-[#2563EB]',
      action: () => navigate('/account/addresses'),
    },
    {
      id: 'personal',
      title: 'Personal Details',
      subtitle: 'Name, mobile and email',
      icon: User,
      iconBg: 'bg-[#FAF5FF]',
      iconColor: 'text-[#9333EA]',
      action: () => navigate('/account/personal'),
    },
    {
      id: 'wishlist',
      title: 'My Wishlist',
      subtitle: 'Your saved toys',
      icon: Heart,
      iconBg: 'bg-[#FFF1F2]',
      iconColor: 'text-[#E11D48]',
      action: () => navigate('/account/wishlist'),
    },
    {
      id: 'coupons',
      title: 'Coupons & Rewards',
      subtitle: 'Offers and discounts',
      icon: Tag,
      iconBg: 'bg-[#FEFCE8]',
      iconColor: 'text-[#CA8A04]',
      action: () => navigate('/account/coupons'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      subtitle: 'Get assistance',
      icon: Headphones,
      iconBg: 'bg-[#EFF6FF]',
      iconColor: 'text-[#3B82F6]',
      action: () => navigate('/account/support'),
    },
  ];

  // Stat cards matching reference image
  const stats = [
    {
      title: 'Orders',
      desktopTitle: 'Total Orders',
      count: '12',
      linkText: 'View Orders',
      action: () => navigate('/account/orders'),
      icon: Package,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      cardBg: 'bg-[#F2F7FF]',
      borderColor: 'border-blue-100',
      accentColor: 'text-blue-600',
    },
    {
      title: 'In Transit',
      desktopTitle: 'In Transit',
      count: '1',
      linkText: 'Track Order',
      action: () => navigate('/account/orders'),
      icon: Truck,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      cardBg: 'bg-[#FFF7ED]',
      borderColor: 'border-amber-100',
      accentColor: 'text-amber-600',
    },
    {
      title: 'Wishlist',
      desktopTitle: 'Wishlist Items',
      count: '6',
      linkText: 'View Wishlist',
      action: () => navigate('/account/wishlist'),
      icon: Heart,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-100',
      cardBg: 'bg-[#FFF1F2]',
      borderColor: 'border-rose-100',
      accentColor: 'text-rose-500',
    },
    {
      title: 'Available Offers',
      desktopTitle: 'Available Offers',
      count: '3',
      linkText: 'View Offers',
      action: () => navigate('/account/coupons'),
      icon: Gift,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      cardBg: 'bg-[#ECFDF5]',
      borderColor: 'border-emerald-100',
      accentColor: 'text-emerald-600',
      hideOnMobile: true, // In mobile reference, top row shows exactly the 3 cards (Orders, In Transit, Wishlist)
    },
  ];

  // Category browse items
  const categoriesList = [
    {
      name: 'Die-cast Vehicles',
      count: '120+ Products',
      slug: 'diecast-toys',
      img: '/lamborghini.jpg',
      fallback: 'https://toyculture.in/wp-content/uploads/2025/12/4.png'
    },
    {
      name: 'Building Blocks',
      count: '200+ Products',
      slug: 'construction-toys-for-kids',
      img: '/lego.jpg',
      fallback: 'https://toyculture.in/wp-content/uploads/2025/09/construction_toys_category-1.webp'
    },
    {
      name: 'Soft Toys',
      count: '150+ Products',
      slug: 'role-play-toys',
      img: '/teddy.jpg',
      fallback: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=300&auto=format&fit=crop&q=80'
    },
    {
      name: 'Remote Control',
      count: '90+ Products',
      slug: 'activity-toys-for-kids',
      img: '/nerf.jpg',
      fallback: 'https://toyculture.in/wp-content/uploads/2025/09/Activity-toys-category-images.avif'
    },
    {
      name: 'Puzzles & Games',
      count: '180+ Products',
      slug: 'puzzles',
      img: '/marble.jpg',
      fallback: 'https://toyculture.in/wp-content/uploads/2025/09/Puzzles-Category-images.avif'
    },
    {
      name: 'Arts & Crafts',
      count: '110+ Products',
      slug: 'art-and-craft-for-kids',
      img: '/playdoh.jpg',
      fallback: 'https://toyculture.in/wp-content/uploads/2025/09/do_it_yourself_category-1.webp'
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-4 sm:py-6 px-3 sm:px-6 md:px-8 font-sans">
      <div className="max-w-[1340px] mx-auto">

        {/* MOBILE VIEW TITLE (only on mobile) */}
        <div className="block lg:hidden mb-4 px-1">
          <h1 className="text-2xl font-black text-[#0B1B3D] tracking-tight">
            My Account
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ================= LEFT SIDEBAR (DESKTOP ONLY) ================= */}
          <aside className="w-full lg:w-[280px] flex-shrink-0 hidden lg:flex flex-col lg:sticky lg:top-6 self-start">
            {/* Unified Sidebar Card Matching Reference Mockup */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
              <div className="p-6 pb-2">
                {/* Avatar Bubble */}
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
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.path && item.id !== 'dashboard') {
                            navigate(item.path);
                          } else {
                            setActiveTab(item.id);
                          }
                        }}
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

                  {/* Logout Button */}
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

          {/* ================= MAIN CONTENT ================= */}
          <main className="flex-1 w-full space-y-4 sm:space-y-6">
            
            {/* Header Greeting Banner Matching Reference Mockup */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm flex items-center justify-between min-h-[148px] sm:min-h-[160px]">
              <div className="relative z-10 max-w-[210px] xs:max-w-xs sm:max-w-md py-1">
                <span className="hidden sm:inline-block text-[11px] font-black uppercase tracking-wider text-slate-400">
                  MY ACCOUNT
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-[#0B1B3D] tracking-tight mt-0.5 sm:mt-1 mb-1 sm:mb-1.5 leading-tight">
                  Hello, {displayFirstName}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Thanks for being a part of ToyCulture.
                </p>
                <p className="hidden sm:block text-slate-400 text-xs mt-0.5">
                  Manage your orders, addresses, wishlist and more from your account.
                </p>
              </div>

              {/* Right Side Illustration matching reference image */}
              <div className="absolute top-0 right-0 bottom-0 h-full w-[190px] xs:w-[240px] sm:w-[320px] md:w-[364px] flex items-center justify-end pointer-events-none overflow-hidden rounded-r-3xl">
                <img
                  src="/account-banner-toys.png"
                  alt="Toy Collection Mascot"
                  className="h-full w-auto max-w-full object-contain object-right"
                />
              </div>
            </div>

            {/* Quick Stat Cards: 3 cards on mobile (Orders, In Transit, Wishlist) and 4 on desktop */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    onClick={stat.action}
                    className={`${stat.cardBg} border ${stat.borderColor} rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xs flex flex-col items-center sm:items-start text-center sm:text-left justify-between hover:shadow-md transition-all duration-200 cursor-pointer ${
                      stat.hideOnMobile ? 'hidden md:flex' : 'flex'
                    }`}
                  >
                    <div className="flex flex-col items-center sm:items-start w-full">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center mb-2 sm:mb-3 shadow-xs`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="text-xl sm:text-3xl font-black text-slate-900 leading-none">
                        {stat.count}
                      </div>
                      <div className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-1 truncate w-full">
                        <span className="sm:hidden">{stat.title}</span>
                        <span className="hidden sm:inline">{stat.desktopTitle}</span>
                      </div>
                    </div>

                    <div
                      className={`mt-2 sm:mt-4 hidden sm:inline-flex items-center gap-1.5 text-xs font-black ${stat.accentColor}`}
                    >
                      <span>{stat.linkText}</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Order Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
                <h3 className="font-black text-slate-800 text-sm sm:text-base">
                  Recent Order
                </h3>
                <Link
                  to="/account/orders"
                  className="text-xs font-black text-rose-500 sm:text-[#4F46E5] hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Order Item Details */}
              <div
                onClick={() => navigate('/account/orders')}
                className="mt-4 sm:mt-5 flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 sm:p-2 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-200 transition-colors">
                    <img
                      src="/lamborghini.jpg"
                      alt="Maisto Lamborghini Huracán LP 610-4"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Maisto
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-snug group-hover:text-[#4F46E5] transition-colors">
                      Lamborghini Huracán LP 610-4
                    </h4>
                    <p className="hidden sm:block text-[11px] text-slate-400 font-semibold mt-0.5">
                      Scale 1:18 | Die-cast Metal
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        ₹2,399
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                        Shipped
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Right Chevron Arrow */}
                <div className="sm:hidden text-slate-400">
                  <ChevronRight size={20} />
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden sm:flex sm:flex-col gap-2 w-auto" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => navigate('/account/orders')}
                    className="text-xs font-bold text-[#4F46E5] border border-[#C7D2FE] hover:bg-[#EEF2FF] px-4 py-2 rounded-xl transition-colors text-center"
                  >
                    Track Order
                  </button>
                  <button
                    onClick={() => navigate('/account/orders')}
                    className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors text-center"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Order Progress Stepper matching mobile design */}
              <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-slate-50 sm:border-none">
                <div className="relative flex items-center justify-between">
                  {/* Progress Line */}
                  <div className="absolute top-2 sm:top-2.5 left-4 right-4 h-0.5 bg-slate-200/80 -z-0">
                    <div className="h-full bg-emerald-500 w-[66%]"></div>
                  </div>

                  {/* Step 1 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] sm:text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 mt-1.5 sm:mt-2">
                      Placed
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-slate-400">18 Oct</span>
                  </div>

                  {/* Step 2 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] sm:text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 mt-1.5 sm:mt-2">
                      Shipped
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-slate-400">20 Oct</span>
                  </div>

                  {/* Step 3 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-emerald-500 bg-white"></div>
                    <span className="text-[10px] font-semibold text-slate-700 mt-1.5 sm:mt-2">
                      Out for Delivery
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-slate-400">21 Oct</span>
                  </div>

                  {/* Step 4 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-slate-300 bg-white"></div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-1.5 sm:mt-2">
                      Delivered
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= MOBILE VIEW NAVIGATION MENU LIST ================= */}
            {/* Directly matching the mobile design screenshot with icon badges and subtitles */}
            <div className="block lg:hidden bg-white rounded-3xl p-3 shadow-sm border border-slate-100 divide-y divide-slate-100">
              {mobileNavList.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0 shadow-xs`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* MOBILE LOGOUT BUTTON */}
            <div className="block lg:hidden pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black text-rose-500 bg-rose-50/80 hover:bg-rose-100 transition-colors shadow-xs"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>

            {/* ================= DESKTOP SAVED ADDRESS SECTION ================= */}
            <div className="hidden lg:grid grid-cols-1 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 className="font-black text-slate-800 text-base">
                      Saved Address
                    </h3>
                    <button
                      onClick={() => navigate('/account/addresses')}
                      className="text-xs font-black text-[#4F46E5] hover:underline flex items-center gap-1"
                    >
                      <span>Manage Addresses</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div
                    onClick={() => navigate('/account/addresses')}
                    className="mt-5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center flex-shrink-0">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-800 mr-2 group-hover:text-[#4F46E5] transition-colors">
                            Home
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/account/addresses');
                        }}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-slate-600 space-y-0.5 pl-10 font-medium">
                      <p className="font-bold text-slate-800">{displayName}</p>
                      <p>TC 12/345, Main Road</p>
                      <p>Kumarapuram</p>
                      <p>Thiruvananthapuram, Kerala</p>
                      <p className="font-bold text-slate-700">695001</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/account/addresses')}
                  className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 font-bold text-xs transition-colors"
                >
                  <Plus size={16} />
                  <span>Add New Address</span>
                </button>
              </div>
            </div>

            {/* ================= DESKTOP SHOP BY CATEGORY SECTION ================= */}
            <div className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    Shop by Category
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Explore our wide range of toys
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="text-xs font-black text-[#4F46E5] hover:underline flex items-center gap-1"
                >
                  <span>View All Categories</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 mt-4">
                {categoriesList.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={`/category/${cat.slug}`}
                    className="flex flex-col items-center p-3 rounded-2xl border border-slate-100 bg-[#FAFAFC] hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all duration-200 group text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-center overflow-hidden mb-2.5 p-1 group-hover:scale-105 transition-transform">
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = cat.fallback;
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#4F46E5] transition-colors leading-tight">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {cat.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* ================= DESKTOP PROMO BANNER ================= */}
            <div className="hidden lg:flex relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] p-6 border border-amber-200/60 shadow-sm flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative z-10">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Discover New Arrivals
                </h3>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Exciting toys, creative games and more for endless fun!
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-4">
                <button
                  onClick={() => navigate('/shop')}
                  className="bg-[#F96515] hover:bg-[#EA580C] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="absolute right-4 bottom-0 opacity-80 pointer-events-none hidden md:block">
                <span className="text-6xl drop-shadow-md">✈️</span>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
