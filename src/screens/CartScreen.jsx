import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import CartItem from '../components/restaurant/CartItem';
import { COLORS } from '../utils/constants';
// Importamos la función actualizada
import { sendOrder } from '../services/orders';

const CartScreen = ({ navigation, route }) => {
  const { cartItems, total, clearCart } = useCart();
  const { restaurantId, tableId: initialTableId } = route.params || {};

  // Estados para la lógica del pedido
  const [isPinModalVisible, setPinModalVisible] = useState(false);
  const [pin, setPin] = useState('');
  const [tableNumber, setTableNumber] = useState(initialTableId ? String(initialTableId) : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NUEVO ESTADO: Controla qué método de pago eligió el usuario
  const [paymentMethod, setPaymentMethod] = useState('tarjeta'); // valor por defecto

  const handleOrderRequest = () => {
    setPinModalVisible(true);
  };

  const submitOrder = async () => {
    // 1. Validaciones básicas
    if (!tableNumber.trim()) {
      Alert.alert("Falta información", "Por favor ingresa el número de mesa.");
      return;
    }
    if (!pin || pin.length < 3) {
      Alert.alert("Falta información", "Por favor ingresa un PIN válido.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 2. Enviamos todo junto: Ubicación + Seguridad + Pago
      // Nota: Pasamos 'paymentMethod' como último argumento
      await sendOrder(restaurantId, tableNumber, pin, cartItems, paymentMethod);
      
      // 3. Éxito: Limpiamos y redirigimos
      setPinModalVisible(false);
      clearCart(); 
      Alert.alert(
        "¡Pedido en camino! 🚀",
        `La cocina ha recibido tu orden para la Mesa ${tableNumber}.`,
        [{ text: "Entendido", onPress: () => navigation.navigate('Home') }]
      );

    } catch (error) {
      Alert.alert("Hubo un problema", error.message || "No se pudo conectar con el restaurante.");
    } finally {
      setIsSubmitting(false);
      setPin(''); 
    }
  };

  const renderItem = ({ item }) => (
    <CartItem item={item} />
  );
  
  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aún no has agregado platillos 🍽️</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Ir al Menú</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Tu Pedido 🛒</Text>
      
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => (item.id || item.productId).toString() + (item.notes || '')}
        contentContainerStyle={styles.listContainer}
      />
      
      {/* Footer con el total y botón de acción */}
      <View style={styles.footer}>
        <View style={styles.totalsRow}>
          <Text style={styles.totalLabel}>Total a Pagar:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleOrderRequest}>
          <Text style={styles.checkoutButtonText}>Confirmar Orden ✅</Text>
        </TouchableOpacity>
      </View>

      {/* --- MODAL UNIFICADO (TODO EN UNO) --- */}
      <Modal
        visible={isPinModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Finalizar Pedido 🔒</Text>
            
            {/* 1. Confirmar Mesa */}
            <Text style={styles.inputLabel}>Número de Mesa:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 5"
              keyboardType="number-pad"
              value={tableNumber}
              onChangeText={setTableNumber}
            />

            {/* 2. Selección de Método de Pago */}
            <Text style={styles.inputLabel}>¿Cómo deseas pagar?</Text>
            <View style={styles.paymentSelector}>
                <TouchableOpacity 
                    style={[styles.paymentOption, paymentMethod === 'tarjeta' && styles.paymentOptionSelected]}
                    onPress={() => setPaymentMethod('tarjeta')}
                >
                    <Text style={styles.paymentIcon}>💳</Text>
                    <Text style={[styles.paymentText, paymentMethod === 'tarjeta' && styles.paymentTextSelected]}>Tarjeta</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.paymentOption, paymentMethod === 'efectivo' && styles.paymentOptionSelected]}
                    onPress={() => setPaymentMethod('efectivo')}
                >
                    <Text style={styles.paymentIcon}>💵</Text>
                    <Text style={[styles.paymentText, paymentMethod === 'efectivo' && styles.paymentTextSelected]}>Efectivo</Text>
                </TouchableOpacity>
            </View>

            {/* 3. PIN de Seguridad */}
            <Text style={styles.inputLabel}>PIN del Mesero:</Text>
            <TextInput
              style={[styles.input, styles.pinInput]}
              placeholder="***"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry={true}
              value={pin}
              onChangeText={setPin}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setPinModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={submitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Enviar a Cocina</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 15 },
  listContainer: { paddingBottom: 20 },
  
  // Footer mejorado
  footer: { padding: 25, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#fff', elevation: 20 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  totalLabel: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: COLORS.accent },
  checkoutButton: { 
    backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 
  },
  checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Empty state
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  emptyText: { fontSize: 18, color: COLORS.secondaryText, marginBottom: 20 },
  backButton: { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25 },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Estilos del Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 25, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15, textAlign: 'center' },
  
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.secondaryText, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 16, color: COLORS.text },
  pinInput: { textAlign: 'center', letterSpacing: 8, fontSize: 24, fontWeight: 'bold' },

  // Estilos del Selector de Pago (Visualmente claros)
  paymentSelector: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  paymentOption: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    padding: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#fff' 
  },
  paymentOptionSelected: { 
    borderColor: COLORS.success, backgroundColor: '#e8f8f5', borderWidth: 2 
  },
  paymentIcon: { fontSize: 20, marginRight: 8 },
  paymentText: { fontWeight: '600', color: COLORS.secondaryText },
  paymentTextSelected: { color: COLORS.success, fontWeight: 'bold' },

  modalButtons: { flexDirection: 'row', marginTop: 25, gap: 15 },
  modalButton: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#e0e0e0' },
  confirmButton: { backgroundColor: COLORS.success },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CartScreen;