import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Headphones, Search } from 'lucide-react';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  
  // 1. Agregamos el estado para guardar lo que el usuario escribe
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este auricular?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8000/api/finance/products/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
        await axios.put(`http://localhost:8000/api/finance/products/${editandoId}/`, nuevoProducto, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:8000/api/finance/products/', nuevoProducto, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      fetchProductos(); 
      setMostrarFormulario(false);
      setEditandoId(null);
      setNuevoProducto({ name: '', cost_price: '', sale_price: '', stock: '' });
      
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Hubo un error al guardar. Revisá la consola.");
    }
  };

  // 2. Filtramos la lista en tiempo real en base al texto del buscador
  const productosFiltrados = productos.filter(producto => 
    producto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Tus Productos</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 transition-colors">Gestioná el stock y precios de tus auriculares.</p>
        </div>
        <button 
          onClick={() => {
            setEditandoId(null);
            setNuevoProducto({ name: '', cost_price: '', sale_price: '', stock: '' });
            setMostrarFormulario(!mostrarFormulario);
          }}
          className="bg-[#2563EB] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors text-sm shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nuevo Auricular
        </button>
      </div>

      {/* FORMULARIO DE CREACIÓN/EDICIÓN */}
      {mostrarFormulario && (
        <div className="bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800/50 p-6 rounded-2xl mb-8 shadow-sm transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
            {editandoId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          
          <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Nombre / Modelo</label>
              <input 
                type="text" 
                name="name"
                value={nuevoProducto.name}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                placeholder="Ej: HyperX Cloud Flight"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Costo ($)</label>
              <input 
                type="number" 
                name="cost_price"
                value={nuevoProducto.cost_price}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                placeholder="0"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Precio Venta ($)</label>
              <input 
                type="number" 
                name="sale_price"
                value={nuevoProducto.sale_price}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                placeholder="0"
                required
              />
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Stock</label>
              <input 
                type="number" 
                name="stock"
                value={nuevoProducto.stock}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                placeholder="0"
                required
              />
            </div>
            <button type="submit" className="cursor-pointer bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              {editandoId ? 'Actualizar' : 'Guardar'}
            </button>
          </form>
        </div>
      )}

      {/* 3. BARRA DE BÚSQUEDA */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar auricular por modelo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-96 pl-11 pr-4 py-2.5 bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800/50 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-[#2563EB] transition-colors shadow-sm"
        />
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800/50 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-transparent transition-colors">
                <th className="px-6 py-4 font-semibold">Producto</th>
                <th className="px-6 py-4 font-semibold">Costo</th>
                <th className="px-6 py-4 font-semibold">Precio Venta</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/30">
              
              {/* 4. Usamos productosFiltrados en lugar de productos */}
              {productosFiltrados.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 dark:bg-gray-800/50 p-2 rounded-lg transition-colors">
                        <Headphones className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <span className="font-medium text-sm text-gray-900 dark:text-white transition-colors">{producto.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                    ${Number(producto.cost_price).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors">
                    ${Number(producto.sale_price).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      producto.stock > 5 ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                    } transition-colors`}>
                      {producto.stock} en stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEdit(producto)}
                      className="cursor-pointer text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(producto.id)}
                      className="cursor-pointer text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 transition-colors ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* 5. Ajustamos los mensajes de estado vacío */}
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
                    No tenés auriculares cargados en el inventario.
                  </td>
                </tr>
              ) : productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
                    No se encontraron auriculares que coincidan con "{searchTerm}".
                  </td>
                </tr>
              ) : null}
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Productos;