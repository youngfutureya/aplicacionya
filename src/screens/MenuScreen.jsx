// Archivo: src/screens/MenuScreen.jsx (CÓDIGO COMPLETO)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
// 1. Ya no se importa MOCK_PRODUCTS
import ProductCard from '../components/restaurant/ProductCard';
import { useCart } from '../context/CartContext';
import { COLORS } from '../utils/constants';
import { getProducts } from '../services/products'; // Importamos la API


const MenuScreen = ({ navigation, route }) => {
  const { totalItems } = useCart();
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Obtenemos los IDs pasados desde QRScannerScreen
  const { restaurantId, tableId } = route.params || {}; 

  useEffect(() => {
    // Función de carga de datos
    const fetchProducts = async () => {
      // Verificamos que tengamos los IDs necesarios
      if (!restaurantId) {
        setError("Error: Falta el ID del restaurante. Vuelve a escanear el QR.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // 2. Llamada a la función real de la API
        const data = await getProducts(restaurantId, tableId); 
        
        setProducts(data); // Guardamos los productos reales
        
      } catch (e) {
        console.error("Fallo al cargar productos:", e);
        setError("Error al cargar el menú desde la API. Revisa la URL y el Backend.");
        setProducts([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [restaurantId, tableId]); 
  
  // Renderizado condicional de Carga o Error
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando Menú de Restaurante ID: {restaurantId}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>🚨 {error}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('QRScanner')} 
        >
          <Text style={styles.backButtonText}>Reintentar Escaneo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Renderizado del Menú
  const renderItem = ({ item }) => (
    <ProductCard product={item} />
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Menú Restaurante #{restaurantId} 🍽️</Text>
      <Text style={styles.subtitle}>Mesa #{tableId}. Selecciona tus platillos:</Text>

      <FlatList
        data={products} // Usamos los productos REALES del estado
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      
      {totalItems > 0 && (
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartButtonText}>Ver Carrito ({totalItems})</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 100, 
  },
  cartButton: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: COLORS.accent, 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.secondaryText,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
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

export default MenuScreen;