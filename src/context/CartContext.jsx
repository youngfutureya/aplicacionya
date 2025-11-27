// Archivo: src/context/CartContext.js (CÓDIGO COMPLETO)

import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // El carrito guardará objetos con { productId, name, price, quantity, notes }
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar un producto al carrito
  const addItem = (product, initialQuantity = 1, notes = '') => {
    setCartItems(currentItems => {
      // 1. Verificar si el ítem (incluyendo la nota) ya existe
      const existingItemIndex = currentItems.findIndex(
        // Un ítem es igual solo si el producto es el mismo Y la nota es la misma
        item => item.productId === product.id && item.notes === notes
      );

      if (existingItemIndex > -1) {
        // Si ya existe con la MISMA NOTA, crea una copia y actualiza la cantidad
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += initialQuantity;
        return newItems;
      } else {
        // Si es un ítem nuevo (o si tiene una nota diferente)
        const newItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: initialQuantity,
          notes: notes, // <--- GUARDAMOS LA NOTA
        };
        return [...currentItems, newItem];
      }
    });
  };

  // Función para modificar la cantidad de un ítem existente
  // Recibe la nota para identificar el ítem único
  const updateQuantity = (productId, change, notes = '') => {
    setCartItems(currentItems => {
      // 1. Encuentra el ítem por ID y nota
      const index = currentItems.findIndex(
        item => item.productId === productId && item.notes === notes
      );
      
      if (index === -1) return currentItems;

      const newItems = [...currentItems];
      newItems[index].quantity += change;

      if (newItems[index].quantity <= 0) {
        // Si la cantidad es cero o menos, eliminamos el ítem
        newItems.splice(index, 1);
      }
      return newItems;
    });
  };
  
  // Función para vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Cálculo del total y del número total de ítems (usando useMemo para optimizar)
  const { total, totalItems } = useMemo(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return { total, totalItems };
  }, [cartItems]);

  const value = {
    cartItems,
    addItem,
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