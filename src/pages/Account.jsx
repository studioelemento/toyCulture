import React, { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, Package, MapPin, Heart, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const Account = () => {
  const { currentUser, isLoggedIn, login, register, googleLogin, logout } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username && loginData.password) {
      const user = login(loginData.username, loginData.password);
      showToast(`Welcome back, ${user.name}!`);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (registerData.email && registerData.password) {
      const user = register(registerData.username, registerData.email, registerData.password);
      showToast(`Account created! Welcome, ${user.name}!`);
    }
  };

  const handleGoogleAuth = () => {
    const user = googleLogin();
    showToast(`Signed in with Google as ${user.name}`);
  };

  if (isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-8">
          {/* Header Profile Banner */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#0B0829] text-toyOrange rounded-full flex items-center justify-center font-black text-2xl shadow">
                {currentUser?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl font-black text-toyNavy">
                  Hello, {currentUser?.name || 'Valued Customer'}!
                </h1>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>

          {/* Quick Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-100 bg-gray-50/50 p-5 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-toyOrange/10 text-toyOrange rounded-lg flex items-center justify-center flex-shrink-0">
                <Package size={24} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase">Total Orders</h3>
                <p className="text-lg font-black text-toyNavy">0 Orders</p>
              </div>
            </div>

            <div className="border border-gray-100 bg-gray-50/50 p-5 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-toyGreen/10 text-toyGreen rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase">Saved Addresses</h3>
                <p className="text-lg font-black text-toyNavy">1 Address</p>
              </div>
            </div>

            <div className="border border-gray-100 bg-gray-50/50 p-5 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-toyRed/10 text-toyRed rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase">Wishlist</h3>
                <p className="text-lg font-black text-toyNavy">0 Items</p>
              </div>
            </div>
          </div>

          {/* Recent Orders section */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-toyNavy">Recent Orders</h2>
            <div className="p-8 border border-dashed border-gray-200 rounded-xl text-center space-y-2">
              <p className="text-xs font-medium text-gray-500">No order has been made yet.</p>
              <Link
                to="/shop"
                className="inline-block text-xs font-bold text-toyOrange hover:underline"
              >
                Go Shop & Explore Products →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 text-sm font-bold text-center">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 pb-3 transition-colors ${
              activeTab === 'login'
                ? 'text-[#0B0829] border-b-2 border-[#0B0829]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 pb-3 transition-colors ${
              activeTab === 'register'
                ? 'text-[#0B0829] border-b-2 border-[#0B0829]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' ? (
          <div className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Username or email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0B0829] hover:bg-[#161240] text-white text-xs font-black tracking-wider py-3.5 rounded-md transition-colors uppercase shadow-sm"
              >
                LOG IN
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-toyNavy focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Please use the slide-in drawer to reset password');
                  }}
                  className="text-[#FF8400] hover:text-[#D86F00] hover:underline font-medium"
                >
                  Lost your password?
                </button>
              </div>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <span className="relative bg-white px-3 text-xs font-bold text-gray-700 uppercase tracking-wide">
                OR LOGIN WITH
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full bg-[#4285F4] hover:bg-[#3367d6] text-white font-bold text-xs py-2.5 px-3 rounded-md flex items-center justify-between transition-colors shadow-sm"
            >
              <div className="bg-white rounded p-1.5 flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <span className="flex-1 text-center font-black tracking-wider uppercase">
                GOOGLE
              </span>
              <div className="w-7" />
            </button>
          </div>
        ) : (
          /* Register Form */
          <div className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                Your personal data will be used to support your experience throughout this website,
                to manage access to your account, and for other purposes described in our privacy
                policy.
              </p>

              <button
                type="submit"
                className="w-full bg-[#0B0829] hover:bg-[#161240] text-white text-xs font-black tracking-wider py-3.5 rounded-md transition-colors uppercase shadow-sm"
              >
                REGISTER
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <span className="relative bg-white px-3 text-xs font-bold text-gray-700 uppercase tracking-wide">
                OR LOGIN WITH
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full bg-[#4285F4] hover:bg-[#3367d6] text-white font-bold text-xs py-2.5 px-3 rounded-md flex items-center justify-between transition-colors shadow-sm"
            >
              <div className="bg-white rounded p-1.5 flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <span className="flex-1 text-center font-black tracking-wider uppercase">
                GOOGLE
              </span>
              <div className="w-7" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

