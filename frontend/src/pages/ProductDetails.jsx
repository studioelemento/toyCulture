import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, RotateCcw, Check, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProduct(data.data);
        }
      })
      .catch((err) => console.error('Failed to load product:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity });
  };

  if (loading) {
    return (
      <div className="w-full bg-[#FAF9F5] min-h-screen py-16 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#F96515] border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full bg-[#FAF9F5] min-h-screen py-16 text-center">
        <h2 className="text-xl font-bold text-[#0F243E]">Product not found</h2>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 px-6 py-2.5 bg-[#F96515] text-white rounded-xl text-sm font-bold"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=800'];

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
              <img
                src={images[activeImage] || images[0]}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden bg-[#FAF9F5] p-2 border-2 transition-all ${
                      activeImage === idx ? 'border-[#F96515]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#8C98A9] uppercase tracking-wider">
                {product.brand}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-[#0F243E] tracking-tight mt-1 mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl md:text-3xl font-black text-[#0F243E]">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-gray-400 line-through">
                    ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {product.description || product.small_description || 'High quality toy from ToyCulture.'}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#F96515] hover:bg-[#EA580C] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
