import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // CORRECCIÓN: Renombramos 'addItem' a 'addToCart' para que coincida con ProductCard
  const addToCart = (product, initialQuantity = 1, notes = '') => {
    setCartItems(currentItems => {
      // 1. Verificar si el ítem (incluyendo la nota) ya existe
      // Nota: Asegúrate que product.id existe (viene del adaptador de products.js)
      const productId = product.id || product.id_producto; 

      const existingItemIndex = currentItems.findIndex(
        item => item.productId === productId && item.notes === notes
      );

      if (existingItemIndex > -1) {
        // Si ya existe con la MISMA NOTA, actualizamos la cantidad
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += initialQuantity;
        return newItems;
      } else {
        // Si es nuevo
        const newItem = {
          productId: productId,
          name: product.name || product.nombre, // Soporte para ambos nombres por si acaso
          price: product.price || product.precio,
          quantity: initialQuantity,
          notes: notes,
          // Guardamos la imagen también para que se vea bonita en el carrito
          image: product.imagen 
        };
        return [...currentItems, newItem];
      }
    });
  };

  const updateQuantity = (productId, change, notes = '') => {
    setCartItems(currentItems => {
      const index = currentItems.findIndex(
        item => item.productId === productId && item.notes === notes
      );
      
      if (index === -1) return currentItems;

      const newItems = [...currentItems];
      newItems[index].quantity += change;

      if (newItems[index].quantity <= 0) {
        newItems.splice(index, 1);
      }
      return newItems;
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const { total, totalItems } = useMemo(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return { total, totalItems };
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart, // <--- Ahora exportamos addToCart
    updateQuantity,
    clearCart,
    total,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};