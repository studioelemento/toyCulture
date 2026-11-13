import React from 'react';
import { Link } from 'react-router-dom';
import PageSeo from '../../components/Common/PageSeo';
import { ChevronRight } from 'lucide-react';
import Shopbyage from './components/Shopbyage';

export default function ShopByAgePage() {
  return (
    <div className="w-full bg-[#FAF9F5] min-h-[calc(100vh-140px)]">
      <PageSeo
        title="Shop by Age"
        description="Find the perfect toy for every age group — from 0–2 years early learning to 13+ advanced play. Shop by age at Toy Culture."
      />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-4 pb-2">
        <nav className="flex items-center text-[13px] text-[#55657E] gap-1.5" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#0F243E] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0F243E] font-semibold">Shop by Age</span>
        </nav>
      </div>
      <Shopbyage />
    </div>
  );
}
