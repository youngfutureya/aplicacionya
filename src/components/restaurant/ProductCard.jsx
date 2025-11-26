// Archivo: src/components/restaurant/ProductCard.jsx (CÓDIGO COMPLETO)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../../context/CartContext';
// 1. Importamos los colores de la marca
import { COLORS } from '../../utils/constants';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
      
      {/* Botón para añadir al carrito */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => addToCart(product)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.background, // Fondo claro
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary, // Detalle de la marca
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  description: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent, // Usamos el rojo de la marca para el precio
  },
  addButton: {
    backgroundColor: COLORS.success, // Usamos un color de éxito para el +
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  }
});

export default ProductCard;