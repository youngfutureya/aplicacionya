// Archivo: src/services/products.js (CÓDIGO COMPLETO)

import api from './api';
import { API_URLS } from '../utils/constants';

// Función para obtener productos desde la API
export const getProducts = async (restaurantId, tableId) => {
  try {
    // Hace un GET a https://proyectoyaweb.onrender.com/api/products
    const response = await api.get(API_URLS.PRODUCTS, {
      // Pasamos IDs en los query params por si el Backend los necesita
      params: { 
        restaurant_id: restaurantId,
        table_id: tableId 
      }
    });
    
    // Si tu API devuelve un objeto con una clave 'data', usa response.data.data
    // Aquí asumimos que response.data es el array de productos.
    return response.data; 
    
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw new Error("No se pudo conectar a la API. Revisa la URL y que el Backend esté activo."); 
  }
};