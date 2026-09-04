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
      // Asumo que la ruta en tu backend es /api/finance/clients/ (o similar)
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
    <div className="text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Registro de Clientes</h1>
          <p className="text-gray-400 text-sm mt-1">Gestioná tu base de datos de compradores.</p>
        </div>
        <button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-[#2563EB] hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-[#141720] border border-gray-800/30 p-6 rounded-2xl mb-8">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">Registrar Cliente</h2>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-400 mb-1">Nombre Completo</label>
              <input 
                type="text" 
                name="name"
                value={nuevoCliente.name}
                onChange={handleInputChange}
                className="w-full bg-[#0B0D14] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                value={nuevoCliente.email}
                onChange={handleInputChange}
                className="w-full bg-[#0B0D14] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="juan@email.com"
              />
            </div>

            <div className="w-48">
              <label className="block text-xs font-medium text-gray-400 mb-1">Teléfono</label>
              <input 
                type="text" 
                name="phone"
                value={nuevoCliente.phone}
                onChange={handleInputChange}
                className="w-full bg-[#0B0D14] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Ej: 341 1234567"
              />
            </div>

            <button type="submit" className="bg-blue-500/10 text-blue-400 border border-blue-500/50 px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-500 hover:text-white transition-colors">
              Guardar Cliente
            </button>
          </form>
        </div>
      )}

      <div className="bg-[#141720] border border-gray-800/30 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800/30 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4 font-medium">Nombre</th>
              <th className="px-6 py-4 font-medium">Contacto</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/30">
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-800/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                      <Users className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="font-medium text-sm">{cliente.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {cliente.email && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Mail className="w-3 h-3" />
                        {cliente.email}
                      </div>
                    )}
                    {cliente.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Phone className="w-3 h-3" />
                        {cliente.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(cliente.id)}
                    className="text-gray-400 hover:text-red-400 p-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500 text-sm">
                  No tenés clientes registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clientes;