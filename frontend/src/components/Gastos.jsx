import React, { useState, useEffect } from 'react';
import { Plus, TrendingDown, Calendar, Trash2 } from 'lucide-react';
import axios from 'axios';

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Sacamos 'category' del estado inicial
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
      // Limpiamos solo los dos campos que usamos
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
    <div className="text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Registro de Gastos</h1>
          <p className="text-gray-400 text-sm mt-1">Llevá el control de tus salidas de dinero (envíos, publicidad, etc).</p>
        </div>
        <button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Gasto
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-[#141720] border border-gray-800/30 p-6 rounded-2xl mb-8">
          <h2 className="text-lg font-semibold mb-4 text-red-400">Registrar Salida de Dinero</h2>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-400 mb-1">Descripción</label>
              <input 
                type="text" 
                name="description"
                value={nuevoGasto.description}
                onChange={handleInputChange}
                className="w-full bg-[#0B0D14] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                placeholder="Ej: Publicidad, Envío Andreani..."
                required
              />
            </div>

            {/* Eliminamos el select de Categoría de acá */}

            <div className="w-32">
              <label className="block text-xs font-medium text-gray-400 mb-1">Monto ($)</label>
              <input 
                type="number" 
                name="amount"
                value={nuevoGasto.amount}
                onChange={handleInputChange}
                className="w-full bg-[#0B0D14] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                placeholder="0"
                required
              />
            </div>

            <button type="submit" className="bg-red-500/10 text-red-400 border border-red-500/50 px-6 py-2 rounded-lg font-semibold text-sm hover:bg-red-500 hover:text-white transition-colors">
              Guardar Gasto
            </button>
          </form>
        </div>
      )}

      <div className="bg-[#141720] border border-gray-800/30 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800/30 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4 font-medium">Fecha</th>
              <th className="px-6 py-4 font-medium">Descripción</th>
              <th className="px-6 py-4 font-medium">Monto</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/30">
            {gastos.map((gasto) => (
              <tr key={gasto.id} className="hover:bg-gray-800/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(gasto.date).toLocaleDateString('es-AR')}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-sm">
                  {gasto.description}
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-1 text-red-400 font-medium">
                    <TrendingDown className="w-4 h-4" />
                    ${Number(gasto.amount).toLocaleString('es-AR')}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(gasto.id)}
                    className="text-gray-400 hover:text-red-400 p-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {gastos.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm">
                  No registraste ningún gasto todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gastos;