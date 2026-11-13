const GIS_SRC = 'https://accounts.google.com/gsi/client';

export function getGoogleClientId() {
  return String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
}

export function loadGoogleIdentity() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve(window.google);
      return;
    }

    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Google sign-in')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Failed to load Google sign-in'));
    document.head.appendChild(script);
  });
}

export async function requestGoogleAuthCode() {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error('Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID in frontend/.env');
  }

  const google = await loadGoogleIdentity();
  if (!google?.accounts?.oauth2) {
    throw new Error('Google sign-in is unavailable');
  }

  return new Promise((resolve, reject) => {
    const client = google.accounts.oauth2.initCodeClient({
      client_id: clientId,
      scope: 'openid email profile',
      ux_mode: 'popup',
      callback: (response) => {
        if (response?.code) {
          resolve(response.code);
          return;
        }
        reject(new Error(response?.error || 'Google sign-in was cancelled'));
      },
      error_callback: (error) => {
        if (error?.type === 'popup_closed') {
          reject(new Error('Google sign-in was cancelled'));
          return;
        }
        reject(new Error(error?.message || 'Google sign-in failed'));
      },
    });
    client.requestCode();
  });
}
