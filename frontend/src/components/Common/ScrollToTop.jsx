import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollStorageKey = (key) => `toyculture:scroll:${key}`;

function readStoredScroll(key) {
  const stored = sessionStorage.getItem(scrollStorageKey(key));
  if (stored == null) return null;
  const top = Number.parseInt(stored, 10);
  return Number.isNaN(top) ? null : top;
}

function writeStoredScroll(key, y) {
  sessionStorage.setItem(scrollStorageKey(key), String(Math.max(0, Math.round(y))));
}

function isInternalAppPath(href) {
  if (!href || href.startsWith('#')) return false;
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  return href.startsWith('/') || href.startsWith(window.location.origin);
}

export default function ScrollToTop() {
  const { pathname, search, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const locationKeyRef = useRef(key);
  const pinnedLeaveScrollRef = useRef(null);
  locationKeyRef.current = key;

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    let rafId = 0;

    const persistScroll = () => {
      const pin = pinnedLeaveScrollRef.current;
      if (pin && pin.key === locationKeyRef.current) return;
      writeStoredScroll(locationKeyRef.current, window.scrollY);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(persistScroll);
    };

    const saveBeforeInAppNavigation = (event) => {
      const anchor = event.target.closest('a[href]');
      if (!anchor || anchor.target === '_blank') return;
      const href = anchor.getAttribute('href');
      if (!isInternalAppPath(href)) return;
      const y = window.scrollY;
      pinnedLeaveScrollRef.current = { key: locationKeyRef.current, y };
      writeStoredScroll(locationKeyRef.current, y);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerdown', saveBeforeInAppNavigation, true);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerdown', saveBeforeInAppNavigation, true);
    };
  }, []);

  useLayoutEffect(() => {
    pinnedLeaveScrollRef.current = null;

    if (navigationType === 'POP') {
      const top = readStoredScroll(key);
      if (top == null) return;

      const restore = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: Math.min(top, Math.max(0, max)), left: 0, behavior: 'auto' });
      };

      restore();
      const timers = [0, 50, 150, 300, 600, 1000].map((ms) =>
        window.setTimeout(restore, ms)
      );
      const raf = requestAnimationFrame(() => {
        restore();
        requestAnimationFrame(restore);
      });

      return () => {
        cancelAnimationFrame(raf);
        timers.forEach((id) => window.clearTimeout(id));
      };
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [pathname, search, hash, key, navigationType]);

  useEffect(() => {
    const onPageShow = (event) => {
      if (!event.persisted) return;
      const top = readStoredScroll(key);
      if (top == null) return;
      window.scrollTo({ top, left: 0, behavior: 'auto' });
    };

    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [key]);

  return null;
}
