import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, RotateCcw, Check, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { newArrivalsProducts } from './Home/components/NewArrivals';

// Fallback dummy data if product not found
const MOCK_PRODUCT = {
  id: 'new-1',
  name: 'Remote Control Off-Road Truck',
  slug: 'remote-control-off-road-truck',
  brand: 'PowerCraze',
  price: 2499,
  badge: 'New',
  rating: 4.6,
  reviewsCount: 89,
  description: 'Experience the thrill of off-road driving with this high-performance remote control truck. Built with durable materials, advanced suspension, and a powerful motor, it can conquer any terrain. Perfect for kids and hobbyists alike.',
  features: [
    '4WD Independent Suspension',
    'High-Grip All Terrain Tires',
    '2.4GHz Radio System for up to 100m range',
    'Rechargeable Battery Included'
  ],
  images: [
    'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1594787317772-5bb92f3900be?auto=format&fit=crop&w=800&q=80'
  ],
  inStock: true,
};

export const ProductDetails = () => {
  const { id } = useParams(); // the slug
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);

  // Find the product dynamically by slug, or fallback to mock
  const foundProduct = newArrivalsProducts.find(p => p.slug === id);
  const product = foundProduct ? {
    ...MOCK_PRODUCT, 
    ...foundProduct, 
    images: [foundProduct.image, foundProduct.image] // using the single image twice for gallery mock
  } : MOCK_PRODUCT;

  const handleAddToCart = () => {
    // Add product to cart with quantity
    addToCart({ ...product, quantity });
    // Optional: show a toast or feedback
  };

  return (
    <div className="w-full bg-[#FAF9F5] min-h-screen py-8 md:py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#55657E] mb-6 font-medium">
          <button onClick={() => navigate('/')} className="hover:text-[#F96515] transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/shop')} className="hover:text-[#F96515] transition-colors">Shop</button>
          <span>/</span>
          <span className="text-[#0F243E]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-[32px] p-6 md:p-10 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-[#ECEFF2]">
          
          {/* Left Column: Images */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF9F5] p-6 relative flex items-center justify-center">
              <span className="absolute top-4 left-4 bg-[#10B981] text-white text-[12px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                {product.badge}
              </span>
              <button 
                onClick={() => setIsWishlist(!isWishlist)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-24 h-24 rounded-xl p-2 bg-[#FAF9F5] border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-[#F96515] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="mb-6">
              <span className="text-[13px] font-bold text-[#8C98A9] uppercase tracking-wider mb-2 block">
                {product.brand}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-[42px] font-black text-[#0F243E] leading-tight font-title mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F59E0B]" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-[14px] font-bold text-[#55657E]">
                  {product.rating} ({product.reviewsCount} reviews)
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span className="text-[14px] font-bold text-[#10B981] flex items-center gap-1">
                  <Check className="w-4 h-4" /> In Stock
                </span>
              </div>
            </div>

            <div className="text-[32px] md:text-[40px] font-black text-[#0F243E] mb-6">
              ₹{product.price.toLocaleString('en-IN')}
            </div>

            <p className="text-[15px] md:text-[16px] text-[#55657E] leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-10">
              
              {/* Quantity Selector */}
              <div className="flex items-center justify-between bg-[#FAF9F5] border border-[#ECEFF2] rounded-2xl px-4 py-3 sm:w-1/3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#0F243E] hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" strokeWidth={3} />
                </button>
                <span className="text-lg font-bold text-[#0F243E] w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#0F243E] hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#F96515] hover:bg-[#EA580C] active:scale-[0.98] text-white text-[16px] font-bold rounded-2xl py-4 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(249,101,21,0.25)] transition-all"
              >
                <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Features & Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-[#ECEFF2]">
              <div className="space-y-3">
                <h4 className="text-[15px] font-bold text-[#0F243E]">Key Features</h4>
                <ul className="space-y-2">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[14px] text-[#55657E]">
                      <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#F96515] flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] flex items-center justify-center text-[#0F243E]">
                    <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#0F243E]">1 Year Warranty</div>
                    <div className="text-[12px] text-[#55657E]">100% Authentic Product</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] flex items-center justify-center text-[#0F243E]">
                    <RotateCcw className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#0F243E]">7 Days Return</div>
                    <div className="text-[12px] text-[#55657E]">Hassle-free returns</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
