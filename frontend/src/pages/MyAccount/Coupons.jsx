import React, { useEffect } from 'react';
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
  ArrowRight,
  Info,
  ShoppingCart,
  Percent,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Coupons() {
  const { currentUser, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-3 sm:py-6 px-3 sm:px-6 md:px-8 font-sans pb-20 lg:pb-8">
      <div className="max-w-[1340px] mx-auto">

        {/* ================= MOBILE HEADER TOP BAR ================= */}
        <div className="flex lg:hidden items-center justify-between pt-1 pb-4 px-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/account')}
              className="p-1 -ml-1 text-[#0B1B3D] hover:text-[#4F46E5] transition-colors"
              aria-label="Back to account"
            >
              <ChevronLeft size={28} className="stroke-[2.8]" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1B3D] tracking-tight">
              Coupons & Offers
            </h1>
          </div>

          {/* Boy Mascot Illustration on Mobile */}
          <div className="h-14 w-28 flex items-center justify-end pointer-events-none overflow-hidden -my-1">
            <img
              src="/coupons-banner-boy.png"
              alt="Coupons Mascot"
              className="h-full w-auto max-w-full object-contain object-right"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ================= LEFT SIDEBAR (Desktop Only) ================= */}
          <aside className="w-full lg:w-[280px] flex-shrink-0 hidden lg:flex flex-col lg:sticky lg:top-6 self-start">
            {/* Unified Sidebar Card Matching Reference Mockup */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
              <div className="p-6 pb-2">
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
                    const isActive = item.id === 'coupons';
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

            {/* Header Greeting Banner Matching Reference Mockup (Desktop Only) */}
            <div className="hidden lg:flex relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm items-center justify-between min-h-[148px]">
              <div className="relative z-10 max-w-xl py-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                  <Link to="/account" className="hover:text-slate-700 transition-colors">
                    My Account
                  </Link>
                  <span>&gt;</span>
                  <span className="text-[#0B1B3D] font-bold">Coupons & Offers</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#0B1B3D] tracking-tight mt-1 mb-1.5">
                  Coupons & Offers
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Exclusive coupons for you. Use them at checkout to save more on your favourite toys.
                </p>
              </div>

              {/* Decorative Boy With Gift Box Mascot */}
              <div className="absolute top-0 right-0 bottom-0 h-full w-[240px] sm:w-[300px] md:w-[340px] flex items-center justify-end pointer-events-none overflow-hidden rounded-r-3xl">
                <img
                  src="/coupons-banner-boy.png"
                  alt="Coupons Mascot"
                  className="h-full w-auto max-w-full object-contain object-right"
                />
              </div>
            </div>

            {/* Main Empty State Card */}
            <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-56 h-48 sm:w-64 sm:h-56 flex items-center justify-center overflow-hidden mb-2">
                <img
                  src="/coupon-empty-box.png"
                  alt="No Coupons Available"
                  className="max-h-full max-w-full object-contain drop-shadow-sm"
                />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#0B1B3D] tracking-tight mt-1">
                No Coupons Available Right Now
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mt-2 leading-relaxed">
                You don't have any exclusive coupons at the moment.
                <br />
                Keep shopping to get special offers on your favourite toys!
              </p>

              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="mt-6 bg-[#F96515] hover:bg-[#EA580C] text-white font-black text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-2 active:scale-98"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Bottom Info Banner: How to get exclusive coupons? */}
            <div className="bg-[#F0F7FF] border border-[#BFDBFE]/60 rounded-3xl p-5 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0">
                  <Info size={13} className="stroke-[2.8]" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[#0B1B3D]">
                  How to get exclusive coupons?
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1. Shop More */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-100/60 shadow-xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
                    <ShoppingCart size={18} className="stroke-[2.3]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-[#0B1B3D]">
                      Shop More
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Get special coupons based on your purchases.
                    </p>
                  </div>
                </div>

                {/* 2. Exclusive Offers */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-100/60 shadow-xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
                    <Percent size={18} className="stroke-[2.3]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-[#0B1B3D]">
                      Exclusive Offers
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      We send personalised offers for our valued customers.
                    </p>
                  </div>
                </div>

                {/* 3. Stay Updated */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-100/60 shadow-xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
                    <Bell size={18} className="stroke-[2.3]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-[#0B1B3D]">
                      Stay Updated
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Check this page regularly for new exciting offers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

