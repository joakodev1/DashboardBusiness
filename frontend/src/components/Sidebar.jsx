import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Headphones, 
  ShoppingCart, 
  Users, 
  TrendingDown, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 

  const menuItems = [
    { name: 'Panel Principal', icon: Home, path: '/dashboard' },
    { name: 'Productos', icon: Headphones, path: '/dashboard/productos' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/dashboard/pedidos' },
    { name: 'Clientes', icon: Users, path: '/dashboard/clientes' },
    { name: 'Gastos', icon: TrendingDown, path: '/dashboard/gastos' },
    { name: 'Configuración', icon: Settings, path: '/dashboard/configuracion' },
  ];

  const handleLogout = () => {
    // 1. Borramos el token de seguridad
    localStorage.removeItem('access_token');
    
    // (Opcional) Si en tu backend configuraste refresh tokens, borralo también:
    localStorage.removeItem('refresh_token'); 
    
    // 2. Redirigimos a la pantalla de inicio de sesión
    navigate('/login'); 
  };

  return (
    // CONTENEDOR PRINCIPAL: Blanco/Crema por defecto, Oscuro en modo dark
    <aside className="w-64 h-screen bg-flb-creamCard dark:bg-flb-darkCard border-r border-gray-200 dark:border-gray-800/50 flex flex-col transition-colors duration-300 fixed left-0 top-0">
      
      {/* LOGO */}
      <div className="p-4 flex justify-center items-center border-b border-gray-200 dark:border-gray-800/50 mb-4">
        <img 
          src="/logo.jpg" 
          alt="FLB GAMING Logo" 
          className="h-16 w-auto rounded-2xl shadow-md dark:shadow-gray-800/30 transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                ${isActive 
                  // Si está ACTIVO: Fondo azul con texto blanco
                  ? 'bg-flb-blue text-white shadow-md shadow-blue-500/20' 
                  // Si está INACTIVO: Texto gris, al pasar el mouse fondo gris claro u oscuro
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* BOTÓN DE CERRAR SESIÓN */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800/50">
        <button
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;