// Archivo: src/context/CartContext.jsx

import React, { createContext, useState, useContext, useMemo } from 'react';

// 1. Crear el Contexto
export const CartContext = createContext();

// 2. Crear el Proveedor (Provider) que envuelve a la app
export const CartProvider = ({ children }) => {
  // Estado que guarda los productos: [{ productId: 'p1', name: '...', price: 120, quantity: 1 }]
  const [cartItems, setCartItems] = useState([]);

  // Función para añadir o aumentar la cantidad de un producto
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Buscar si el producto ya existe
      const existingItem = prevItems.find(item => item.productId === product.id);

      if (existingItem) {
        // Si existe, aumentamos la cantidad
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si no existe, lo agregamos con cantidad 1
        return [...prevItems, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
      }
    });
  };

  // Función para reducir la cantidad o eliminar el producto
  const updateQuantity = (productId, amount) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);

      if (!existingItem) return prevItems;

      const newQuantity = existingItem.quantity + amount;

      if (newQuantity <= 0) {
        // Eliminar si la cantidad es cero o negativa
        return prevItems.filter(item => item.productId !== productId);
      } else {
        // Actualizar la cantidad
        return prevItems.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
    });
  };
  
  // Función para vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Cálculos esenciales (se recalculan solo si cartItems cambia)
  const cartTotals = useMemo(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return { total, totalItems };
  }, [cartItems]);

  // 3. Valores que se exportan para que cualquier componente los use
  const contextValue = {
    cartItems,
    addToCart,
    updateQuantity,
    clearCart,
    ...cartTotals,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// 4. Hook personalizado para usar el carrito fácilmente
export const useCart = () => {
  return useContext(CartContext);
};