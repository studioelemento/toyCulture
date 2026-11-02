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
  Briefcase,
  Home as HomeIcon,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MyAddresses() {
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

  // Address cards matching reference image
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      type: 'Home',
      icon: HomeIcon,
      isDefault: true,
      name: 'Anand R V',
      line1: 'TC 12/345, Main Road',
      line2: 'Kumarapuram',
      cityState: 'Thiruvananthapuram, Kerala 695001',
      pincode: '695001',
      mobile: '+91 98765 43210',
      color: 'blue'
    },
    {
      id: 'addr-2',
      type: 'Office',
      icon: Briefcase,
      isDefault: false,
      name: 'Anand R V',
      line1: '2nd Floor, Technopark Phase 1',
      line2: 'Kazhakkoottam',
      cityState: 'Thiruvananthapuram, Kerala 695581',
      pincode: '695581',
      mobile: '+91 98765 43210',
      color: 'slate'
    },
    {
      id: 'addr-3',
      type: 'Other',
      icon: MapPin,
      isDefault: false,
      name: 'Anand R V',
      line1: 'Door No. 18/220, Beach Road',
      line2: 'Kovalam',
      cityState: 'Thiruvananthapuram, Kerala 695527',
      pincode: '695527',
      mobile: '+91 98765 43210',
      color: 'amber'
    }
  ]);

  // Form State
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressType, setAddressType] = useState('Home');
  const [fullName, setFullName] = useState(displayName);
  const [mobileNumber, setMobileNumber] = useState('+91 98765 43210');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter((a) => a.id !== id));
    }
  };

  const handleOpenAdd = () => {
    setEditingAddressId(null);
    setAddressType('Home');
    setFullName(displayName);
    setMobileNumber('+91 98765 43210');
    setAddressLine1('');
    setAddressLine2('');
    setPincode('');
    setCity('');
    setState('');
    setIsDefault(false);
    setShowMobileModal(true);

    const el = document.getElementById('add-new-address');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenEdit = (addr) => {
    setEditingAddressId(addr.id);
    setAddressType(addr.type);
    setFullName(addr.name);
    setMobileNumber(addr.mobile);
    setAddressLine1(addr.line1);
    setAddressLine2(addr.line2);
    setPincode(addr.pincode);
    setIsDefault(addr.isDefault);
    setShowMobileModal(true);

    const el = document.getElementById('add-new-address');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressLine1 || !city || !pincode) {
      alert('Please fill out the required address fields.');
      return;
    }

    if (editingAddressId) {
      setAddresses(
        addresses.map((a) => {
          if (a.id === editingAddressId) {
            return {
              ...a,
              type: addressType,
              icon: addressType === 'Home' ? HomeIcon : addressType === 'Office' ? Briefcase : MapPin,
              name: fullName || displayName,
              line1: addressLine1,
              line2: addressLine2,
              cityState: `${city}, ${state || 'Kerala'} ${pincode}`,
              pincode: pincode,
              mobile: mobileNumber,
            };
          }
          return isDefault ? { ...a, isDefault: false } : a;
        })
      );
    } else {
      const newAddr = {
        id: `addr-${Date.now()}`,
        type: addressType,
        icon: addressType === 'Home' ? HomeIcon : addressType === 'Office' ? Briefcase : MapPin,
        isDefault: isDefault || addresses.length === 0,
        name: fullName || displayName,
        line1: addressLine1,
        line2: addressLine2,
        cityState: `${city}, ${state || 'Kerala'} ${pincode}`,
        pincode: pincode,
        mobile: mobileNumber,
        color: addressType === 'Home' ? 'blue' : addressType === 'Office' ? 'slate' : 'amber'
      };

      if (newAddr.isDefault) {
        setAddresses([...addresses.map((a) => ({ ...a, isDefault: false })), newAddr]);
      } else {
        setAddresses([...addresses, newAddr]);
      }
    }

    // Reset form
    setAddressLine1('');
    setAddressLine2('');
    setPincode('');
    setCity('');
    setState('');
    setIsDefault(false);
    setShowMobileModal(false);
    setEditingAddressId(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-3 sm:py-6 px-3 sm:px-6 md:px-8 font-sans">
      <div className="max-w-[1340px] mx-auto">

        {/* ================= MOBILE HEADER TOP BAR (matching mobile screenshot) ================= */}
        <div className="flex lg:hidden items-center justify-between pb-4 pt-1 px-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/account')}
              className="p-1 -ml-1 text-[#0B1B3D] hover:text-[#4F46E5] transition-colors"
              aria-label="Back to account"
            >
              <ChevronLeft size={26} className="stroke-[2.5]" />
            </button>
            <h1 className="text-xl font-black text-[#0B1B3D] tracking-tight">
              My Addresses
            </h1>
          </div>

          {/* Orange + Add Button */}
          <button
            onClick={handleOpenAdd}
            className="bg-[#F96515] hover:bg-[#EA580C] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
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
                    const isActive = item.id === 'addresses';
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
                <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                  <Link to="/account" className="hover:text-slate-700 transition-colors">
                    My Account
                  </Link>
                  <span>&gt;</span>
                  <span className="text-[#0B1B3D] font-bold">My Addresses</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#0B1B3D] tracking-tight mt-1 mb-1.5">
                  My Addresses
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Manage your saved addresses for a faster and smoother checkout experience.
                </p>
              </div>

              {/* Decorative toy box & car banner matching reference image */}
              <div className="absolute top-0 right-0 bottom-0 h-full w-[240px] sm:w-[300px] md:w-[340px] flex items-center justify-end pointer-events-none overflow-hidden rounded-r-3xl">
                <img
                  src="/addresses-banner-toys.png"
                  alt="Addresses Toys Mascot"
                  className="h-full w-auto max-w-full object-contain object-right"
                />
              </div>
            </div>

            {/* Desktop Saved Addresses Title Bar */}
            <div className="hidden lg:flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-[#0B1B3D]">
                Saved Addresses
              </h2>
              <button
                onClick={handleOpenAdd}
                className="bg-[#F96515] hover:bg-[#EA580C] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Address Cards List: Stacked on mobile exactly matching mobile phone screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              {addresses.map((addr) => {
                const Icon = addr.icon;
                const isHome = addr.type === 'Home';
                const isOffice = addr.type === 'Office';
                return (
                  <div
                    key={addr.id}
                    className={`rounded-3xl p-4 sm:p-6 transition-all flex flex-col justify-between ${
                      addr.isDefault
                        ? 'bg-[#F2F7FF] border-2 border-[#93C5FD] shadow-xs'
                        : 'bg-white border border-slate-200/80 shadow-xs hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Card Header (Icon, Type, Default pill, Options menu) */}
                      <div className="flex items-center justify-between pb-2 sm:pb-3">
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isHome
                                ? 'text-blue-600'
                                : isOffice
                                ? 'text-slate-800'
                                : 'text-amber-600'
                            }`}
                          >
                            <Icon size={20} className={isHome ? 'fill-blue-600' : ''} />
                          </div>
                          <span className="font-black text-sm sm:text-base text-[#0B1B3D]">
                            {addr.type}
                          </span>

                          {addr.isDefault && (
                            <span className="ml-2 text-[10px] font-bold bg-[#DBEAFE] text-[#1D4ED8] px-2.5 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefault(addr.id)}
                              className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-full px-2.5 py-0.5 bg-slate-50/70 hover:bg-white transition-colors"
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(addr)}
                            className="text-slate-400 hover:text-slate-700 p-1"
                            title="Options"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Address Details matching mobile phone screenshot */}
                      <div className="text-xs text-slate-600 font-medium space-y-0.5 sm:space-y-1 mt-2 leading-relaxed">
                        <p className="font-bold text-[#0B1B3D] text-sm">{addr.name}</p>
                        <p>{addr.line1}</p>
                        <p>{addr.line2}</p>
                        <p>{addr.cityState}</p>
                        <p className="pt-0.5 text-slate-600">{addr.mobile}</p>
                      </div>
                    </div>

                    {/* Card Footer Actions: Edit / Delete */}
                    <div className="pt-3.5 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-200/60 flex items-center justify-around sm:justify-start sm:gap-8">
                      <button
                        onClick={() => handleOpenEdit(addr)}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <span className="sm:hidden text-slate-200">|</span>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Bottom Add New Address Card (matching the peach/orange outlined card in mobile screenshot) */}
            <div className="block lg:hidden pt-2">
              <button
                onClick={handleOpenAdd}
                className="w-full flex items-center justify-center gap-3.5 py-4 px-4 rounded-3xl bg-[#FFF6EE] border-2 border-[#FED7AA] hover:bg-[#FFEDD5] transition-all text-left shadow-xs"
              >
                <div className="w-10 h-10 rounded-full border-2 border-[#F96515] flex items-center justify-center text-[#F96515] flex-shrink-0">
                  <Plus size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#F96515] leading-snug">
                    Add New Address
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Save a new delivery address
                  </p>
                </div>
              </button>
            </div>

            {/* Add New Address Form Section (Visible on Desktop, or as Modal/Expanded on Mobile) */}
            <div
              id="add-new-address"
              className={`bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 ${
                showMobileModal ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-black text-[#0B1B3D]">
                  {editingAddressId ? 'Edit Address' : 'Add New Address'}
                </h2>
                {showMobileModal && (
                  <button
                    onClick={() => setShowMobileModal(false)}
                    className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-5">
                {/* Address Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Address Type
                  </label>
                  <div className="flex items-center gap-3">
                    {[
                      { id: 'Home', label: 'Home', icon: HomeIcon },
                      { id: 'Office', label: 'Office', icon: Briefcase },
                      { id: 'Other', label: 'Other', icon: MapPin },
                    ].map((type) => {
                      const Icon = type.icon;
                      const isSelected = addressType === type.id;
                      return (
                        <button
                          type="button"
                          key={type.id}
                          onClick={() => setAddressType(type.id)}
                          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-[#EEF2FF] text-[#4F46E5] border-2 border-[#4F46E5] shadow-xs'
                              : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Icon size={15} />
                          <span>{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Full Name & Mobile Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                      required
                    />
                  </div>
                </div>

                {/* Address Lines 1 & 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="House / Flat No., Building Name, Street"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Landmark, Area, etc."
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                {/* Pincode, City, State */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter pincode"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      State
                    </label>
                    <div className="relative">
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-400 pr-8 cursor-pointer"
                      >
                        <option value="">Select state</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Set as default checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="set-default"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="set-default" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                    Set as default address
                  </label>
                </div>

                {/* Cancel & Save Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAddressLine1('');
                      setAddressLine2('');
                      setPincode('');
                      setCity('');
                      setState('');
                      setShowMobileModal(false);
                      setEditingAddressId(null);
                    }}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#F96515] hover:bg-[#EA580C] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    {editingAddressId ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
