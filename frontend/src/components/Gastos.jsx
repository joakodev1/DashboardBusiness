import React, { useState, useEffect } from 'react';
import { Plus, TrendingDown, Calendar, Trash2 } from 'lucide-react';
import axios from 'axios';

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [nuevoGasto, setNuevoGasto] = useState({
    description: '',
    amount: ''
  });

  useEffect(() => {
    fetchGastos();
  }, []);

  const fetchGastos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/finance/expenses/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGastos(response.data);
    } catch (error) {
      console.error("Error al cargar gastos:", error);
    }
  };

  const handleInputChange = (e) => {
    setNuevoGasto({ ...nuevoGasto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:8000/api/finance/expenses/', nuevoGasto, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchGastos();
      setMostrarFormulario(false);
      setNuevoGasto({ description: '', amount: '' });
      
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
      alert("Hubo un error al guardar. Revisá la consola.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este registro de gasto?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8000/api/finance/expenses/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        fetchGastos();
      } catch (error) {
        console.error("Error al eliminar el gasto:", error);
        alert("Hubo un error al intentar borrar.");
      }
    }
  };

  return (
    <div className="p-8">
      
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Registro de Gastos</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 transition-colors">Llevá el control de tus salidas de dinero (envíos, publicidad, etc).</p>
        </div>
        <button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Gasto
        </button>
      </div>

      {/* FORMULARIO DE NUEVO GASTO */}
      {mostrarFormulario && (
        <div className="bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800/50 p-6 rounded-2xl mb-8 shadow-sm transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Registrar Salida de Dinero</h2>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Descripción</label>
              <input 
                type="text" 
                name="description"
                value={nuevoGasto.description}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                placeholder="Ej: Publicidad, Envío Andreani..."
                required
              />
            </div>

            <div className="w-32">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Monto ($)</label>
              <input 
                type="number" 
                name="amount"
                value={nuevoGasto.amount}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                placeholder="0"
                required
              />
            </div>

            <button type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Guardar Gasto
            </button>
          </form>
        </div>
      )}

      {/* TABLA DE GASTOS */}
      <div className="bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800/50 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-transparent transition-colors">
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold text-center">Descripción</th>
                <th className="px-6 py-4 font-semibold text-center">Monto</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/30">
              {gastos.map((gasto) => (
                <tr key={gasto.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                      <Calendar className="w-4 h-4" />
                      {new Date(gasto.date).toLocaleDateString('es-AR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-sm text-gray-900 dark:text-white text-center transition-colors">
                    {gasto.description}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 font-bold transition-colors">
                      <TrendingDown className="w-4 h-4" />
                      ${Number(gasto.amount).toLocaleString('es-AR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(gasto.id)}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {gastos.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
                    No registraste ningún gasto todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Gastos;