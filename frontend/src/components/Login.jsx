import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Acá va tu lógica de validación
    navigate('/dashboard');
  };

  return (
    // FONDOS GLOBALES con overflow-hidden para los efectos decorativos
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#0B0D14] transition-colors duration-300 relative overflow-hidden">
      
      {/* ELEMENTOS DECORATIVOS DE FONDO (Luces sutiles) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* TARJETA DEL FORMULARIO */}
      <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#141720] p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800/60 relative z-10 transition-colors duration-300">
        
        {/* LOGO MÁS ANCHO */}
        <div className="flex flex-col items-center justify-center mb-10">
          <img 
            src="/logo.jpg" 
            alt="FLB GAMING Logo" 
            className="w-50 h-auto object-contain rounded-xl mb-4 transition-transform duration-500 hover:scale-105"
          />
          <p className="text-gray-400 dark:text-gray-500 text-xs tracking-[0.2em] font-bold uppercase">
            Portal de Administración
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
              <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#2563EB] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Usuario"
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-[#0B0D14]/50 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563EB] dark:focus:border-[#2563EB] outline-none transition-all font-medium placeholder-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#2563EB] transition-colors" />
            </div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-[#0B0D14]/50 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563EB] dark:focus:border-[#2563EB] outline-none transition-all font-medium placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-2 flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-600 active:scale-[0.98] text-white rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-500/30"
          >
            INGRESAR AL DASHBOARD
            <ArrowRight className="w-4 h-4" />
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Login;