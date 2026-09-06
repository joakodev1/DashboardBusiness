import React, { useState, useRef } from 'react';
import { Download, FileSpreadsheet, Camera, Trash2, User } from 'lucide-react';
import api from '../api'; // Importamos tu instancia de axios configurada

const Configuracion = () => {
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar_url') || null);
  const [username] = useState(localStorage.getItem('username') || 'Administrador'); // NUEVO
  const [isUploading, setIsUploading] = useState(false); // Estado para bloquear el botón
  const fileInputRef = useRef(null);

  const handleCargarFoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true); // Bloqueamos la interfaz
      
      // Vista previa instantánea
      setAvatar(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await api.post('users/upload-avatar/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const urlReal = response.data.avatar_url;
        setAvatar(urlReal);
        localStorage.setItem('avatar_url', urlReal);
        window.dispatchEvent(new Event('cambioAvatar'));

        console.log('Imagen guardada en el servidor:', urlReal);
        
      } catch (error) {
        console.error("Error al subir la foto", error);
        
        // Verificamos si el error es por exceder las 3 subidas por minuto (Error 429)
        if (error.response && error.response.status === 429) {
          alert("Estás subiendo fotos muy rápido. Esperá un minuto e intentá de nuevo.");
        } else {
          alert("Hubo un error al guardar tu foto de perfil en la base de datos.");
        }
        
        // Revertimos la imagen si falló la subida
        setAvatar(localStorage.getItem('avatar_url') || null);
      } finally {
        setIsUploading(false); // Desbloqueamos el botón siempre, falle o no
      }
    }
  };

  const handleEliminarFoto = () => {
    setAvatar(null);
    localStorage.removeItem('avatar_url');
    window.dispatchEvent(new Event('cambioAvatar'));
  };

  const handleExportar = async (tipo) => {
    const endpoints = {
      clientes: 'users/export/clients/',
      ventas: 'finance/export/sales/',
      gastos: 'finance/export/expenses/'
    };

    try {
      const response = await api.get(endpoints[tipo], { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FLB_Gaming_${tipo}.csv`);
      document.body.appendChild(link);
      link.click();
      
      link.remove(); 
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error(`Error al exportar ${tipo}`, error);
      alert(`Hubo un error al descargar la base de datos de ${tipo}.`);
    }
  };

  return (
    <div className="p-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Configuración</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 transition-colors">Gestioná tu cuenta y resguardá la información de la tienda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TARJETA 1: PERFIL DE ADMINISTRADOR */}
        <div className="bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 shadow-sm transition-colors duration-300 flex flex-col justify-center">
          
          <div className="flex flex-col items-center text-center">
            {/* Contenedor del Avatar */}
            <div className="relative group mb-4">
              <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 border-white dark:border-[#0B0D14] shadow-lg overflow-hidden transition-all duration-300">
                {avatar ? (
                  <img src={avatar} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{username}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">Admin</p>

            {/* Input de archivo oculto */}
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleCargarFoto}
            />

            <div className="flex gap-3">
              <button 
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm
                  ${isUploading 
                    ? 'bg-blue-400 cursor-not-allowed text-white/70' 
                    : 'bg-[#2563EB] hover:bg-blue-600 text-white cursor-pointer' 
                  }`}
              >
                <Camera className="w-4 h-4" />
                {isUploading ? 'Subiendo...' : 'Cambiar Foto'}
              </button>
              
              {avatar && (
                <button 
                  onClick={handleEliminarFoto}
                  disabled={isUploading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors
                    ${isUploading
                      ? 'bg-red-50 text-red-300 cursor-not-allowed'
                      : 'bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 cursor-pointer'
                    }`}
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TARJETA 2: EXPORTACIÓN DE DATOS */}
        <div className="bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 dark:bg-green-500/10 p-2 rounded-lg">
              <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Exportación de Datos</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Descargá tu base de datos en formato Excel (.csv)</p>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => handleExportar('ventas')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 dark:bg-[#0B0D14] dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Historial de Ventas</span>
              </div>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </button>

            <button 
              onClick={() => handleExportar('clientes')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 dark:bg-[#0B0D14] dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Base de Datos de Clientes</span>
              </div>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
            </button>

            <button 
              onClick={() => handleExportar('gastos')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 dark:bg-[#0B0D14] dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Registro de Gastos</span>
              </div>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Configuracion;