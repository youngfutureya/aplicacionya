// Archivo: src/screens/QRScannerScreen.jsx (CÓDIGO COMPLETO)

import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';

const QRScannerScreen = ({ navigation }) => {
    
    // Función para simular el escaneo y obtener los datos de la web
    const simulateScan = () => {
        // Simulamos el JSON que arrojaría la lectura del QR
        const scannedData = {
            restaurant_id: 1, // ID del restaurante para obtener el menú
            table_id: 10,     // ID de la mesa para asociar el pedido
        };

        // Navegamos al Menú y pasamos los parámetros
        navigation.navigate('Menu', { 
            restaurantId: scannedData.restaurant_id,
            tableId: scannedData.table_id
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Escanear Código QR 🤳</Text>
            
            <View style={styles.scannerArea}>
                <Text style={styles.scanText}>Esperando código QR de la mesa...</Text>
            </View>

            {/* Botón de Simulación para probar la API inmediatamente */}
            <TouchableOpacity 
                style={styles.simulateButton}
                onPress={simulateScan}
            >
                <Text style={styles.simulateButtonText}>SIMULAR LECTURA DE QR</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 40,
    },
    scannerArea: {
        width: 250,
        height: 250,
        borderWidth: 5,
        borderColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    scanText: {
        color: COLORS.secondaryText,
    },
    simulateButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    simulateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default QRScannerScreen;