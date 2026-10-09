import React from 'react';
import { Phone, Mail, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TopNoticeBar = () => {
  return (
    <div className="bg-toyNavy-dark text-gray-300 text-[11px] py-1.5 px-4 border-b border-white/10 hidden sm:block">
      <div className="container mx-auto flex items-center justify-between">
        {/* Right side: Quick links / contact */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ShieldCheck size={13} className="text-toyGreen" />
            <span>100% Genuine Toys</span>
          </div>
          <Link
            to="/affiliate-registration"
            className="hover:text-toyOrange transition-colors font-medium"
          >
            Affiliate Program
          </Link>
          <Link
            to="/shipping-policy"
            className="hover:text-toyOrange transition-colors font-medium"
          >
            Track Your Order
          </Link>
        </div>
      </div>
    </div>
  );
};
