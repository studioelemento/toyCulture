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
  Camera,
  CheckCircle2,
  Phone,
  Mail,
  Shield,
  Lock,
  Monitor,
  Edit2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PersonalDetails() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.name || 'Anand R V');
  const [email, setEmail] = useState(currentUser?.email || 'anandrv@example.com');
  const [mobile, setMobile] = useState('+91 98765 43210');

  const [newMobile, setNewMobile] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const displayName = fullName || 'Anand R V';
  const displayEmail = email || 'anandrv@example.com';
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

  const handleSaveDetails = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert('Personal details updated successfully!');
  };

  const handleSendMobileOtp = (e) => {
    e.preventDefault();
    if (!newMobile) {
      alert('Please enter a valid mobile number');
      return;
    }
    alert(`OTP sent to +91 ${newMobile}`);
    setNewMobile('');
  };

  const handleSendEmailVerification = (e) => {
    e.preventDefault();
    if (!newEmail) {
      alert('Please enter a valid email address');
      return;
    }
    alert(`Verification link sent to ${newEmail}`);
    setNewEmail('');
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-3 sm:py-6 px-3 sm:px-6 md:px-8 font-sans">
      <div className="max-w-[1340px] mx-auto">

        {/* ================= MOBILE HEADER TOP BAR ================= */}
        {/* Matching reference mobile image: Back chevron with bold "Personal Details" title and cartoon boy holding car on right */}
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
              Personal Details
            </h1>
          </div>

          {/* Cartoon boy with red car mascot illustration */}
          <div className="h-14 w-28 flex items-center justify-end pointer-events-none overflow-hidden -my-1">
            <img
              src="/personal-banner-boy.png"
              alt="Personal Details Boy Mascot"
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
                    const isActive = item.id === 'personal';
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
                  <span className="text-[#0B1B3D] font-bold">Personal Details</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#0B1B3D] tracking-tight mt-1 mb-1.5">
                  Personal Details
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Manage your personal information and keep your account secure.
                </p>
              </div>

              {/* Decorative Happy Kid With Toy Car matching reference image */}
              <div className="absolute top-0 right-0 bottom-0 h-full w-[240px] sm:w-[300px] md:w-[340px] flex items-center justify-end pointer-events-none overflow-hidden rounded-r-3xl">
                <img
                  src="/personal-banner-boy.png"
                  alt="Personal Details Boy Mascot"
                  className="h-full w-auto max-w-full object-contain object-right"
                />
              </div>
            </div>

            {/* 1. Profile Information Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-100/90 shadow-sm space-y-5">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#6366F1] flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
                    <User size={20} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#0B1B3D] tracking-tight">
                      Profile Information
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Your basic account details.
                    </p>
                  </div>
                </div>

                {/* Edit Button matching mobile design */}
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F96515] hover:text-[#EA580C] px-2 py-1 transition-colors"
                >
                  <Edit2 size={15} className="stroke-[2.5]" />
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              {/* Avatar with Camera badge */}
              <div className="flex justify-center pt-1 pb-1">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#EDE9FE] text-[#6366F1] flex items-center justify-center text-2xl sm:text-3xl font-black shadow-inner">
                    {initials}
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Change profile photo')}
                    className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center shadow-md hover:bg-slate-700 transition-colors border-2 border-white"
                    title="Change Photo"
                  >
                    <Camera size={14} className="stroke-[2.2]" />
                  </button>
                </div>
              </div>

              {/* Form Fields: In mobile read-only, rendered cleanly matching mockup */}
              <form onSubmit={handleSaveDetails} className="space-y-4 pt-1">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-500">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-[#0B1B3D] bg-white border-2 border-indigo-400 focus:outline-none"
                    />
                  ) : (
                    <p className="text-base font-black text-[#0B1B3D] tracking-tight">
                      {displayName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-500">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-[#0B1B3D] bg-white border-2 border-indigo-400 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm sm:text-base font-semibold text-slate-600 truncate">
                        {displayEmail}
                      </p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#10B981] border border-emerald-100 flex-shrink-0">
                        <CheckCircle2 size={14} className="stroke-[2.5]" />
                        <span>Verified</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1 pt-0.5">
                  <label className="block text-xs font-semibold text-slate-500">
                    Mobile Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-[#0B1B3D] bg-white border-2 border-indigo-400 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm sm:text-base font-bold text-[#0B1B3D] tracking-tight">
                        {mobile}
                      </p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#10B981] border border-emerald-100 flex-shrink-0">
                        <CheckCircle2 size={14} className="stroke-[2.5]" />
                        <span>Verified</span>
                      </span>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* 2. Change Mobile Number Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100/90 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#3B82F6] text-white flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
                  <Phone size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0B1B3D] tracking-tight">
                    Change Mobile Number
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                    You will receive an OTP on your new mobile number.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendMobileOtp} className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  {/* +91 box */}
                  <div className="w-16 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-sm font-black text-[#0B1B3D] flex-shrink-0 shadow-xs">
                    +91
                  </div>
                  {/* Mobile input */}
                  <div className="flex-1">
                    <input
                      type="tel"
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value)}
                      placeholder="Enter new mobile number"
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 shadow-xs"
                    />
                  </div>
                </div>

                {/* Send OTP Orange Button */}
                <button
                  type="submit"
                  className="w-full h-12 bg-[#F96515] hover:bg-[#EA580C] text-white font-black text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center"
                >
                  Send OTP
                </button>
              </form>
            </div>

            {/* 3. Change Email Address Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100/90 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
                  <Mail size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0B1B3D] tracking-tight">
                    Change Email Address
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                    You will receive a verification link on your new email address.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendEmailVerification} className="space-y-3 pt-1">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 shadow-xs"
                />

                {/* Send Verification Link Button */}
                <button
                  type="submit"
                  className="w-full h-12 bg-[#F96515] hover:bg-[#EA580C] text-white font-black text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center"
                >
                  Send Verification Link
                </button>
              </form>
            </div>

            {/* 4. Account Security Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100/90 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
                  <Shield size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0B1B3D] tracking-tight">
                    Account Security
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                    Keep your account safe with these options.
                  </p>
                </div>
              </div>

              {/* In Mobile view: list rows with chevron right matching the reference screenshot */}
              <div className="divide-y divide-slate-100 pt-1">
                {/* Change Password row */}
                <button
                  type="button"
                  onClick={() => alert('Change password dialog')}
                  className="w-full py-4 flex items-center justify-between group hover:bg-slate-50/60 rounded-xl px-2 transition-colors text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="text-[#0B1B3D] group-hover:text-indigo-600 transition-colors">
                      <Lock size={20} className="stroke-[2.3]" />
                    </div>
                    <span className="text-sm font-bold text-[#0B1B3D] group-hover:text-indigo-600 transition-colors">
                      Change Password
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </button>

                {/* Login Activity row */}
                <button
                  type="button"
                  onClick={() => alert('Active sessions: Chrome on Windows 11 - Kerala, India')}
                  className="w-full py-4 flex items-center justify-between group hover:bg-slate-50/60 rounded-xl px-2 transition-colors text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="text-[#0B1B3D] group-hover:text-indigo-600 transition-colors">
                      <Monitor size={20} className="stroke-[2.3]" />
                    </div>
                    <span className="text-sm font-bold text-[#0B1B3D] group-hover:text-indigo-600 transition-colors">
                      Login Activity
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
