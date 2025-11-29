import api from './api';

// Enviar el pedido a cocina
export const sendOrder = async (restaurantId, tableNumber, pin, cartItems, paymentMethod) => {
  try {
    const itemsFormatted = cartItems.map(item => ({
      id_producto: item.productId,
      cantidad: item.quantity
    }));

    const payload = {
      numero_mesa: tableNumber, 
      pin: pin,
      items: itemsFormatted,
      metodo_pago: paymentMethod // 'tarjeta' o 'efectivo'
    };

    const response = await api.post('api/movil/pedido', payload);
    return response.data;

  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Error de conexión al enviar el pedido.");
  }
};

// NUEVA FUNCIÓN: Pedir la cuenta (Cambia estado en el dashboard)
export const requestBill = async (restaurantId, tableNumber, paymentMethod) => {
  try {
    const payload = {
      restaurant_id: restaurantId,
      numero_mesa: tableNumber,
      metodo_pago: paymentMethod, // 'tarjeta' o 'efectivo'
      accion: 'pedir_cuenta' 
    };

    // Ajusta esta ruta si tu backend usa otra URL para pedir la cuenta
    // Si usas el mismo endpoint 'pedido' pero con otro flag, cámbialo aquí.
    const response = await api.post('api/movil/cuenta', payload); 
    return response.data;

  } catch (error) {
    console.error("Error pidiendo cuenta:", error);
    // Lanzamos un error genérico para que el usuario no se asuste con detalles técnicos
    throw new Error("No se pudo notificar al mesero. Intenta de nuevo.");
  }
};