import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons'; 

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const itemSubtotal = item.precio_venta * item.quantity;

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.nombre}</Text>
        <Text style={styles.price}>${item.precio_venta.toFixed(2)} c/u</Text>
        
        {/* Si hubieran notas, se mostrarían aquí */}
        {item.notes ? (
          <Text style={styles.notesText}>Nota: {item.notes}</Text>
        ) : null}
      </View>

      <View style={styles.actionsContainer}>
        {/* Controles de Cantidad */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id_producto || item.id, -1, item.notes)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id_producto || item.id, 1, item.notes)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Botón Eliminar (Basura) */}
        <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => removeFromCart(item.id_producto || item.id, item.notes)}
        >
            <Ionicons name="trash-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
      
      {/* Subtotal */}
      <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>${itemSubtotal.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 6,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
    marginTop: 3,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginRight: 12,
    padding: 2
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 1
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#fff0f0',
    borderRadius: 8
  },
  subtotalContainer: {
    marginLeft: 10,
    minWidth: 60, 
    alignItems: 'flex-end'
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default CartItem;