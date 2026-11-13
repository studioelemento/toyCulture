import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SEO_DEFAULTS,
  buildAbsoluteUrl,
  formatPageTitle,
  truncateDescription,
} from '../../lib/seo';

const JSON_LD_ID = 'toyculture-page-jsonld';

function upsertMeta(attr, key, content) {
  if (content == null || content === '') {
    document.querySelector(`meta[${attr}="${key}"]`)?.remove();
    return;
  }
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  if (!href) {
    document.querySelector('link[rel="canonical"]')?.remove();
    return;
  }
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(data) {
  const existing = document.getElementById(JSON_LD_ID);
  if (!data) {
    existing?.remove();
    return;
  }
  let el = existing;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = JSON_LD_ID;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function applyHead({
  title,
  description,
  canonical,
  image,
  type,
  robots,
  siteName,
  jsonLd,
}) {
  const pageTitle = formatPageTitle(title);
  const pageDescription = truncateDescription(description || SEO_DEFAULTS.description);

  document.title = pageTitle;

  upsertMeta('name', 'description', pageDescription);
  upsertMeta('name', 'robots', robots);
  upsertMeta('property', 'og:title', pageTitle);
  upsertMeta('property', 'og:description', pageDescription);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:type', type || 'website');
  upsertMeta('property', 'og:image', image || SEO_DEFAULTS.image);
  upsertMeta('property', 'og:site_name', siteName || SEO_DEFAULTS.siteName);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', pageTitle);
  upsertMeta('name', 'twitter:description', pageDescription);
  upsertMeta('name', 'twitter:image', image || SEO_DEFAULTS.image);

  upsertCanonical(canonical);
  upsertJsonLd(jsonLd);
}

/**
 * Client-side SEO for SPA routes (title, description, canonical, OG/Twitter, optional JSON-LD).
 */
export default function PageSeo({
  title,
  description,
  image,
  type = 'website',
  robots,
  pathname,
  search,
  jsonLd,
}) {
  const location = useLocation();
  const path = pathname ?? location.pathname;
  const query = search ?? location.search;
  const canonical = buildAbsoluteUrl(path, query);

  useEffect(() => {
    applyHead({
      title,
      description,
      canonical,
      image,
      type,
      robots,
      siteName: SEO_DEFAULTS.siteName,
      jsonLd,
    });

    return () => {
      document.getElementById(JSON_LD_ID)?.remove();
    };
  }, [title, description, canonical, image, type, robots, jsonLd]);

  return null;
}
