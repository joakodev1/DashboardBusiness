import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Headphones, 
  ShoppingCart, 
  Users,
  User,
  TrendingDown, 
  Settings, 
  LogOut,
  X 
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [username] = useState(localStorage.getItem('username') || 'Administrador');
  const location = useLocation();
  const navigate = useNavigate(); 

  // 1. Lee la foto de memoria al cargar el panel
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar_url') || null);

  // 2. Escucha si la Configuración avisa que la foto cambió para actualizarse solo
  useEffect(() => {
    const actualizarAvatar = () => {
      setAvatar(localStorage.getItem('avatar_url'));
    };
    window.addEventListener('cambioAvatar', actualizarAvatar);
    return () => window.removeEventListener('cambioAvatar', actualizarAvatar);
  }, []);

  const menuItems = [
    { name: 'Panel Principal', icon: Home, path: '/dashboard' },
    { name: 'Productos', icon: Headphones, path: '/dashboard/productos' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/dashboard/pedidos' },
    { name: 'Clientes', icon: Users, path: '/dashboard/clientes' },
    { name: 'Gastos', icon: TrendingDown, path: '/dashboard/gastos' },
    { name: 'Configuración', icon: Settings, path: '/dashboard/configuracion' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token'); 
    navigate('/login'); 
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-flb-creamCard dark:bg-flb-darkCard border-r border-gray-200 dark:border-gray-800/50 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      
      {/* LOGO Y BOTÓN CERRAR (MÓVIL) */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800/50 mb-4 h-24">
        <div className="flex-1 flex justify-center">
          <img 
            src="/logo.jpg" 
            alt="FLB GAMING Logo" 
            className="h-16 w-auto rounded-2xl shadow-md dark:shadow-gray-800/30 transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                ${isActive 
                  ? 'bg-flb-blue text-white shadow-md shadow-blue-500/20' 
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

      {/* BLOQUE INFERIOR: PERFIL Y CERRAR SESIÓN */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800/50 mt-auto bg-gray-50/50 dark:bg-gray-900/20">
        
        {/* Info del Usuario con Efecto Hover y Foto Real */}
        <div className="flex items-center gap-3 px-2 mb-4 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center overflow-hidden flex-shrink-0 border border-blue-200 dark:border-blue-500/30 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:shadow-md group-hover:border-blue-400 dark:group-hover:border-blue-500">
            {/* Renderizado condicional: Foto si existe, si no el ícono */}
            {avatar ? (
              <img src={avatar} alt="Perfil" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            ) : (
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate transition-colors duration-300 group-hover:text-[#2563EB] dark:group-hover:text-blue-400">
              {username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Admin
            </p>
          </div>
        </div>

        {/* Botón Salir */}
        <button
          onClick={handleLogout} 
          className="cursor-pointer flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;