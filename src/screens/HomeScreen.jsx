import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { COLORS } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';

// CAMBIO: Quitamos tableId predeterminado
const SAVED_RESTAURANTS = [
  { id: 1, name: "Angel's Restaurant", lastVisit: 'Visitado recientemente' },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleRestaurantPress = (restaurantId) => {
    // Enviamos tableId vacío para que el usuario lo escriba después
    navigation.navigate('Menu', { restaurantId, tableId: '' });
  };

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyCard}
      onPress={() => handleRestaurantPress(item.id)}
    >
      <View style={styles.iconPlaceholder}>
        <Text style={styles.iconText}>🍽️</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.visitInfo}>{item.lastVisit}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* CAMBIO: Saludo genérico y simple */}
        <Text style={styles.greeting}>Restaurantes</Text> 
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Guardados</Text>
        <FlatList
          data={SAVED_RESTAURANTS}
          renderItem={renderRestaurantItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <View style={styles.scanContainer}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => navigation.navigate('QRScanner')}
        >
          <Text style={styles.scanIcon}>📷</Text>
          <Text style={styles.scanText}>Escanear QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: 25,
    paddingTop: 60,
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  
  historyContainer: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 15 },
  
  historyCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 15, borderRadius: 12, marginBottom: 12, elevation: 3,
  },
  iconPlaceholder: {
    width: 50, height: 50, backgroundColor: '#f0f4f8', borderRadius: 25,
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  iconText: { fontSize: 24 },
  cardInfo: { flex: 1 },
  restaurantName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  visitInfo: { fontSize: 12, color: COLORS.secondaryText, marginTop: 2 },
  arrow: { fontSize: 24, color: COLORS.secondaryText, fontWeight: 'bold' },

  scanContainer: { padding: 20, paddingBottom: 40, alignItems: 'center' },
  scanButton: {
    flexDirection: 'row', backgroundColor: COLORS.accent,
    paddingVertical: 15, paddingHorizontal: 30, borderRadius: 50,
    alignItems: 'center', elevation: 8,
  },
  scanIcon: { fontSize: 24, marginRight: 10, color: '#fff' },
  scanText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default HomeScreen;