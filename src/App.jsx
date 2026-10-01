import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home/Home';
import { Shopbyage } from './pages/Home/components/Shopbyage';
import { ShopbyCategory } from './pages/Home/components/ShopbyCategory';
import ShopHome from './pages/Home/Shop/ShopHome';

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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}
