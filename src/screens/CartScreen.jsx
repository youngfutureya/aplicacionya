import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import CartItem from '../components/restaurant/CartItem';
import { COLORS } from '../utils/constants';
import { sendOrder } from '../services/orders';

const CartScreen = ({ navigation, route }) => {
  const { cartItems, total, clearCart } = useCart();
  // Recibimos los datos, pero ahora "tableId" es solo una sugerencia inicial
  const { restaurantId, tableId: initialTableId } = route.params || {};

  // Estados
  const [isPinModalVisible, setPinModalVisible] = useState(false);
  const [pin, setPin] = useState('');
  // Nuevo estado para la mesa (se inicia con lo que venga de params o vacío)
  const [tableNumber, setTableNumber] = useState(initialTableId ? String(initialTableId) : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOrderRequest = () => {
    setPinModalVisible(true);
  };

  const submitOrder = async () => {
    // 1. Validaciones
    if (!tableNumber.trim()) {
      Alert.alert("Falta información", "Por favor ingresa el número de mesa.");
      return;
    }
    if (!pin || pin.length < 3) {
      Alert.alert("Falta información", "Por favor ingresa un PIN válido (3 dígitos).");
      return;
    }

    setIsSubmitting(true);
    try {
      // 2. Enviar pedido usando la mesa que escribió el usuario
      await sendOrder(restaurantId, tableNumber, pin, cartItems);
      
      // 3. Éxito
      setPinModalVisible(false);
      clearCart(); 
      Alert.alert(
        "¡Pedido Enviado! 👨‍🍳",
        `Tu orden para la Mesa ${tableNumber} ha sido recibida.`,
        [
          { text: "OK", onPress: () => navigation.navigate('Home') }
        ]
      );

    } catch (error) {
      Alert.alert("Error", error.message);
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
        <Text style={styles.emptyText}>Tu carrito está vacío </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver al Menú</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Confirmar Pedido 🛒</Text>
      
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.productId.toString()}
        contentContainerStyle={styles.listContainer}
      />
      
      <View style={styles.footer}>
        <View style={styles.totalsRow}>
          <Text style={styles.totalLabel}>Total Estimado:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleOrderRequest}
        >
          <Text style={styles.checkoutButtonText}>Pedir a Cocina 👨‍🍳</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL DE SEGURIDAD (MESA + PIN) */}
      <Modal
        visible={isPinModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Mesa 🔒</Text>
            <Text style={styles.modalText}>
              Confirma tu número de mesa e ingresa el PIN que te dio el mesero.
            </Text>
            
            {/* Input para la Mesa */}
            <Text style={styles.inputLabel}>Número de Mesa:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 10"
              keyboardType="number-pad"
              value={tableNumber}
              onChangeText={setTableNumber}
            />

            {/* Input para el PIN */}
            <Text style={styles.inputLabel}>PIN de Seguridad:</Text>
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
                  <Text style={styles.modalButtonText}>Enviar</Text>
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
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 10 },
  listContainer: { paddingBottom: 20 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#fff' },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  totalAmount: { fontSize: 22, fontWeight: 'bold', color: COLORS.accent },
  checkoutButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 12, alignItems: 'center' },
  checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  emptyText: { fontSize: 20, color: COLORS.secondaryText, marginBottom: 20 },
  backButton: { backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  backButtonText: { color: '#fff', fontSize: 16 },

  // Estilos del Modal Actualizados
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'stretch', elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10, textAlign: 'center' },
  modalText: { fontSize: 14, color: COLORS.secondaryText, textAlign: 'center', marginBottom: 20 },
  
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 5, marginTop: 10 },
  input: { 
    width: '100%', height: 50, borderWidth: 1, borderColor: COLORS.border, 
    borderRadius: 10, fontSize: 18, paddingHorizontal: 15, backgroundColor: '#f9f9f9', color: '#333' 
  },
  pinInput: { textAlign: 'center', letterSpacing: 5, fontSize: 24 },

  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  modalButton: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#999' },
  confirmButton: { backgroundColor: COLORS.success },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default CartScreen;