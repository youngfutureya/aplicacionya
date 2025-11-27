// Archivo: src/components/restaurant/CartItem.jsx (CÓDIGO COMPLETO)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../utils/constants';

const CartItem = ({ item }) => {
  const { updateQuantity } = useCart();
  
  const itemSubtotal = item.price * item.quantity;

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)} c/u</Text>
        
        {/* Muestra la nota/especificación si existe */}
        {item.notes && (
          <Text style={styles.notesText}>
            Especif.: {item.notes} 📝
          </Text>
        )}
      </View>

      <View style={styles.controlsContainer}>
        {/* Usamos item.notes como tercer argumento para identificar el ítem único */}
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.productId, -1, item.notes)}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>

        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.productId, 1, item.notes)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      
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
  // Estilo para la nota
  notesText: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
    marginTop: 3,
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
    minWidth: 70, 
    textAlign: 'right',
  },
});

export default CartItem;