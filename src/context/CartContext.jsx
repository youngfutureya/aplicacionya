import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native'; 
import { API_URL } from '../utils/constants'; 

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // Datos de Sesión
  const [restaurantData, setRestaurantData] = useState({ restaurantId: null, name: '' });
  const [pin, setPin] = useState(null); 
  const [tableId, setTableId] = useState(null);

  // === MAGIA DE AUTO-EXPULSIÓN ===
  // Verifica periódicamente si la sesión sigue activa en el servidor
  useEffect(() => {
    let interval;
    if (pin) {
        interval = setInterval(async () => {
            try {
                const response = await fetch(`${API_URL}/api/movil/verificar-sesion/${pin}`);
                const data = await response.json();

                if (data.valida === false) {
                    Alert.alert(
                        "Mesa Cerrada", 
                        "El mesero ha cerrado la cuenta. ¡Gracias por su visita!",
                        [{ text: "OK", onPress: () => exitSession() }]
                    );
                    exitSession(); 
                }
            } catch (error) {
                console.log("Check sesión fallido (red)", error);
            }
        }, 5000); 
    }
    return () => {
        if (interval) clearInterval(interval);
    };
  }, [pin]); 

  // === FUNCIONES DEL CARRITO ===

  const addToCart = (product, quantity = 1, notes = '') => {
    setCartItems(prev => {
      // Normalización de ID: prioridad a id_producto
      const productId = product.id_producto || product.id;
      const precio = parseFloat(product.precio_venta || product.precio || 0);
      
      // Buscamos si ya existe el producto CON LAS MISMAS NOTAS
      const existingIndex = prev.findIndex(item => 
        (item.id_producto || item.id) === productId && item.notes === notes
      );

      if (existingIndex >= 0) {
        // Si existe, actualizamos cantidad
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        // Si no, agregamos nuevo item
        return [...prev, { 
            ...product, 
            id_producto: productId, 
            precio_venta: precio, 
            quantity: quantity,
            notes: notes 
        }];
      }
    });
  };

  // Función para modificar cantidad (+/-)
  const updateQuantity = (productId, change, notes) => {
    setCartItems(prev => {
      return prev.map(item => {
        // Identificamos por ID y por Notas para no afectar otros items iguales pero con notas distintas
        if ((item.id_producto || item.id) === productId && item.notes === notes) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      });
    });
  };

  // Función para eliminar item (Bote de basura)
  const removeFromCart = (productId, notes) => {
    setCartItems(prev => prev.filter(item => 
        !((item.id_producto || item.id) === productId && item.notes === notes)
    ));
  };

  const clearCart = () => setCartItems([]);
  
  const exitSession = () => {
    setCartItems([]);
    setPin(null);
    setTableId(null);
    setRestaurantData({ restaurantId: null, name: '' });
  };

  const total = cartItems.reduce((sum, item) => sum + (item.precio_venta * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, updateQuantity, removeFromCart, clearCart, exitSession, 
      total, totalItems, 
      restaurantData, setRestaurantData, 
      pin, setPin, 
      tableId, setTableId 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);