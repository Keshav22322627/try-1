// India Hyundai Power - Shopping Cart & Order Checkout Context

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbStore } from '../data/dbStore.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [selectedDealerId, setSelectedDealerId] = useState('usr-dealer-ldh');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('ihp_cart_v1');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('ihp_cart_v1', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1) => {
    const existingIndex = cartItems.findIndex(item => item.productId === product.id);
    let updated;
    if (existingIndex > -1) {
      updated = cartItems.map((item, idx) => {
        if (idx === existingIndex) {
          return { ...item, quantity: item.quantity + quantity };
        }
        return item;
      });
    } else {
      const isDealerUser = currentUser?.role === 'DEALER';
      const effectivePrice = isDealerUser && product.dealerPrice ? product.dealerPrice : product.price;
      updated = [
        ...cartItems,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          image: product.images?.[0] || '',
          unitPrice: effectivePrice,
          capacity: product.capacity,
          warranty: product.warranty,
          quantity
        }
      ];
    }
    saveCart(updated);
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, delta) => {
    const updated = cartItems
      .map(item => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    saveCart(updated);
  };

  const removeFromCart = (productId) => {
    const updated = cartItems.filter(item => item.productId !== productId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = subtotal > 20000 ? Math.round(subtotal * 0.05) : 0;
  const tax = Math.round((subtotal - discount) * 0.10);
  const totalAmount = subtotal - discount + tax;
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const checkout = async (checkoutData) => {
    if (!currentUser) {
      throw new Error('Authentication Required: Please sign in to your account before placing an order.');
    }

    if (cartItems.length === 0) throw new Error('Cart is empty');

    const dealers = dbStore.getUsers().filter(u => u.role === 'DEALER');
    const dealer = dealers.find(d => d.id === selectedDealerId) || dealers[0];

    const orderPayload = {
      clientId: currentUser.id,
      clientName: checkoutData.clientName || currentUser.name || 'Customer',
      clientPhone: checkoutData.clientPhone || currentUser.phone || '+91 98000 00000',
      clientEmail: checkoutData.clientEmail || currentUser.email || 'customer@example.com',
      dealerId: dealer?.id || 'usr-dealer-ldh',
      dealerName: dealer?.name || 'Ludhiana Power Hub',
      salesPersonId: dealer?.salesPersonId || 'usr-sp-ldh',
      salesHeadId: dealer?.salesHeadId || 'usr-sh-pb',
      areaId: dealer?.areaId || 'area-ldh-central',
      areaName: dealer?.areaName || 'Ludhiana Central',
      items: cartItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity
      })),
      discount,
      deliveryAddress: checkoutData.address || currentUser.address || '142-B, Mall Road, Ludhiana, Punjab',
      notes: checkoutData.notes || 'Order placed online via India Hyundai Power E-Store'
    };

    const createdOrder = dbStore.createOrder(orderPayload, currentUser);
    clearCart();
    setIsCartOpen(false);
    return createdOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        discount,
        tax,
        totalAmount,
        totalItemsCount,
        selectedDealerId,
        setSelectedDealerId,
        isCartOpen,
        setIsCartOpen,
        checkout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
