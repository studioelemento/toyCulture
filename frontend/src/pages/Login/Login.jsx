import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, Smartphone, X, ShoppingCart, Heart, Package, Star, Loader2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../lib/apiClient';
import GoogleAuthButton, { AuthDivider } from '../../components/Auth/GoogleAuthButton';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, openAuthDrawer, isLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || '/account';

  useEffect(() => {
    if (isLoggedIn) navigate(from, { replace: true });
  }, [isLoggedIn, from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa] md:bg-white relative">
      <Link
        to="/"
        className="hidden md:flex absolute top-5 right-5 z-30 p-2.5 rounded-full text-gray-400 hover:text-[#0A1930] hover:bg-gray-100/80 transition-all"
        aria-label="Back to store"
      >
        <X size={22} strokeWidth={2.2} />
      </Link>

      <div className="hidden md:flex md:w-1/2 h-screen sticky top-0 bg-[#fcfbfa] items-center justify-start overflow-hidden select-none">
        <img
          src="/login-banner.png"
          alt="A World of Play Awaits - ToyCulture"
          className="h-full w-auto max-h-screen object-contain object-left"
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center relative bg-white rounded-t-[32px] md:rounded-none -mt-5 md:mt-0 z-10 px-6 pt-7 pb-10 sm:px-10 md:p-12 min-h-screen">
        <div className="w-full max-w-[420px] mx-auto">
          <h1 className="text-[28px] md:text-[34px] font-black text-[#0A1930] mb-2">Login to ToyCulture</h1>
          <p className="text-[14px] text-[#475569] mb-6">Sign in with Google or your email and password</p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <GoogleAuthButton
            className="rounded-xl py-3.5"
            onError={setError}
          />
          <AuthDivider />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#0A1930] mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#F96515] focus:ring-2 focus:ring-[#F96515]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0A1930] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#F96515] focus:ring-2 focus:ring-[#F96515]/20 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F96515] hover:bg-[#EA580C] disabled:opacity-70 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New here?{' '}
            <button
              type="button"
              onClick={() => {
                navigate('/');
                openAuthDrawer('register');
              }}
              className="text-[#F96515] font-semibold hover:underline"
            >
              Create an account
            </button>
          </p>

          <div className="hidden md:grid grid-cols-3 gap-2 text-center mt-10">
            <Trust icon={ShieldCheck} title="Secure & Safe" desc="Your data is protected" />
            <Trust icon={Lock} title="Quick Login" desc="Secure JWT session" />
            <Trust icon={Smartphone} title="Seamless" desc="Shop on any device" />
          </div>

          <div className="md:hidden space-y-4 mt-8">
            <FeatureItem icon={ShoppingCart} color="#5D5FEF" bg="#ECE8FD" title="Faster Checkout" desc="Saved details for quick ordering" />
            <FeatureItem icon={Heart} color="#EF4444" bg="#FDECEB" title="Save Favourites" desc="Keep your favourite toys handy" />
            <FeatureItem icon={Package} color="#10B981" bg="#E6F9F0" title="Track Orders" desc="Get real-time order updates" />
            <FeatureItem icon={Star} color="#F59E0B" bg="#FEF6DB" title="Exclusive Offers" desc="New arrivals and deals" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Trust = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center px-1">
    <div className="w-12 h-12 rounded-full bg-[#edf4fe] flex items-center justify-center mb-2.5">
      <Icon className="w-6 h-6 text-[#2563EB]" strokeWidth={2.2} />
    </div>
    <div className="text-[13px] font-bold text-[#0F243E]">{title}</div>
    <div className="text-[11px] text-gray-500">{desc}</div>
  </div>
);

const FeatureItem = ({ icon: Icon, color, bg, title, desc }) => (
  <div className="flex items-center gap-4">
    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <div className="text-[15px] font-bold text-[#0A1930]">{title}</div>
      <div className="text-[13px] text-[#475569]">{desc}</div>
    </div>
  </div>
);

export default Login;
