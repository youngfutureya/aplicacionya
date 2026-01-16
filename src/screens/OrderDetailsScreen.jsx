import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { CartContext } from '../context/CartContext';
import { API_URL, COLORS } from '../utils/constants';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function OrderDetailsScreen({ navigation }) {
    const { pin, tableId } = useContext(CartContext);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrderData = async () => {
        try {
            if(!pin) return; 
            const response = await fetch(`${API_URL}/api/movil/seguimiento/${pin}`);
            const data = await response.json();
            
            if (data.activo) {
                setOrderData(data);
            } else {
                setOrderData(null); 
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrderData();
    }, []);

    const generatePdf = async () => {
        if (!orderData?.ticket) return Alert.alert("Error", "No hay datos para el ticket");
        const { ticket } = orderData;
        
        const html = `
            <html>
                <body style="text-align: center; font-family: monospace;">
                    <h1>${ticket.restaurante}</h1>
                    <h2>Mesa: ${tableId || ticket.mesa}</h2>
                    <hr/>
                    ${ticket.items.map(i => `<div style="display:flex; justify-content:space-between;"><span>${i.cantidad}x ${i.nombre}</span><span>$${i.subtotal}</span></div>`).join('')}
                    <hr/>
                    <h3>Total: $${ticket.total}</h3>
                    <br/>
                    <p>¡Gracias por su visita!</p>
                </body>
            </html>
        `;
        try {
            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri);
        } catch (e) { Alert.alert("Error", "No se pudo crear el PDF"); }
    };

    if (loading) return <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />;

    if (!orderData) {
        return (
            <View style={styles.center}>
                <Text style={styles.msg}>No tienes pedidos activos.</Text>
                <TouchableOpacity style={styles.btnSmall} onPress={() => navigation.navigate('Home')}>
                    <Text style={{color:'#fff'}}>Volver al Inicio</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Lógica visual: ¿Ya pidieron la cuenta?
    const esPorPagar = orderData.estado === 'por_pagar';

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOrderData(); }} />}
        >
            <View style={styles.card}>
                <Text style={styles.status}>
                    Estado: {esPorPagar ? "ESPERANDO CUENTA" : orderData.estado.toUpperCase().replace('_', ' ')}
                </Text>
                <Text style={styles.mesa}>Mesa: {tableId || orderData.ticket.mesa}</Text>
                
                <View style={styles.divider}/>
                
                {/* LISTA DE ITEMS MEJORADA */}
                {orderData.ticket.items.map((item, index) => (
                    <View key={index} style={styles.row}>
                        <View style={{flex: 1}}>
                            <Text style={{fontSize: 16}}>
                                {item.cantidad}x {item.nombre}
                            </Text>
                            {/* Etiqueta de estado individual */}
                            <Text style={{fontSize: 12, color: item.estado_producto === 'completado' ? '#2ecc71' : '#f39c12'}}>
                                {item.estado_producto === 'completado' ? '✅ Servido' : '🍳 Cocinando'}
                            </Text>
                        </View>
                        <Text style={{fontWeight:'bold'}}>${item.subtotal}</Text>
                    </View>
                ))}
                
                <View style={styles.divider}/>
                <Text style={styles.total}>Total: ${orderData.ticket.total}</Text>
            </View>

            <View style={styles.actions}>
                {/* LOGICA DE BOTONES:
                   1. Si ya pidió cuenta ('por_pagar') -> Solo PDF y mensaje de espera.
                   2. Si sigue comiendo -> Botón Pedir Más y Botón Pagar.
                */}
                
                {esPorPagar ? (
                    <View>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>🔔 El mesero ya viene en camino.</Text>
                        </View>
                        <TouchableOpacity style={styles.btnPdf} onPress={generatePdf}>
                            <Text style={styles.btnText}>📄 Descargar Ticket PDF</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        {/* BOTÓN PEDIR MÁS (Arriba del terminar) */}
                        <TouchableOpacity 
                            style={styles.btnMore} 
                            onPress={() => navigation.navigate('Menu')}
                        >
                            <Text style={styles.btnText}>🍽️ Pedir Algo Más</Text>
                        </TouchableOpacity>

                        {/* BOTÓN TERMINAR (Pagar) */}
                        <TouchableOpacity 
                            style={styles.btnPay} 
                            onPress={() => navigation.navigate('Payment', { 
                                total: orderData.ticket.total,
                                items: orderData.ticket.items 
                            })}
                        >
                            <Text style={styles.btnText}>👋 ¡YA terminé! (Pagar)</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
    loader: { marginTop: 50 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    msg: { fontSize: 18, color: '#666', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 20, elevation: 3 },
    status: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 5 },
    mesa: { textAlign: 'center', color: '#666', marginBottom: 15 },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
    row: { flexDirection: 'row', marginBottom: 8 },
    total: { fontSize: 22, fontWeight: 'bold', textAlign: 'right', marginTop: 10, color: COLORS.success },
    actions: { gap: 15, paddingBottom: 30 },
    
    // Estilos de Botones
    btnMore: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 }, // Azul
    btnPay: { backgroundColor: '#e74c3c', padding: 15, borderRadius: 10, alignItems: 'center' }, // Rojo
    btnPdf: { backgroundColor: '#2c3e50', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 }, // Gris oscuro
    btnSmall: { backgroundColor: COLORS.primary, padding: 10, borderRadius: 8 },
    
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    
    // Caja de información
    infoBox: { backgroundColor: '#e8f6f3', padding: 15, borderRadius: 8, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#d1f2eb' },
    infoText: { color: '#16a085', fontWeight: 'bold' }
});