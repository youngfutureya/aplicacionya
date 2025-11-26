// Archivo: src/services/api.js (CÓDIGO COMPLETO)

import axios from 'axios';
import { API_URLS } from '../utils/constants'; 

const api = axios.create({
  // Usamos la URL base definida en constantes
  baseURL: API_URLS.BASE,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default api;