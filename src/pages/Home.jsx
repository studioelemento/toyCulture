import React from 'react';
import { Link } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid/ProductGrid';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { ArrowRight, Sparkles, Award, Star } from 'lucide-react';

export const Home = () => {
  const diecastProducts = products.filter((p) => p.category === 'Diecast Toys');
  const constructionProducts = products.filter((p) => p.category === 'Construction Toys');
  const puzzleProducts = products.filter((p) => p.category === 'Puzzles');
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Category Highlights Header */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-black text-toyNavy uppercase tracking-tight">
            Top Categories
          </h2>
          <Link
            to="/shop"
            className="text-xs font-bold text-toyOrange hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Categories Image Grid with hover scale effect */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center p-3 text-center"
            >
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-toyBg-single mb-2 p-2 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-xs font-extrabold text-toyText-heading group-hover:text-toyOrange transition-colors line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Banner Section */}
      <section className="mb-12 rounded-3xl bg-gradient-to-r from-toyNavy via-toyNavy-light to-toyNavy text-white p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-toyOrange/30">
        <div className="max-w-xl z-10 space-y-4">
          <span className="bg-toyOrange text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-widest inline-block">
            Genuine Official Collectibles
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Maisto & Bburago Diecast Models
          </h1>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            Discover 1:18, 1:24, and 1:64 scale precision diecast cars, bikes, and Formula 1 models. Delivered safely across India with free shipping above ₹2000.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/category/diecast-toys"
              className="bg-toyOrange hover:bg-toyOrange-hover text-white text-xs font-extrabold px-6 py-3 rounded-full transition-colors shadow-lg flex items-center gap-2"
            >
              <span>Explore Diecast Collection</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-1/2 max-w-sm">
          <img
            src="https://toyculture.in/wp-content/uploads/2025/12/4.png"
            alt="Diecast MotoGP Bike"
            className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Diecast Toys Section */}
      <section className="mb-12">
        <ProductGrid
          products={diecastProducts}
          title="Diecast Toys"
          subtitle="Explore authentic scale model bikes, cars, and racing collectibles"
          columns={5}
        />
      </section>

      {/* Construction & Educational Toys Banner Section */}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-toyOrange uppercase tracking-wider">
              Learning Through Play
            </span>
            <h3 className="text-lg font-bold text-toyNavy">Construction Toys & Blocks</h3>
            <p className="text-xs text-gray-500">Spark logic and motor skills with building sets.</p>
            <Link
              to="/category/construction-toys-for-kids"
              className="inline-block text-xs font-bold text-toyOrange hover:underline pt-1"
            >
              Shop Construction Toys →
            </Link>
          </div>
          <img
            src="https://toyculture.in/wp-content/uploads/2025/09/construction_toys_category-1.webp"
            alt="Construction Toys"
            className="w-28 h-28 object-contain"
          />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-toyOrange uppercase tracking-wider">
              Cognitive Skills
            </span>
            <h3 className="text-lg font-bold text-toyNavy">Puzzles & Brain Teasers</h3>
            <p className="text-xs text-gray-500">Educational jigsaw & vehicle puzzles for all ages.</p>
            <Link
              to="/category/puzzles"
              className="inline-block text-xs font-bold text-toyOrange hover:underline pt-1"
            >
              Shop Puzzles →
            </Link>
          </div>
          <img
            src="https://toyculture.in/wp-content/uploads/2025/09/Puzzles-Category-images.avif"
            alt="Puzzles"
            className="w-28 h-28 object-contain"
          />
        </div>
      </section>

      {/* Construction Toys Section */}
      <section className="mb-12">
        <ProductGrid
          products={constructionProducts}
          title="Construction & DIY Toys"
          subtitle="STEM building blocks, mechanical kits, and metal builder sets"
          columns={5}
        />
      </section>

      {/* All Featured Toys Section */}
      <section className="mb-12">
        <ProductGrid
          products={featuredProducts}
          title="Featured Toys"
          subtitle="Handpicked popular toys loved by parents and collectors"
          columns={5}
        />
      </section>
    </div>
  );
};
