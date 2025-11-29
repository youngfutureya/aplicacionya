import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../utils/constants';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleAddToCart = () => {
    addToCart(product, quantity, notes);
    setModalVisible(false);
    setQuantity(1);
    setNotes('');
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)}>
        <Image source={{ uri: product.imagen || 'https://via.placeholder.com/150' }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{product.nombre}</Text>
          <Text style={styles.description} numberOfLines={2}>{product.descripcion}</Text>
          <Text style={styles.price}>${product.precio}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{product.nombre}</Text>
                <Text style={styles.modalDescription}>{product.descripcion}</Text>
                
                <Text style={styles.label}>¿Algo especial? (Opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Sin cebolla, extra salsa..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                />

                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyButton}>
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{quantity}</Text>
                  <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyButton}>
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.modalAddButton} onPress={handleAddToCart}>
                  <Text style={styles.modalAddButtonText}>
                    Agregar al Pedido - ${(product.precio * quantity).toFixed(2)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Cancelar</Text>
                </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, padding: 10, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#eee' },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  description: { fontSize: 12, color: '#666', marginTop: 4 },
  price: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary, marginTop: 6 },
  addButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: COLORS.primary },
  modalDescription: { fontSize: 14, color: '#666', marginBottom: 20 },
  label: { fontWeight: 'bold', marginBottom: 10, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, height: 80, textAlignVertical: 'top', marginBottom: 20, backgroundColor: '#f9f9f9' },
  quantityContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  qtyButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  quantity: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 25 },
  modalAddButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  modalAddButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  closeButton: { padding: 15, alignItems: 'center' },
  closeButtonText: { color: '#888', fontSize: 16 }
});

export default ProductCard;