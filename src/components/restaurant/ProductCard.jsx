import React, { useState } from 'react';
import { 
  View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, 
  KeyboardAvoidingView, Platform, ScrollView, Pressable 
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const priceValue = parseFloat(product.precio_venta || product.precio || 0);

  const handleAddToCart = () => {
    addToCart(product, quantity, notes);
    setModalVisible(false);
    setQuantity(1);
    setNotes('');
  };

  return (
    <>
      <TouchableOpacity activeOpacity={0.7} style={styles.card} onPress={() => setModalVisible(true)}>
        
        {/* === IMAGEN OCULTA TEMPORALMENTE (CÓDIGO PRESERVADO) === */}
        {/* <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.imagen || 'https://via.placeholder.com/150' }} 
            style={styles.image} 
          />
        </View>
        */}

        <View style={styles.info}>
          <View>
            <Text style={styles.name}>{product.nombre}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {product.descripcion || 'Sin descripción disponible.'}
            </Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>${priceValue.toFixed(2)}</Text>
            <View style={styles.addButton}>
              <Ionicons name="add" size={20} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal Estilo Bottom Sheet */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: '100%' }}
          >
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHandle} />
              
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.modalTitle}>{product.nombre}</Text>
                <Text style={styles.modalDescription}>{product.descripcion}</Text>
                
                <View style={styles.divider} />

                {/* === COMENTARIOS OCULTOS TEMPORALMENTE === */}
                {/* <Text style={styles.label}>¿Algo especial? 📝</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Sin cebolla, extra salsa..."
                  placeholderTextColor="#999"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  blurOnSubmit={true}
                />
                */}

                {/* SELECTOR DE CANTIDAD */}
                <View style={styles.quantitySection}>
                  <Text style={styles.label}>Cantidad</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      onPress={() => setQuantity(Math.max(1, quantity - 1))} 
                      style={styles.qtyButton}
                    >
                      <Ionicons name="remove" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{quantity}</Text>
                    
                    <TouchableOpacity 
                      onPress={() => setQuantity(quantity + 1)} 
                      style={styles.qtyButton}
                    >
                      <Ionicons name="add" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.modalAddButton} onPress={handleAddToCart}>
                  <Text style={styles.modalAddButtonText}>
                    Agregar ${(priceValue * quantity).toFixed(2)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </ScrollView>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 18, 
    marginBottom: 16, 
    padding: 15, // Ajustado porque no hay imagen
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  // imageContainer: { ... }, // Oculto
  // image: { ... },          // Oculto
  info: { 
    flex: 1, 
    // marginLeft: 15, // Ya no es necesario tanto margen si no hay imagen
    justifyContent: 'space-between',
    paddingVertical: 2
  },
  name: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1A1A1A',
    letterSpacing: -0.5
  },
  description: { 
    fontSize: 14, 
    color: '#777', 
    marginTop: 4,
    lineHeight: 20
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12
  },
  price: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: COLORS.primary 
  },
  addButton: { 
    width: 36, 
    height: 36, 
    borderRadius: 12, 
    backgroundColor: COLORS.primary, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24, paddingTop: 12, maxHeight: '90%' },
  modalHandle: { width: 40, height: 5, backgroundColor: '#DDD', borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
  modalDescription: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#1A1A1A' },
  // input: { ... }, // Oculto
  quantitySection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 15, padding: 5 },
  qtyButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  quantityText: { fontSize: 18, fontWeight: '800', marginHorizontal: 20, color: '#1A1A1A' },
  modalAddButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 18, alignItems: 'center', elevation: 5 },
  modalAddButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cancelButton: { padding: 20, alignItems: 'center' },
  cancelButtonText: { color: '#999', fontSize: 16, fontWeight: '600' }
});

export default ProductCard;
