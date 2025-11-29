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
  Modal, 
  Platform,      
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import ProductCard from '../components/restaurant/ProductCard';
import { getProducts } from '../services/products';
import { requestBill } from '../services/orders';
import { COLORS } from '../utils/constants';
// IMPORTANTE: Recuperamos el contexto del carrito
import { useCart } from '../context/CartContext'; 

const MenuScreen = ({ route, navigation }) => {
  const { restaurantId, tableId } = route.params || {}; 
  
  // Hook del carrito para saber si mostrar el botón
  const { totalItems, total } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [billModalVisible, setBillModalVisible] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cargar el menú.');
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE CATEGORÍAS ---
  const availableCategories = [...new Set(products.map(p => p.categoria || 'Varios'))];
  const priorityOrder = ['Platillos', 'Bebidas', 'Postres'];

  const uniqueCategories = ['Todos', ...availableCategories.sort((a, b) => {
    const idxA = priorityOrder.indexOf(a);
    const idxB = priorityOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  })];

  const getSectionedProducts = () => {
    let filtered = products.filter(p => 
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (selectedCategory !== 'Todos') {
        filtered = filtered.filter(p => (p.categoria || 'Varios') === selectedCategory);
    }

    const grouped = filtered.reduce((acc, product) => {
      const category = product.categoria || 'Varios'; 
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    return Object.keys(grouped).map(key => ({
      title: key,
      data: grouped[key]
    })).sort((a, b) => {
        const idxA = priorityOrder.indexOf(a.title);
        const idxB = priorityOrder.indexOf(b.title);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.title.localeCompare(b.title);
    });
  };

  const handleRequestBill = async (method) => {
    setBillModalVisible(false);
    if(!tableId) {
        Alert.alert("¿En qué mesa estás?", "Escanea el QR primero.", [
            { text: "Escanear", onPress: () => navigation.navigate('QRScanner') },
            { text: "Cancelar" }
        ]);
        return;
    }
    try {
        await requestBill(restaurantId, tableId, method);
        Alert.alert("¡Listo! 🧾", "Hemos avisado al mesero.");
    } catch (error) {
        Alert.alert("Aviso", "Hubo un problema de conexión.");
    }
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* HEADER PRINCIPAL */}
      <View style={styles.searchHeader}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={32} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#999" style={{marginRight: 8}} />
            <TextInput
            style={styles.searchInput}
            placeholder="¿Qué se te antoja?"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            />
        </View>
      </View>

      {/* FILTRO ACTIVO */}
      {selectedCategory !== 'Todos' && (
        <View style={styles.activeFilterContainer}>
            <Text style={styles.activeFilterText}>Filtro: {selectedCategory}</Text>
            <TouchableOpacity onPress={() => setSelectedCategory('Todos')}>
                <Text style={styles.clearFilterText}>Borrar</Text>
            </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <SectionList
          sections={getSectionedProducts()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={[
              styles.listContainer, 
              // Si hay carrito visible, damos más espacio abajo para que no tape el último producto
              totalItems > 0 && { paddingBottom: 100 } 
          ]}
          stickySectionHeadersEnabled={false} 
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    {searchQuery ? `Sin resultados para "${searchQuery}"` : "No hay productos disponibles"} 😢
                </Text>
            </View>
          }
        />
      )}

      {/* --- BOTÓN 1: PEDIR CUENTA (Flotante Pequeño) --- */}
      {tableId && (
          <TouchableOpacity 
            // Si el carrito está visible, subimos este botón para que no se tapen
            style={[styles.billButton, totalItems > 0 ? { bottom: 90 } : { bottom: 30 }]} 
            onPress={() => setBillModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.billButtonIcon}>📄</Text>
            <Text style={styles.billButtonText}>Pedir Cuenta</Text>
          </TouchableOpacity>
      )}

      {/* --- BOTÓN 2: VER CARRITO (Barra Inferior Grande) --- */}
      {/* SOLO APARECE SI HAY ITEMS EN EL CARRITO */}
      {totalItems > 0 && (
        <TouchableOpacity 
          style={styles.cartBar} 
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.9}
        >
          <View style={styles.cartQuantityBadge}>
            <Text style={styles.cartQuantityText}>{totalItems}</Text>
          </View>
          
          <Text style={styles.cartBarText}>Ver Pedido</Text>
          
          <Text style={styles.cartBarTotal}>${total.toFixed(2)}</Text>
        </TouchableOpacity>
      )}

      {/* SIDE BAR (MENÚ LATERAL) */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.sidebarOverlay}>
            <View style={styles.sidebarContent}>
                <View style={styles.sidebarHeader}>
                    <Text style={styles.sidebarTitle}>Menú</Text>
                    <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeMenuButton}>
                        <Ionicons name="close" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.menuItemsContainer}>
                    <Text style={styles.menuLabel}>CATEGORÍAS</Text>
                    {uniqueCategories.map((category) => (
                        <TouchableOpacity 
                            key={category} 
                            style={[
                                styles.menuItem, 
                                selectedCategory === category && styles.menuItemSelected
                            ]}
                            onPress={() => {
                                setSelectedCategory(category);
                                setMenuVisible(false);
                            }}
                        >
                            <Text style={styles.menuItemIcon}>
                                {category === 'Bebidas' ? '🥤' : 
                                 category === 'Postres' ? '🍰' : 
                                 category === 'Platillos' ? '🌮' : 
                                 category === 'Todos' ? '🍽️' : '🍴'}
                            </Text>
                            <Text style={[
                                styles.menuItemText,
                                selectedCategory === category && styles.menuItemTextSelected
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                <View style={styles.sidebarBackdrop} />
            </TouchableWithoutFeedback>
        </View>
      </Modal>

      {/* MODAL CUENTA */}
      <Modal
        transparent={true}
        visible={billModalVisible}
        animationType="fade"
        onRequestClose={() => setBillModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Solicitar la Cuenta</Text>
                <Text style={styles.modalSubtitle}>Selecciona tu forma de pago.</Text>
                <View style={styles.paymentOptions}>
                    <TouchableOpacity style={styles.paymentBtn} onPress={() => handleRequestBill('tarjeta')}>
                        <Text style={styles.paymentEmoji}>💳</Text>
                        <Text style={styles.paymentLabel}>Tarjeta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.paymentBtn} onPress={() => handleRequestBill('efectivo')}>
                        <Text style={styles.paymentEmoji}>💵</Text>
                        <Text style={styles.paymentLabel}>Efectivo</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.cancelLink} onPress={() => setBillModalVisible(false)}>
                    <Text style={styles.cancelLinkText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  loader: { marginTop: 50 },
  // Ajustamos el padding inferior para que no se corte el contenido
  listContainer: { paddingBottom: 50, paddingHorizontal: 15 },
  
  searchHeader: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#fff', 
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 15 : 60,
    paddingBottom: 15,
    paddingHorizontal: 15,
    elevation: 4, 
    zIndex: 1,
  },
  menuButton: { padding: 5, marginRight: 10 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f2f2f2', borderRadius: 12, paddingHorizontal: 12, height: 45,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333', height: '100%' },

  activeFilterContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#e8f4fd', borderBottomWidth: 1, borderColor: '#d0e9fc'
  },
  activeFilterText: { color: COLORS.primary, fontWeight: 'bold' },
  clearFilterText: { color: COLORS.primary, textDecorationLine: 'underline' },

  sectionHeader: { backgroundColor: '#f8f8f8', paddingVertical: 15, marginTop: 10, marginBottom: 5 },
  sectionHeaderText: { fontSize: 22, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 18, color: '#888', textAlign: 'center' },

  // --- ESTILOS BOTÓN PEDIR CUENTA (Flotante circular/pequeño) ---
  billButton: {
    position: 'absolute', 
    right: 20,
    // Bottom se define dinámicamente en el JSX (30 o 90)
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 30, elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5,
    zIndex: 10 // Para que flote sobre todo
  },
  billButtonIcon: { fontSize: 18, marginRight: 6, color: '#fff' },
  billButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  // --- ESTILOS BARRA DEL CARRITO (Estilo Uber Eats) ---
  cartBar: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: COLORS.primary, // Verde o el color principal de tu marca
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
    zIndex: 20 // Máxima prioridad
  },
  cartQuantityBadge: {
    backgroundColor: '#fff',
    width: 30, height: 30, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center',
  },
  cartQuantityText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  cartBarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cartBarTotal: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Sidebar
  sidebarOverlay: { flex: 1, flexDirection: 'row' },
  sidebarBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }, 
  sidebarContent: { 
    width: '75%', backgroundColor: '#fff', height: '100%', 
    paddingTop: Platform.OS === 'android' ? 40 : 60, 
    elevation: 5
  },
  sidebarHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  sidebarTitle: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  closeMenuButton: { backgroundColor: '#ddd', borderRadius: 20, padding: 5 },
  menuItemsContainer: { padding: 20 },
  menuLabel: { fontSize: 12, color: '#999', fontWeight: 'bold', marginBottom: 15, letterSpacing: 1 },
  menuItem: { 
    flexDirection: 'row', alignItems: 'center', paddingVertical: 15, 
    borderRadius: 12, paddingHorizontal: 10, marginBottom: 8
  },
  menuItemSelected: { backgroundColor: '#e8f4fd' },
  menuItemIcon: { fontSize: 22, marginRight: 15 },
  menuItemText: { fontSize: 18, color: '#444', fontWeight: '500' },
  menuItemTextSelected: { color: COLORS.primary, fontWeight: 'bold' },
  
  // Modal Cuenta
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: COLORS.primary },
  modalSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25 },
  paymentOptions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  paymentBtn: { flex: 0.48, alignItems: 'center', padding: 15, backgroundColor: '#f5f5f5', borderRadius: 15, borderWidth: 1, borderColor: '#eee' },
  paymentEmoji: { fontSize: 32, marginBottom: 8 },
  paymentLabel: { fontWeight: '600', color: '#333', fontSize: 16 },
  cancelLink: { padding: 10 },
  cancelLinkText: { color: COLORS.secondaryText, fontSize: 16 }
});

export default MenuScreen;