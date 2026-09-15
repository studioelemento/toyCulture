import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, CheckCircle, Info, Lock } from 'lucide-react';

export const Checkout = () => {
  const { cart, subtotal, shippingFee, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Kerala',
    pincode: '',
    paymentMethod: 'upi',
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone || !formData.address || !formData.pincode) {
      alert('Please complete all required contact & shipping fields.');
      return;
    }

    const generatedId = `TC-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl text-center">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6 animate-scaleUp">
          <div className="w-20 h-20 bg-green-100 text-toyGreen rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={48} />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-toyOrange uppercase tracking-widest">
              Demo Order Placed Successfully
            </span>
            <h1 className="text-2xl font-black text-toyNavy">Thank You For Your Order!</h1>
            <p className="text-xs text-gray-500">
              Your demo order <strong className="text-toyNavy">{orderId}</strong> has been received and processed locally.
            </p>
          </div>

          <div className="bg-toyBg-single p-4 rounded-2xl text-left text-xs space-y-2 border border-gray-100">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-500">Customer:</span>
              <span>{formData.firstName} {formData.lastName}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-gray-500">Phone:</span>
              <span>{formData.phone}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-gray-500">Payment Method:</span>
              <span className="uppercase text-toyOrange font-extrabold">{formData.paymentMethod}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/shop"
              className="bg-toyOrange hover:bg-toyOrange-hover text-white text-xs font-extrabold px-8 py-3 rounded-full transition-colors inline-block shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <h2 className="text-xl font-bold text-toyNavy mb-4">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 mb-6">You need to add items to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="bg-toyOrange text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-toyOrange-hover transition-colors"
        >
          Browse Toys
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-toyNavy uppercase mb-6">
        Checkout
      </h1>

      {/* Backend API separation banner */}
      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl mb-8 text-xs flex items-start gap-3">
        <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Frontend Demonstration Notice:</strong>
          <p className="mt-0.5 text-amber-800">
            This React + Vite application implements the complete frontend checkout UI workflow. For real order processing and gateway fulfillment, connect this form to WooCommerce REST API or a custom Express backend.
          </p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Customer & Shipping Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-black text-toyNavy uppercase border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-toyOrange text-white rounded-full flex items-center justify-center text-xs">1</span>
              <span>Contact Information</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-black text-toyNavy uppercase border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-toyOrange text-white rounded-full flex items-center justify-center text-xs">2</span>
              <span>Shipping Address</span>
            </h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                  placeholder="House No, Building, Street Name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">City / District</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                    placeholder="Trivandrum"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                    placeholder="Kerala"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                    placeholder="695020"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-black text-toyNavy uppercase border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-toyOrange text-white rounded-full flex items-center justify-center text-xs">3</span>
              <span>Payment Option</span>
            </h2>
            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 p-3.5 border border-gray-200 rounded-2xl cursor-pointer hover:border-toyOrange transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={formData.paymentMethod === 'upi'}
                  onChange={handleChange}
                  className="text-toyOrange focus:ring-toyOrange"
                />
                <div>
                  <span className="font-extrabold text-toyNavy block">UPI / Google Pay / PhonePe / Paytm</span>
                  <span className="text-gray-400 text-[11px]">Instant zero-fee payment via any UPI app</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 border border-gray-200 rounded-2xl cursor-pointer hover:border-toyOrange transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="text-toyOrange focus:ring-toyOrange"
                />
                <div>
                  <span className="font-extrabold text-toyNavy block">Cash on Delivery (COD)</span>
                  <span className="text-gray-400 text-[11px]">Pay with cash upon package arrival</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 border border-gray-200 rounded-2xl cursor-pointer hover:border-toyOrange transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleChange}
                  className="text-toyOrange focus:ring-toyOrange"
                />
                <div>
                  <span className="font-extrabold text-toyNavy block">Credit / Debit Cards</span>
                  <span className="text-gray-400 text-[11px]">Visa, Mastercard, RuPay & Amex supported</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 sticky top-24">
            <h2 className="text-base font-black text-toyNavy uppercase border-b border-gray-100 pb-3">
              Your Order ({cart.length})
            </h2>

            {/* Product list */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-10 h-10 object-contain rounded bg-toyBg-single p-1 flex-shrink-0"
                    />
                    <span className="font-bold text-gray-700 truncate">
                      {item.quantity}x {item.product.name}
                    </span>
                  </div>
                  <span className="font-extrabold text-toyNavy">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-bold text-toyGreen">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-toyNavy pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-xl text-toyOrange">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              className="w-full bg-toyOrange hover:bg-toyOrange-hover text-white text-xs font-black py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              <Lock size={16} />
              <span>Place Order (₹{grandTotal.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
