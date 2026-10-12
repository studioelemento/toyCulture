import React from 'react';
import { ShoppingCart, Heart, Package, Star, ShieldCheck, Lock, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="min-h-screen flex items-stretch bg-[#f4f7f9] md:bg-white relative">
            
            {/* Mobile Header Image */}
            <div className="md:hidden absolute top-0 left-0 right-0 h-[28vh] z-0 overflow-hidden">
                <img 
                    src="/mobile_login_header.jpg" 
                    alt="Toys" 
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Left Panel (Desktop) */}
            <div className="hidden md:flex flex-col w-1/2 p-12 lg:p-16 bg-[#fbfaf8] relative overflow-hidden z-10">
                {/* Background Decorative Shapes */}
                <div className="absolute top-[-100px] right-[-100px] w-[350px] h-[350px] bg-[#e3def1] rounded-full z-0"></div>
                <div className="absolute bottom-[10%] left-[-150px] w-[350px] h-[350px] bg-[#fde9d2] rounded-full z-0"></div>
                <div className="absolute bottom-[-150px] right-[-50px] w-[600px] h-[600px] bg-[#e6e2f6] rounded-full z-0"></div>

                {/* Desktop Bottom Image */}
                <div className="absolute bottom-0 right-0 w-full h-[50vh] z-0 flex justify-end">
                    <img 
                        src="/mobile_login_header.jpg" 
                        alt="Toys" 
                        className="h-full object-contain mix-blend-multiply"
                    />
                </div>

                <div className="relative z-10 max-w-md mt-4">
                    <h1 className="text-[48px] lg:text-[64px] font-black text-[#0A1930] leading-[1.05] tracking-tight mb-6">
                        A World<br />of Play<br />Awaits
                    </h1>
                    <p className="text-[16px] text-[#475569] leading-relaxed mb-12 pr-4">
                        Login to explore our wide range of toys, save your favourites, track your orders and more.
                    </p>

                    <div className="space-y-6">
                        <FeatureItem icon={ShoppingCart} color="#6366f1" bg="#eeeaff" title="Faster Checkout" desc="Saved details for quick ordering" />
                        <FeatureItem icon={Heart} color="#ef4444" bg="#fceceb" title="Save Favourites" desc="Keep your favourite toys handy" />
                        <FeatureItem icon={Package} color="#10b981" bg="#e8f5e9" title="Track Orders" desc="Get real-time order updates" />
                        <FeatureItem icon={Star} color="#eab308" bg="#fefce8" title="Exclusive Offers" desc="Be the first to know about new arrivals" />
                    </div>
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="w-full md:w-1/2 flex flex-col md:justify-center mt-[24vh] md:mt-0 relative z-10 pb-10 md:pb-0">
                
                <div className="bg-white min-h-screen md:min-h-0 rounded-t-[24px] md:rounded-none px-6 py-8 md:p-16 lg:p-24 relative shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none flex flex-col flex-1 w-full mx-auto md:max-w-none">
                    
                    {/* Decorative corner shape (Desktop only) */}
                    <div className="hidden md:block absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#fdebd4] rounded-full z-0"></div>

                    <div className="w-full max-w-[420px] mx-auto relative z-10">

                        <h2 className="text-[28px] md:text-[36px] font-black text-[#0A1930] leading-tight mb-2 tracking-tight">
                            Login to ToyCulture
                        </h2>
                        <p className="text-[14px] md:text-[15px] text-[#475569] mb-8 pr-4">
                            Enter your mobile number to receive a one-time password (OTP)
                        </p>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#0A1930]">
                                    Mobile Number
                                </label>
                                <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:border-[#F96515] focus-within:ring-1 focus-within:ring-[#F96515] transition-all bg-white shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
                                    <div className="bg-gray-50 text-[#0A1930] font-bold px-4 flex items-center justify-center border-r border-gray-200 text-[15px]">
                                        +91
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="Enter your mobile number"
                                        className="flex-1 w-full px-4 py-3.5 text-[15px] outline-none text-[#0A1930] placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                className="w-full bg-[#F96515] hover:bg-[#EA580C] text-white text-[16px] font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_4px_12px_rgba(249,101,21,0.2)]"
                            >
                                Send OTP
                                <span className="text-[18px] leading-none">&rarr;</span>
                            </button>
                        </form>

                        <div className="flex items-center gap-4 my-8">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">OR</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <button
                            type="button"
                            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0F243E] text-[15px] font-bold py-3.5 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.02)] mb-10"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Mobile Features List */}
                        <div className="md:hidden space-y-6 pb-6">
                            <FeatureItem icon={ShoppingCart} color="#6366f1" bg="#eeeaff" title="Faster Checkout" desc="Saved details for quick ordering" />
                            <FeatureItem icon={Heart} color="#ef4444" bg="#fceceb" title="Save Favourites" desc="Keep your favourite toys handy" />
                            <FeatureItem icon={Package} color="#10b981" bg="#e8f5e9" title="Track Orders" desc="Get real-time order updates" />
                            <FeatureItem icon={Star} color="#eab308" bg="#fefce8" title="Exclusive Offers" desc="Be the first to know about new arrivals" />
                        </div>

                        {/* Desktop Bottom Features */}
                        <div className="hidden md:flex mt-12 items-start justify-between gap-2 text-center pt-8 border-t border-gray-100">
                            <div className="flex flex-col items-center flex-1 px-1">
                                <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-3">
                                    <ShieldCheck className="w-6 h-6 text-[#2563EB]" strokeWidth={2.5} />
                                </div>
                                <div className="text-[13px] font-bold text-[#0F243E] leading-tight mb-1">Secure & Safe</div>
                                <div className="text-[12px] text-gray-500 leading-tight">Your data is protected</div>
                            </div>
                            <div className="flex flex-col items-center flex-1 px-1">
                                <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-3">
                                    <Lock className="w-6 h-6 text-[#2563EB]" strokeWidth={2.5} />
                                </div>
                                <div className="text-[13px] font-bold text-[#0F243E] leading-tight mb-1">Quick Login</div>
                                <div className="text-[12px] text-gray-500 leading-tight">No passwords</div>
                            </div>
                            <div className="flex flex-col items-center flex-1 px-1">
                                <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-3">
                                    <Smartphone className="w-6 h-6 text-[#2563EB]" strokeWidth={2.5} />
                                </div>
                                <div className="text-[13px] font-bold text-[#0F243E] leading-tight mb-1">Seamless<br />Experience</div>
                                <div className="text-[12px] text-gray-500 leading-tight">Shop on any device</div>
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
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: bg }}
        >
            <Icon className="w-5 h-5" style={{ color: color }} />
        </div>
        <div>
            <div className="text-[15px] font-bold text-[#0F243E]">{title}</div>
            <div className="text-[13px] text-gray-500">{desc}</div>
        </div>
    </div>
);

export default Login;
