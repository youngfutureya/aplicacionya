import api from './api';

export const sendOrder = async (restaurantId, tableNumber, pin, cartItems) => {
  try {
    const itemsFormatted = cartItems.map(item => ({
      id_producto: item.productId,
      cantidad: item.quantity
    }));

    // CAMBIO: Enviamos 'numero_mesa' con el valor que el usuario escribió
    const payload = {
      numero_mesa: tableNumber, 
      pin: pin,
      items: itemsFormatted
    };

    const response = await api.post('api/movil/pedido', payload);
    return response.data;

  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Error de conexión.");
  }
};