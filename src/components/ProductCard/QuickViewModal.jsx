import React, { useState } from 'react';
import { X, ShoppingBag, Check, ShieldCheck } from 'lucide-react';
import { StarRating } from '../Rating/StarRating';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
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
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain p-4"
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
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto max-w-full py-1">
              {product.images.map((img, idx) => (
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

        {/* Right Column: Product Details */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-toyOrange uppercase tracking-wider mb-1">
              {product.brand}
            </div>
            <h2 className="text-lg font-bold text-toyText-heading leading-tight mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="mb-4">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-4 bg-toyBg-single p-3 rounded-xl">
              <span className="text-2xl font-black text-toyOrange">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through font-medium">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description excerpt */}
            <p className="text-xs text-toyText-secondary leading-relaxed mb-4 line-clamp-3">
              {product.description}
            </p>

            {/* Specifications quick summary */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div>
                <span className="text-gray-400 font-medium">SKU:</span>{' '}
                <span className="font-bold text-toyText-primary">{product.sku}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Age Group:</span>{' '}
                <span className="font-bold text-toyText-primary">{product.ageGroup}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Material:</span>{' '}
                <span className="font-bold text-toyText-primary">{product.material}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Stock:</span>{' '}
                <span
                  className={`font-bold ${
                    product.inStock ? 'text-toyGreen' : 'text-toyRed'
                  }`}
                >
                  {product.inStock ? 'In Stock' : 'Sold Out'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons & quantity */}
          {product.inStock ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-bold text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-extrabold text-toyText-primary min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm font-bold text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-toyNavy hover:bg-toyNavy-light text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-toyOrange hover:bg-toyOrange-hover text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 text-toyRed p-3 rounded-xl text-center text-xs font-bold border border-red-200">
              This product is currently out of stock.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
