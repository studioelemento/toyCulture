import React, { useState } from 'react';
import { ShieldCheck, Lock, Smartphone, X, ShoppingCart, Heart, Package, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle OTP sending logic
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa] md:bg-white relative">
            
            {/* Close / Back to Store button (Desktop Only) */}
            <Link 
                to="/" 
                className="hidden md:flex absolute top-5 right-5 z-30 p-2.5 rounded-full text-gray-400 hover:text-[#0A1930] hover:bg-gray-100/80 transition-all cursor-pointer"
                title="Back to store"
                aria-label="Close and return to store"
            >
                <X size={22} strokeWidth={2.2} />
            </Link>

            {/* Left Banner Panel (Desktop) */}
            <div className="hidden md:flex md:w-1/2 h-screen sticky top-0 bg-[#fcfbfa] items-center justify-start overflow-hidden select-none">
                <img 
                    src="/login-banner.png" 
                    alt="A World of Play Awaits - ToyCulture" 
                    className="h-full w-auto max-h-screen object-contain object-left"
                />
            </div>

            {/* Mobile Header Banner (Mobile Only) */}
            <div className="md:hidden w-full h-[200px] xs:h-[220px] sm:h-[250px] relative overflow-hidden bg-[#faf9f6]">
                <img 
                    src="/mobile-login-header.png" 
                    alt="ToyCulture Toys" 
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Right Panel / Mobile Main Card */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center relative overflow-hidden bg-white rounded-t-[32px] md:rounded-none -mt-5 md:mt-0 z-10 px-6 pt-7 pb-10 sm:px-10 md:p-12 lg:p-16 min-h-[calc(100vh-180px)] md:min-h-screen shadow-[0_-10px_35px_rgba(0,0,0,0.06)] md:shadow-none">
                
                {/* Decorative peach corner blob (Desktop Only) */}
                <div className="hidden md:block absolute -top-16 -right-16 w-44 h-44 md:w-56 md:h-56 bg-[#fde9d2] rounded-full pointer-events-none opacity-90 z-0"></div>

                <div className="w-full max-w-[420px] mx-auto relative z-10 flex flex-col justify-center">

                    <h1 className="text-[26px] sm:text-[28px] md:text-[34px] font-black text-[#0A1930] leading-tight mb-2 tracking-tight">
                        Login to ToyCulture
                    </h1>
                    <p className="text-[14px] md:text-[15px] text-[#475569] mb-6 md:mb-8 leading-relaxed">
                        Enter your mobile number to receive a one-time password (OTP)
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[13px] md:text-[14px] font-bold text-[#0A1930]">
                                Mobile Number
                            </label>
                            <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:border-[#F96515] focus-within:ring-2 focus-within:ring-[#F96515]/20 transition-all bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                <div className="bg-[#f8fafc] text-[#0A1930] font-bold px-4 py-3 md:py-3.5 flex items-center justify-center border-r border-gray-200 text-[15px] select-none">
                                    +91
                                </div>
                                <input
                                    type="tel"
                                    maxLength={10}
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Enter your mobile number"
                                    className="flex-1 w-full px-4 py-3 md:py-3.5 text-[15px] outline-none text-[#0A1930] placeholder:text-gray-400 font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#F96515] hover:bg-[#EA580C] text-white text-[15px] md:text-[16px] font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(249,101,21,0.25)] hover:shadow-[0_6px_20px_rgba(249,101,21,0.35)] active:scale-[0.99] cursor-pointer"
                        >
                            <span>Send OTP</span>
                            <span className="text-[18px] leading-none">&rarr;</span>
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-6 md:my-8">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">OR</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <button
                        type="button"
                        className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0F243E] text-[15px] font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.02)] cursor-pointer mb-8 md:mb-12"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    {/* Mobile Feature Items (Visible only on mobile/tablet) */}
                    <div className="md:hidden space-y-4 pt-2 pb-4">
                        <FeatureItem 
                            icon={ShoppingCart} 
                            color="#5D5FEF" 
                            bg="#ECE8FD" 
                            title="Faster Checkout" 
                            desc="Saved details for quick ordering" 
                        />
                        <FeatureItem 
                            icon={Heart} 
                            color="#EF4444" 
                            bg="#FDECEB" 
                            title="Save Favourites" 
                            desc="Keep your favourite toys handy" 
                        />
                        <FeatureItem 
                            icon={Package} 
                            color="#10B981" 
                            bg="#E6F9F0" 
                            title="Track Orders" 
                            desc="Get real-time order updates" 
                        />
                        <FeatureItem 
                            icon={Star} 
                            color="#F59E0B" 
                            bg="#FEF6DB" 
                            title="Exclusive Offers" 
                            desc="Be the first to know about new arrivals" 
                        />
                    </div>

                    {/* Desktop Bottom Trust Badges (Visible only on desktop) */}
                    <div className="hidden md:grid grid-cols-3 gap-2 text-center">
                        <div className="flex flex-col items-center px-1">
                            <div className="w-12 h-12 rounded-full bg-[#edf4fe] flex items-center justify-center mb-2.5">
                                <ShieldCheck className="w-6 h-6 text-[#2563EB]" strokeWidth={2.2} />
                            </div>
                            <div className="text-[13px] font-bold text-[#0F243E] leading-tight mb-1">
                                Secure &amp; Safe
                            </div>
                            <div className="text-[11px] text-gray-500 leading-tight">
                                Your data is protected
                            </div>
                        </div>

                        <div className="flex flex-col items-center px-1">
                            <div className="w-12 h-12 rounded-full bg-[#edf4fe] flex items-center justify-center mb-2.5">
                                <Lock className="w-6 h-6 text-[#2563EB]" strokeWidth={2.2} />
                            </div>
                            <div className="text-[13px] font-bold text-[#0F243E] leading-tight mb-1">
                                Quick Login
                            </div>
                            <div className="text-[11px] text-gray-500 leading-tight">
                                No passwords
                            </div>
                        </div>

                        <div className="flex flex-col items-center px-1">
                            <div className="w-12 h-12 rounded-full bg-[#edf4fe] flex items-center justify-center mb-2.5">
                                <Smartphone className="w-6 h-6 text-[#2563EB]" strokeWidth={2.2} />
                            </div>
                            <div className="text-[13px] font-bold text-[#0F243E] leading-tight mb-1">
                                Seamless<br />Experience
                            </div>
                            <div className="text-[11px] text-gray-500 leading-tight">
                                Shop on any device
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const FeatureItem = ({ icon: Icon, color, bg, title, desc }) => (
    <div className="flex items-center gap-4">
        <div 
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: bg }}
        >
            <Icon className="w-5 h-5" style={{ color: color }} />
        </div>
        <div>
            <div className="text-[15px] font-bold text-[#0A1930] leading-tight mb-0.5">{title}</div>
            <div className="text-[13px] text-[#475569] leading-tight">{desc}</div>
        </div>
    </div>
);

export default Login;
