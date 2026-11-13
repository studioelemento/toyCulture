import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ApiError } from '../../lib/apiClient';
import GoogleAuthButton, { AuthDivider } from './GoogleAuthButton';

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const AuthDrawer = () => {
  const {
    isAuthDrawerOpen,
    closeAuthDrawer,
    authMode,
    setAuthMode,
    login,
    register,
    verifyRegistrationOtp,
    requestPasswordReset,
    completePasswordReset,
    resendVerificationOtp,
    pendingEmail,
    authNotice,
  } = useAuth();
  const { showToast } = useCart();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'male',
    password: '',
    confirm_password: '',
    refferal_code: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [resetForm, setResetForm] = useState({ otp_code: '', password: '', confirm_password: '' });
  const [lostPasswordEmail, setLostPasswordEmail] = useState('');

  if (!isAuthDrawerOpen) return null;

  const handleError = (err) => {
    const message = err instanceof ApiError ? err.message : err?.message || 'Something went wrong';
    setError(message);
    showToast(message);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
  setLoading(true);
    try {
      const user = await login(loginForm.email.trim().toLowerCase(), loginForm.password);
      showToast(`Welcome back, ${user.name}!`);
      setLoginForm({ email: '', password: '' });
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        ...registerForm,
        email: registerForm.email.trim().toLowerCase(),
      });
      showToast('OTP sent to your email. Please verify to activate your account.');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await verifyRegistrationOtp(otpCode.trim());
      showToast(`Account verified! Welcome, ${user.name}!`);
      setOtpCode('');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLostPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestPasswordReset(lostPasswordEmail);
      showToast(`OTP sent to ${lostPasswordEmail}`);
      setLostPasswordEmail('');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await completePasswordReset(resetForm);
      showToast('Password updated. You can log in now.');
      setResetForm({ otp_code: '', password: '', confirm_password: '' });
      setAuthMode('login');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const titleMap = {
    login: 'Sign in',
    register: 'Register',
    'verify-otp': 'Verify email',
    'lost-password': 'Reset password',
    'reset-otp': 'Set new password',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuthDrawer}
      />

      <div className="relative w-full max-w-[420px] bg-white text-toyText-primary h-full shadow-2xl flex flex-col z-50 animate-slideLeft overflow-y-auto">
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{titleMap[authMode] || 'Account'}</h2>
          <button
            onClick={closeAuthDrawer}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
            type="button"
          >
            <X size={16} />
            <span>Close</span>
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
          {authNotice && !error && (
            <div className="mb-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              {authNotice}
            </div>
          )}
          {error && (
            <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex-1">
            {(authMode === 'login' || authMode === 'register') && (
              <>
                <GoogleAuthButton
                  label={authMode === 'register' ? 'Sign up with Google' : 'Continue with Google'}
                  onError={(message) => {
                    setError(message);
                    showToast(message);
                  }}
                  onSuccess={(user) => showToast(`Welcome, ${user.name}!`)}
                />
                <AuthDivider />
              </>
            )}

            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <Field
                  label="Email address"
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(v) => setLoginForm({ ...loginForm, email: v })}
                />
                <PasswordField
                  label="Password"
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  value={loginForm.password}
                  onChange={(v) => setLoginForm({ ...loginForm, password: v })}
                />
                <SubmitButton loading={loading}>LOG IN</SubmitButton>
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setAuthMode('register');
                    }}
                    className="text-xs text-[#FF8400] hover:underline font-semibold"
                  >
                    Create an account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setAuthMode('lost-password');
                    }}
                    className="text-xs text-gray-500 hover:text-[#FF8400] hover:underline font-medium"
                  >
                    Lost your password?
                  </button>
                </div>
              </form>
            )}

            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" required value={registerForm.first_name} onChange={(v) => setRegisterForm({ ...registerForm, first_name: v })} />
                  <Field label="Last name" required value={registerForm.last_name} onChange={(v) => setRegisterForm({ ...registerForm, last_name: v })} />
                </div>
                <Field label="Email" type="email" required value={registerForm.email} onChange={(v) => setRegisterForm({ ...registerForm, email: v })} />
                <Field label="Phone" required value={registerForm.phone} onChange={(v) => setRegisterForm({ ...registerForm, phone: v.replace(/\D/g, '') })} />
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Gender</label>
                  <select
                    value={registerForm.gender}
                    onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md"
                  >
                    {GENDERS.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
                <PasswordField
                  label="Password"
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  value={registerForm.password}
                  onChange={(v) => setRegisterForm({ ...registerForm, password: v })}
                />
                <PasswordField
                  label="Confirm password"
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  value={registerForm.confirm_password}
                  onChange={(v) => setRegisterForm({ ...registerForm, confirm_password: v })}
                />
                <Field
                  label="Referral code (optional)"
                  value={registerForm.refferal_code}
                  onChange={(v) => setRegisterForm({ ...registerForm, refferal_code: v })}
                />
                <SubmitButton loading={loading}>CREATE ACCOUNT</SubmitButton>
              </form>
            )}

            {authMode === 'verify-otp' && (
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <p className="text-xs text-gray-600">
                  Enter the OTP sent to <span className="font-semibold">{pendingEmail}</span>
                </p>
                <Field label="OTP code" required value={otpCode} onChange={setOtpCode} />
                <SubmitButton loading={loading}>VERIFY</SubmitButton>
                <button
                  type="button"
                  onClick={() => resendVerificationOtp().then(() => showToast('OTP resent'))}
                  className="text-xs text-gray-600 hover:text-[#FF8400] w-full text-center"
                >
                  Resend OTP
                </button>
              </form>
            )}

            {authMode === 'lost-password' && (
              <form onSubmit={handleLostPasswordSubmit} className="space-y-4">
                <Field
                  label="Email address"
                  type="email"
                  required
                  value={lostPasswordEmail}
                  onChange={setLostPasswordEmail}
                />
                <SubmitButton loading={loading}>SEND OTP</SubmitButton>
              </form>
            )}

            {authMode === 'reset-otp' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <p className="text-xs text-gray-600">OTP sent to {pendingEmail}</p>
                <Field label="OTP" required value={resetForm.otp_code} onChange={(v) => setResetForm({ ...resetForm, otp_code: v })} />
                <PasswordField
                  label="New password"
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  value={resetForm.password}
                  onChange={(v) => setResetForm({ ...resetForm, password: v })}
                />
                <PasswordField
                  label="Confirm password"
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  value={resetForm.confirm_password}
                  onChange={(v) => setResetForm({ ...resetForm, confirm_password: v })}
                />
                <SubmitButton loading={loading}>UPDATE PASSWORD</SubmitButton>
              </form>
            )}
          </div>

          <AuthDrawerFooter
            authMode={authMode}
            onSwitch={(mode) => {
              setError('');
              setAuthMode(mode);
            }}
          />
        </div>
      </div>
    </div>
  );
};

function Field({ label, type = 'text', required, value, onChange }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
      />
    </div>
  );
}

function PasswordField({ label, show, onToggle, value, onChange }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
        />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-[#0B0829] hover:bg-[#161240] disabled:opacity-60 text-white text-xs font-black tracking-wider py-3.5 rounded-md uppercase flex items-center justify-center gap-2"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
}

function AuthDrawerFooter({ authMode, onSwitch }) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-3">
        <User size={36} strokeWidth={1.5} />
      </div>
      {authMode === 'login' && (
        <>
          <p className="text-xs text-gray-600 font-medium mb-1">No account yet?</p>
          <button type="button" onClick={() => onSwitch('register')} className="text-xs font-black uppercase underline">
            CREATE AN ACCOUNT
          </button>
        </>
      )}
      {['register', 'lost-password', 'verify-otp', 'reset-otp'].includes(authMode) && (
        <>
          <p className="text-xs text-gray-600 font-medium mb-1">Back to sign in</p>
          <button type="button" onClick={() => onSwitch('login')} className="text-xs font-black uppercase underline">
            LOG IN
          </button>
        </>
      )}
    </div>
  );
}