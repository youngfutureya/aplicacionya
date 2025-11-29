import api from './api';
import { API_URLS } from '../utils/constants';

export const getProducts = async (restaurantId, tableId) => {
  try {
    const response = await api.get(API_URLS.PRODUCTS, {
      params: { 
        restaurant_id: restaurantId,
        table_id: tableId 
      }
    });
    
    const rawData = response.data;

    // CORRECCIÓN: Usamos las mismas llaves que usan tus componentes (MenuScreen y ProductCard)
    const adaptedData = rawData.map(item => ({
      id: item.id_producto,           
      nombre: item.nombre,            // Mantenemos "nombre" (no "name")
      descripcion: item.descripcion,  // Mantenemos "descripcion" (no "description")
      precio: parseFloat(item.precio_venta), // Mantenemos "precio"
      imagen: item.imagen,
      // AGREGADO IMPORTANTÍSIMO: Necesitamos la categoría para las secciones
      categoria: item.categoria || item.nombre_categoria || 'General' 
    }));

    return adaptedData; 
    
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error; 
  }
};