import React, { useState } from 'react';
import { User, Lock, Mail, Phone, ArrowRight } from 'lucide-react';

export const Account = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username && loginData.password) {
      setIsLoggedIn(true);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (registerData.email && registerData.password) {
      setIsLoggedIn(true);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl text-center">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-4">
          <div className="w-16 h-16 bg-toyOrange/10 text-toyOrange rounded-full flex items-center justify-center mx-auto">
            <User size={32} />
          </div>
          <h1 className="text-2xl font-black text-toyNavy">Welcome Back!</h1>
          <p className="text-xs text-gray-500">
            You are currently logged into your ToyCulture account dashboard.
          </p>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="bg-toyNavy text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-toyNavy-light transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 text-sm font-black text-center">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 pb-3 transition-colors ${
              activeTab === 'login'
                ? 'text-toyOrange border-b-2 border-toyOrange'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 pb-3 transition-colors ${
              activeTab === 'register'
                ? 'text-toyOrange border-b-2 border-toyOrange'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Username or Email Address *</label>
              <input
                type="text"
                required
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Password *</label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-toyOrange hover:bg-toyOrange-hover text-white text-xs font-black py-3.5 rounded-xl transition-colors shadow-md uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Log In</span>
              <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Password *</label>
              <input
                type="password"
                required
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-toyOrange"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-toyNavy hover:bg-toyNavy-light text-white text-xs font-black py-3.5 rounded-xl transition-colors shadow-md uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Register Account</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
