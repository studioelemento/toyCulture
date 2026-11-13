import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'toyculture_cart_items';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const showToast = (message) => {
    setToastMessage(message);
    const duration = typeof message === 'string' && /log in/i.test(message) ? 5000 : 3000;
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  const addToCart = (product, quantity = 1) => {
    const isOutOfStock = product?.inStock === false || product?.stock === 0;
    if (isOutOfStock) {
      showToast(`Sorry, "${product?.name || 'This item'}" is currently out of stock.`);
      return;
    }

    setCart((prevCart) => {
      const pId = product?.id || product?.slug;
      const existingIndex = prevCart.findIndex((item) => {
        const existingId = item.product?.id || item.product?.slug || item.id;
        return existingId === pId;
      });

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });

    showToast(`"${product?.name || 'Product'}" has been added to your cart.`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => {
      const id = item.product?.id || item.product?.slug || item.id;
      return id !== productId;
    }));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        const id = item.product?.id || item.product?.slug || item.id;
        return id === productId ? { ...item, quantity: newQuantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const subtotal = cart.reduce((sum, item) => {
    const p = item.product || item;
    const price = Number(p.sellingPrice ?? p.price ?? 0);
    return sum + price * (item.quantity || 1);
  }, 0);

  const shippingFee = subtotal >= 2000 || subtotal === 0 ? 0 : 99;

  const grandTotal = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        shippingFee,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
        toggleCart: () => setIsCartOpen(!isCartOpen),
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
