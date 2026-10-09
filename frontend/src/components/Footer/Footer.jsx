import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white text-toyText-primary border-t border-gray-200 mt-16">
      {/* Upper features highlights */}
      <div className="bg-toyBg-single py-8 border-b border-gray-200">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 bg-toyOrange/10 text-toyOrange rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              🚚
            </div>
            <div>
              <h4 className="text-xs font-bold text-toyNavy uppercase">Free Express Shipping</h4>
              <p className="text-[11px] text-gray-500">On all orders above ₹2000</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 bg-toyOrange/10 text-toyOrange rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              🛡️
            </div>
            <div>
              <h4 className="text-xs font-bold text-toyNavy uppercase">100% Genuine Toys</h4>
              <p className="text-[11px] text-gray-500">Official Maisto & Bburago partner</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 bg-toyOrange/10 text-toyOrange rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              💳
            </div>
            <div>
              <h4 className="text-xs font-bold text-toyNavy uppercase">Secure Payments</h4>
              <p className="text-[11px] text-gray-500">UPI, Cards & Netbanking</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 bg-toyOrange/10 text-toyOrange rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              💬
            </div>
            <div>
              <h4 className="text-xs font-bold text-toyNavy uppercase">Dedicated Support</h4>
              <p className="text-[11px] text-gray-500">Fast assistance via email</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
        {/* Company Info */}
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <img
              src="https://toyculture.in/wp-content/uploads/2025/09/TOY-CULTURE-1.avif"
              alt="ToyCulture"
              className="h-10 w-auto bg-toyNavy p-2 rounded-lg"
            />
          </Link>
          <p className="text-gray-500 leading-relaxed">
            ToyCulture is an online toy store offering a wide range of genuine, high-quality toys that inspire learning through play. We focus on educational, fun, and safe toys for kids of all ages.
          </p>
          <div className="space-y-2 text-gray-600 font-medium">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-toyOrange flex-shrink-0 mt-0.5" />
              <span>Revathy, Near Marthoma Church, Karakkamandapam, Trivandrum, Kerala 695020</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-toyOrange flex-shrink-0" />
              <a href="mailto:support@toyculture.in" className="hover:text-toyOrange transition-colors">
                support@toyculture.in
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold uppercase text-toyNavy mb-4 pb-2 border-b-2 border-toyOrange inline-block">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-gray-600 font-semibold">
            <li>
              <Link to="/" className="hover:text-toyOrange transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-toyOrange transition-colors">All Products</Link>
            </li>
            <li>
              <Link to="/affiliate-registration" className="hover:text-toyOrange transition-colors">Affiliate Program</Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-toyOrange transition-colors">My Account</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-toyOrange transition-colors">Shopping Cart</Link>
            </li>
          </ul>
        </div>

        {/* Top Categories */}
        <div>
          <h3 className="text-sm font-bold uppercase text-toyNavy mb-4 pb-2 border-b-2 border-toyOrange inline-block">
            Popular Categories
          </h3>
          <ul className="space-y-2.5 text-gray-600 font-semibold">
            <li>
              <Link to="/category/diecast-toys" className="hover:text-toyOrange transition-colors">Diecast Toys</Link>
            </li>
            <li>
              <Link to="/category/building-blocks-for-kids" className="hover:text-toyOrange transition-colors">Building Blocks</Link>
            </li>
            <li>
              <Link to="/category/puzzles" className="hover:text-toyOrange transition-colors">Puzzles & Brain Teasers</Link>
            </li>
            <li>
              <Link to="/category/diy-toys" className="hover:text-toyOrange transition-colors">DIY Craft Kits</Link>
            </li>
            <li>
              <Link to="/category/role-play-toys" className="hover:text-toyOrange transition-colors">Role-Play Toys</Link>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-sm font-bold uppercase text-toyNavy mb-4 pb-2 border-b-2 border-toyOrange inline-block">
            Information & Policies
          </h3>
          <ul className="space-y-2.5 text-gray-600 font-semibold">
            <li>
              <Link to="/privacy-policy" className="hover:text-toyOrange transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-conditions" className="hover:text-toyOrange transition-colors">Terms & Conditions</Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-toyOrange transition-colors">Returns & Refund Policy</Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:text-toyOrange transition-colors">Shipping Policy</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright bar */}
      <div className="bg-toyNavy text-gray-400 text-xs py-4 border-t border-gray-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ToyCulture. Rebuilt with React + Vite.</p>
          <div className="flex items-center gap-2">
            <span>Designed with</span>
            <Heart size={14} className="text-toyRed fill-toyRed" />
            <span>for authentic toy enthusiasts in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
