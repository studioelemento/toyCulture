import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { StarRating } from '../components/Rating/StarRating';
import { useCart } from '../context/CartContext';
import { ProductGrid } from '../components/ProductGrid/ProductGrid';
import { ChevronRight, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check } from 'lucide-react';

export const ProductDetails = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const product = products.find((p) => p.slug === productSlug || p.id === productSlug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-toyNavy mb-4">Product Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/shop"
          className="bg-toyOrange text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-toyOrange-hover transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-6">
        <Link to="/" className="hover:text-toyOrange transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to={`/category/${product.categorySlug}`} className="hover:text-toyOrange transition-colors">
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span className="text-toyNavy font-extrabold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 mb-12 border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Gallery Column */}
        <div className="space-y-4">
          <div className="relative w-full aspect-square bg-toyBg-single rounded-2xl p-6 flex items-center justify-center border border-gray-100 overflow-hidden">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            {product.discount && (
              <span className="absolute top-4 left-4 bg-toyRed text-white text-xs font-black px-3 py-1 rounded-full shadow">
                {product.discount} OFF
              </span>
            )}
            {product.isHot && (
              <span className="absolute top-4 right-4 bg-toyOrange text-white text-xs font-black px-3 py-1 rounded-full shadow">
                Hot
              </span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl border-2 bg-toyBg-single p-1 flex-shrink-0 transition-all ${
                    selectedImage === idx ? 'border-toyOrange shadow' : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Column */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-toyOrange uppercase tracking-wider">
                Brand: {product.brand}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  product.inStock ? 'bg-green-100 text-toyGreen' : 'bg-red-100 text-toyRed'
                }`}
              >
                {product.inStock ? `In Stock (${product.stock} available)` : 'Sold Out'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-toyNavy leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size={18} />
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs font-bold text-gray-600">Verified Buyer Reviews</span>
            </div>

            {/* Price Box */}
            <div className="bg-toyBg-single p-4 rounded-2xl flex items-baseline gap-4 border border-gray-100">
              <span className="text-3xl font-black text-toyOrange">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-gray-400 line-through font-semibold">
                  MRP: ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs font-extrabold text-toyGreen bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                Inclusive of all taxes
              </span>
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Action Area */}
            {product.inStock ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-sm font-black text-toyNavy min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="bg-toyNavy hover:bg-toyNavy-light text-white font-bold text-xs py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="bg-toyOrange hover:bg-toyOrange-hover text-white font-bold text-xs py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 text-toyRed p-4 rounded-xl text-center text-xs font-bold border border-red-200">
                This item is currently out of stock. Check back soon or browse related items below.
              </div>
            )}
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-500 font-semibold">
            <div className="flex flex-col items-center gap-1">
              <Truck size={18} className="text-toyOrange" />
              <span>Free Shipping &gt; ₹2000</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck size={18} className="text-toyOrange" />
              <span>100% Original Product</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw size={18} className="text-toyOrange" />
              <span>Easy Replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 mb-12 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-extrabold text-toyNavy uppercase tracking-tight mb-6 pb-2 border-b border-gray-200">
          Product Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-bold text-gray-500">SKU Code</span>
            <span className="font-extrabold text-toyNavy">{product.sku}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-bold text-gray-500">Brand Name</span>
            <span className="font-extrabold text-toyNavy">{product.brand}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-bold text-gray-500">Category</span>
            <span className="font-extrabold text-toyNavy">{product.category}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-bold text-gray-500">Age Group</span>
            <span className="font-extrabold text-toyNavy">{product.ageGroup}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-bold text-gray-500">Material</span>
            <span className="font-extrabold text-toyNavy">{product.material}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-bold text-gray-500">Toy Type</span>
            <span className="font-extrabold text-toyNavy">{product.toyType}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-bold text-gray-500">Color Variant</span>
            <span className="font-extrabold text-toyNavy">{product.color}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-bold text-gray-500">Availability</span>
            <span className="font-extrabold text-toyGreen">In Stock & Ready to Ship</span>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="mb-12">
          <ProductGrid
            products={relatedProducts}
            title="Related Products"
            subtitle="You might also like these similar items"
            columns={5}
          />
        </section>
      )}
    </div>
  );
};
