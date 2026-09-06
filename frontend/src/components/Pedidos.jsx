import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, DollarSign, Calendar, Trash2 } from 'lucide-react';
import axios from 'axios';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [nuevoPedido, setNuevoPedido] = useState({
    product: '', 
    quantity: 1,
    total_price: '',
    payment_method: 'Efectivo/Transferencia'
  });

  useEffect(() => {
    fetchPedidos();
    fetchProductos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/finance/sales/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/finance/products/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const handleInputChange = (e) => {
    setNuevoPedido({ ...nuevoPedido, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const productoSeleccionado = productos.find(p => p.id.toString() === productId);
    
    setNuevoPedido({ 
      ...nuevoPedido, 
      product: productId,
      total_price: productoSeleccionado ? productoSeleccionado.sale_price * nuevoPedido.quantity : ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este pedido?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8000/api/finance/sales/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        fetchPedidos();
      } catch (error) {
        console.error("Error al eliminar la venta:", error);
        alert("Hubo un error al intentar borrar el pedido.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:8000/api/finance/sales/', nuevoPedido, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchPedidos();
      setMostrarFormulario(false);
      setNuevoPedido({ product: '', quantity: 1, total_price: '', payment_method: 'Efectivo/Transferencia' });
      
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      alert("Hubo un error al registrar la venta. Revisá la consola.");
    }
  };

  const getNombreProducto = (idProducto) => {
    const producto = productos.find(p => p.id === idProducto);
    return producto ? producto.name : 'Producto Eliminado'; 
  };

  return (
    <div className="p-8">
      
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Registro de Pedidos</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 transition-colors">Registrá tus ventas y descontá stock automáticamente.</p>
        </div>
        <button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-[#2563EB] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nueva Venta
        </button>
      </div>

      {/* FORMULARIO DE NUEVA VENTA */}
      {mostrarFormulario && (
        <div className="bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800/50 p-6 rounded-2xl mb-8 shadow-sm transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Registrar Nueva Venta</h2>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Producto</label>
              <select 
                name="product"
                value={nuevoPedido.product}
                onChange={handleProductChange}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Seleccioná un auricular...</option>
                {productos.map(prod => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} (Stock: {prod.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-24">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Cantidad</label>
              <input 
                type="number" 
                name="quantity"
                min="1"
                value={nuevoPedido.quantity}
                onChange={(e) => {
                  handleInputChange(e);
                  const productoSeleccionado = productos.find(p => p.id.toString() === nuevoPedido.product);
                  if (productoSeleccionado) {
                    setNuevoPedido(prev => ({
                      ...prev,
                      quantity: e.target.value,
                      total_price: productoSeleccionado.sale_price * e.target.value
                    }));
                  }
                }}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="w-32">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Total Cobrado ($)</label>
              <input 
                type="number" 
                name="total_price"
                value={nuevoPedido.total_price}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="w-48">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors">Método de Pago</label>
              <select 
                name="payment_method"
                value={nuevoPedido.payment_method}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
              >
                <option value="Efectivo/Transferencia">Efectivo/Transferencia</option>
                <option value="MercadoPago">MercadoPago</option>
                <option value="Cripto">Cripto (USDT)</option>
              </select>
            </div>

            <button type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Registrar
            </button>
          </form>
        </div>
      )}

      {/* TABLA DE PEDIDOS */}
      <div className="bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800/50 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-transparent transition-colors">
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Producto</th>
                <th className="px-6 py-4 font-semibold">Cantidad</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Método</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/30">
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                      <Calendar className="w-4 h-4" />
                      {new Date(pedido.date).toLocaleDateString('es-AR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 dark:bg-blue-500/10 p-2 rounded-lg transition-colors">
                        <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium text-sm text-gray-900 dark:text-white transition-colors">{getNombreProducto(pedido.product)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors">
                    {pedido.quantity} unid.
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold transition-colors">
                      <DollarSign className="w-4 h-4" />
                      {Number(pedido.total_price).toLocaleString('es-AR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors">
                      {pedido.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(pedido.id)}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
                    Todavía no registraste ninguna venta.
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

export default Pedidos;