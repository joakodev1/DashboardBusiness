// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Productos from "./components/Productos";
import Pedidos from './components/Pedidos';
import Gastos from './components/Gastos';
import Clientes from './components/Clientes';

function App() {
  // Estado para el modo oscuro, inicializado leyendo si el usuario ya lo había elegido antes
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Cada vez que cambia el estado, actualizamos la clase en el HTML y guardamos la preferencia
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Función para alternar el tema
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    // Este div envuelve absolutamente todo y maneja el fondo general de la app
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B0D14] text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Botón flotante para cambiar el tema (luego podés moverlo a tu Sidebar o barra superior) */}
      <button 
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-xl z-50 shadow-lg font-medium transition-colors border border-blue-400/30"
      >
        {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
      </button>

      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<Login />} />

          {/* El Layout actúa como contenedor de las rutas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Rutas anidadas que se inyectan en el <Outlet /> del Layout */}
            <Route index element={<Dashboard />} /> 
            <Route path="productos" element={<Productos />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="gastos" element={<Gastos />} />
            <Route path="clientes" element={<Clientes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;