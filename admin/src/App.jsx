import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAdmin from "./components/auth/RequireAdmin";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
import Catalog from "./pages/Catalog";
import Brands from "./pages/Brands";
import Categories from "./pages/Categories";
import Reviews from "./pages/Reviews";
import Customers from "./pages/Customers";
import Coupons from "./pages/Coupons";
import Shipping from "./pages/Shipping";

export default function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAdmin />}>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<AddProduct />} />
              <Route path="products/:id/edit" element={<AddProduct />} />
              <Route path="orders" element={<Orders />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="shipping" element={<Shipping />} />
              <Route path="customers" element={<Customers />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="brands" element={<Brands />} />
              <Route path="categories" element={<Categories />} />
              <Route path="reviews" element={<Reviews />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
