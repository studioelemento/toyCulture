import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronRight, Heart, Star, CheckCircle2, Minus, Plus, ShoppingCart, Zap, 
  ShieldCheck, CreditCard, Truck, RotateCcw, ChevronDown, Smile, Layers, Car,
  Tag, Ruler, User
} from 'lucide-react';
import { products } from './ShopHome';

const SingleProduct = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Product Highlights');
  const [openAccordion, setOpenAccordion] = useState('Product Highlights');

  const product = products.find(p => p.id.toString() === id) || products[0];

  const images = [
    product.image,
    product.image,
    product.image,
    product.image,
    product.image
  ];

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
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-[20px] text-gray-400 line-through font-medium">
                    ₹{product.originalPrice.toLocaleString()}
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
                  You save ₹{(product.originalPrice - product.price).toLocaleString()}
                </div>
              )}
              <div className="text-[13px] text-gray-500">
                Inclusive of all taxes
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-4 mb-6 pt-2 pb-1">
              <div className="flex items-center gap-1.5 text-[13px] text-[#0F243E] font-medium">
                <Smile className="w-4 h-4 text-[#0F243E]" /> Age 8+ Years
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-[#0F243E] font-medium">
                <Layers className="w-4 h-4 text-[#0F243E]" /> Die-cast Metal
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-[#0F243E] font-medium">
                <Car className="w-4 h-4 text-[#0F243E]" /> Sports Car
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <span className="block text-[14px] font-bold text-[#0F243E] mb-2">Quantity</span>
              <div className="flex items-center w-[120px] h-[40px] border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-[#2563EB] hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4 font-bold" />
                </button>
                <div className="flex-1 flex items-center justify-center text-[15px] font-bold text-[#0F243E] h-full">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-[#2563EB] hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4 font-bold" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-auto pt-2">
              <button className="w-full bg-[#F96515] hover:bg-[#EA580C] text-white text-[15px] font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="w-full bg-white border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 text-[15px] font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all">
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
                onClick={() => setActiveTab(tab)}
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
            <div className="hidden md:block w-full md:w-[45%] flex-shrink-0 p-8">
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
                    <Ruler className="w-5 h-5 text-[#334155]" />
                  </div>
                  <div>
                    <div className="text-[12px] text-gray-500 font-medium mb-0.5">Scale</div>
                    <div className="text-[14px] font-bold text-[#0F243E]">1:18</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#334155]" />
                  </div>
                  <div>
                    <div className="text-[12px] text-gray-500 font-medium mb-0.5">Age</div>
                    <div className="text-[14px] font-bold text-[#0F243E]">8+ Years</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-[#334155]" />
                  </div>
                  <div>
                    <div className="text-[12px] text-gray-500 font-medium mb-0.5">Vehicle Type</div>
                    <div className="text-[14px] font-bold text-[#0F243E]">Sports Car</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                    <Layers className="w-5 h-5 text-[#334155]" />
                  </div>
                  <div>
                    <div className="text-[12px] text-gray-500 font-medium mb-0.5">Material</div>
                    <div className="text-[14px] font-bold text-[#0F243E]">Die-cast Metal</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-[#334155]" />
                  </div>
                  <div>
                    <div className="text-[12px] text-gray-500 font-medium mb-0.5">Recommended For</div>
                    <div className="text-[14px] font-bold text-[#0F243E]">Collectors</div>
                  </div>
                </div>

              </div>
            </div>

            <div className="hidden md:block w-px min-h-[300px] bg-gray-200 self-stretch"></div>

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
                      <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0"><Ruler className="w-4 h-4 text-[#334155]" /></div>
                      <div>
                        <div className="text-[11px] text-gray-500 font-medium mb-0.5">Scale</div>
                        <div className="text-[13px] font-bold text-[#0F243E]">1:18</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0"><User className="w-4 h-4 text-[#334155]" /></div>
                      <div>
                        <div className="text-[11px] text-gray-500 font-medium mb-0.5">Age</div>
                        <div className="text-[13px] font-bold text-[#0F243E]">8+ Years</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0"><Layers className="w-4 h-4 text-[#334155]" /></div>
                      <div>
                        <div className="text-[11px] text-gray-500 font-medium mb-0.5">Material</div>
                        <div className="text-[13px] font-bold text-[#0F243E]">Die-cast Metal</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Always Visible: About this product */}
              <div className="hidden md:block mb-6">
                <h3 className="text-[16px] font-bold text-[#0F243E] mb-2">About this product</h3>
                <p className="text-[14px] leading-[1.6] text-[#475569]">
                  The {product.brand} {product.name} is a premium toy that brings joy and fun. With its sleek design, accurate detailing and high-quality finish, this model is a perfect blend of style and craftsmanship. Ideal for kids, it offers a realistic and engaging play experience.
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
                    <div className="pb-4 text-[13px] leading-[1.6] text-[#475569]">
                      The {product.brand} {product.name} is a premium toy that brings joy and fun. With its sleek design, accurate detailing and high-quality finish, this model is a perfect blend of style and craftsmanship. Ideal for kids, it offers a realistic and engaging play experience.
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-100">
                  <button 
                    className="flex items-center justify-between w-full py-4 group"
                    onClick={() => setOpenAccordion(openAccordion === 'Specifications' ? '' : 'Specifications')}
                  >
                    <span className="text-[15px] font-bold text-[#0F243E] group-hover:text-[#2563EB] transition-colors">Specifications</span>
                    <ChevronDown className={`w-5 h-5 text-[#0F243E] transition-transform ${openAccordion === 'Specifications' ? 'rotate-180' : ''}`} />
                  </button>
                  {openAccordion === 'Specifications' && (
                    <div className="pb-4 text-[13px] leading-[1.6] text-[#475569]">
                      Dimensions: 10 x 5 x 4 inches<br />Weight: 1.2 lbs<br />Batteries: Not required
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
                    <span className="text-[15px] font-bold text-[#0F243E] group-hover:text-[#2563EB] transition-colors">Customer Reviews ({product.reviews})</span>
                    <ChevronDown className={`w-5 h-5 text-[#0F243E] transition-transform ${openAccordion === 'Customer Reviews' ? 'rotate-180' : ''}`} />
                  </button>
                  {openAccordion === 'Customer Reviews' && (
                    <div className="pb-4 text-[13px] leading-[1.6] text-[#475569]">
                      "Great product! My son loves it." - Verified Buyer
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
