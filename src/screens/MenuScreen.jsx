// Archivo: src/screens/MenuScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import ProductCard from '../components/restaurant/ProductCard';
import { useCart } from '../context/CartContext';
import { COLORS } from '../utils/constants';
import { getProducts } from '../services/products';

const MenuScreen = ({ navigation, route }) => {
  const { totalItems } = useCart();
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const { restaurantId, tableId } = route.params || {}; 

  useEffect(() => {
    let isMounted = true; // Evita errores si te sales de la pantalla

    const fetchProducts = async (isBackgroundRefresh = false) => {
      if (!restaurantId) {
        if (isMounted) {
            setError("Falta ID del restaurante.");
            setLoading(false);
        }
        return;
      }
      
      try {
        // Solo mostramos el spinner la primera vez
        if (!isBackgroundRefresh) setLoading(true);
        setError(null);
        
        const data = await getProducts(restaurantId, tableId); 
        
        if (isMounted) {
            setProducts(data);
        }
        
      } catch (e) {
        console.error("Error cargando menú:", e);
        // Si falla el refresh automático, no borramos la pantalla, solo ignoramos
        if (!isBackgroundRefresh && isMounted) {
            setError("Error de conexión con el Menú.");
        }
      } finally {
        if (!isBackgroundRefresh && isMounted) setLoading(false);
      }
    };

    // 1. Carga Inicial Inmediata
    fetchProducts();

    // 2. Configurar el Auto-Refresh cada 10 segundos (10000 ms)
    const intervalId = setInterval(() => {
        fetchProducts(true); // 'true' para que sea silencioso (sin spinner)
    }, 10000);

    // 3. Limpieza al salir de la pantalla (importante para no dejar procesos fantasma)
    return () => {
        isMounted = false;
        clearInterval(intervalId);
    };

  }, [restaurantId, tableId]); 
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando Menú...</Text>
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
          <Text style={styles.backButtonText}>Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <ProductCard product={item} />
  );
  
  return (
    <View style={styles.container}>
     
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id_producto ? item.id_producto.toString() : Math.random().toString()}
        contentContainerStyle={styles.listContainer}
      />
  
      {totalItems > 0 && (
        <TouchableOpacity 
          style={styles.cartButton}
          // CAMBIO AQUÍ: Pasamos los IDs al navegar
          onPress={() => navigation.navigate('Cart', { restaurantId, tableId })}
        >
          <Text style={styles.cartButtonText}>Ver Pedido ({totalItems})</Text>
        </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.secondaryText, textAlign: 'center', marginBottom: 10 },
  listContainer: { paddingBottom: 100 },
  cartButton: {
    position: 'absolute', bottom: 25, right: 20,
    backgroundColor: COLORS.accent, paddingVertical: 12, paddingHorizontal: 25,
    borderRadius: 30, elevation: 8,
  },
  cartButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  loadingText: { marginTop: 10, fontSize: 16, color: COLORS.secondaryText },
  errorText: { fontSize: 18, color: COLORS.accent, textAlign: 'center', marginBottom: 20 },
  backButton: { backgroundColor: COLORS.primary, padding: 10, borderRadius: 5 },
  backButtonText: { color: '#fff', fontSize: 16 }
});

export default MenuScreen;