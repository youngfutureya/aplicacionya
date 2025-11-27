// Archivo: src/screens/OrderDetailsScreen.jsx (CÓDIGO COMPLETO)

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { COLORS } from '../utils/constants';

const OrderDetailsScreen = ({ navigation, route }) => {
  const { total } = useCart();
  
  // Obtenemos los IDs de la mesa y restaurante de la ruta (vienen del QRScanner)
  const { restaurantId, tableId } = route.params || { restaurantId: 1, tableId: 10 }; // Usamos defaults si no hay params
  
  // Estados para el formulario de detalles
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  // Función para validar y pasar a la siguiente pantalla
  const handleContinue = () => {
    if (customerName.trim().length < 3) {
      Alert.alert('Falta Nombre', 'Por favor, introduce tu nombre para continuar.');
      return;
    }

    // Pasamos todos los datos relevantes a la pantalla de pago
    navigation.navigate('Payment', {
      orderTotal: total,
      restaurantId: restaurantId,
      tableId: tableId,
      customerName: customerName.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Detalles del Pedido 📝</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Información del Contexto de la Mesa */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>RESTAURANTE ID: #{restaurantId}</Text>
          <Text style={styles.infoText}>MESA ASIGNADA: #{tableId}</Text>
        </View>

        {/* Input para el Nombre del Cliente */}
        <Text style={styles.label}>Tu Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Juan Pérez"
          value={customerName}
          onChangeText={setCustomerName}
        />

        {/* Input para Notas/Comentarios Adicionales */}
        <Text style={styles.label}>Notas para el Chef (Opcional):</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Sin cebolla, aderezo extra, etc."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />

        {/* Resumen del Total */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total del Pedido:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        
      </ScrollView>

      {/* Botón de Continuar */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continuar al Método de Pago</Text>
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
  scrollContainer: {
    padding: 20,
    paddingBottom: 100, // Espacio para el footer
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  // Estilos de la Caja de Información de Mesa/Restaurante
  infoBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.accent,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  // Estilos de la Caja de Totales
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 20,
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
  // Estilos del Footer
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
  continueButton: {
    backgroundColor: COLORS.primary,
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

export default OrderDetailsScreen;