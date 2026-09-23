import React, { useState } from 'react';
import { X, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const AuthDrawer = () => {
  const {
    isAuthDrawerOpen,
    closeAuthDrawer,
    authMode,
    setAuthMode,
    login,
    register,
    googleLogin,
  } = useAuth();
  const { showToast } = useCart();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({ usernameOrEmail: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
  const [lostPasswordEmail, setLostPasswordEmail] = useState('');

  if (!isAuthDrawerOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginForm.usernameOrEmail || !loginForm.password) return;
    const user = login(loginForm.usernameOrEmail, loginForm.password);
    showToast(`Welcome back, ${user.name}!`);
    setLoginForm({ usernameOrEmail: '', password: '' });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerForm.email || !registerForm.password) return;
    const user = register(registerForm.username, registerForm.email, registerForm.password);
    showToast(`Account created! Welcome, ${user.name}!`);
    setRegisterForm({ username: '', email: '', password: '' });
  };

  const handleLostPasswordSubmit = (e) => {
    e.preventDefault();
    if (!lostPasswordEmail) return;
    showToast(`Password reset link has been sent to ${lostPasswordEmail}`);
    setLostPasswordEmail('');
    setAuthMode('login');
  };

  const handleGoogleSignIn = () => {
    const user = googleLogin();
    showToast(`Signed in with Google as ${user.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuthDrawer}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[420px] bg-white text-toyText-primary h-full shadow-2xl flex flex-col z-50 animate-slideLeft overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {authMode === 'login' && 'Sign in'}
            {authMode === 'register' && 'Register'}
            {authMode === 'lost-password' && 'Lost password'}
          </h2>
          <button
            onClick={closeAuthDrawer}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
            aria-label="Close"
          >
            <X size={16} />
            <span>Close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          {/* LOGIN MODE */}
          {authMode === 'login' && (
            <div>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Username or Email */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    Username or email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={loginForm.usernameOrEmail}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, usernameOrEmail: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 transition-colors"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 transition-colors"
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

                {/* Submit Log In Button */}
                <button
                  type="submit"
                  className="w-full bg-[#0B0829] hover:bg-[#161240] text-white text-xs font-black tracking-wider py-3.5 rounded-md transition-colors uppercase shadow-sm"
                >
                  LOG IN
                </button>

                {/* Remember me & Lost password */}
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
                    onClick={() => setAuthMode('lost-password')}
                    className="text-[#FF8400] hover:text-[#D86F00] hover:underline font-medium"
                  >
                    Lost your password?
                  </button>
                </div>
              </form>

              {/* Divider: OR LOGIN WITH */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <span className="relative bg-white px-3 text-xs font-bold text-gray-700 uppercase tracking-wide">
                  OR LOGIN WITH
                </span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-[#4285F4] hover:bg-[#3367d6] text-white font-bold text-xs py-2.5 px-3 rounded-md flex items-center justify-between transition-colors shadow-sm"
              >
                <div className="bg-white rounded p-1.5 flex items-center justify-center">
                  {/* Official Google G SVG */}
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

          {/* REGISTER MODE */}
          {authMode === 'register' && (
            <div>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={registerForm.username}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, username: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 transition-colors"
                  />
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 transition-colors"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, password: e.target.value })
                      }
                      className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 transition-colors"
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
                  Your personal data will be used to support your experience throughout this
                  website, to manage access to your account, and for other purposes described
                  in our privacy policy.
                </p>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  className="w-full bg-[#0B0829] hover:bg-[#161240] text-white text-xs font-black tracking-wider py-3.5 rounded-md transition-colors uppercase shadow-sm"
                >
                  REGISTER
                </button>
              </form>

              {/* Divider: OR LOGIN WITH */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <span className="relative bg-white px-3 text-xs font-bold text-gray-700 uppercase tracking-wide">
                  OR LOGIN WITH
                </span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
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

          {/* LOST PASSWORD MODE */}
          {authMode === 'lost-password' && (
            <div>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Lost your password? Please enter your username or email address. You will
                receive a link to create a new password via email.
              </p>
              <form onSubmit={handleLostPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    Username or email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lostPasswordEmail}
                    onChange={(e) => setLostPasswordEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0B0829] hover:bg-[#161240] text-white text-xs font-black tracking-wider py-3.5 rounded-md transition-colors uppercase shadow-sm"
                >
                  RESET PASSWORD
                </button>
              </form>
            </div>
          )}

          {/* Bottom Avatar Section & Account Switcher */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center flex flex-col items-center">
            {/* Light gray user silhouette */}
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-3 border border-gray-100">
              <User size={36} strokeWidth={1.5} className="text-gray-300" />
            </div>

            {authMode === 'login' && (
              <>
                <p className="text-xs text-gray-600 font-medium mb-1">No account yet?</p>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-xs font-black text-gray-900 tracking-wider uppercase underline underline-offset-4 hover:text-toyOrange transition-colors"
                >
                  CREATE AN ACCOUNT
                </button>
              </>
            )}

            {(authMode === 'register' || authMode === 'lost-password') && (
              <>
                <p className="text-xs text-gray-600 font-medium mb-1">
                  {authMode === 'register'
                    ? 'Already have an account?'
                    : 'Remember your password?'}
                </p>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs font-black text-gray-900 tracking-wider uppercase underline underline-offset-4 hover:text-toyOrange transition-colors"
                >
                  LOG IN
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
