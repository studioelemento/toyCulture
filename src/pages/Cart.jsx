import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Truck, Tag, RefreshCw } from 'lucide-react';

export const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingFee,
    grandTotal,
    totalItemsCount,
  } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'TOY10' || couponCode.trim().toUpperCase() === 'WELCOME10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try "TOY10" for 10% off!');
    }
  };

  const finalTotal = Math.max(0, grandTotal - discountAmount);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
          <div className="w-20 h-20 bg-toyOrange/10 text-toyOrange rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={36} />
          </div>
          <h1 className="text-2xl font-black text-toyNavy uppercase">Your Cart is Empty</h1>
          <p className="text-xs text-gray-500">
            Looks like you haven't added any toys to your cart yet. Explore our top categories and find something amazing!
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="bg-toyOrange hover:bg-toyOrange-hover text-white text-xs font-extrabold px-8 py-3 rounded-full transition-colors inline-block shadow-md"
            >
              Return to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-toyNavy uppercase mb-6">
        Shopping Cart ({totalItemsCount} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Products Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-toyBg-single border-b border-gray-100 text-xs font-extrabold text-toyNavy uppercase">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center text-xs"
                >
                  {/* Product Details */}
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="w-16 h-16 bg-toyBg-single rounded-xl p-1 border border-gray-100 flex-shrink-0 flex items-center justify-center"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="font-bold text-toyText-heading hover:text-toyOrange transition-colors line-clamp-2 leading-tight"
                      >
                        {item.product.name}
                      </Link>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        SKU: {item.product.sku}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-center font-bold text-gray-600">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-black text-toyNavy min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Line Subtotal & Remove */}
                  <div className="col-span-2 flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <span className="font-extrabold text-toyOrange text-sm">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-toyRed transition-colors p-1"
                      title="Remove product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <button
              onClick={clearCart}
              className="text-xs font-bold text-gray-500 hover:text-toyRed transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Clear Shopping Cart</span>
            </button>
            <Link
              to="/shop"
              className="text-xs font-bold text-toyNavy hover:text-toyOrange transition-colors flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-toyNavy uppercase border-b border-gray-100 pb-3">
              Order Summary
            </h2>

            {/* Coupon Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold text-gray-600 block">Have a Coupon?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter TOY10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange uppercase font-bold"
                />
                <button
                  type="submit"
                  className="bg-toyNavy hover:bg-toyNavy-light text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-[11px] font-bold text-toyGreen">Coupon TOY10 applied! 10% discount subtracted.</p>
              )}
              {couponError && <p className="text-[11px] font-bold text-toyRed">{couponError}</p>}
            </form>

            {/* Summary Breakdown */}
            <div className="space-y-3 pt-2 text-xs border-t border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-extrabold text-toyNavy">
                  ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-toyGreen font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <Truck size={14} className="text-toyOrange" /> Shipping
                </span>
                <span className="font-extrabold">
                  {shippingFee === 0 ? (
                    <span className="text-toyGreen">FREE</span>
                  ) : (
                    `₹${shippingFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                  )}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-gray-200 text-sm font-black">
                <span className="text-toyNavy">Total Payable</span>
                <span className="text-2xl text-toyOrange">
                  ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-toyOrange hover:bg-toyOrange-hover text-white text-xs font-black py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
