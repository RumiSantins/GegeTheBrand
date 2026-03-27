// Centralización de la configuración de la API
// Este archivo permite que la tienda sepa a qué dirección conectarse (Local o Cloud)

export const API_BASE_URL = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8080' 
        : 'http://34.176.8.184:8080');

export default API_BASE_URL;
