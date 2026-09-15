import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNoticeBar } from '../components/Header/TopNoticeBar';
import { MainHeader } from '../components/Header/MainHeader';
import { CategoryNav } from '../components/Header/CategoryNav';
import { MobileNavDrawer } from '../components/Header/MobileNavDrawer';
import { CartDrawer } from '../components/Cart/CartDrawer';
import { Footer } from '../components/Footer/Footer';
import { useCart } from '../context/CartContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toastMessage } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-toyBg text-toyText-primary font-sans relative">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-toyNavy text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-toyOrange/40 animate-slideUp">
          <CheckCircle size={18} className="text-toyGreen flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Stack */}
      <TopNoticeBar />
      <MainHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <CategoryNav />

      {/* Mobile Menu Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* Main Page Viewport */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
};
