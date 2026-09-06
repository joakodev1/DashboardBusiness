import React, { useState, useEffect } from 'react';
import { Plus, Users, Mail, Phone, Trash2 } from 'lucide-react';
import axios from 'axios';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [nuevoCliente, setNuevoCliente] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/users/clients/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientes(response.data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  const handleInputChange = (e) => {
    setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:8000/api/users/clients/', nuevoCliente, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchClientes();
      setMostrarFormulario(false);
      setNuevoCliente({ name: '', email: '', phone: '' });
      
    } catch (error) {
      console.error("Error al registrar el cliente:", error);
      alert("Hubo un error al guardar. Revisá la consola.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que querés eliminar a este cliente?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8000/api/users/clients/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        fetchClientes();
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        alert("Hubo un error al intentar borrar.");
      }
    }
  };

  return (
    <div className="p-8">
      
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Registro de Clientes</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 transition-colors">Gestioná tu base de datos de compradores.</p>
        </div>
        <button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-[#2563EB] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {/* FORMULARIO DE NUEVO CLIENTE */}
      {mostrarFormulario && (
        <div className="bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800/50 p-6 rounded-2xl mb-8 shadow-sm transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Registrar Cliente</h2>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Nombre Completo</label>
              <input 
                type="text" 
                name="name"
                value={nuevoCliente.name}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Email</label>
              <input 
                type="email" 
                name="email"
                value={nuevoCliente.email}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                placeholder="juan@email.com"
              />
            </div>

            <div className="w-48">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Teléfono</label>
              <input 
                type="text" 
                name="phone"
                value={nuevoCliente.phone}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                placeholder="Ej: 341 1234567"
              />
            </div>

            <button type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Guardar Cliente
            </button>
          </form>
        </div>
      )}

      {/* TABLA DE CLIENTES */}
      <div className="bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800/50 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-transparent transition-colors">
                <th className="px-6 py-4 font-semibold">Nombre</th>
                <th className="px-6 py-4 font-semibold">Contacto</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/30">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 dark:bg-gray-800/50 p-2 rounded-lg transition-colors">
                        <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <span className="font-medium text-sm text-gray-900 dark:text-white transition-colors">{cliente.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {cliente.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 transition-colors">
                          <Mail className="w-3 h-3" />
                          {cliente.email}
                        </div>
                      )}
                      {cliente.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 transition-colors">
                          <Phone className="w-3 h-3" />
                          {cliente.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(cliente.id)}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
                    No tenés clientes registrados todavía.
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

export default Clientes;