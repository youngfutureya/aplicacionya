// Archivo: src/utils/constants.js (CÓDIGO COMPLETO)

// 1. Colores Principales (Tomados del Dashboard)
export const COLORS = {
  // Color principal oscuro del Dashboard (Barra lateral)
  primary: '#2c3e50', 
  accent: '#e74c3c', 
  background: '#f8f8f8', 
  text: '#333333', 
  secondaryText: '#666666', 
  border: '#dddddd',
  success: '#2ecc71',
};

// 2. Valores de la API
export const API_URLS = {
  // URL de tu proyecto web en Render.com
  BASE: 'https://proyectoyaweb.onrender.com/', 
  // Endpoint ajustado: Probamos con 'productos' (en español)
  PRODUCTS: 'productos', // <--- CAMBIO CLAVE AQUÍ
  // Endpoint asumido para enviar la orden
  ORDERS: 'api/orders', 
};

// 3. Tipografía básica
export const FONT_SIZES = {
  large: 24,
  medium: 16,
  small: 12,
};