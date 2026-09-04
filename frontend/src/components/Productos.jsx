import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Headphones } from 'lucide-react';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Nuevo estado para saber si estamos editando (guarda el ID) o creando (es null)
  const [editandoId, setEditandoId] = useState(null);

  const [nuevoProducto, setNuevoProducto] = useState({
    name: '',
    cost_price: '',
    sale_price: '',
    stock: ''
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/finance/products/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  const handleInputChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  // Función para preparar el formulario en modo "Edición"
  const handleEdit = (producto) => {
    setNuevoProducto({
      name: producto.name,
      cost_price: producto.cost_price,
      sale_price: producto.sale_price,
      stock: producto.stock
    });
    setEditandoId(producto.id);
    setMostrarFormulario(true);
  };

  // Función para Eliminar un producto
  const handleDelete = async (id) => {
    // Preguntamos para confirmar antes de borrar
    if (window.confirm('¿Estás seguro de que querés eliminar este auricular?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8000/api/finance/products/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Volvemos a pedir la lista actualizada
        fetchProductos();
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert("Hubo un error al intentar borrar el auricular.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (editandoId) {
        // Si hay un editandoId, significa que estamos EDITANDO (Manda PUT)
        await axios.put(`http://localhost:8000/api/finance/products/${editandoId}/`, nuevoProducto, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Si no lo hay, estamos CREANDO uno nuevo (Manda POST)
        await axios.post('http://localhost:8000/api/finance/products/', nuevoProducto, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      fetchProductos(); 
      setMostrarFormulario(false);
      setEditandoId(null); // Reseteamos el estado de edición
      setNuevoProducto({ name: '', cost_price: '', sale_price: '', stock: '' });
      
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Hubo un error al guardar. Revisá la consola.");
    }
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Tus Productos</h1>
          <p className="text-gray-400 text-sm mt-1">Gestioná el stock y precios de tus auriculares.</p>
        </div>
        <button 
          onClick={() => {
            // Si apretamos el botón principal, limpiamos el form por si quedó algo de una edición
            setEditandoId(null);
            setNuevoProducto({ name: '', cost_price: '', sale_price: '', stock: '' });
            setMostrarFormulario(!mostrarFormulario);
          }}
          className="bg-[#2563EB] hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Auricular
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-[#141720] border border-gray-800/30 p-6 rounded-2xl mb-8">
          {/* El título cambia si estamos editando o creando */}
          <h2 className="text-lg font-semibold mb-4">
            {editandoId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          
          <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-400 mb-1">Nombre / Modelo</label>
              <input 
                type="text" 
                name="name"
                value={nuevoProducto.name}
                onChange={handleInputChange}
                className="w-full bg-[#0B0D14] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Ej: HyperX Cloud Flight"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-400 mb-1">Costo ($)</label>
              <input 
                type="number" 
                name="cost_price"
                value={nuevoProducto.cost_price}
                onChange={handleInputChange}
                className="w-full bg-[#0B0D14] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="0"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-400 mb-1">Precio Venta ($)</label>
              <input 
                type="number" 
                name="sale_price"
                value={nuevoProducto.sale_price}
                onChange={handleInputChange}
                className="w-full bg-[#0B0D14] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="0"
                required
              />
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-gray-400 mb-1">Stock</label>
              <input 
                type="number" 
                name="stock"
                value={nuevoProducto.stock}
                onChange={handleInputChange}
                className="w-full bg-[#0B0D14] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="0"
                required
              />
            </div>
            <button type="submit" className="bg-white text-black px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors">
              {editandoId ? 'Actualizar' : 'Guardar'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-[#141720] border border-gray-800/30 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800/30 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4 font-medium">Producto</th>
              <th className="px-6 py-4 font-medium">Costo</th>
              <th className="px-6 py-4 font-medium">Precio Venta</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/30">
            {productos.map((producto) => (
              <tr key={producto.id} className="hover:bg-gray-800/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                      <Headphones className="w-5 h-5 text-gray-300" />
                    </div>
                    <span className="font-medium text-sm">{producto.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  ${Number(producto.cost_price).toLocaleString('es-AR')}
                </td>
                <td className="px-6 py-4 text-sm">
                  ${Number(producto.sale_price).toLocaleString('es-AR')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    producto.stock > 5 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {producto.stock} en stock
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {/* Conectamos el botón de Editar */}
                  <button 
                    onClick={() => handleEdit(producto)}
                    className="text-gray-400 hover:text-white p-2 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {/* Conectamos el botón de Eliminar */}
                  <button 
                    onClick={() => handleDelete(producto.id)}
                    className="text-gray-400 hover:text-red-400 p-2 transition-colors ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                  No tenés auriculares cargados en el inventario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;