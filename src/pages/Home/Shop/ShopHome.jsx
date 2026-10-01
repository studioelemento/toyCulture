import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingCart,
  Star,
  LayoutGrid,
  List as ListIcon,
  X,
  Search,
  Filter,
  ArrowDownUp
} from 'lucide-react';

const makePlaceholder = (text) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f1f5f9"/><text x="200" y="150" font-family="sans-serif" font-size="20" font-weight="bold" fill="#64748b" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const products = [
  {
    id: 1,
    name: 'Lamborghini Huracán LP 610-4',
    brand: 'Maisto',
    price: 2399,
    originalPrice: 2999,
    discount: '20%',
    rating: 4.8,
    reviews: 124,
    image: '/lamborghini.jpg',
    badge: 'discount'
  },
  {
    id: 2,
    name: 'City Space Base and Rocket Launch Pad',
    brand: 'LEGO',
    price: 5599,
    originalPrice: null,
    discount: null,
    rating: 4.7,
    reviews: 96,
    image: '/lego.jpg',
    badge: 'new'
  },
  {
    id: 3,
    name: 'Elite 2.0 Commander RD-6 Blaster',
    brand: 'NERF',
    price: 1299,
    originalPrice: null,
    discount: null,
    rating: 4.7,
    reviews: 78,
    image: '/nerf.jpg',
    badge: null
  },
  {
    id: 4,
    name: 'Teddy Bear (50 cm)',
    brand: 'Hamleys',
    price: 1699,
    originalPrice: 1999,
    discount: '15%',
    rating: 4.9,
    reviews: 210,
    image: '/teddy.jpg',
    badge: 'discount'
  },
  {
    id: 5,
    name: 'Ferrari SF23 1:18 Scale',
    brand: 'Bburago',
    price: 4299,
    originalPrice: null,
    discount: null,
    rating: 4.8,
    reviews: 112,
    image: '/ferrari.jpg',
    badge: 'bestseller'
  },
  {
    id: 6,
    name: 'Mechanical Marble Run',
    brand: 'Smartivity',
    price: 2499,
    originalPrice: null,
    discount: null,
    rating: 4.6,
    reviews: 64,
    image: '/marble.jpg',
    badge: 'new'
  },
  {
    id: 7,
    name: 'Junior Ring Stacker',
    brand: 'Funskool',
    price: 599,
    originalPrice: 849,
    discount: '30%',
    rating: 4.5,
    reviews: 93,
    image: '/stacker.jpg',
    badge: 'discount'
  },
  {
    id: 8,
    name: 'Creative Tub (20 Pieces)',
    brand: 'Play-Doh',
    price: 899,
    originalPrice: null,
    discount: null,
    rating: 4.7,
    reviews: 128,
    image: '/playdoh.jpg',
    badge: 'new'
  }
];

const categories = [
  { name: 'All Toys', count: 428, checked: true },
  { name: 'Diecast Toys', count: 312, checked: false },
  { name: 'Construction Toys', count: 210, checked: false },
  { name: 'Puzzles', count: 186, checked: false },
  { name: 'Role Play', count: 298, checked: false },
  { name: 'STEM & DIY', count: 243, checked: false },
  { name: 'Arts & Crafts', count: 190, checked: false },
];

const ageGroups = [
  { name: '0 - 2 Years', count: 312, checked: false },
  { name: '3 - 5 Years', count: 642, checked: false },
  { name: '6 - 8 Years', count: 728, checked: true },
  { name: '9 - 12 Years', count: 489, checked: false },
  { name: '13+ Years', count: 177, checked: false },
];

const brands = [
  { name: 'Maisto', count: 428, checked: true },
  { name: 'Bburago', count: 312, checked: false },
  { name: 'LEGO', count: 210, checked: false },
  { name: 'Funskool', count: 164, checked: false },
  { name: 'Hasbro', count: 142, checked: false },
];

const ShopHome = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isAgeOpen, setIsAgeOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen pb-12 font-sans">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-4 pb-2">
        <div className="flex items-center text-[13px] text-gray-500 gap-1.5">
          <Link to="/" className="hover:text-gray-800 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-medium">Shop</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 md:mb-6">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-black text-[#0F243E] leading-tight">All Toys</h1>
            <p className="text-gray-500 text-[15px] mt-1">2,348 products</p>
          </div>

          {/* Mobile Filter & Sort Buttons */}
          <div className="grid grid-cols-2 gap-3 md:hidden mt-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg py-2.5 text-[#0F243E] font-bold shadow-sm active:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
              onClick={() => setIsMobileSortOpen(true)}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg py-2.5 text-[#0F243E] font-bold shadow-sm active:bg-gray-50"
            >
              <ArrowDownUp className="w-4 h-4" />
              Sort
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-[14px]">Sort by</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-10 text-[14px] font-medium text-gray-800 outline-none focus:border-gray-300">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>New Arrivals</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden">
              <button className="p-2.5 bg-[#F96515] text-white">
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-gray-500 hover:bg-gray-50 transition-colors">
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h2 className="text-[18px] font-bold text-[#0F243E]">Filters</h2>
                <button className="text-[#F96515] text-[13px] font-bold hover:underline">Clear All</button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center justify-between w-full text-left mb-3 group"
                >
                  <span className="font-bold text-[#0F243E]">Categories</span>
                  {isCategoryOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
                {isCategoryOpen && (
                  <div className="space-y-2">
                    {categories.map((cat, idx) => (
                      <label key={idx} className={`flex items-center justify-between cursor-pointer group ${cat.checked ? 'bg-[#FFF1EB] -mx-2 px-2 py-1 rounded-md' : 'py-1'}`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            defaultChecked={cat.checked}
                            className="w-4 h-4 rounded border-gray-300 text-[#F96515] focus:ring-[#F96515] focus:ring-offset-0 cursor-pointer"
                          />
                          <span className={`text-[14px] ${cat.checked ? 'text-[#F96515] font-semibold' : 'text-gray-600 group-hover:text-gray-800'}`}>{cat.name}</span>
                        </div>
                        <span className="text-[13px] text-gray-400">({cat.count})</span>
                      </label>
                    ))}
                    <button className="text-[13px] text-gray-500 font-medium hover:text-[#F96515] mt-1">Show more</button>
                  </div>
                )}
              </div>

              {/* Age */}
              <div className="mb-6 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setIsAgeOpen(!isAgeOpen)}
                  className="flex items-center justify-between w-full text-left mb-3 group"
                >
                  <span className="font-bold text-[#0F243E]">Age</span>
                  {isAgeOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
                {isAgeOpen && (
                  <div className="space-y-2">
                    {ageGroups.map((age, idx) => (
                      <label key={idx} className="flex items-center justify-between cursor-pointer group py-1">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            defaultChecked={age.checked}
                            className="w-4 h-4 rounded border-gray-300 text-[#F96515] focus:ring-[#F96515] focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="text-[14px] text-gray-600 group-hover:text-gray-800">{age.name}</span>
                        </div>
                        <span className="text-[13px] text-gray-400">({age.count})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mb-6 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                  className="flex items-center justify-between w-full text-left mb-3 group"
                >
                  <span className="font-bold text-[#0F243E]">Price</span>
                  {isPriceOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
                {isPriceOpen && (
                  <div className="space-y-4">
                    {/* Fake Slider Range */}
                    <div className="px-1 mt-2">
                      <div className="relative w-full h-1 bg-gray-200 rounded-full">
                        <div className="absolute left-0 right-[40%] top-0 bottom-0 bg-[#F96515] rounded-full"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F96515] border-2 border-white rounded-full shadow cursor-pointer"></div>
                        <div className="absolute right-[40%] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F96515] border-2 border-white rounded-full shadow cursor-pointer"></div>
                      </div>
                      <div className="text-[13px] text-gray-500 font-medium mt-3">₹0 - ₹5,000+</div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { name: 'Under ₹500', count: 620, checked: false },
                        { name: '₹500 - ₹1,000', count: 842, checked: false },
                        { name: '₹1,000 - ₹2,000', count: 564, checked: true },
                        { name: '₹2,000 - ₹5,000', count: 298, checked: false },
                        { name: '₹5,000+', count: 24, checked: false }
                      ].map((price, idx) => (
                        <label key={idx} className="flex items-center justify-between cursor-pointer group py-1">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              defaultChecked={price.checked}
                              className="w-4 h-4 rounded border-gray-300 text-[#F96515] focus:ring-[#F96515] focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-[14px] text-gray-600 group-hover:text-gray-800">{price.name}</span>
                          </div>
                          <span className="text-[13px] text-gray-400">({price.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Brand */}
              <div className="mb-2 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setIsBrandOpen(!isBrandOpen)}
                  className="flex items-center justify-between w-full text-left mb-3 group"
                >
                  <span className="font-bold text-[#0F243E]">Brand</span>
                  {isBrandOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
                {isBrandOpen && (
                  <div>
                    <div className="relative mb-3">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search brands..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-9 pr-3 text-[13px] outline-none focus:border-gray-300 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      {brands.map((brand, idx) => (
                        <label key={idx} className="flex items-center justify-between cursor-pointer group py-1">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              defaultChecked={brand.checked}
                              className="w-4 h-4 rounded border-gray-300 text-[#F96515] focus:ring-[#F96515] focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-[14px] text-gray-600 group-hover:text-gray-800">{brand.name}</span>
                          </div>
                          <span className="text-[13px] text-gray-400">({brand.count})</span>
                        </label>
                      ))}
                      <button className="text-[13px] text-gray-500 font-medium hover:text-[#F96515] mt-1">Show more</button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">

            {/* Active Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[14px] font-medium text-gray-600 mr-1">Active Filters:</span>
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm text-[13px] font-medium text-gray-700">
                  6 - 8 Years
                  <button className="text-gray-400 hover:text-gray-700 ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm text-[13px] font-medium text-gray-700">
                  Maisto
                  <button className="text-gray-400 hover:text-gray-700 ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm text-[13px] font-medium text-gray-700">
                  Under ₹2,000
                  <button className="text-gray-400 hover:text-gray-700 ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button className="text-[#F96515] text-[13px] font-bold hover:underline ml-2">Clear All</button>
              </div>
              <div className="text-[14px] text-gray-500">
                Showing 1 – 16 of 2,348 products
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all group flex flex-col h-full">

                  {/* Image & Badges */}
                  <div className="relative aspect-square mb-3 md:mb-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-3 md:p-4">
                    {/* Badge */}
                    {product.badge === 'discount' && (
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#F96515] text-white text-[10px] md:text-[11px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md z-10">
                        -{product.discount}
                      </div>
                    )}
                    {product.badge === 'new' && (
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#10B981] text-white text-[10px] md:text-[11px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md z-10">
                        New
                      </div>
                    )}
                    {product.badge === 'bestseller' && (
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#3B82F6] text-white text-[10px] md:text-[11px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md z-10">
                        Bestseller
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button className="absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 transition-colors z-10">
                      <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1">
                    <div className="text-[10px] md:text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">{product.brand}</div>
                    <h3 className="text-[13px] md:text-[15px] font-bold text-[#0F243E] leading-tight mb-1.5 md:mb-2 line-clamp-2 min-h-[36px] md:min-h-[40px]">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-2 md:mb-3">
                      <div className="flex items-center text-[#FBBF24]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 md:w-3.5 md:h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-transparent stroke-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-[11px] md:text-[12px] font-bold text-gray-600 ml-0.5 md:ml-1">{product.rating}</span>
                      <span className="text-[11px] md:text-[12px] text-gray-400">({product.reviews})</span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-end gap-1.5 md:gap-2 mb-3 md:mb-4">
                        <span className="text-[16px] md:text-[20px] font-black text-[#0F243E]">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-[12px] md:text-[14px] text-gray-400 line-through mb-0.5 md:mb-1">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>

                      <button className="w-full bg-[#F96515] hover:bg-[#EA580C] active:scale-[0.98] text-white text-[12px] md:text-[14px] font-bold py-2 md:py-2.5 rounded-lg flex items-center justify-center gap-1.5 md:gap-2 transition-all shadow-[0_4px_12px_rgba(249,101,21,0.2)]">
                        <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 mt-8 md:mt-10">
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 rotate-180" />
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-[#F96515] text-white text-[14px] md:text-base font-bold shadow-sm">
                1
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 text-[14px] md:text-base font-medium hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 text-[14px] md:text-base font-medium hover:bg-gray-50 transition-colors">
                3
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                4
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                5
              </button>
              <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                147
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0F243E]/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          ></div>

          {/* Bottom Sheet */}
          <div className="relative bg-white w-full h-[85vh] rounded-t-3xl flex flex-col overflow-hidden shadow-2xl translate-y-0 transition-transform duration-300">
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-5 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-[22px] font-black text-[#0F243E] leading-none mb-1">Filter</h2>
                <p className="text-[13px] text-gray-500 font-medium">2,348 products</p>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-[#0F243E] hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-1 overflow-y-auto px-5 pb-[100px] pt-2">
              {/* Categories */}
              <div className="py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold text-[#0F243E]">Categories</h3>
                  <ChevronDown className="w-5 h-5 text-[#0F243E]" />
                </div>
                <div className="space-y-3">
                  {categories.map((cat, idx) => (
                    <label key={idx} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            defaultChecked={cat.checked}
                            className="w-5 h-5 rounded-[4px] border-gray-300 text-[#F96515] focus:ring-0 cursor-pointer peer appearance-none checked:bg-[#F96515] checked:border-[#F96515] bg-white border-[1.5px]"
                          />
                          <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-[15px] text-[#0F243E] font-medium">{cat.name}</span>
                      </div>
                      <span className="text-[14px] text-gray-400">({cat.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div className="py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold text-[#0F243E]">Age</h3>
                  <ChevronDown className="w-5 h-5 text-[#0F243E]" />
                </div>
                <div className="space-y-3">
                  {ageGroups.map((age, idx) => (
                    <label key={idx} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            defaultChecked={age.checked}
                            className="w-5 h-5 rounded-[4px] border-gray-300 text-[#F96515] focus:ring-0 cursor-pointer peer appearance-none checked:bg-[#F96515] checked:border-[#F96515] bg-white border-[1.5px]"
                          />
                          <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-[15px] text-[#0F243E] font-medium">{age.name}</span>
                      </div>
                      <span className="text-[14px] text-gray-400">({age.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold text-[#0F243E]">Price</h3>
                  <ChevronDown className="w-5 h-5 text-[#0F243E]" />
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Under ₹500', count: 620, checked: false },
                    { name: '₹500 - ₹1,000', count: 842, checked: false },
                    { name: '₹1,000 - ₹2,000', count: 564, checked: true },
                    { name: '₹2,000 - ₹5,000', count: 298, checked: false },
                    { name: '₹5,000+', count: 24, checked: false }
                  ].map((price, idx) => (
                    <label key={idx} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="mobile_price"
                            defaultChecked={price.checked}
                            className="w-5 h-5 rounded-full border-gray-300 text-[#F96515] focus:ring-0 cursor-pointer peer appearance-none checked:border-[#F96515] checked:border-2 bg-white border-[1.5px]"
                          />
                          <div className="absolute w-2.5 h-2.5 bg-[#F96515] rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                        </div>
                        <span className="text-[15px] text-[#0F243E] font-medium">{price.name}</span>
                      </div>
                      <span className="text-[14px] text-gray-400">({price.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 border border-gray-200 rounded-xl py-3.5 text-[#0F243E] font-bold text-[15px] hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-[1.5] bg-[#F96515] rounded-xl py-2 flex flex-col items-center justify-center text-white active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(249,101,21,0.25)]"
              >
                <span className="font-bold text-[15px] leading-tight">Apply Filters</span>
                <span className="text-[11px] font-medium text-white/90 leading-tight">(2,348 products)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Modal */}
      {isMobileSortOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0F243E]/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsMobileSortOpen(false)}
          ></div>

          {/* Bottom Sheet */}
          <div className="relative bg-white w-full rounded-t-3xl flex flex-col overflow-hidden shadow-2xl translate-y-0 transition-transform duration-300 max-h-[90vh]">
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-gray-100">
              <h2 className="text-[22px] font-black text-[#0F243E] leading-none">Sort by</h2>
              <button
                onClick={() => setIsMobileSortOpen(false)}
                className="p-1 text-[#0F243E] hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Sort Options */}
            <div className="flex-1 overflow-y-auto px-5 pb-24 pt-2">
              <div className="flex flex-col">
                {[
                  { id: 'recommended', title: 'Recommended', subtitle: 'Our top picks for you', checked: true },
                  { id: 'popularity', title: 'Popularity', subtitle: 'Most popular products', checked: false },
                  { id: 'newest', title: 'Newest First', subtitle: 'Latest arrivals', checked: false },
                  { id: 'price_asc', title: 'Price: Low to High', subtitle: 'Lowest to highest price', checked: false },
                  { id: 'price_desc', title: 'Price: High to Low', subtitle: 'Highest to lowest price', checked: false },
                  { id: 'discount', title: 'Discount', subtitle: 'Highest discount first', checked: false },
                  { id: 'rating', title: 'Customer Rating', subtitle: 'Highest rated products', checked: false }
                ].map((option, idx) => (
                  <label key={idx} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 cursor-pointer group">
                    <div className="relative flex items-center justify-center flex-shrink-0">
                      <input
                        type="radio"
                        name="mobile_sort"
                        defaultChecked={option.checked}
                        className="w-[22px] h-[22px] rounded-full border-gray-300 text-[#F96515] focus:ring-0 cursor-pointer peer appearance-none checked:border-[#F96515] checked:border-2 bg-white border-2"
                      />
                      <div className="absolute w-2.5 h-2.5 bg-[#F96515] rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[15px] font-medium ${option.checked ? 'text-[#0F243E]' : 'text-[#0F243E]'}`}>{option.title}</span>
                      <span className="text-[13.5px] text-gray-500">{option.subtitle}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 flex shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
              <button
                onClick={() => setIsMobileSortOpen(false)}
                className="w-full bg-[#F96515] rounded-xl py-3.5 flex items-center justify-center text-white active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(249,101,21,0.25)] font-bold text-[16px]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopHome;
