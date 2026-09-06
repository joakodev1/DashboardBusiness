import React, { useState, useEffect } from 'react';
import { DollarSign, Package, ShoppingCart, TrendingUp, TrendingDown, Calendar, Wallet } from 'lucide-react';
// IMPORTANTE: Cambiamos axios por nuestra instancia api
import api from '../api'; 

const Dashboard = () => {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [gastos, setGastos] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Mirá lo limpio que queda el código sin tener que buscar el token manualmente
      const [resProductos, resVentas, resGastos] = await Promise.all([
        api.get('finance/products/'),
        api.get('finance/sales/'),
        api.get('finance/expenses/')
      ]);

      setProductos(resProductos.data);
      setVentas(resVentas.data);
      setGastos(resGastos.data);
    } catch (error) {
      console.error("Error al cargar los datos del dashboard", error);
    }
  };

  const ingresosTotales = ventas.reduce((acc, venta) => acc + Number(venta.total_price), 0);
  const gastosTotales = gastos.reduce((acc, gasto) => acc + Number(gasto.amount), 0);
  const gananciaNeta = ingresosTotales - gastosTotales;
  const stockTotal = productos.reduce((acc, producto) => acc + producto.stock, 0);
  const ultimasVentas = [...ventas].slice(0, 4);

  const getNombreProducto = (idProducto) => {
    const producto = productos.find(p => p.id === idProducto);
    return producto ? producto.name : 'Producto Eliminado';
  };

  return (
    <div className="text-gray-900 dark:text-white transition-colors duration-300">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Panel Principal</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Resumen financiero y rendimiento de tu tienda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* TARJETA 1: Ganancia Neta */}
        <div className="bg-[#FFFFFF] dark:bg-[#141720] border border-green-500/30 p-6 rounded-2xl shadow-[0_0_15px_rgba(34,197,94,0.05)] dark:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Ganancia Neta</p>
              <h3 className={`text-3xl font-bold ${gananciaNeta >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-500 dark:text-red-400'}`}>
                ${gananciaNeta.toLocaleString('es-AR')}
              </h3>
            </div>
            <div className="bg-green-100 dark:bg-green-500/20 p-3 rounded-xl border border-green-200 dark:border-green-500/30">
              <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* TARJETA 2: Ingresos Brutos */}
        <div className="bg-[#FFFFFF] dark:bg-[#141720] border border-gray-200 dark:border-gray-800/30 p-6 rounded-2xl transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Ingresos</p>
              <h3 className="text-2xl font-bold">${ingresosTotales.toLocaleString('es-AR')}</h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-500/10 p-3 rounded-xl">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* TARJETA 3: Gastos Totales */}
        <div className="bg-[#FFFFFF] dark:bg-[#141720] border border-gray-200 dark:border-gray-800/30 p-6 rounded-2xl transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Gastos</p>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                ${gastosTotales.toLocaleString('es-AR')}
              </h3>
            </div>
            <div className="bg-red-100 dark:bg-red-500/10 p-3 rounded-xl">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* TARJETA 4: Stock */}
        <div className="bg-[#FFFFFF] dark:bg-[#141720] border border-gray-200 dark:border-gray-800/30 p-6 rounded-2xl transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Stock Total</p>
              <h3 className="text-2xl font-bold">{stockTotal} unid.</h3>
            </div>
            <div className="bg-purple-100 dark:bg-purple-500/10 p-3 rounded-xl">
              <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

      </div>

      {/* Sección de Últimos Movimientos */}
      <div className="bg-[#FFFFFF] dark:bg-[#141720] border border-gray-200 dark:border-gray-800/30 rounded-2xl p-6 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold">Últimas Ventas</h2>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-800/30">
          {ultimasVentas.map(venta => (
            <div key={venta.id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 dark:bg-gray-800/50 p-2 rounded-lg hidden sm:block">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {getNombreProducto(venta.product)} <span className="text-gray-400 dark:text-gray-500 font-normal">#{venta.id}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(venta.date).toLocaleDateString('es-AR')} • {venta.payment_method}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 dark:text-green-400 text-sm">
                  + ${Number(venta.total_price).toLocaleString('es-AR')}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{venta.quantity} unid.</p>
              </div>
            </div>
          ))}
          {ultimasVentas.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">Aún no hay ventas registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;