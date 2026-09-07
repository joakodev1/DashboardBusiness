import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertCircle, X, Loader2 } from 'lucide-react';
import api from '../api';// Ajustá la ruta de importación según dónde tengas guardado tu api.js

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // Efecto de aparición suave al cargar la página
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Limpiamos errores previos

    try {
      // Usamos nuestra instancia 'api' en lugar de fetch apuntando a localhost
      const response = await api.post('token/', {
        username: username,
        password: password,
      });

      const data = response.data;
      localStorage.setItem('access_token', data.access);
      if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
      
      // Guardamos el nombre que el usuario tipeó en el formulario
      localStorage.setItem('username', username);
      
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setError('Credenciales incorrectas o error de conexión con el servidor.');
      
      // La ocultamos automáticamente después de 4 segundos
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#0B0D14] transition-colors duration-300 relative overflow-hidden">
      
      {/* TOAST DE ERROR FLOTANTE (Popout) */}
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-4 bg-white dark:bg-[#141720] border border-red-200 dark:border-red-900/50 rounded-2xl shadow-[0_20px_50px_rgba(239,68,68,0.15)] dark:shadow-[0_20px_50px_rgba(239,68,68,0.05)] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
        error ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="bg-red-100 dark:bg-red-500/20 p-2 rounded-full">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 pr-4">{error}</p>
        <button 
          onClick={() => setError(null)} 
          className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* FONDOS GLOBALES */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* TARJETA DEL FORMULARIO CON ANIMACIÓN DE ENTRADA */}
      <div className={`w-full max-w-md bg-[#FFFFFF] dark:bg-[#141720] p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800/60 relative z-10 transition-all duration-700 ease-out transform ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        
        <div className="flex flex-col items-center justify-center mb-10">
          <img 
            src="/logo.jpg" 
            alt="FLB GAMING Logo" 
            className="w-64 h-auto object-contain rounded-xl mb-4 transition-transform duration-500 hover:scale-105"
          />
          <p className="text-gray-400 dark:text-gray-500 text-xs tracking-[0.2em] font-bold uppercase">
            Portal de Administración
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#2563EB] transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Usuario"
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-[#0B0D14]/50 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563EB] dark:focus:border-[#2563EB] outline-none transition-all duration-300 font-medium placeholder-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#2563EB] transition-colors duration-300" />
            </div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-[#0B0D14]/50 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563EB] dark:focus:border-[#2563EB] outline-none transition-all duration-300 font-medium placeholder-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* BOTÓN ANIMADO Y ESTÉTICO */}
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer group relative w-full py-4 mt-2 flex items-center justify-center gap-3 bg-[#2563EB] hover:bg-blue-600 active:scale-[0.98] disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 overflow-hidden"
          >
            {/* Capa de brillo interno que reacciona al hover */}
            <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  VERIFICANDO...
                </>
              ) : (
                <>
                  INGRESAR AL DASHBOARD
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </>
              )}
            </span>
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Login;