// Archivo: src/screens/CartScreen.jsx (CÓDIGO COMPLETO)

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// 1. Importamos el hook y los colores
import { useCart } from '../context/CartContext';
import CartItem from '../components/restaurant/CartItem';
import { COLORS } from '../utils/constants';

const CartScreen = ({ navigation }) => {
  // 2. Obtenemos los ítems, el total, y las funciones del contexto
  const { cartItems, total, clearCart } = useCart();

  const renderItem = ({ item }) => (
    <CartItem item={item} />
  );
  
  // Si el carrito está vacío
  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Tu carrito está vacío 😔</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Menu')}
        >
          <Text style={styles.backButtonText}>Volver al Menú</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Mi Pedido 🛒</Text>

      {/* Lista de ítems del carrito */}
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.productId}
        contentContainerStyle={styles.listContainer}
      />
      
      {/* Zona de Totales y Botones de Acción */}
      <View style={styles.footer}>
        <View style={styles.totalsRow}>
          <Text style={styles.totalLabel}>Total a Pagar:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('OrderDetails')}
        >
          <Text style={styles.checkoutButtonText}>Continuar al Pago</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearCart}
        >
          <Text style={styles.clearButtonText}>Vaciar Carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20, 
  },
  // Estilos del Pie de página (Totales y Botones)
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: '#fff',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  checkoutButton: {
    backgroundColor: COLORS.success,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: COLORS.border,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: COLORS.text,
    fontSize: 16,
  },
  // Estilos Carrito Vacío
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  emptyText: {
    fontSize: 20,
    color: COLORS.secondaryText,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  }
});

export default CartScreen;