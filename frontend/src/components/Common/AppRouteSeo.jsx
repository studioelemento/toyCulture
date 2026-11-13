import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageSeo from './PageSeo';

const NOINDEX_PREFIXES = [
  '/login',
  '/cart',
  '/checkout',
  '/account',
  '/my-account',
  '/orders',
  '/my-orders',
  '/addresses',
  '/my-addresses',
  '/wishlist',
  '/personal-details',
  '/help-support',
  '/support',
  '/coupons',
];

function isPrivateRoute(pathname) {
  return NOINDEX_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

const PRIVATE_SEO = {
  '/login': {
    title: 'Login',
    description: 'Sign in to your Toy Culture account to track orders and checkout faster.',
  },
  '/cart': {
    title: 'Shopping Cart',
    description: 'Review items in your Toy Culture cart before checkout.',
  },
  '/checkout': {
    title: 'Checkout',
    description: 'Complete your Toy Culture order securely.',
  },
};

function privatePageCopy(pathname) {
  if (pathname.startsWith('/account') || pathname === '/my-account') {
    return { title: 'My Account', description: 'Manage your Toy Culture account, orders and wishlist.' };
  }
  return PRIVATE_SEO[pathname] || { title: 'Account', description: 'Your Toy Culture account area.' };
}

/** Applies noindex + basic titles on cart, checkout, login, and account routes. */
export default function AppRouteSeo() {
  const { pathname } = useLocation();

  if (!isPrivateRoute(pathname)) {
    return null;
  }

  const { title, description } = privatePageCopy(pathname);

  return (
    <PageSeo
      title={title}
      description={description}
      robots="noindex, nofollow"
    />
  );
}

/** Sets document lang (future: i18n). */
export function DocumentLang() {
  useEffect(() => {
    document.documentElement.lang = 'en-IN';
  }, []);
  return null;
}
