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
  ChevronDown,
  Search,
  Send,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function HelpSupport() {
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

  // Form State
  const [subject, setSubject] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // FAQ Search & Expansion State
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // FAQ List matching the exact 10 items in the reference image
  const faqList = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'Browse our categories, add desired toys to your cart, proceed to checkout, provide your shipping details, and complete your payment securely.'
    },
    {
      id: 2,
      question: 'How can I track my order?',
      answer: 'Go to My Orders in your account to see real-time updates and delivery tracking for all your active shipments.'
    },
    {
      id: 3,
      question: 'Can I cancel or modify my order?',
      answer: 'You can cancel or modify orders within 2 hours of placing them from the My Orders page, or by reaching out immediately to our support team.'
    },
    {
      id: 4,
      question: 'How do I update my shipping address?',
      answer: 'Navigate to "My Addresses" in your account dashboard to add, edit, or set default delivery addresses anytime.'
    },
    {
      id: 5,
      question: 'How do I change my account details?',
      answer: 'Visit the "Personal Details" section under My Account to edit your name, mobile number, or update password and security settings.'
    },
    {
      id: 6,
      question: 'How do I use a coupon code?',
      answer: 'Enter your coupon code during checkout in the "Apply Coupon" box to avail instant discounts on eligible toy orders.'
    },
    {
      id: 7,
      question: 'Where can I find my order invoice?',
      answer: 'Open the specific order under "My Orders", click "View Details", and select "Download Invoice" to get a PDF copy.'
    },
    {
      id: 8,
      question: 'How do I save items in my wishlist?',
      answer: 'Click the heart icon on any toy product card or product details page to save it directly to "My Wishlist".'
    },
    {
      id: 9,
      question: 'What payment methods are available?',
      answer: 'We accept UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards (Visa, MasterCard, RuPay), Net Banking, and Cash on Delivery.'
    },
    {
      id: 10,
      question: 'How can I contact customer support?',
      answer: 'You can fill out the form above, email us at support@toyculture.in, or chat with us on WhatsApp at +91 98765 43210 (Mon-Sat, 10 AM - 6 PM).'
    }
  ];

  const filteredFaqs = faqList.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject) {
      alert('Please select a subject');
      return;
    }
    if (!message.trim()) {
      alert('Please enter your message');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setSubject('');
      setOrderNumber('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }, 600);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-3 sm:py-6 px-3 sm:px-6 md:px-8 font-sans">
      <div className="max-w-[1340px] mx-auto">

        {/* ================= MOBILE TOP BAR (Only visible on small screens) ================= */}
        <div className="flex lg:hidden items-center gap-2.5 pb-3 px-1">
          <button
            onClick={() => navigate('/account')}
            className="p-1 -ml-1 text-[#0B1B3D] hover:text-[#4F46E5] transition-colors"
            aria-label="Back to account"
          >
            <ChevronLeft size={28} className="stroke-[2.8]" />
          </button>
          <h1 className="text-xl font-black text-[#0B1B3D] tracking-tight">
            Help & Support
          </h1>
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
                    const isActive = item.id === 'support';
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

          {/* ================= MAIN CONTENT ================= */}
          <main className="flex-1 w-full space-y-6">

            {/* Top Greeting Header Banner - Exact replica of the reference image */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm flex items-center justify-between gap-4">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-transparent rounded-full pointer-events-none"></div>

              <div className="relative z-10 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                  <Link to="/account" className="hover:text-slate-700 transition-colors">
                    My Account
                  </Link>
                  <span>&gt;</span>
                  <span className="text-slate-600 font-bold">Help & Support</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#0B1B3D] tracking-tight mt-1 mb-1.5">
                  Help & Support
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  We're here to help! If you have any questions or need assistance, feel free to reach out to us.
                </p>
              </div>

              {/* Decorative Kid with Headset & Speech Bubble - Real illustration from reference */}
              <div className="relative z-10 flex-shrink-0 flex items-center justify-end -my-4 -mr-2 sm:-my-6 sm:-mr-4">
                <div className="w-40 sm:w-56 md:w-64 h-28 sm:h-36 overflow-hidden flex items-end justify-end">
                  <img
                    src="/support-mascot.png"
                    alt="Help & Support Mascot"
                    className="max-h-full max-w-full object-contain object-right-bottom drop-shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Main Form & Support Team Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Send us a Message Card (2 columns on desktop) */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-black text-[#0B1B3D] tracking-tight">
                    Send us a Message
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                    Have a question about your orders, account or products?
                    <br />
                    Fill in the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                {submitted && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                    <span>Your message has been sent successfully! Our team will get back to you soon.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Subject <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-400 cursor-pointer shadow-xs"
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="order">Order Tracking & Status</option>
                          <option value="cancel">Cancel or Modify Order</option>
                          <option value="return">Return & Refund Request</option>
                          <option value="payment">Payment & Invoicing Issues</option>
                          <option value="product">Product Quality or Inquiry</option>
                          <option value="other">Other Inquiry</option>
                        </select>
                        <ChevronDown
                          size={15}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Order Number (Optional) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Order Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="Enter order number"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Your Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        rows={5}
                        maxLength={500}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 resize-none shadow-xs"
                        required
                      />
                      <span className="absolute bottom-3 right-3 text-[11px] font-semibold text-slate-400">
                        {message.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Send Message Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#F96515] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-xl shadow-xs transition-colors flex items-center gap-2 active:scale-98"
                    >
                      <Send size={15} className="rotate-45 -mt-0.5" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Our Support Team Card (1 column on desktop) */}
              <div className="bg-[#FFFDF7] rounded-3xl p-6 sm:p-7 border border-amber-100/80 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#0B1B3D] tracking-tight">
                    Our Support Team
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    We usually respond within 24 hours on business days.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Response Time */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Clock size={20} className="stroke-[2.3]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-[#0B1B3D]">
                        Response Time
                      </h4>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">
                        Within 24 hours
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        (Mon - Sat)
                      </p>
                    </div>
                  </div>

                  {/* Email Support */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Mail size={20} className="stroke-[2.3]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-[#0B1B3D]">
                        Email Support
                      </h4>
                      <a
                        href="mailto:support@toyculture.in"
                        className="text-xs font-bold text-[#2563EB] hover:underline mt-0.5 block"
                      >
                        support@toyculture.in
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp Support */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center flex-shrink-0 shadow-xs">
                      <MessageCircle size={20} className="stroke-[2.3]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-[#0B1B3D]">
                        WhatsApp Support
                      </h4>
                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-slate-800 hover:text-emerald-600 mt-0.5 block"
                      >
                        +91 98765 43210
                      </a>
                      <p className="text-[11px] text-slate-400 font-medium">
                        (Mon - Sat, 10 AM - 6 PM)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Frequently Asked Questions Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-[#0B1B3D] tracking-tight">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Find quick answers to common questions about your account.
                  </p>
                </div>

                {/* Search questions input */}
                <div className="relative w-full sm:w-64">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-xs"
                  />
                </div>
              </div>

              {/* 2-Column Grid of 10 FAQ items matching the layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border border-slate-100 hover:border-slate-200 rounded-2xl bg-[#FAFBFD] transition-all overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                        className="w-full p-4 flex items-center justify-between text-left gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs font-black flex items-center justify-center flex-shrink-0">
                            {faq.id}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#0B1B3D]">
                            {faq.question}
                          </span>
                        </div>
                        <ChevronRight
                          size={16}
                          className={`text-slate-400 flex-shrink-0 transition-transform ${
                            isExpanded ? 'rotate-90 text-[#4F46E5]' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                          <p className="pl-9">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching questions found for "{searchQuery}".
                </div>
              )}
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
