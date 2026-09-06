import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = () => {
  // Estado para controlar si el menú está abierto o cerrado en celulares
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#0B0D14] transition-colors duration-300">
      
      {/* OVERLAY PARA MÓVILES (Fondo semitransparente al abrir el menú) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Le pasamos el estado y la función para cerrarlo a tu Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* 
        El margen md:ml-64 aplica solo en monitores. 
        En celulares, Tailwind lo ignora y queda en ml-0 para no pisar el contenido.
      */}
      <main className="flex-1 flex flex-col min-h-screen md:ml-64">
        
        {/* BARRA SUPERIOR MÓVIL (Visible solo en pantallas chicas) */}
        <div className="md:hidden flex items-center justify-between bg-white dark:bg-[#141720] border-b border-gray-200 dark:border-gray-800/50 p-4 z-30 sticky top-0 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="FLB GAMING" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-bold text-gray-900 dark:text-white">FLB GAMING</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full max-w-7xl mx-auto">
          {/* Outlet inyecta la vista correspondiente (Dashboard, Productos, etc.) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;