import React from 'react';
import { ProductCard } from '../ProductCard/ProductCard';

export const ProductGrid = ({ products, title, subtitle, columns = 5 }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-500 font-semibold text-sm">No products found matching your request.</p>
      </div>
    );
  }

  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }[columns] || 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';

  return (
    <div className="my-8">
      {title && (
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-toyNavy uppercase tracking-tight">
              {title}
            </h2>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
      )}

      <div className={`grid ${gridColsClass} gap-4 md:gap-6`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
