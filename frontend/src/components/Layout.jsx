import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    // FORZAMOS EL CREMA Y EL OSCURO ACÁ:
    <div className="flex h-screen overflow-hidden bg-[#FDFBF7] dark:bg-[#0B0D14] transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;