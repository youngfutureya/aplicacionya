import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SectionList, 
  ActivityIndicator, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  StatusBar,
  ScrollView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import ProductCard from '../components/restaurant/ProductCard'; // Asumo que este componente ya maneja el 'addToCart'
import { COLORS, API_URL } from '../utils/constants'; // Importa tu URL real
import { useCart } from '../context/CartContext'; 

const MenuScreen = ({ navigation }) => {
  const { totalItems, total } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // 1. CARGA DE DATOS REAL
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      // Hardcodeamos id_restaurante=1 por ahora, como en tu backend
      const response = await fetch(`${API_URL}/api/movil/menu?restaurant_id=1`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando menú:", error);
      Alert.alert("Error", "No se pudo cargar el menú. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  // 2. LÓGICA DE FILTRADO Y AGRUPACIÓN
  const getSectionedProducts = () => {
    // A. Filtrar por búsqueda
    let filtered = products.filter(p => 
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // B. Filtrar por categoría seleccionada (si no es 'Todos')
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(p => p.categoria === selectedCategory);
    }

    // C. Agrupar por categoría para la SectionList
    const grouped = filtered.reduce((acc, product) => {
      const category = product.categoria || 'Varios';
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});

    // D. Convertir a formato de array para SectionList
    // Ordenamos para que 'Platillos' o 'Bebidas' salgan primero si quieres, 
    // por ahora orden alfabético de categoría
    return Object.keys(grouped).sort().map(key => ({
      title: key,
      data: grouped[key]
    }));
  };

  // Obtener categorías únicas para la barra superior
  const categories = ['Todos', ...new Set(products.map(p => p.categoria || 'Varios'))];

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title.toUpperCase()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 1. HEADER CON BUSCADOR */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué se te antoja hoy?"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 2. BARRA DE CATEGORÍAS (Horizontal) */}
      {!loading && (
        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip, 
                  selectedCategory === cat && styles.categoryChipSelected
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[
                  styles.categoryText, 
                  selectedCategory === cat && styles.categoryTextSelected
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 3. LISTA DE PRODUCTOS */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <SectionList
          sections={getSectionedProducts()}
          keyExtractor={(item) => item.id_producto.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={[
            styles.listContent, 
            totalItems > 0 && { paddingBottom: 100 } // Espacio para la barra del carrito
          ]}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No encontramos productos 😢</Text>
            </View>
          }
        />
      )}

      {/* 4. BARRA FLOTANTE DEL CARRITO (Solo si hay items) */}
      {totalItems > 0 && (
        <TouchableOpacity 
          style={styles.cartBar} 
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.9}
        >
          <View style={styles.cartInfo}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
            <Text style={styles.viewCartText}>Ver pedido</Text>
          </View>
          <Text style={styles.totalText}>${total.toFixed(2)}</Text>
        </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  
  // Header Buscador
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 50,
    paddingBottom: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowOpacity: 0.05
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333', height: '100%' },

  // Categorías
  categoriesContainer: { paddingHorizontal: 15, paddingVertical: 12 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary, // Usa tu color principal
    borderColor: COLORS.primary,
  },
  categoryText: { color: '#666', fontWeight: '600' },
  categoryTextSelected: { color: '#fff', fontWeight: 'bold' },

  // Lista
  listContent: { paddingHorizontal: 15, paddingBottom: 20 },
  sectionHeader: {
    backgroundColor: '#f9f9f9', // Mismo color del fondo para que no se note corte
    paddingVertical: 15,
    marginTop: 5
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    letterSpacing: 0.5
  },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#999', fontSize: 16 },

  // Barra Carrito Flotante
  cartBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cartInfo: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    backgroundColor: '#fff',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  badgeText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  viewCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  totalText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default MenuScreen;