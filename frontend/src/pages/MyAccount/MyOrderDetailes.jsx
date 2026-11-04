import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  Truck,
  CreditCard,
  ExternalLink,
  RotateCcw,
  Download,
  Info,
  ShoppingCart,
  Star,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function MyOrderDetailes() {
  const { currentUser, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { id } = useParams();

  const [liveOrder, setLiveOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!id || id === 'TC10482') return;

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const userEmail = currentUser?.email || 'customer@toyculture.com';
        const res = await fetch(`/api/order/${id}`, {
          headers: { 'x-user-email': userEmail }
        });
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          if (isMounted) setLiveOrder(json.data);
        }
      } catch (err) {
        console.error('Failed to load order detail:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrderDetail();
    return () => { isMounted = false; };
  }, [id, currentUser]);

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

  // Fallback ordered items matching reference image
  const fallbackOrderItems = [
    {
      id: 'item-1',
      name: 'Lamborghini Huracán LP 610-4',
      brand: 'Maisto',
      material: 'Die-cast Metal',
      scale: 'Scale 1:18',
      price: 2399,
      quantity: 1,
      image: '/lamborghini.jpg',
      fallback: 'https://toyculture.in/wp-content/uploads/2025/12/4.png'
    },
    {
      id: 'item-2',
      name: 'Building Blocks Set – 100 Pieces',
      brand: 'Toy World',
      material: 'Plastic',
      scale: '',
      price: 599,
      quantity: 1,
      image: '/lego.jpg',
      fallback: 'https://toyculture.in/wp-content/uploads/2025/09/construction_toys_category-1.webp'
    }
  ];

  const orderItems = liveOrder?.items?.length ? liveOrder.items.map((it, idx) => ({
    id: it.id || `item-${idx}`,
    name: it.product_name || 'Toy Product',
    brand: 'ToyCulture',
    material: '',
    scale: '',
    price: Number(it.price || 0),
    quantity: it.quantity || 1,
    image: it.product_image || '/lamborghini.jpg',
    fallback: '/lamborghini.jpg'
  })) : fallbackOrderItems;

  const displayOrderNumber = liveOrder?.order_number || liveOrder?.id || (id || 'TC10482');
  const displayOrderDate = liveOrder?.createdAt ? new Date(liveOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '21 Oct 2026 at 10:24 AM';
  const displayStatus = (liveOrder?.status || 'Delivered').toUpperCase();
  const displayPaymentMethod = liveOrder?.payment_method ? (liveOrder.payment_method === 'COD' ? 'Cash on Delivery (COD)' : liveOrder.payment_method) : 'UPI (Google Pay)';
  const displayShipping = liveOrder?.shipping_address || null;
  const displaySubtotal = liveOrder ? (Number(liveOrder.subtotal) || orderItems.reduce((acc, it) => acc + (it.price * it.quantity), 0)) : 2998;
  const displayDiscount = liveOrder ? Number(liveOrder.coupon_discount || 0) : 300;
  const displayTotal = liveOrder ? Number(liveOrder.total_amount || 0) : 2698;
  const displayDeliveryFee = liveOrder ? (liveOrder.delivery_charge || 0) : 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    }, 1);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-3 sm:py-6 px-3 sm:px-6 md:px-8 font-sans">
      <div className="max-w-[1340px] mx-auto">

        {/* ================= MOBILE HEADER TOP BAR (matching mobile screenshot) ================= */}
        <div className="flex lg:hidden items-center justify-between pb-3 px-1">
          <button
            onClick={() => navigate('/account')}
            className="p-1 -ml-1 text-[#0B1B3D] hover:text-[#4F46E5] transition-colors"
            aria-label="Back to account"
          >
            <ChevronLeft size={28} className="stroke-[2.5]" />
          </button>
          <h1 className="text-xl font-black text-[#0B1B3D] tracking-tight">
            Order Details
          </h1>
          <button
            onClick={() => alert('Need Help? Contact support@toyculture.in | +91 98765 43210')}
            className="p-1 text-[#0B1B3D] hover:text-[#F96515] transition-colors"
            aria-label="Help & Support"
          >
            <Headphones size={22} className="stroke-[2.2]" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ================= LEFT SIDEBAR (Desktop Only) ================= */}
          <aside className="w-full lg:w-[280px] flex-shrink-0 hidden lg:flex flex-col gap-5">
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
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
                          ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon
                        size={18}
                        className={isActive ? 'text-[#4F46E5]' : 'text-slate-400'}
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full mt-4 flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-rose-500 bg-rose-50/70 hover:bg-rose-100/70 transition-all text-left"
                >
                  <LogOut size={18} className="text-rose-500" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>

            {/* Teddy & Toy Stacker Illustration Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#E0E7FF]/60 via-[#EEF2FF] to-[#FAF8F5] border border-blue-100/60 p-5 shadow-sm">
              <div className="absolute top-3 right-4 w-7 h-7 rounded-full bg-amber-300/50 blur-[1px]"></div>
              
              <div className="flex items-end justify-center gap-2 pt-2">
                <div className="w-28 h-32 rounded-2xl overflow-hidden bg-white/70 shadow-sm border border-white p-1.5 flex items-center justify-center">
                  <img
                    src="/teddy.jpg"
                    alt="Cute Teddy Bear"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="w-24 h-28 rounded-2xl overflow-hidden bg-white/70 shadow-sm border border-white p-1.5 flex items-center justify-center">
                  <img
                    src="/stacker.jpg"
                    alt="Baby Stacking Rings"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-center items-center gap-2 mt-4">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT MAIN CONTENT ================= */}
          <main className="flex-1 w-full space-y-4 sm:space-y-5">

            {/* Breadcrumb & Header Title Banner (Desktop) */}
            <div className="hidden lg:flex relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-transparent rounded-full pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                  <Link to="/account" className="hover:text-slate-700 transition-colors">
                    My Orders
                  </Link>
                  <span>&gt;</span>
                  <span className="text-slate-600 font-bold">Order #{displayOrderNumber}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-[#0B1B3D] tracking-tight">
                  Order Details
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Placed on {displayOrderDate}
                </p>
              </div>

              <div className="relative z-10 flex-shrink-0 flex items-center justify-end">
                <div className="w-36 h-24 sm:w-48 sm:h-28 bg-[#FFF5F5] rounded-2xl p-2 border border-red-100/70 shadow-xs flex items-center justify-center overflow-hidden">
                  <img
                    src="/lamborghini.jpg"
                    alt="Maisto Lamborghini Huracán"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Order Status & Progress Tracker Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm space-y-4 sm:space-y-6">
              
              {/* Order Header */}
              <div className="flex items-start justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-xl font-black text-[#0B1B3D]">
                      Order #{displayOrderNumber}
                    </h2>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${displayStatus === 'CANCELLED' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${displayStatus === 'CANCELLED' ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
                      {displayStatus}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                    Placed on {displayOrderDate}
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                    {orderItems.length} item${orderItems.length === 1 ? '' : 's'} <span className="mx-1.5">|</span> Paid via {displayPaymentMethod}
                  </p>
                </div>

                {/* Mobile Right Car Preview (matches mobile phone screenshot) */}
                <div className="block lg:hidden flex-shrink-0">
                  <div className="w-24 h-16 bg-[#FFF5F5] rounded-2xl p-1.5 border border-red-100/70 shadow-xs flex items-center justify-center overflow-hidden">
                    <img
                      src="/lamborghini.jpg"
                      alt="Car"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden lg:flex items-center gap-3">
                  <button
                    onClick={() => {
                      orderItems.forEach(item => handleAddToCart(item));
                      navigate('/cart');
                    }}
                    className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-xl transition-colors shadow-xs"
                  >
                    Buy Again
                  </button>
                  <button
                    onClick={() => alert('Support line: support@toyculture.in | +91 98765 43210')}
                    className="text-xs font-bold text-white bg-[#F96515] hover:bg-[#EA580C] px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Headphones size={15} />
                    <span>Need Help?</span>
                  </button>
                </div>
              </div>

              {/* 4-Step Progress Stepper matching mobile phone design */}
              <div className="pt-2 px-1 sm:px-6">
                <div className="relative flex items-center justify-between">
                  {/* Progress Line */}
                  <div className="absolute top-2.5 sm:top-3 left-4 sm:left-6 right-4 sm:right-6 h-0.5 bg-emerald-500 -z-0"></div>

                  {/* Step 1: Placed */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] sm:text-xs font-bold shadow-xs">
                      ✓
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-800 mt-1.5 sm:mt-2">
                      Placed
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5">
                      <span className="sm:hidden">21 Oct</span>
                      <span className="hidden sm:inline">21 Oct 2026, 10:24 AM</span>
                    </span>
                  </div>

                  {/* Step 2: Shipped */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] sm:text-xs font-bold shadow-xs">
                      ✓
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-800 mt-1.5 sm:mt-2">
                      Shipped
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5">
                      <span className="sm:hidden">22 Oct</span>
                      <span className="hidden sm:inline">22 Oct 2026, 04:10 PM</span>
                    </span>
                  </div>

                  {/* Step 3: Out for Delivery */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] sm:text-xs font-bold shadow-xs">
                      ✓
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-800 mt-1.5 sm:mt-2">
                      Out for Delivery
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5">
                      <span className="sm:hidden">23 Oct</span>
                      <span className="hidden sm:inline">23 Oct 2026, 09:15 AM</span>
                    </span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] sm:text-xs font-bold shadow-xs">
                      ✓
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-800 mt-1.5 sm:mt-2">
                      Delivered
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5">
                      <span className="sm:hidden">24 Oct</span>
                      <span className="hidden sm:inline">24 Oct 2026, 05:22 PM</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Notification Card */}
              <div className="rounded-2xl bg-[#F0FDF4] border border-emerald-100 p-3 sm:p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Package size={22} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-800">
                    Delivered
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    24 Oct 2026 at 05:22 PM
                  </p>
                </div>
              </div>

              {/* Track Again Button (Full width on mobile, matching mobile screenshot) */}
              <button
                onClick={() => alert('Tracking ID: TC-DEL-992384. Delivered successfully via BlueDart.')}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#2563EB] bg-white border border-[#BFDBFE] hover:bg-blue-50 py-3 rounded-2xl transition-colors shadow-xs"
              >
                <span>Track Again</span>
                <ExternalLink size={14} />
              </button>

            </div>

            {/* Items in this order */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm space-y-3 sm:space-y-4">
              <h3 className="font-black text-[#0B1B3D] text-sm sm:text-base">
                Items in this order
              </h3>

              <div className="divide-y divide-slate-100">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 first:pt-1 last:pb-1 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Item image */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = item.fallback;
                            }}
                          />
                        </div>

                        {/* Title and details */}
                        <div className="flex-1">
                          <h4 className="text-xs sm:text-sm font-black text-[#0B1B3D] leading-snug">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                            {item.brand} <span className="mx-1">|</span> {item.material || item.scale} {item.material && item.scale && <> <span className="mx-1">|</span> {item.scale}</>}
                          </p>
                          <div className="text-sm sm:text-base font-black text-slate-900 mt-1.5">
                            ₹{item.price.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Quantity */}
                      <span className="text-xs font-bold text-slate-500 flex-shrink-0">
                        Qty: {item.quantity}
                      </span>
                    </div>

                    {/* Action buttons (Review & Add to Cart) matching mobile phone screenshot */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <button
                        onClick={() => alert(`Review dialog for ${item.name}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-[#0B1B3D] bg-white hover:bg-slate-50 border border-slate-200 py-2.5 rounded-xl transition-colors shadow-xs"
                      >
                        <Star size={14} className="text-amber-500" />
                        <span>Review</span>
                      </button>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[#F96515] hover:bg-[#EA580C] py-2.5 rounded-xl transition-colors shadow-xs"
                      >
                        <ShoppingCart size={14} />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Details Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Truck size={20} className="text-[#0B1B3D]" />
                  <h4 className="font-black text-[#0B1B3D] text-sm sm:text-base">
                    Shipping Details
                  </h4>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Delivered
                </span>
              </div>

              <div className="mt-3 text-xs text-slate-600 space-y-1 font-medium leading-relaxed">
                <p className="font-bold text-[#0B1B3D] text-sm">{displayName}</p>
                <p>TC 12/345, Main Road</p>
                <p>Kumarapuram, Thiruvananthapuram</p>
                <p>Kerala, 695001</p>
                <p className="text-slate-700 font-semibold pt-0.5">+91 98765 43210</p>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CreditCard size={20} className="text-[#0B1B3D]" />
                  <h4 className="font-black text-[#0B1B3D] text-sm sm:text-base">
                    Payment Details
                  </h4>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Paid
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Payment Method</span>
                  <span className="font-bold text-slate-800">UPI (Google Pay)</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Transaction ID</span>
                  <span className="font-mono text-slate-700 font-semibold">pay_Lz9f8s7a2H3K1</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Payment Date</span>
                  <span className="font-medium text-slate-700">21 Oct 2026, 10:24 AM</span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">Total Charged</span>
                <span className="text-base font-black text-slate-900">₹{Number(displaySubtotal).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <FileText size={20} className="text-[#0B1B3D]" />
                <h4 className="font-black text-[#0B1B3D] text-sm sm:text-base">
                  Order Summary
                </h4>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Subtotal (2 items)</span>
                  <span className="font-bold text-slate-800">₹{Number(displaySubtotal).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Shipping Charges</span>
                  <span className="font-bold text-emerald-600">₹0</span>
                </div>
                <div className="flex justify-between items-center text-emerald-600">
                  <span>Discount (WELCOME10)</span>
                  <span className="font-bold">- ₹{Number(displayDiscount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-black text-slate-900">Total Paid</span>
                <span className="text-lg font-black text-slate-900">₹{Number(displayTotal).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Need Help? Quick Action Links */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Headphones size={20} className="text-[#0B1B3D]" />
                  <div>
                    <h4 className="font-black text-[#0B1B3D] text-sm leading-tight">
                      Need Help?
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Have questions about this order?
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Connecting to ToyCulture Support...')}
                  className="text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-colors"
                >
                  Contact Support
                </button>
              </div>

              <div className="mt-3 space-y-2.5 text-xs font-semibold text-slate-600">
                <button
                  onClick={() => alert('Return request submitted.')}
                  className="w-full flex items-center gap-2 hover:text-[#4F46E5] transition-colors text-left"
                >
                  <RotateCcw size={15} className="text-slate-400" />
                  <span>Return or Replace Items</span>
                </button>
                <button
                  onClick={() => alert('Invoice TC10482 downloaded.')}
                  className="w-full flex items-center gap-2 hover:text-[#4F46E5] transition-colors text-left"
                >
                  <Download size={15} className="text-slate-400" />
                  <span>Download Invoice</span>
                </button>
                <button
                  onClick={() => alert('Return policy: 7 days replacement for damaged or missing pieces.')}
                  className="w-full flex items-center gap-2 hover:text-[#4F46E5] transition-colors text-left"
                >
                  <Info size={15} className="text-slate-400" />
                  <span>View Return Policy</span>
                </button>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
