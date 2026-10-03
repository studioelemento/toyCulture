import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingCart, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';

const CartPage = () => {
  const cartItems = [
    {
      id: 1,
      name: "Lamborghini Huracán LP 610-4",
      brand: "Maisto",
      price: 2399,
      originalPrice: 2999,
      discount: "20% OFF",
      quantity: 1,
      image: "/lamborghini.jpg",
      specs: ["Scale 1:18", "Die-cast Metal"]
    },
    {
      id: 2,
      name: "JCB Backhoe Loader - 1:50 Scale",
      brand: "Bruder",
      price: 3199,
      originalPrice: null,
      quantity: 1,
      image: "/lego.jpg",
      specs: ["Scale 1:50", "Die-cast Metal"]
    },
    {
      id: 3,
      name: "5 Car Gift Pack",
      brand: "Hot Wheels",
      price: 999,
      originalPrice: null,
      quantity: 1,
      image: "/ferrari.jpg",
      specs: ["5 Mini Cars", "Metal & Plastic"]
    }
  ];

  const suggestedProducts = [
    {
      id: 4,
      name: "Porsche 911 GT3",
      brand: "Maisto",
      price: 2199,
      originalPrice: 2799,
      discount: "20% OFF",
      image: "/ferrari.jpg"
    },
    {
      id: 5,
      name: "Fire Engine with Ladder",
      brand: "Bruder",
      price: 3499,
      originalPrice: null,
      image: "/lego.jpg"
    },
    {
      id: 6,
      name: "10 Car Pack",
      brand: "Hot Wheels",
      price: 1499,
      originalPrice: null,
      image: "/playdoh.jpg"
    },
    {
      id: 7,
      name: "John Deere Tractor",
      brand: "Siku",
      price: 2299,
      originalPrice: null,
      image: "/stacker.jpg"
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">Your Cart</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <h1 className="text-[22px] sm:text-3xl font-black text-[#0F243E] tracking-tight">Your Cart ({cartItems.length})</h1>
          <Link to="/" className="text-blue-700 hover:text-blue-800 font-semibold flex items-center mt-4 sm:mt-0 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden border border-gray-100">
              
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-5 border-b border-gray-100 text-sm font-semibold text-gray-500 bg-gray-50/50">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:items-center hover:bg-gray-50/30 transition-colors">
                    {/* Product Info */}
                    <div className="col-span-1 sm:col-span-6 flex gap-4 sm:gap-5 w-full">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-white rounded-xl overflow-hidden flex items-center justify-center p-2 border border-gray-100 shadow-sm">
                        <img src={item.image} alt={item.name} className="object-contain w-full h-full" />
                      </div>
                      <div className="flex flex-col flex-1 w-full relative">
                        {/* Mobile Top Row */}
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[13px] sm:text-xs text-[#64748b] sm:text-blue-600 font-medium sm:font-semibold tracking-wide sm:tracking-wider sm:uppercase">{item.brand}</span>
                          <button className="sm:hidden text-[#64748b] hover:text-red-500 transition-colors p-1 -mr-1 -mt-1">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <h3 className="text-[#0F243E] sm:text-gray-900 font-bold text-[14px] sm:text-[15px] leading-tight mb-2 sm:mb-2.5 pr-4 sm:pr-0">{item.name}</h3>
                        
                        {item.specs && (
                          <div className="hidden sm:block text-xs text-gray-500 space-y-1.5">
                            {item.specs.map((spec, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100">
                                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15 10L23 12L15 14L12 22L9 14L1 12L9 10L12 2Z"/></svg>
                                </span> 
                                <span className="font-medium">{spec}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Mobile Price Row */}
                        <div className="flex items-center gap-2 sm:hidden mb-3">
                          <span className="font-bold text-[#0F243E] text-[16px]">₹{item.price.toLocaleString('en-IN')}</span>
                          {item.originalPrice && (
                            <span className="text-[12px] text-[#94a3b8] line-through font-medium">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                          )}
                          {item.discount && (
                            <span className="text-[10px] text-[#ef4444] bg-red-50 px-1.5 py-0.5 rounded font-bold">{item.discount}</span>
                          )}
                        </div>

                        {/* Mobile Quantity & Total Row */}
                        <div className="flex items-center justify-between sm:hidden mt-auto pt-1">
                          <div className="flex items-center border border-blue-100 rounded-lg bg-white overflow-hidden h-9">
                            <button className="w-9 h-full flex items-center justify-center text-[#0F243E] hover:bg-gray-50 transition-colors"><Minus className="w-4 h-4" /></button>
                            <span className="w-8 text-center font-bold text-[#0F243E] text-[14px]">{item.quantity}</span>
                            <button className="w-9 h-full flex items-center justify-center text-[#0F243E] hover:bg-gray-50 transition-colors"><Plus className="w-4 h-4" /></button>
                          </div>
                          <div className="font-bold text-[#0F243E] text-[16px]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Price (Desktop) */}
                    <div className="hidden sm:flex col-span-2 flex-col items-center justify-center">
                      <div className="font-bold text-gray-900 text-base">₹{item.price.toLocaleString('en-IN')}</div>
                      {item.originalPrice && (
                        <div className="text-sm text-gray-400 line-through mt-0.5 font-medium">₹{item.originalPrice.toLocaleString('en-IN')}</div>
                      )}
                      {item.discount && (
                        <div className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full mt-1.5 font-bold tracking-wide border border-red-100">{item.discount}</div>
                      )}
                    </div>

                    {/* Quantity (Desktop) */}
                    <div className="hidden sm:flex col-span-2 items-center justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Minus className="w-4 h-4" /></button>
                        <span className="w-10 text-center font-bold text-gray-800 text-sm">{item.quantity}</span>
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>

                    {/* Total & Delete (Desktop) */}
                    <div className="hidden sm:flex col-span-2 items-center justify-end gap-5">
                       <div className="font-bold text-gray-900 text-lg">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                       </div>
                       <button className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all" title="Remove item">
                         <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 mb-12 flex justify-start">
               <Link to="/" className="text-blue-700 hover:text-blue-800 font-semibold flex items-center transition-colors">
                 <ArrowLeft className="w-4 h-4 mr-1.5" />
                 Continue Shopping
               </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-[#f8fafc] sm:bg-white rounded-2xl sm:shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] sm:border border-gray-100 p-5 sm:p-6 lg:p-7 sticky top-6 mt-2 sm:mt-0">
              <h2 className="text-xl font-bold text-[#0F243E] mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-[15px] mb-6 border-b border-gray-200/60 pb-6">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Subtotal ({cartItems.length} items)</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600 items-center">
                  <span className="flex items-center gap-1.5 font-medium">
                    Shipping 
                    <span className="w-3.5 h-3.5 border border-gray-300 rounded-full text-[9px] flex items-center justify-center text-gray-400 cursor-help" title="Shipping costs will be calculated at checkout">i</span>
                  </span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-7">
                <div className="flex flex-col">
                   <span className="text-lg font-bold text-gray-900">Total</span>
                   <span className="text-xs text-gray-500 font-medium">(incl. of all taxes)</span>
                </div>
                <span className="text-3xl font-black text-[#1e293b]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <Link to="/checkout" className="w-full bg-[#ff5a00] hover:bg-[#e65200] text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mb-8 shadow-[0_4px_14px_0_rgba(255,90,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,90,0,0.23)] hover:-translate-y-0.5">
                <ShoppingCart className="w-5 h-5" />
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>

              <div className="space-y-5">
                <div className="flex gap-3.5 items-start">
                   <div className="w-10 h-10 rounded-full bg-blue-50/80 text-blue-700 flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                     <ShieldCheck className="w-5 h-5" />
                   </div>
                   <div className="pt-0.5">
                     <h4 className="font-bold text-[14px] text-gray-900">100% Genuine Products</h4>
                     <p className="text-[13px] text-gray-500 mt-0.5 font-medium">Authentic and original toys</p>
                   </div>
                </div>
                <div className="flex gap-3.5 items-start">
                   <div className="w-10 h-10 rounded-full bg-blue-50/80 text-blue-700 flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                     <CreditCard className="w-5 h-5" />
                   </div>
                   <div className="pt-0.5">
                     <h4 className="font-bold text-[14px] text-gray-900">Secure Payments</h4>
                     <p className="text-[13px] text-gray-500 mt-0.5 font-medium">Multiple payment options</p>
                   </div>
                </div>
                <div className="flex gap-3.5 items-start">
                   <div className="w-10 h-10 rounded-full bg-blue-50/80 text-blue-700 flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                     <Truck className="w-5 h-5" />
                   </div>
                   <div className="pt-0.5">
                     <h4 className="font-bold text-[14px] text-gray-900">Pan-India Delivery</h4>
                     <p className="text-[13px] text-gray-500 mt-0.5 font-medium">Across 20,000+ pin codes</p>
                   </div>
                </div>
                <div className="flex gap-3.5 items-start">
                   <div className="w-10 h-10 rounded-full bg-blue-50/80 text-blue-700 flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                     <RefreshCw className="w-5 h-5" />
                   </div>
                   <div className="pt-0.5">
                     <h4 className="font-bold text-[14px] text-gray-900">Easy Returns</h4>
                     <p className="text-[13px] text-gray-500 mt-0.5 font-medium">Hassle-free returns</p>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* You may also like */}
        <div className="mt-20">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">You may also like</h2>
            <Link to="/" className="text-blue-700 hover:text-blue-800 font-bold text-sm flex items-center transition-colors mb-1">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-4 flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="h-44 bg-white rounded-xl mb-4 flex items-center justify-center overflow-hidden p-4 border border-gray-50 group-hover:bg-gray-50/50 transition-colors">
                  <img src={product.image} alt={product.name} className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out" />
                </div>
                <div className="flex-1 flex flex-col px-1">
                   <span className="text-xs text-blue-600 font-bold tracking-wider uppercase mb-1.5">{product.brand}</span>
                   <h3 className="text-gray-900 font-bold text-[15px] leading-snug mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">{product.name}</h3>
                   <div className="mt-auto flex justify-between items-end pb-1">
                      <div>
                        <div className="font-black text-gray-900 text-lg">₹{product.price.toLocaleString('en-IN')}</div>
                        {product.originalPrice && (
                          <div className="text-xs text-gray-400 line-through mt-0.5 font-medium">₹{product.originalPrice.toLocaleString('en-IN')}</div>
                        )}
                        {product.discount && (
                          <div className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md mt-1 font-bold inline-block border border-red-100">{product.discount}</div>
                        )}
                      </div>
                      <button className="w-10 h-10 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 shadow-sm" title="Add to cart">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
