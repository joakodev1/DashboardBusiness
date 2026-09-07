import axios from 'axios';

// Creamos una instancia configurada de Axios apuntando a Render
const api = axios.create({
  baseURL: 'https://flb-gaming-backend.onrender.com/api/',
});

// 1. INTERCEPTOR DE PETICIÓN: Le inyecta el access_token a cada request automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. INTERCEPTOR DE RESPUESTA: Atrapa los errores 401 y renueva el token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 (No autorizado) y no intentamos reintentar todavía
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        // Pedimos un nuevo token a Django en el servidor de Render
        const response = await axios.post('https://flb-gaming-backend.onrender.com/api/token/refresh/', {
          refresh: refreshToken,
        });

        // Guardamos el nuevo access_token
        localStorage.setItem('access_token', response.data.access);
        
        // Actualizamos el header de la petición original y la volvemos a disparar
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Si el refresh_token también venció, limpiamos todo y mandamos al login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;