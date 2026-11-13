import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { requestGoogleAuthCode } from '../../lib/googleIdentity';
import { ApiError } from '../../lib/apiClient';

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.5 5.6-6.6 7.1l6.3 5.3C38.2 37.3 44 32 44 24c0-1.3-.1-2.5-.4-3.5z" />
    </svg>
  );
}

export default function GoogleAuthButton({
  label = 'Continue with Google',
  onError,
  onSuccess,
  className = '',
}) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const code = await requestGoogleAuthCode();
      const user = await loginWithGoogle(code);
      onSuccess?.(user);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : err?.message || 'Google sign-in failed';
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`w-full border border-gray-300 hover:bg-gray-50 disabled:opacity-60 bg-white text-gray-800 text-xs font-black tracking-wider py-3.5 rounded-md uppercase flex items-center justify-center gap-2 ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleMark />}
      {loading ? 'Connecting…' : label}
    </button>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">or</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
