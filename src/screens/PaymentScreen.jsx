// Archivo: src/screens/MenuScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const MenuScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* 1. Cambia este título en cada archivo: */}
      <Text style={styles.title}>PANTALLA: MENÚ</Text>
      <Text>Aquí se verán los productos cargados desde la API.</Text>
      <Button 
        title="PAGO>>"
        // 2. Cambia esta ruta para que apunte al siguiente paso:
        onPress={() => navigation.navigate('QRScanner')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }
});

// ¡Recuerda el export default!
export default MenuScreen;