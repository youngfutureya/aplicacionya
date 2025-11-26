// Archivo: src/navigation/AppNavigator.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Importar todas las pantallas (los archivos .jsx que creaste)
import QRScannerScreen from '../screens/QRScannerScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import PaymentScreen from '../screens/PaymentScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      // La primera pantalla al abrir la app.
      initialRouteName="QRScanner"
      // Ocultamos la barra de título por defecto para un diseño más limpio
      screenOptions={{ headerShown: false }} 
    >
      {/* 2. Definición de todas las Rutas del Flujo: */}
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;