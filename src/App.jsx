import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Shopbyage } from './pages/Shopbyage';
import { ShopbyCategory } from './pages/ShopbyCategory';
import { Category } from './pages/Category';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { SearchResults } from './pages/SearchResults';
import { Account } from './pages/Account';
import { PolicyPage } from './pages/PolicyPage';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="shop-by-age" element={<Shopbyage />} />
              <Route path="shop-by-category" element={<ShopbyCategory />} />
              <Route path="category/:categorySlug" element={<Category />} />
              <Route path="product/:productSlug" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="account" element={<Account />} />
              <Route path="privacy-policy" element={<PolicyPage />} />
              <Route path="terms-conditions" element={<PolicyPage />} />
              <Route path="refund-policy" element={<PolicyPage />} />
              <Route path="shipping-policy" element={<PolicyPage />} />
              <Route path="affiliate-registration" element={<PolicyPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}
