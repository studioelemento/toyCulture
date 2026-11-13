import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Heart, Star, CheckCircle2, Minus, Plus, ShoppingCart, Zap, 
  ShieldCheck, CreditCard, Truck, RotateCcw, ChevronDown, Smile, Layers, Car,
  Tag, Ruler, User, Box, Shield, PackageCheck, Send, MessageSquare, ThumbsUp
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/apiClient';
import { requireLoginForReview } from '../../../lib/requireLoginAction';
// Removed static import; product will be fetched via API

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, showToast } = useCart();
  const { isLoggedIn, isBootstrapping, openAuthDrawer } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Product Highlights');
  const [openAccordion, setOpenAccordion] = useState('Specifications');

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [errorProduct, setErrorProduct] = useState(null);

  // ── Reviews state ──────────────────────────────────────────────────────────
  const [reviews,        setReviews]        = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [avgRating,      setAvgRating]      = useState(0);
  const [totalReviews,   setTotalReviews]   = useState(0);
  const [myRating,       setMyRating]       = useState(0);
  const [hoverRating,    setHoverRating]    = useState(0);
  const [myComment,      setMyComment]      = useState('');
  const [submitLoading,  setSubmitLoading]  = useState(false);
  const [submitMsg,      setSubmitMsg]      = useState(null); // {type:'success'|'error', text}

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/v1/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        // Assuming API returns { success: true, data: {...} }
        setProduct(data.success ? data.data : null);
      } catch (err) {
        setErrorProduct(err.message);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ── Fetch approved reviews for this product ────────────────────────────────
  const fetchReviews = async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const res  = await fetch(`/api/reviews/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews(data.reviews || []);
        setAvgRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      }
    } catch (e) {
      console.error('Failed to fetch reviews', e);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (
      !requireLoginForReview({
        isLoggedIn,
        isBootstrapping,
        openAuthDrawer,
        onBlocked: (text) => {
          setSubmitMsg({ type: 'error', text });
          showToast?.(text);
        },
      })
    ) {
      return;
    }
    if (!myRating) {
      setSubmitMsg({ type: 'error', text: 'Please select a star rating.' });
      return;
    }
    setSubmitLoading(true);
    setSubmitMsg(null);
    try {
      const data = await api.post('/api/reviews', {
        product_id: id,
        rating: myRating,
        comment: myComment,
      });
      if (data.success) {
        setSubmitMsg({ type: 'success', text: data.message });
        setMyRating(0);
        setMyComment('');
        fetchReviews();
      } else {
        setSubmitMsg({ type: 'error', text: data.message || 'Failed to submit review.' });
      }
    } catch (err) {
      setSubmitMsg({ type: 'error', text: err?.message || 'Network error. Please try again.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="w-full bg-[#f8fafc] min-h-[60vh] flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#F96515] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (errorProduct || !product) {
    return (
      <div className="w-full bg-[#f8fafc] min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-3xl mb-4 shadow-xs">
          🧸
        </div>
        <h2 className="text-2xl font-black text-[#0F243E] tracking-tight mb-2">
          Product Not Found
        </h2>
        <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
          The product you are looking for may have been updated, sold out, or moved. Explore our real live collection of toys below!
        </p>
        <div className="flex gap-3">
          <Link
            to="/shop"
            className="bg-[#F96515] hover:bg-[#EA580C] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-all"
          >
            Explore All Toys
          </Link>
          <Link
            to="/"
            className="bg-white border border-gray-200 hover:bg-gray-50 text-[#0F243E] font-bold text-sm px-6 py-3 rounded-xl transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600'];

  const stockQty = Number(product.stockQTY ?? product.stock ?? 0);
  const isInStock =
    product.inStock !== undefined ? Boolean(product.inStock) : stockQty > 0;
  const displayPrice = Number(product.sellingPrice ?? product.price ?? 0);
  const displayOriginalPrice = product.mrp ?? product.originalPrice ?? null;

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen pb-12 font-sans text-[#0F243E]">
      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-[13px] text-gray-500 gap-1.5">
          <Link to="/" className="hover:text-gray-800 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-gray-800 transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0F243E] font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section (Gallery & Details) */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          
          {/* Gallery Container */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row gap-4 h-full md:min-h-[500px]">
            {/* Thumbnails (Vertical) */}
            <div className="hidden md:flex flex-col gap-3 w-[72px] flex-shrink-0">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-[72px] h-[72px] rounded-lg overflow-hidden border-2 transition-all p-1 flex items-center justify-center ${activeImage === idx ? 'border-[#F96515]' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded" />
                </button>
              ))}
              <button className="w-[72px] h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors mt-1">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="flex-1 relative flex flex-col items-center justify-center px-4 md:px-8">
              <div className="absolute top-0 left-0">
                {product.discount && (
                  <span className="bg-[#F96515] text-white text-[13px] font-bold px-3 py-1 rounded-full">
                    -{product.discount}
                  </span>
                )}
              </div>
              <button className="absolute top-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              
              <div className="w-full max-w-[500px] aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden my-auto relative">
                 <img src={images[activeImage]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>

              {/* Dots */}
              <div className="flex items-center gap-2 mt-4 md:mt-6">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <span 
                    key={idx} 
                    className={`w-2 h-2 rounded-full transition-all ${idx === activeImage + 1 ? 'bg-[#0F243E]' : 'bg-gray-300'}`} 
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails (Horizontal on Mobile) */}
            <div className="flex md:hidden gap-3 overflow-x-auto hide-scrollbar w-full mt-2">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all p-1 flex items-center justify-center ${activeImage === idx ? 'border-[#F96515]' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details Container */}
          <div className="w-full lg:w-[420px] bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[15px] font-black text-[#0F243E] uppercase">{product.brand}</span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-[#2563EB]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Official Store
              </span>
            </div>

            <h1 className="text-[26px] font-black text-[#0F243E] leading-[1.2] mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-[#FBBF24]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : i === Math.floor(product.rating) && product.rating % 1 !== 0 ? 'fill-current opacity-50' : 'fill-transparent stroke-gray-300'}`} />
                ))}
              </div>
              <span className="text-[14px] font-bold text-[#0F243E]">{product.rating}</span>
              <span className="text-[13px] text-gray-500">({product.reviews} reviews)</span>
            </div>

            <div className="text-[13px] text-gray-400 mb-4">
              SKU: MT-31505
            </div>

            {/* Price Section */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[34px] font-black text-[#0F243E] leading-none">
                  ₹{displayPrice.toLocaleString()}
                </span>
                {displayOriginalPrice && displayOriginalPrice > displayPrice && (
                  <span className="text-[20px] text-gray-400 line-through font-medium">
                    ₹{Number(displayOriginalPrice).toLocaleString()}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-[#F96515] text-white text-[13px] font-bold px-3 py-1 rounded-full ml-1">
                    -{product.discount}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <div className="text-[15px] text-[#10B981] font-bold mb-0.5">
                  You save ₹{(displayOriginalPrice - displayPrice).toLocaleString()}
                </div>
              )}
              <div className="text-[13px] text-gray-500">
                Inclusive of all taxes
              </div>
            </div>

            {/* Stock status & Dynamic Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-5 pt-2 pb-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isInStock 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isInStock ? `In Stock (${product.stock ?? product.stockQTY ?? 'Available'})` : 'Out of Stock'}
              </span>

              {product.ageGroup && (
                <div className="flex items-center gap-1.5 text-[13px] text-[#0F243E] font-medium bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-lg">
                  <Smile className="w-3.5 h-3.5 text-[#2563EB]" /> Age: {product.ageGroup}
                </div>
              )}
              {product.category && (
                <div className="flex items-center gap-1.5 text-[13px] text-[#0F243E] font-medium bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-lg">
                  <Layers className="w-3.5 h-3.5 text-[#2563EB]" /> {product.category}
                </div>
              )}
              {Array.isArray(product.attributes) && product.attributes.slice(0, 2).map((a, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[13px] text-[#0F243E] font-medium bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-lg">
                  <span className="text-gray-500 font-semibold">{a.attributeName || a.name}:</span>
                  <span className="font-bold">{a.attributeValue || a.value}</span>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <span className="block text-[14px] font-bold text-[#0F243E] mb-2">Quantity</span>
              <div className="flex items-center w-[120px] h-[40px] border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!isInStock}
                  className="w-10 h-full flex items-center justify-center text-[#2563EB] hover:bg-gray-50 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4 font-bold" />
                </button>
                <div className="flex-1 flex items-center justify-center text-[15px] font-bold text-[#0F243E] h-full">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!isInStock}
                  className="w-10 h-full flex items-center justify-center text-[#2563EB] hover:bg-gray-50 disabled:opacity-40"
                >
                  <Plus className="w-4 h-4 font-bold" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-auto pt-2">
              <button 
                onClick={() => addToCart(product, quantity)}
                disabled={!isInStock}
                className={`w-full text-white text-[15px] font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  isInStock
                    ? 'bg-[#F96515] hover:bg-[#EA580C] shadow-lg shadow-orange-500/20 active:scale-[0.98]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button 
                onClick={() => {
                  if (!isInStock) return;
                  addToCart(product, quantity);
                  navigate('/cart');
                }}
                disabled={!isInStock}
                className={`w-full text-[15px] font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  isInStock
                    ? 'bg-white border-2 border-[#2563EB] text-[#2563EB] hover:bg-blue-50 active:scale-[0.98]'
                    : 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="bg-white rounded-xl border border-gray-200 px-4 md:px-8 py-5 mb-6 flex justify-between md:justify-around gap-2 md:gap-6 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left flex-1 md:flex-none">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <div className="text-[11px] md:text-[13px] font-bold text-[#0F243E] leading-tight">100%<br className="md:hidden"/> Genuine</div>
              <div className="text-[12px] text-gray-500 hidden md:block">Authentic products</div>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-10 bg-gray-200"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left flex-1 md:flex-none">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <div className="text-[11px] md:text-[13px] font-bold text-[#0F243E] leading-tight">Secure<br className="md:hidden"/> Payments</div>
              <div className="text-[12px] text-gray-500 hidden md:block">Multiple payment options</div>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-10 bg-gray-200"></div>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left flex-1 md:flex-none">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <div className="text-[11px] md:text-[13px] font-bold text-[#0F243E] leading-tight">Pan-India<br className="md:hidden"/> Delivery</div>
              <div className="text-[12px] text-gray-500 hidden md:block">Across 20,000+ pin codes</div>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200"></div>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left flex-1 md:flex-none">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <div className="text-[11px] md:text-[13px] font-bold text-[#0F243E] leading-tight">Easy<br className="md:hidden"/> Returns</div>
              <div className="text-[12px] text-gray-500 hidden md:block">Hassle-free returns</div>
            </div>
          </div>
        </div>

        {/* Tabs & Content Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          
          {/* Tabs (Desktop Only) */}
          <div className="hidden md:flex overflow-x-auto border-b border-gray-200 px-6 hide-scrollbar">
            {['Product Highlights', 'About this product', 'Specifications', 'Safety Information', 'Customer Reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setOpenAccordion(tab);
                }}
                className={`py-4 px-4 text-[14px] font-bold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab 
                  ? 'border-[#F96515] text-[#0F243E]' 
                  : 'border-transparent text-gray-500 hover:text-[#0F243E]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-start">
            
            {/* Desktop Left: Product Highlights Grid */}
            <div className="hidden md:block w-full md:w-[45%] flex-shrink-0 p-8 border-r border-gray-200">
              <h2 className="text-[18px] font-black text-[#0F243E] mb-6">Product Highlights</h2>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-[#334155]" />
                  </div>
                  <div>
                    <div className="text-[12px] text-gray-500 font-medium mb-0.5">Brand</div>
                    <div className="text-[14px] font-bold text-[#0F243E] uppercase">{product.brand}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                    <Layers className="w-5 h-5 text-[#334155]" />
                  </div>
                  <div>
                    <div className="text-[12px] text-gray-500 font-medium mb-0.5">Category</div>
                    <div className="text-[14px] font-bold text-[#0F243E]">{product.category}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#334155]" />
                  </div>
                  <div>
                    <div className="text-[12px] text-gray-500 font-medium mb-0.5">Recommended Age</div>
                    <div className="text-[14px] font-bold text-[#0F243E]">{product.ageGroup || 'All Ages'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className={`w-5 h-5 ${isInStock ? 'text-emerald-600' : 'text-rose-500'}`} />
                  </div>
                  <div>
                    <div className="text-[12px] text-gray-500 font-medium mb-0.5">Availability</div>
                    <div className={`text-[14px] font-bold ${isInStock ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {isInStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                </div>

                {/* Dynamic Attributes in Highlights */}
                {Array.isArray(product.attributes) && product.attributes.slice(0, 4).map((attr, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                      <Box className="w-5 h-5 text-[#334155]" />
                    </div>
                    <div>
                      <div className="text-[12px] text-gray-500 font-medium mb-0.5">{attr.attributeName || attr.name}</div>
                      <div className="text-[14px] font-bold text-[#0F243E]">{attr.attributeValue || attr.value}</div>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Right / Mobile Accordions */}
            <div className="w-full md:flex-1 flex flex-col p-4 md:p-8 md:pl-12">
              
              {/* Mobile Only: Product Highlights Accordion */}
              <div className="md:hidden border-b border-gray-100 flex flex-col">
                <button 
                  className={`flex items-center justify-between py-4 group ${openAccordion === 'Product Highlights' ? 'border-b-2 border-[#F96515]' : ''}`}
                  onClick={() => setOpenAccordion(openAccordion === 'Product Highlights' ? '' : 'Product Highlights')}
                >
                  <span className="text-[15px] font-bold text-[#0F243E] group-hover:text-[#2563EB] transition-colors">Product Highlights</span>
                  <ChevronDown className={`w-5 h-5 text-[#0F243E] transition-transform ${openAccordion === 'Product Highlights' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'Product Highlights' && (
                  <div className="py-4 grid grid-cols-2 gap-y-6 gap-x-2">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0"><Tag className="w-4 h-4 text-[#334155]" /></div>
                      <div>
                        <div className="text-[11px] text-gray-500 font-medium mb-0.5">Brand</div>
                        <div className="text-[13px] font-bold text-[#0F243E] uppercase">{product.brand}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0"><Layers className="w-4 h-4 text-[#334155]" /></div>
                      <div>
                        <div className="text-[11px] text-gray-500 font-medium mb-0.5">Category</div>
                        <div className="text-[13px] font-bold text-[#0F243E]">{product.category}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0"><User className="w-4 h-4 text-[#334155]" /></div>
                      <div>
                        <div className="text-[11px] text-gray-500 font-medium mb-0.5">Age</div>
                        <div className="text-[13px] font-bold text-[#0F243E]">{product.ageGroup || 'All Ages'}</div>
                      </div>
                    </div>
                    {Array.isArray(product.attributes) && product.attributes.slice(0, 3).map((attr, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0"><Box className="w-4 h-4 text-[#334155]" /></div>
                        <div>
                          <div className="text-[11px] text-gray-500 font-medium mb-0.5">{attr.attributeName || attr.name}</div>
                          <div className="text-[13px] font-bold text-[#0F243E]">{attr.attributeValue || attr.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Always Visible: About this product */}
              <div className="hidden md:block mb-6">
                <h3 className="text-[16px] font-bold text-[#0F243E] mb-2">About this product</h3>
                <p className="text-[14px] leading-[1.6] text-[#475569] whitespace-pre-line">
                  {product.description || product.small_description || `The ${product.brand} ${product.name} is a premium toy that brings joy and fun. With its sleek design, accurate detailing and high-quality finish, this model is a perfect blend of style and craftsmanship.`}
                </p>
              </div>

              {/* Accordion List */}
              <div className="flex flex-col border-t md:border-t-0 border-gray-100">
                {/* Mobile Only: About this product Accordion */}
                <div className="md:hidden border-b border-gray-100">
                  <button 
                    className="flex items-center justify-between w-full py-4 group"
                    onClick={() => setOpenAccordion(openAccordion === 'About this product' ? '' : 'About this product')}
                  >
                    <span className="text-[15px] font-bold text-[#0F243E] group-hover:text-[#2563EB] transition-colors">About this product</span>
                    <ChevronDown className={`w-5 h-5 text-[#0F243E] transition-transform ${openAccordion === 'About this product' ? 'rotate-180' : ''}`} />
                  </button>
                  {openAccordion === 'About this product' && (
                    <div className="pb-4 text-[13px] leading-[1.6] text-[#475569] whitespace-pre-line">
                      {product.description || product.small_description || `The ${product.brand} ${product.name} is a premium toy that brings joy and fun.`}
                    </div>
                  )}
                </div>

                {/* Specifications Accordion (Dynamic from Database) */}
                <div className="border-b border-gray-100">
                  <button 
                    className="flex items-center justify-between w-full py-4 group"
                    onClick={() => setOpenAccordion(openAccordion === 'Specifications' ? '' : 'Specifications')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-[#0F243E] group-hover:text-[#2563EB] transition-colors">Specifications</span>
                      {Array.isArray(product.attributes) && product.attributes.length > 0 && (
                        <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                          {product.attributes.length} specs
                        </span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-[#0F243E] transition-transform ${openAccordion === 'Specifications' ? 'rotate-180' : ''}`} />
                  </button>
                  {openAccordion === 'Specifications' && (
                    <div className="pb-4 text-[13px] leading-[1.6] text-[#475569]">
                      {Array.isArray(product.attributes) && product.attributes.length > 0 ? (
                        <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100 mt-1">
                          {product.attributes.map((attr, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2.5 px-3.5 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                              <span className="font-semibold text-gray-600">{attr.attributeName || attr.name}</span>
                              <span className="font-bold text-[#0F243E]">{attr.attributeValue || attr.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-2 text-gray-500 italic">
                          Standard manufacturer specifications apply for {product.name}.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-100">
                  <button 
                    className="flex items-center justify-between w-full py-4 group"
                    onClick={() => setOpenAccordion(openAccordion === 'Safety Information' ? '' : 'Safety Information')}
                  >
                    <span className="text-[15px] font-bold text-[#0F243E] group-hover:text-[#2563EB] transition-colors">Safety Information</span>
                    <ChevronDown className={`w-5 h-5 text-[#0F243E] transition-transform ${openAccordion === 'Safety Information' ? 'rotate-180' : ''}`} />
                  </button>
                  {openAccordion === 'Safety Information' && (
                    <div className="pb-4 text-[13px] leading-[1.6] text-[#475569]">
                      Choking Hazard: Small parts. Not for children under 3 years.
                    </div>
                  )}
                </div>

                <div className="border-b-0 md:border-b border-gray-100">
                  <button 
                    className="flex items-center justify-between w-full py-4 group"
                    onClick={() => setOpenAccordion(openAccordion === 'Customer Reviews' ? '' : 'Customer Reviews')}
                  >
                    <span className="text-[15px] font-bold text-[#0F243E] group-hover:text-[#2563EB] transition-colors">Customer Reviews ({totalReviews})</span>
                    <ChevronDown className={`w-5 h-5 text-[#0F243E] transition-transform ${openAccordion === 'Customer Reviews' ? 'rotate-180' : ''}`} />
                  </button>
                  {openAccordion === 'Customer Reviews' && (
                    <div className="pb-4 space-y-5">

                      {/* Summary bar */}
                      {totalReviews > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                          <div className="text-3xl font-bold text-[#0F243E]">{avgRating}</div>
                          <div>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-transparent text-gray-300'}`} />
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      )}

                      {/* Existing reviews list */}
                      {reviewsLoading ? (
                        <p className="text-sm text-gray-400 text-center py-4">Loading reviews…</p>
                      ) : reviews.length === 0 ? (
                        <div className="text-center py-6">
                          <MessageSquare className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                          <p className="text-sm text-gray-400">No approved reviews yet. Be the first!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {reviews.map(review => (
                            <div key={review.id} className="border border-gray-100 rounded-xl p-4">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-[#2563EB]" />
                                  </div>
                                  <div>
                                    <p className="text-[13px] font-semibold text-[#0F243E]">
                                      {review.user ? `${review.user.first_name} ${review.user.last_name}` : 'Anonymous'}
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                      {new Date(review.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-0.5 shrink-0">
                                  {[1,2,3,4,5].map(s => (
                                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-transparent text-gray-300'}`} />
                                  ))}
                                </div>
                              </div>
                              {review.comment && (
                                <p className="text-[13px] text-[#475569] leading-relaxed">{review.comment}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Write a Review form */}
                      {!submitMsg?.type !== 'success' && (
                        <div className="border-t border-gray-100 pt-5">
                          <h4 className="text-[14px] font-bold text-[#0F243E] mb-4 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-[#2563EB]" />
                            Write a Review
                          </h4>
                          {submitMsg && (
                            <div className={`text-[13px] px-4 py-3 rounded-xl mb-4 ${submitMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                              {submitMsg.text}
                            </div>
                          )}
                          <form onSubmit={handleSubmitReview} className="space-y-4">
                            {/* Star picker */}
                            <div>
                              <label className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide block mb-2">Your Rating *</label>
                              <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(s => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => setMyRating(s)}
                                    onMouseEnter={() => setHoverRating(s)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform hover:scale-110"
                                  >
                                    <Star className={`w-7 h-7 transition-colors ${s <= (hoverRating || myRating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-transparent text-gray-300'}`} />
                                  </button>
                                ))}
                                {myRating > 0 && (
                                  <span className="ml-2 text-sm text-gray-500">
                                    {['','Poor','Fair','Good','Very Good','Excellent'][myRating]}
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Comment textarea */}
                            <div>
                              <label className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide block mb-2">Your Review (optional)</label>
                              <textarea
                                value={myComment}
                                onChange={e => setMyComment(e.target.value)}
                                placeholder="Share your experience with this product…"
                                rows={3}
                                maxLength={500}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-[#0F243E] placeholder-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 resize-none transition-colors"
                              />
                              <p className="text-right text-[11px] text-gray-400 mt-1">{myComment.length}/500</p>
                            </div>
                            {/* Submit button */}
                            <button
                              type="submit"
                              disabled={submitLoading || !myRating}
                              className="flex items-center gap-2 bg-[#0F243E] hover:bg-[#1a3a60] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors"
                            >
                              {submitLoading ? (
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                              {submitLoading ? 'Submitting…' : 'Submit Review'}
                            </button>
                          </form>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SingleProduct;
