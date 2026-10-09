import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home/Home';
import { Shopbyage } from './pages/Home/components/Shopbyage';
import { ShopbyCategory } from './pages/Home/components/ShopbyCategory';
import ShopHome from './pages/Home/Shop/ShopHome';
import { ProductDetails } from './pages/ProductDetails';
import CartPage from './pages/Cart/CartPage';
import CartCheckout from './pages/Cart/CartCheckout';

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<ShopHome />} />
              <Route path="shop-by-age" element={<Shopbyage />} />
              <Route path="shop-by-category" element={<ShopbyCategory />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CartCheckout />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}
