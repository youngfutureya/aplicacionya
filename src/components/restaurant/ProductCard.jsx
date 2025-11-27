// Archivo: src/components/restaurant/ProductCard.jsx (CÓDIGO COMPLETO Y FINAL)

import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, 
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../utils/constants';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const [isModalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Maneja la adición del producto al carrito
  const handleAddToCart = () => {
    if (quantity <= 0) {
      Alert.alert('Cantidad Inválida', 'Debes agregar al menos un producto.');
      return;
    }
    
    addItem(product, quantity, notes.trim());

    // Reiniciamos y cerramos el modal
    setQuantity(1);
    setNotes('');
    setModalVisible(false);
  };
  
  const handleOpenModal = () => {
      setModalVisible(true);
  };
  
  // Función para cerrar el modal y resetear
  const handleCloseModal = () => {
      setQuantity(1);
      setNotes('');
      setModalVisible(false);
  };

  return (
    <View style={styles.card}>
      {/* Información del Producto */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>

      {/* Botón de Agregar (Abre el Modal) */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleOpenModal} 
      >
        <Text style={styles.addButtonText}>+ Agregar</Text>
      </TouchableOpacity>
      
      {/* ------------------ MODAL DE CONFIGURACIÓN ------------------ */}
      <Modal
        animationType="slide"
        // 🛑 CLAVE: Ya no es transparente. Ocupa toda la pantalla.
        transparent={false} 
        visible={isModalVisible}
        onRequestClose={handleCloseModal} 
        hardwareAccelerated={true} 
      >
        {/* Contenedor que simula el fondo oscuro */}
        <View style={styles.modalTransparentContainer}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Bloquea toques de fondo y descarta el teclado */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        
                        <View style={styles.modalContent}>
                        
                            <Text style={styles.modalTitle}>Personalizar {product.name}</Text>
                            <Text style={styles.modalSubtitle}>Precio: ${product.price.toFixed(2)}</Text>

                            {/* Selector de Cantidad */}
                            <Text style={styles.label}>Cantidad:</Text>
                            <View style={styles.quantityControl}>
                            <TouchableOpacity 
                                style={styles.quantityButton}
                                onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                            >
                                <Text style={styles.controlText}>-</Text>
                            </TouchableOpacity>
                            
                            <Text style={styles.quantityDisplay}>{quantity}</Text>
                            
                            <TouchableOpacity 
                                style={styles.quantityButton}
                                onPress={() => setQuantity(prev => prev + 1)}
                            >
                                <Text style={styles.controlText}>+</Text>
                            </TouchableOpacity>
                            </View>

                            {/* Notas de Personalización */}
                            <Text style={styles.label}>Notas/Especificaciones (Opcional):</Text>
                            <TextInput
                                style={styles.notesInput}
                                placeholder="Ej: Sin cebolla, poco picante, etc."
                                multiline
                                numberOfLines={3}
                                value={notes}
                                onChangeText={setNotes}
                            />
                            
                            {/* Total del Ítem antes de agregar */}
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Subtotal:</Text>
                                <Text style={styles.totalAmount}>${(product.price * quantity).toFixed(2)}</Text>
                            </View>

                            {/* Botones de Acción */}
                            <TouchableOpacity 
                                style={styles.confirmButton}
                                onPress={handleAddToCart}
                            >
                                <Text style={styles.confirmButtonText}>Añadir {quantity} al Carrito</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.cancelButton}
                                onPress={handleCloseModal}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
      </Modal>
      {/* ------------------ FIN DEL MODAL ------------------ */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  description: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  addButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // --- Estilos del Modal ---
  modalTransparentContainer: { // Simula el fondo oscuro
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: { // Contenedor de KeyboardAvoidingView
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 5,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quantityButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  controlText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantityDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 40,
    textAlign: 'center',
  },
  notesInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    textAlignVertical: 'top',
    height: 80,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 20,
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
  confirmButton: {
    backgroundColor: COLORS.success,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.secondaryText,
    fontSize: 16,
  },
});

export default ProductCard;