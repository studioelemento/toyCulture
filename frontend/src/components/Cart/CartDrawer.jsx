import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItemsCount,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2000;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-md bg-white text-toyText-primary h-full shadow-2xl flex flex-col z-50 animate-slideLeft">
        {/* Drawer Header */}
        <div className="bg-toyNavy text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-toyOrange" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Shopping Cart ({totalItemsCount})</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 hover:text-toyOrange transition-colors"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-toyOrange-light p-3 border-b border-toyOrange/20">
          <div className="flex items-center gap-2 text-xs font-bold text-toyNavy mb-1.5">
            <Truck size={16} className="text-toyOrange" />
            {amountForFreeShipping === 0 ? (
              <span className="text-toyGreen font-extrabold">You qualify for FREE shipping!</span>
            ) : (
              <span>
                Add <strong className="text-toyOrange">₹{amountForFreeShipping.toLocaleString('en-IN')}</strong> more for FREE Shipping!
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-toyOrange h-full transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <ShoppingBag size={36} />
              </div>
              <p className="text-sm font-bold text-toyText-primary">Your cart is currently empty.</p>
              <p className="text-xs text-gray-400">Explore our wide collection of toys and diecast models!</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="bg-toyOrange hover:bg-toyOrange-hover text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="py-4 flex gap-4 items-center">
                {/* Product Image */}
                <Link
                  to={`/product/${item.product.slug}`}
                  onClick={() => setIsCartOpen(false)}
                  className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-lg p-1 flex-shrink-0 flex items-center justify-center"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </Link>

                {/* Info & Quantity controls */}
                <div className="flex-1">
                  <Link
                    to={`/product/${item.product.slug}`}
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs font-bold text-toyText-heading hover:text-toyOrange transition-colors line-clamp-2 leading-tight mb-1"
                  >
                    {item.product.name}
                  </Link>

                  <div className="text-xs font-extrabold text-toyOrange mb-2">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-extrabold text-toyText-primary min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-toyRed transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Action Buttons */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-600">Subtotal:</span>
              <span className="text-lg font-black text-toyNavy">
                ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <p className="text-[11px] text-gray-400 text-center">
              Taxes and shipping calculated at checkout.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
                className="bg-white border-2 border-toyNavy text-toyNavy font-bold text-xs py-3 rounded-xl hover:bg-toyNavy hover:text-white transition-colors text-center"
              >
                View Cart
              </button>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="bg-toyOrange hover:bg-toyOrange-hover text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-md"
              >
                <span>Checkout</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
