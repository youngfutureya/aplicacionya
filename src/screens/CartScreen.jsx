import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { CartContext } from '../context/CartContext';
import { COLORS, API_URL } from '../utils/constants';
// IMPORTANTE: Conectamos tu componente de item
import CartItem from '../components/restaurant/CartItem';

const CartScreen = ({ navigation }) => {
  const { cartItems, total, clearCart, pin, setPin, setTableId } = useContext(CartContext);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) return Alert.alert("Carrito vacío", "Agrega algo primero.");
    // Si ya tenemos PIN (sesión activa), enviamos directo. Si no, pedimos PIN.
    if (pin) {
      sendOrderToBackend(pin);
    } else {
      setModalVisible(true);
    }
  };

  const confirmPin = () => {
    if (!inputPin || inputPin.length < 3) return Alert.alert("Error", "PIN muy corto.");
    setPin(inputPin);
    setModalVisible(false);
    sendOrderToBackend(inputPin);
  };

  const sendOrderToBackend = async (pinCode) => {
    setLoading(true);
    try {
      const orderPayload = {
        pin: pinCode,
        items: cartItems.map(item => ({
          // Aseguramos que se envíe el ID correcto al backend
          id_producto: item.id_producto || item.id,
          cantidad: item.quantity,
          notas: item.notes || '' 
        }))
      };

      const response = await fetch(`${API_URL}/api/movil/pedido`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (response.ok) {
        // Si el backend nos devuelve la mesa asignada, la guardamos
        if(data.mesa) setTableId(data.mesa); 
        
        clearCart();
        navigation.navigate('OrderDetails'); 
      } else {
        Alert.alert("Error", data.message || "No se pudo enviar.");
        // Si el error es de autenticación (401), limpiamos el PIN para obligar a reingresarlo
        if (response.status === 401) setPin(null);
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error de Conexión", "Revisa tu internet o intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu Pedido 🛒</Text>
      
      <FlatList
        data={cartItems}
        // AQUI ESTA LA MAGIA: Usamos CartItem en lugar de una View simple
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
            <Text style={styles.emptyText}>Tu carrito está vacío. ¡Pide algo rico!</Text>
        }
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.total}>${total.toFixed(2)}</Text>
        </View>
        
        {loading ? <ActivityIndicator size="large" color={COLORS.primary}/> : (
            <TouchableOpacity style={styles.btn} onPress={handleCheckout}>
                <Text style={styles.btnText}>CONFIRMAR Y PEDIR</Text>
            </TouchableOpacity>
        )}
      </View>

      {/* Modal para ingresar PIN */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>🔐 Código de Mesa</Text>
            <Text style={styles.modalSubtitle}>Pide el PIN al mesero para iniciar.</Text>
            
            <TextInput 
                style={styles.input} 
                placeholder="000" 
                keyboardType="numeric" 
                maxLength={3}
                // autoFocus={true} // A veces causa bugs en Android, probar con cuidado
                onChangeText={setInputPin} 
            />
            
            <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnCancel}>
                    <Text style={styles.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnConfirm} onPress={confirmPin}>
                    <Text style={styles.btnText}>Confirmar</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 50, backgroundColor: '#F8F9FA' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 20, color: '#2c3e50' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#95a5a6' },
  
  footer: { 
    borderTopWidth: 1, 
    borderColor: '#eee', 
    paddingTop: 20, 
    paddingBottom: 30,
    backgroundColor: '#F8F9FA'
  },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 15 },
  totalLabel: { fontSize: 18, color: '#7f8c8d' },
  total: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50' },
  
  btn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 16, alignItems: 'center', shadowColor: "#000", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.2, elevation: 5 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  
  // Estilos del Modal
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', backgroundColor: '#fff', padding: 25, borderRadius: 20, alignItems: 'center', elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#2c3e50' },
  modalSubtitle: { fontSize: 14, color: '#95a5a6', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', backgroundColor: '#f1f2f6', borderRadius: 12, padding: 15, fontSize: 24, textAlign: 'center', fontWeight: 'bold', letterSpacing: 5, marginBottom: 25 },
  modalActions: { flexDirection: 'row', gap: 15, width: '100%' },
  btnCancel: { flex: 1, padding: 15, alignItems: 'center' },
  btnConfirm: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 12, padding: 15, alignItems: 'center' },
  btnCancelText: { color: '#7f8c8d', fontWeight: '600' }
});

export default CartScreen;