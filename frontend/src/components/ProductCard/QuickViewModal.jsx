import React, { useState } from 'react';
import { X, ShoppingBag, Check, ShieldCheck } from 'lucide-react';
import { StarRating } from '../Rating/StarRating';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { requireLoginForPurchase } from '../../lib/requireLoginAction';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setIsCartOpen, showToast } = useCart();
  const { isLoggedIn, isBootstrapping, openAuthDrawer } = useAuth();
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600'];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    if (
      !requireLoginForPurchase({
        isLoggedIn,
        isBootstrapping,
        openAuthDrawer,
        showToast,
      })
    ) {
      return;
    }
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden z-50 flex flex-col md:flex-row max-h-[90vh] animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Left Column: Product Gallery */}
        <div className="md:w-1/2 p-6 bg-gray-50 flex flex-col justify-between items-center border-r border-gray-100">
          <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden shadow-inner mb-4 flex items-center justify-center">
            <img
              src={images[selectedImage] || images[0]}
              alt={product.name}
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";
              }}
            />
            {product.discount && (
              <span className="absolute top-3 left-3 bg-toyRed text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
                {product.discount}
              </span>
            )}
            {product.isHot && (
              <span className="absolute top-3 right-3 bg-toyOrange text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
                Hot
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto max-w-full py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
                    selectedImage === idx ? 'border-toyOrange shadow-sm' : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Brand & Category */}
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-1">
              <span className="uppercase tracking-wider">{product.brand || 'ToyCulture'}</span>
              <span>{product.category || 'Toys'}</span>
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-black text-toyText-heading mb-2 leading-tight">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="mb-4">
              <StarRating rating={product.rating || 4.8} reviewCount={product.reviews || product.reviewCount || 0} />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-black text-toyText-heading">
                ₹{Number(product.price || 0).toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
              {product.description || product.small_description || 'Premium quality toy from ToyCulture.'}
            </p>

            {/* Stock Status */}
            <div className="mb-6 flex items-center gap-2 text-xs font-bold">
              <span className="text-gray-500">Availability:</span>
              {product.inStock !== false ? (
                <span className="text-toyGreen flex items-center gap-1">
                  <Check size={14} /> In Stock
                </span>
              ) : (
                <span className="text-toyRed">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-bold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1 font-bold text-sm text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.inStock === false}
                className="flex-1 bg-toyOrange hover:bg-toyOrange-hover disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.inStock === false}
                className="flex-1 bg-toyText-heading hover:bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-sm"
              >
                Buy Now
              </button>
            </div>

            {/* Security note */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2">
              <ShieldCheck size={14} className="text-toyGreen" />
              <span>Safe & Secure Checkout Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
