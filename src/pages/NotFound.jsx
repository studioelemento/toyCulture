import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-md">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
        <h1 className="text-6xl font-black text-toyOrange">404</h1>
        <h2 className="text-xl font-bold text-toyNavy">Page Not Found</h2>
        <p className="text-xs text-gray-500">The page you are looking for doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="bg-toyNavy hover:bg-toyNavy-light text-white text-xs font-bold px-6 py-2.5 rounded-full inline-block transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};
