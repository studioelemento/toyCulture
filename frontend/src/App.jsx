import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home/Home';
import { Shopbyage } from './pages/Home/components/Shopbyage';
import { ShopbyCategory } from './pages/Home/components/ShopbyCategory';
import ShopHome from './pages/Home/Shop/ShopHome';
import SingleProduct from './pages/Home/Shop/SingleProduct';
import { ProductDetails } from './pages/ProductDetails';
import CartPage from './pages/Cart/CartPage';
import CartCheckout from './pages/Cart/CartCheckout';
import Login from './pages/Login/Login';

import AccountMain from './pages/MyAccount/AccountMain';
import MyOrder from './pages/MyAccount/MyOrder';
import MyOrderDetailes from './pages/MyAccount/MyOrderDetailes';
import MyAddresses from './pages/MyAccount/MyAddresses';
import PersonalDetails from './pages/MyAccount/PersonalDetails';
import MyWishlist from './pages/MyAccount/MyWishlist';
import HelpSupport from './pages/MyAccount/HelpSupport';
import Coupons from './pages/MyAccount/Coupons';
import ScrollToTop from './components/Common/ScrollToTop';

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<ShopHome />} />
              <Route path="shop-by-age" element={<Shopbyage />} />
              <Route path="shop-by-category" element={<ShopbyCategory />} />
              <Route path="product/:id" element={<SingleProduct />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CartCheckout />} />
              <Route path="account" element={<AccountMain />} />
              <Route path="account/orders" element={<MyOrder />} />
              <Route path="account/orders/:id" element={<MyOrderDetailes />} />
              <Route path="account/order-details" element={<MyOrderDetailes />} />
              <Route path="account/addresses" element={<MyAddresses />} />
              <Route path="account/personal" element={<PersonalDetails />} />
              <Route path="account/personal-details" element={<PersonalDetails />} />
              <Route path="personal-details" element={<PersonalDetails />} />
              <Route path="account/wishlist" element={<MyWishlist />} />
              <Route path="account/my-wishlist" element={<MyWishlist />} />
              <Route path="wishlist" element={<MyWishlist />} />
              <Route path="account/support" element={<HelpSupport />} />
              <Route path="account/help" element={<HelpSupport />} />
              <Route path="account/help-support" element={<HelpSupport />} />
              <Route path="account/coupons" element={<Coupons />} />
              <Route path="account/offers" element={<Coupons />} />
              <Route path="account/rewards" element={<Coupons />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="help-support" element={<HelpSupport />} />
              <Route path="support" element={<HelpSupport />} />
              <Route path="my-account" element={<AccountMain />} />
              <Route path="orders" element={<MyOrder />} />
              <Route path="orders/:id" element={<MyOrderDetailes />} />
              <Route path="my-orders" element={<MyOrder />} />
              <Route path="addresses" element={<MyAddresses />} />
              <Route path="my-addresses" element={<MyAddresses />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}
