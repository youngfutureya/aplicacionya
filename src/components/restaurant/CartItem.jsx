// Archivo: src/components/restaurant/CartItem.jsx (CÓDIGO COMPLETO)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Importamos el hook y los colores
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../utils/constants';

const CartItem = ({ item }) => {
  // Obtenemos la función para actualizar la cantidad
  const { updateQuantity } = useCart();
  
  // Calcula el subtotal para este ítem
  const itemSubtotal = item.price * item.quantity;

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)} c/u</Text>
      </View>

      <View style={styles.controlsContainer}>
        {/* Botón para restar cantidad */}
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.productId, -1)}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        {/* Contador de Cantidad */}
        <Text style={styles.quantityText}>{item.quantity}</Text>

        {/* Botón para sumar cantidad */}
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.productId, 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      {/* Muestra el subtotal del ítem */}
      <Text style={styles.subtotalText}>${itemSubtotal.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  price: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  quantityButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    minWidth: 70, // Para que el texto no baile al cambiar
    textAlign: 'right',
  },
});

export default CartItem;