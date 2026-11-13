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
  ChevronRight,
  Search,
  Truck,
  CheckCircle2,
  Calendar,
  ChevronDown,
  ArrowRight,
  Home,
  Grid
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/apiClient';
import { accountIdentity, extractList, mapStoreOrder } from '../../lib/accountHelpers';

export default function MyOrder() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Orders');
  const [filterTime, setFilterTime] = useState('Last 6 Months');
  const [currentPage, setCurrentPage] = useState(1);

  const { displayName, displayEmail, initials } = accountIdentity(currentUser);

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

  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const json = await api.get('/api/order?limit=50');
        const rows = extractList(json);
        if (isMounted) setOrdersList(rows.map(mapStoreOrder));
      } catch (err) {
        console.error('Failed to load orders from API:', err);
        if (isMounted) setOrdersList([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => { isMounted = false; };
  }, [currentUser]);

  const totalOrdersCount = ordersList.length;
  const inTransitCount = ordersList.filter((o) => ['processing', 'shipped'].includes(o.statusType)).length;
  const deliveredCount = ordersList.filter((o) => o.statusType === 'delivered').length;
  const cancelledCount = ordersList.filter((o) => o.statusType === 'cancelled').length;

  const stats = [
    {
      title: 'Total Orders',
      count: String(totalOrdersCount),
      icon: Package,
      iconBg: 'bg-[#EFF6FF]',
      iconColor: 'text-[#2563EB]',
      cardBg: 'bg-[#F2F7FF]',
      borderColor: 'border-blue-100/80',
    },
    {
      title: 'In Transit',
      count: String(inTransitCount),
      icon: Truck,
      iconBg: 'bg-[#FFF7ED]',
      iconColor: 'text-[#EA580C]',
      cardBg: 'bg-[#FFF7ED]',
      borderColor: 'border-amber-100/80',
    },
    {
      title: 'Delivered',
      count: String(deliveredCount),
      icon: CheckCircle2,
      iconBg: 'bg-[#ECFDF5]',
      iconColor: 'text-[#059669]',
      cardBg: 'bg-[#ECFDF5]',
      borderColor: 'border-emerald-100/80',
    },
    {
      title: 'Cancelled / Returned',
      count: String(cancelledCount),
      icon: LogOut,
      iconBg: 'bg-[#FAF5FF]',
      iconColor: 'text-[#9333EA]',
      cardBg: 'bg-[#FAF5FF]',
      borderColor: 'border-purple-100/80',
    },
  ];

  // Filtered orders list matching search and dropdown filters
  const orders = ordersList.filter((order) => {
    if (filterStatus === 'In Transit' && !['processing', 'shipped'].includes(order.statusType)) return false;
    if (filterStatus === 'Delivered' && order.statusType !== 'delivered') return false;
    if (filterStatus === 'Cancelled' && order.statusType !== 'cancelled') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = String(order.id || '').toLowerCase().includes(q);
      const matchTitle = String(order.title || '').toLowerCase().includes(q);
      return matchId || matchTitle;
    }
    return true;
  });

  const ordersPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(orders.length / ordersPerPage));
  const paginatedOrders = orders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (statusType, statusText) => {
    switch (statusType) {
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {statusText}
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            {statusText}
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {statusText}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            {statusText}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-3 sm:py-6 px-3 sm:px-6 md:px-8 font-sans pb-20 lg:pb-8">
      <div className="max-w-[1340px] mx-auto">

        {/* ================= MOBILE HEADER TOP BAR (matching mobile screenshot) ================= */}
        <div className="flex lg:hidden flex-col gap-1.5 pb-3 pt-1 px-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/account')}
              className="p-1 -ml-1 text-[#0B1B3D] hover:text-[#4F46E5] transition-colors"
              aria-label="Back to account"
            >
              <ChevronLeft size={26} className="stroke-[2.5]" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1B3D] tracking-tight">
              My Orders
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium pl-8">
            Track your orders, view details and manage your purchases.
          </p>
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
                    const isActive = item.id === 'orders';
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
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  MY ACCOUNT
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-[#0B1B3D] tracking-tight mt-1 mb-1.5">
                  My Orders
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Track your orders, view details and manage your purchases.
                </p>
              </div>

              {/* Decorative toy collection banner matching reference image */}
              <div className="absolute top-0 right-0 bottom-0 h-full w-[240px] sm:w-[300px] md:w-[350px] flex items-center justify-end pointer-events-none overflow-hidden rounded-r-3xl">
                <img
                  src="/orders-banner-toys.png"
                  alt="Orders Toys Mascot"
                  className="h-full w-auto max-w-full object-contain object-right"
                />
              </div>
            </div>

            {/* 4 Stat Cards: 2x2 grid on mobile matching phone screenshot, 4 columns on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`${stat.cardBg} border ${stat.borderColor} rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xs flex flex-col justify-between`}
                  >
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center shadow-xs`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="text-xl sm:text-3xl font-black text-slate-900 leading-none">
                        {stat.count}
                      </div>
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">
                      {stat.title}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filter and Search Bar: Compact & stacked on mobile */}
            <div className="space-y-2.5">
              {/* Search input */}
              <div className="relative w-full">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by order ID or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-xs"
                />
              </div>

              {/* Dropdowns row matching mobile phone screenshot */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* All Orders filter */}
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none shadow-xs"
                  >
                    <option value="All Orders">All Orders</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Date range filter */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">
                    <Calendar size={14} />
                  </div>
                  <select
                    value={filterTime}
                    onChange={(e) => setFilterTime(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200/90 rounded-2xl pl-8 pr-7 py-2.5 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none shadow-xs truncate"
                  >
                    <option value="Last 6 Months">Last 6 Months</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Orders List Container */}
            <div className="space-y-3 sm:space-y-4">
              {loading && (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-sm text-slate-500">
                  Loading your orders…
                </div>
              )}
              {!loading && paginatedOrders.length === 0 && (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center">
                  <p className="font-black text-slate-800">No orders yet</p>
                  <p className="text-xs text-slate-500 mt-1">Orders you place on the store will show up here.</p>
                </div>
              )}
              {paginatedOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/account/orders/${order.rawId || order.id}`)}
                  className="bg-white rounded-3xl p-3.5 sm:p-6 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-6 hover:border-slate-200 transition-colors cursor-pointer group"
                >
                  {/* MOBILE & DESKTOP ROW: Image + Order Info + Chevron */}
                  <div className="flex items-center justify-between gap-3 flex-1">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      {/* Product thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 sm:p-2 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-100 transition-colors">
                        <img
                          src={order.image}
                          alt={order.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Info & Status Badge */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                          #{order.id}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 font-semibold mt-0.5">
                          {order.date}{order.time ? ` at ${order.time}` : ""} <span className="mx-1">•</span> {order.itemsCount}
                        </p>
                        
                        <div className="mt-1.5 flex items-center gap-2">
                          {getStatusBadge(order.statusType, order.status)}
                        </div>

                        {/* Price */}
                        <div className="text-sm sm:text-lg font-black text-slate-900 mt-1">
                          {order.amount}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Chevron Arrow directly matching phone screenshot */}
                    <div className="lg:hidden text-slate-400 group-hover:text-indigo-600 transition-colors pr-1 flex-shrink-0">
                      <ChevronRight size={20} />
                    </div>
                  </div>

                  {/* DESKTOP PROGRESS TIMELINE */}
                  <div className="hidden lg:flex flex-1 w-full max-w-md flex-col justify-center px-4">
                    <div className="relative pt-1 px-2">
                      <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-slate-100 -z-0">
                        <div
                          className={`h-full ${order.lineColor}`}
                          style={{ width: order.progressWidth }}
                        ></div>
                      </div>

                      <div className="relative z-10 flex items-center justify-between">
                        {order.steps.map((st, sIdx) => (
                          <div key={sIdx} className="flex flex-col items-center text-center">
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                                st.isCancelled
                                  ? 'bg-purple-500 text-white'
                                  : st.done
                                  ? `${order.lineColor} text-white`
                                  : 'border-2 border-slate-200 bg-white'
                              }`}
                            >
                              {st.done ? '✓' : ''}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 mt-1.5">
                              {st.label}
                            </span>
                            <span className="text-[8px] text-slate-400 mt-0.5">
                              {st.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* DESKTOP ACTION BUTTONS */}
                  <div className="hidden lg:flex flex-col items-end gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {order.hasTrack && (
                      <button
                        onClick={() => alert(`Tracking Order #${order.id}: Package in transit via BlueDart.`)}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
                      >
                        <Truck size={14} />
                        <span>Track Order</span>
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/account/orders/${order.rawId || order.id}`)}
                      className={`text-xs font-bold text-slate-700 hover:text-[#4F46E5] transition-colors flex items-center gap-1 ${
                        !order.hasTrack ? 'bg-slate-100 hover:bg-slate-200 px-5 py-2 rounded-xl' : 'mt-0.5'
                      }`}
                    >
                      <span>View Details</span>
                      {order.hasTrack && <ArrowRight size={13} />}
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Desktop Pagination */}
            {totalPages > 1 && (
              <div className="hidden sm:flex items-center justify-between pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium">
                  Showing {(currentPage - 1) * ordersPerPage + 1}–{Math.min(currentPage * ordersPerPage, orders.length)} of {orders.length} orders
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Previous page"
                  >
                    &larr;
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-colors ${
                        currentPage === page
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'border border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Next page"
                  >
                    &rarr;
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR (matching mobile screenshot) ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200/80 px-6 py-2.5 flex items-center justify-between shadow-lg">
        <Link
          to="/"
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Home size={20} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link
          to="/shop"
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Grid size={20} />
          <span className="text-[10px] font-bold">Categories</span>
        </Link>
        <Link
          to="/account"
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Heart size={20} />
          <span className="text-[10px] font-bold">Wishlist</span>
        </Link>
        <Link
          to="/account"
          className="flex flex-col items-center gap-1 text-[#2563EB]"
        >
          <User size={20} />
          <span className="text-[10px] font-bold text-[#2563EB]">Account</span>
        </Link>
      </div>

    </div>
  );
}
