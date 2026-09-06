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
import { Sun, Moon } from 'lucide-react';
import Configuracion from './components/Configuracion';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0B0D14] transition-colors duration-300">
      
      {/* Botón flotante para cambiar el tema tipo Switch */}
      <div 
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 flex items-center w-24 h-12 bg-white dark:bg-[#141720] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-200 dark:border-gray-800 cursor-pointer p-1 z-50"
      >
        {/* Círculo azul que se desliza */}
        <div 
          className={`absolute w-10 h-10 bg-[#2563EB] rounded-full transition-transform duration-500 ease-in-out ${
            isDarkMode ? 'translate-x-12' : 'translate-x-0'
          }`}
        />
        
        {/* Íconos interactivos */}
        <div className="relative z-10 flex w-full justify-between items-center px-2.5 pointer-events-none">
          <Sun 
            className={`w-5 h-5 transition-colors duration-500 ${
              !isDarkMode ? 'text-white' : 'text-gray-400 dark:text-gray-500'
            }`} 
          />
          <Moon 
            className={`w-5 h-5 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-gray-400 dark:text-gray-500'
            }`} 
          />
        </div>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} /> 
            <Route path="productos" element={<Productos />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="gastos" element={<Gastos />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="configuracion" element={<Configuracion />} /> {/* <-- Agregá esta línea */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;