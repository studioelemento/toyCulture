import React from 'react';
import { useLocation } from 'react-router-dom';

export const PolicyPage = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Information & Policy';
  let content = 'Information details for ToyCulture.';

  if (path.includes('privacy')) {
    title = 'Privacy Policy';
    content = 'At ToyCulture, we respect your privacy and are committed to protecting your personal data. We collect information necessary to process orders and improve your shopping experience.';
  } else if (path.includes('terms')) {
    title = 'Terms & Conditions';
    content = 'Welcome to ToyCulture. By accessing our website, you agree to comply with our terms of service, ordering policies, and user conduct guidelines.';
  } else if (path.includes('refund')) {
    title = 'Returns & Refund Policy';
    content = 'We offer replacements for damaged or incorrect items reported within 7 days of delivery. All returned items must be unused and in original packaging.';
  } else if (path.includes('shipping')) {
    title = 'Shipping Policy';
    content = 'ToyCulture provides express shipping across India. Orders above ₹2000 qualify for FREE standard shipping. Delivery typically takes 3-7 business days depending on location.';
  } else if (path.includes('affiliate')) {
    title = 'Affiliate Program';
    content = 'Join the ToyCulture Affiliate Program! Earn competitive commissions by sharing genuine toys and diecast collectibles with your audience and community.';
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
        <h1 className="text-2xl font-black text-toyNavy uppercase border-b border-gray-100 pb-4">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
};
