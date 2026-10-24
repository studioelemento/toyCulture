import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCircle, 
  MapPin, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  Plus,
  CheckCircle2
} from 'lucide-react';

const CartCheckout = () => {
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('upi');

  const addresses = [
    {
      id: 1,
      type: 'Home',
      isDefault: true,
      name: 'Anand R V',
      addressLine1: 'TC 12/345, Main Road',
      addressLine2: 'Kumarapuram',
      city: 'Thiruvananthapuram, Kerala',
      pin: '695001'
    },
    {
      id: 2,
      type: 'Office',
      isDefault: false,
      name: 'Anand R V',
      addressLine1: '2nd Floor, Tech Park, Infopark',
      addressLine2: 'Kakkanad',
      city: 'Kochi, Kerala',
      pin: '682042'
    },
    {
      id: 3,
      type: 'Other',
      isDefault: false,
      name: 'Anand R V',
      addressLine1: 'Plantation House',
      addressLine2: 'Kollam, Kerala',
      city: 'Kollam, Kerala',
      pin: '691001'
    }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F243E] tracking-tight mb-1">Checkout</h1>
          <p className="text-gray-500">Review your details and complete your order</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Checkout Steps */}
          <div className="lg:w-2/3 space-y-6">
            
            {/* 1. Customer Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 relative">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 sm:bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h2 className="text-lg font-bold text-[#0F243E]">Customer Details</h2>
                </div>
                <button className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <UserCircle className="w-4 h-4" />
                  Edit Profile
                </button>
                <button className="sm:hidden text-blue-600 font-bold text-[14px]">Edit</button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 pt-1 sm:pt-2">
                <div className="flex sm:block items-center">
                  <div className="text-[14px] sm:text-xs text-gray-500 sm:text-gray-400 font-medium sm:mb-1 w-[80px] sm:w-auto">Name</div>
                  <div className="font-semibold text-gray-800 sm:text-gray-900 text-[15px] sm:text-base">Anand R V</div>
                </div>
                <div className="flex sm:block items-center">
                  <div className="text-[14px] sm:text-xs text-gray-500 sm:text-gray-400 font-medium sm:mb-1 w-[80px] sm:w-auto">Mobile</div>
                  <div className="font-semibold text-gray-800 sm:text-gray-900 text-[15px] sm:text-base">+91 98765 43210</div>
                </div>
                <div className="flex sm:block items-center">
                  <div className="text-[14px] sm:text-xs text-gray-500 sm:text-gray-400 font-medium sm:mb-1 w-[80px] sm:w-auto">Email</div>
                  <div className="font-semibold text-gray-800 sm:text-gray-900 text-[15px] sm:text-base">anandrv@example.com</div>
                </div>
              </div>
            </div>

            {/* 2. Billing & Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 relative">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 sm:bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h2 className="text-lg font-bold text-[#0F243E]">Delivery Address</h2>
                </div>
                <button className="hidden sm:flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add New Address
                </button>
                <button className="sm:hidden text-blue-600 font-bold text-[14px]">Change</button>
              </div>

              <div className="hidden sm:block mb-4">
                <span className="font-semibold text-gray-800 text-sm">Select a delivery address</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 sm:mb-6">
                {addresses.map(addr => (
                  <div 
                    key={addr.id} 
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`relative border rounded-xl p-4 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-blue-500 bg-blue-50/50 sm:bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'} ${selectedAddress !== addr.id ? 'hidden sm:block' : ''}`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`mt-1 w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 sm:border flex items-center justify-center flex-shrink-0 ${selectedAddress === addr.id ? 'border-blue-600 sm:border-blue-500' : 'border-gray-300'}`}>
                        {selectedAddress === addr.id && <div className="w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 sm:bg-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-1">
                          <span className="font-bold text-[#0F243E] sm:text-gray-900 text-[15px] sm:text-base">{addr.type}</span>
                          {addr.isDefault && <span className="text-[11px] sm:text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold">Default</span>}
                        </div>
                        <div className="text-[14px] sm:text-sm text-[#334155] sm:text-gray-600 space-y-0.5 leading-snug">
                          <div className="font-medium sm:font-medium text-[#0F243E] sm:text-gray-800">{addr.name}</div>
                          <div>{addr.addressLine1}</div>
                          <div>{addr.addressLine2}</div>
                          <div>{addr.city}</div>
                          <div>{addr.pin}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-3 mt-4 ml-7 text-xs font-semibold text-blue-600">
                      <button className="hover:underline">Edit</button>
                      <span className="text-gray-300">|</span>
                      <button className="hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="sm:hidden w-full flex items-center justify-center gap-1.5 border border-blue-100 bg-white text-blue-600 font-bold py-3 rounded-xl mb-4 text-[14px]">
                <Plus className="w-4 h-4" />
                Add New Address
              </button>

              <label className="flex items-center gap-3 cursor-pointer mt-2 sm:mt-0">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" defaultChecked className="w-5 h-5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer peer appearance-none checked:bg-blue-600 checked:border-blue-600 bg-white border-2 sm:border" />
                  <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-[14px] sm:text-sm font-medium sm:font-semibold text-[#334155] sm:text-gray-800">Billing address is the same as shipping address</span>
              </label>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 relative">
              <div className="flex items-center gap-3 mb-2 sm:mb-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 sm:bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h2 className="text-lg font-bold text-[#0F243E]">Payment Method</h2>
              </div>
              <p className="hidden sm:block text-sm text-gray-500 ml-11 mb-6">Choose your preferred payment method</p>
              <div className="sm:hidden mb-4"></div>

              <div className="space-y-3 sm:space-y-4">
                
                {/* UPI */}
                <div 
                  onClick={() => setSelectedPayment('upi')}
                  className={`border rounded-xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer transition-all ${selectedPayment === 'upi' ? 'border-blue-500 bg-blue-50/10 sm:bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                   <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 sm:border flex items-center justify-center flex-shrink-0 ${selectedPayment === 'upi' ? 'border-blue-600 sm:border-blue-500' : 'border-gray-300'}`}>
                      {selectedPayment === 'upi' && <div className="w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 sm:bg-blue-500" />}
                   </div>
                   <div className="w-8 h-8 sm:bg-gray-50 rounded flex items-center justify-center flex-shrink-0 sm:border sm:border-gray-100">
                     <svg className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600 hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                     <img src="https://cdn.iconscout.com/icon/free/png-256/upi-2085056-1747946.png" className="w-6 h-6 sm:hidden object-contain" alt="upi" />
                   </div>
                   <div className="flex-1">
                     <div className="font-bold text-[#0F243E] sm:text-gray-900 text-[15px] sm:text-sm mb-0.5">UPI</div>
                     <div className="text-[13px] sm:text-xs text-[#64748b] sm:text-gray-500 leading-tight">Google Pay, PhonePe, Paytm, etc.</div>
                   </div>
                   <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-400">
                     <span className="text-gray-800">G Pay</span>
                     <span className="text-purple-600">Pe</span>
                     <span className="text-blue-500">Paytm</span>
                     <span className="text-gray-900">UPI</span>
                   </div>
                   <div className="sm:hidden text-gray-400">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                   </div>
                </div>

                {/* Card */}
                <div 
                  onClick={() => setSelectedPayment('card')}
                  className={`border rounded-xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer transition-all ${selectedPayment === 'card' ? 'border-blue-500 bg-blue-50/10 sm:bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                   <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 sm:border flex items-center justify-center flex-shrink-0 ${selectedPayment === 'card' ? 'border-blue-600 sm:border-blue-500' : 'border-gray-300'}`}>
                      {selectedPayment === 'card' && <div className="w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 sm:bg-blue-500" />}
                   </div>
                   <div className="w-8 h-8 sm:bg-gray-50 rounded flex items-center justify-center flex-shrink-0 sm:border sm:border-gray-100">
                     <CreditCard className="w-6 h-6 sm:w-5 sm:h-5 text-[#0F243E]" />
                   </div>
                   <div className="flex-1">
                     <div className="font-bold text-[#0F243E] sm:text-gray-900 text-[15px] sm:text-sm mb-0.5">Credit / Debit Card</div>
                     <div className="text-[13px] sm:text-xs text-[#64748b] sm:text-gray-500 leading-tight">Visa, Mastercard, Rupay</div>
                   </div>
                   <div className="hidden sm:flex items-center gap-3">
                     <span className="text-blue-700 font-black italic text-sm">VISA</span>
                     <div className="flex"><div className="w-4 h-4 rounded-full bg-red-500"></div><div className="w-4 h-4 rounded-full bg-yellow-500 -ml-2"></div></div>
                     <span className="text-blue-800 font-bold italic text-sm">RuPay</span>
                   </div>
                   <div className="sm:hidden text-gray-400">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                   </div>
                </div>

                {/* Net Banking */}
                <div 
                  onClick={() => setSelectedPayment('netbanking')}
                  className={`border rounded-xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer transition-all ${selectedPayment === 'netbanking' ? 'border-blue-500 bg-blue-50/10 sm:bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                   <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 sm:border flex items-center justify-center flex-shrink-0 ${selectedPayment === 'netbanking' ? 'border-blue-600 sm:border-blue-500' : 'border-gray-300'}`}>
                      {selectedPayment === 'netbanking' && <div className="w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 sm:bg-blue-500" />}
                   </div>
                   <div className="w-8 h-8 sm:bg-gray-50 rounded flex items-center justify-center flex-shrink-0 sm:border sm:border-gray-100">
                     <svg className="w-6 h-6 sm:w-5 sm:h-5 text-[#0F243E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="10" width="20" height="10" rx="2" ry="2"/><path d="M2 14h20M7 10V7a5 5 0 0 1 10 0v3"/></svg>
                   </div>
                   <div className="flex-1">
                     <div className="font-bold text-[#0F243E] sm:text-gray-900 text-[15px] sm:text-sm mb-0.5">Net Banking</div>
                     <div className="text-[13px] sm:text-xs text-[#64748b] sm:text-gray-500 leading-tight">All major banks</div>
                   </div>
                   <div className="hidden sm:flex items-center gap-3">
                     <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                     <div className="w-5 h-5 bg-red-600 rounded"></div>
                     <div className="w-5 h-5 bg-orange-500"></div>
                   </div>
                   <div className="sm:hidden text-gray-400">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                   </div>
                </div>

                {/* Wallets */}
                <div 
                  onClick={() => setSelectedPayment('wallet')}
                  className={`border rounded-xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer transition-all ${selectedPayment === 'wallet' ? 'border-blue-500 bg-blue-50/10 sm:bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                   <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 sm:border flex items-center justify-center flex-shrink-0 ${selectedPayment === 'wallet' ? 'border-blue-600 sm:border-blue-500' : 'border-gray-300'}`}>
                      {selectedPayment === 'wallet' && <div className="w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 sm:bg-blue-500" />}
                   </div>
                   <div className="w-8 h-8 sm:bg-gray-50 rounded flex items-center justify-center flex-shrink-0 sm:border sm:border-gray-100">
                     <svg className="w-6 h-6 sm:w-5 sm:h-5 text-[#0F243E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4H6a2 2 0 0 1-2-2z"/></svg>
                   </div>
                   <div className="flex-1">
                     <div className="font-bold text-[#0F243E] sm:text-gray-900 text-[15px] sm:text-sm mb-0.5">Wallets</div>
                     <div className="text-[13px] sm:text-xs text-[#64748b] sm:text-gray-500 leading-tight">Amazon Pay, PhonePe Wallet, etc.</div>
                   </div>
                   <div className="hidden sm:flex items-center gap-3 text-xs font-bold">
                     <span className="text-gray-900">amazon pay</span>
                     <span className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center font-serif text-[10px]">Pe</span>
                   </div>
                   <div className="sm:hidden text-gray-400">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                   </div>
                </div>
              </div>
            </div>

            {/* Place Order CTA (Desktop) */}
            <div className="hidden sm:block">
              <button className="w-full bg-[#ff5a00] hover:bg-[#e65200] text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(255,90,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,90,0,0.23)] text-lg">
                <Lock className="w-5 h-5 mr-1" />
                Place Order <span className="font-medium mx-1">•</span> ₹2,399
              </button>
              <div className="text-center text-xs text-gray-500 mt-4">
                By placing your order, you agree to our <Link to="/terms" className="text-blue-600 hover:underline font-semibold">Terms & Conditions</Link> and <Link to="/privacy" className="text-blue-600 hover:underline font-semibold">Privacy Policy</Link>.
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-1/3 mb-6 sm:mb-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 sticky top-6">
              
              <div className="flex items-center justify-between mb-4 sm:mb-6 pb-4 sm:border-b sm:border-gray-100 cursor-pointer sm:cursor-default">
                <h2 className="text-lg font-bold text-[#0F243E]">Order Summary <span className="text-sm font-medium text-gray-500 font-normal">(1 item)</span></h2>
                <svg className="w-5 h-5 text-[#0F243E] sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                <Link to="/cart" className="hidden sm:block text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  Edit Cart
                </Link>
              </div>

              {/* Item */}
              <div className="flex gap-4 mb-2 sm:mb-6">
                <div className="w-20 h-20 bg-white sm:bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-2 flex-shrink-0 shadow-sm">
                   <img src="/lamborghini.jpg" alt="Lamborghini" className="object-contain max-h-full" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[11px] sm:text-[10px] text-[#64748b] sm:text-gray-400 font-medium sm:font-bold sm:uppercase tracking-wider mb-1 sm:mb-1">Maisto</span>
                  <h4 className="text-[15px] sm:text-sm font-bold text-[#0F243E] leading-snug mb-1">Lamborghini Huracán LP 610-4</h4>
                  <div className="hidden sm:block text-xs text-gray-500 mb-2">Scale 1:18 | Die-cast Metal</div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[13px] sm:text-xs font-semibold text-[#64748b] sm:text-gray-600">Qty: 1</span>
                    <span className="font-bold text-[#0F243E] text-[15px] sm:text-base">₹2,399</span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block space-y-3 text-[14px] mb-6 border-y border-gray-100 py-4">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">₹2,399</span>
                </div>
                <div className="flex justify-between text-gray-600 items-center">
                  <span className="flex items-center gap-1.5 font-medium">
                    Shipping 
                    <span className="w-3.5 h-3.5 border border-gray-300 rounded-full text-[9px] flex items-center justify-center text-gray-400 cursor-help" title="Shipping calculation">i</span>
                  </span>
                  <span className="font-bold text-gray-900">₹0</span>
                </div>
                <div className="text-[11px] text-gray-400 -mt-1">Free shipping on toy orders</div>
              </div>

              <div className="hidden sm:flex justify-between items-center mb-6">
                <div className="flex flex-col">
                   <span className="text-lg font-bold text-gray-900">Total</span>
                   <span className="text-xs text-gray-500 font-medium">(incl. of all taxes)</span>
                </div>
                <span className="text-2xl font-black text-[#1e293b]">₹2,399</span>
              </div>

              <div className="hidden sm:flex bg-green-50 border border-green-100 rounded-xl p-4 items-start gap-3 mb-8">
                <div className="mt-0.5 text-green-600">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-green-800">Free Delivery</h4>
                  <p className="text-xs text-green-700 mt-0.5">Your order is eligible for free delivery.</p>
                </div>
              </div>

              <div className="hidden sm:block space-y-5">
                <div className="flex gap-3.5 items-start">
                   <div className="w-9 h-9 rounded-full bg-blue-50/80 text-blue-700 flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                     <ShieldCheck className="w-4 h-4" />
                   </div>
                   <div className="pt-0.5">
                     <h4 className="font-bold text-[13px] text-[#0F243E]">100% Genuine Products</h4>
                     <p className="text-[12px] text-gray-500 mt-0.5 font-medium">Authentic and original toys</p>
                   </div>
                </div>
                <div className="flex gap-3.5 items-start">
                   <div className="w-9 h-9 rounded-full bg-blue-50/80 text-blue-700 flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                     <CreditCard className="w-4 h-4" />
                   </div>
                   <div className="pt-0.5">
                     <h4 className="font-bold text-[13px] text-[#0F243E]">Secure Payments</h4>
                     <p className="text-[12px] text-gray-500 mt-0.5 font-medium">Multiple payment options</p>
                   </div>
                </div>
                <div className="flex gap-3.5 items-start">
                   <div className="w-9 h-9 rounded-full bg-blue-50/80 text-blue-700 flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                     <Truck className="w-4 h-4" />
                   </div>
                   <div className="pt-0.5">
                     <h4 className="font-bold text-[13px] text-[#0F243E]">Pan-India Delivery</h4>
                     <p className="text-[12px] text-gray-500 mt-0.5 font-medium">Across 20,000+ pin codes</p>
                   </div>
                </div>
                <div className="flex gap-3.5 items-start">
                   <div className="w-9 h-9 rounded-full bg-blue-50/80 text-blue-700 flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                     <RefreshCw className="w-4 h-4" />
                   </div>
                   <div className="pt-0.5">
                     <h4 className="font-bold text-[13px] text-[#0F243E]">Easy Returns</h4>
                     <p className="text-[12px] text-gray-500 mt-0.5 font-medium">Hassle-free returns</p>
                   </div>
                </div>
              </div>

            </div>
            
            {/* Place Order CTA (Mobile) */}
            <div className="sm:hidden mt-6">
              <button className="w-full bg-[#ff5a00] hover:bg-[#e65200] text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(255,90,0,0.39)] text-[16px]">
                <Lock className="w-5 h-5 mr-1" />
                Place Order <span className="font-medium mx-1">•</span> ₹2,399
              </button>
              <div className="text-center text-xs text-gray-500 mt-4">
                By placing your order, you agree to our <br/><Link to="/terms" className="text-blue-600 hover:underline font-semibold">Terms & Conditions</Link> and <Link to="/privacy" className="text-blue-600 hover:underline font-semibold">Privacy Policy</Link>.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CartCheckout;
