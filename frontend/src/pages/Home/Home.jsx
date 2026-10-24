import React from 'react';
import { Hero } from './components/Hero';
import { Shopbyage } from './components/Shopbyage';
import { ShopbyCategory } from './components/ShopbyCategory';
import { TrendingToys } from './components/TrendingToys';
import { BestSeller } from './components/BestSeller';
import { TopBrands } from './components/TopBrands';
import { DealoftheDay } from './components/DealoftheDay';
import { NewArrivals } from './components/NewArrivals';
import { SubscribeNewsletter } from './components/SubscribeNewsletter';

export const Home = () => {
  return (
    <div className="bg-[#FAF9F5] min-h-[calc(100vh-140px)] flex flex-col justify-between overflow-x-hidden selection:bg-toyOrange/20 selection:text-toyOrange">
      {/* Hero Section */}
      <Hero />

      {/* Shop by Age Section */}
      <Shopbyage />

      {/* Shop by Category Section */}
      <ShopbyCategory />

      {/* Trending Toys Section */}
      <TrendingToys />

      {/* Best Sellers Section */}
      <BestSeller />

      {/* Top Brands Section */}
      <TopBrands />

      {/* Deal of the Day Section */}
      <DealoftheDay />

      {/* New Arrivals Section */}
      <NewArrivals />

      {/* Subscribe Newsletter Section */}
      <SubscribeNewsletter />
    </div>
  );
};

export default Home;