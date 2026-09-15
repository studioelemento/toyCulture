import React from 'react';
import { Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TopNoticeBar = () => {
  return (
    <div className="bg-toyNavy-dark text-white text-xs py-2 px-4 border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <Truck size={14} className="text-toyOrange" />
          <span>
            <strong>Free shipping</strong> for all orders above <strong>Rs 2000/-</strong>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-gray-300">
          <Link to="/affiliate-registration" className="hover:text-toyOrange transition-colors">
            Affiliate Program
          </Link>
          <span>|</span>
          <a href="mailto:support@toyculture.in" className="hover:text-toyOrange transition-colors">
            support@toyculture.in
          </a>
        </div>
      </div>
    </div>
  );
};
