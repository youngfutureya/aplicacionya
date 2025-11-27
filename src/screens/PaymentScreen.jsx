// Archivo: src/screens/PaymentScreen.jsx (CÓDIGO COMPLETO)

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import { COLORS } from '../utils/constants';

// *** PENDIENTE DE IMPLEMENTAR: La función real para enviar el pedido a la API ***
const sendOrderToApi = async (orderDetails) => {
    // Por ahora, simulamos una espera de 3 segundos para simular el envío
    return new Promise(resolve => setTimeout(resolve, 3000));
};
// ******************************************************************************

const PaymentScreen = ({ navigation, route }) => {
  const { clearCart, cartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' o 'cash'
  const [loading, setLoading] = useState(false);

  // Datos pasados de OrderDetailsScreen
  const { 
    orderTotal, 
    restaurantId, 
    tableId, 
    customerName, 
    notes 
  } = route.params || {};

  // Función principal para confirmar y enviar el pedido
  const handleConfirmOrder = async () => {
    if (loading) return;
    
    setLoading(true);

    const orderDetails = {
      restaurant_id: restaurantId,
      table_id: tableId,
      customer_name: customerName,
      payment_method: paymentMethod,
      total_amount: orderTotal,
      notes: notes,
      items: cartItems.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        price_unit: item.price,
      }))
    };

    try {
      // 1. Llamar a la función de envío de la API (AQUÍ IRÁ EL AXIOS REAL)
      await sendOrderToApi(orderDetails); 

      // 2. Limpiar el carrito y notificar éxito
      clearCart();
      
      Alert.alert(
        '✅ Pedido Enviado', 
        'Tu pedido ha sido enviado con éxito al restaurante. ¡Buen provecho!',
        [
          // Redirigimos al inicio (QRScanner) para un nuevo pedido
          { text: 'Aceptar', onPress: () => navigation.popToTop() }
        ]
      );
      
    } catch (error) {
      console.error('Error al enviar pedido:', error);
      Alert.alert('Error', 'No se pudo enviar el pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { key: 'card', label: 'Tarjeta de Crédito/Débito', icon: '💳' },
    { key: 'cash', label: 'Efectivo (Pago en Mesa)', icon: '💵' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Confirmar Pago y Pedido</Text>

      {/* Resumen del Pedido */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Cliente: {customerName}</Text>
        <Text style={styles.summaryText}>Mesa: {tableId}</Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL A PAGAR:</Text>
          <Text style={styles.totalAmount}>${orderTotal ? orderTotal.toFixed(2) : '0.00'}</Text>
        </View>
      </View>

      <Text style={styles.methodLabel}>Selecciona Método de Pago:</Text>
      
      {/* Opciones de Método de Pago */}
      <View style={styles.methodOptions}>
        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method.key}
            style={[
              styles.methodCard,
              paymentMethod === method.key && styles.methodSelected
            ]}
            onPress={() => setPaymentMethod(method.key)}
            disabled={loading}
          >
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <Text style={styles.methodText}>{method.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón de Confirmar Pedido */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmOrder}
          disabled={loading || !orderTotal || cartItems.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirmar y Enviar Pedido</Text>
          )}
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
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  // Resumen del Pedido
  summaryBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.success,
  },
  summaryText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  // Opciones de Pago
  methodLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  methodOptions: {
    marginBottom: 20,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  methodSelected: {
    borderColor: COLORS.primary, // Borde azul si está seleccionado
    backgroundColor: '#f1f7ff',
    borderWidth: 2,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  methodText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  confirmButton: {
    backgroundColor: COLORS.success,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;