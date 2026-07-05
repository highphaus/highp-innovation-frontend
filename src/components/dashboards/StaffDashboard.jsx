import React, { useState } from "react";
import { useOrders } from "@/lib/OrderContext";
import { ChefHat, CheckCircle2, Clock, Activity, LayoutList, ToggleLeft, ToggleRight, DollarSign, PackageCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StaffDashboard() {
  const { 
    orders, 
    updateOrderStatus, 
    products, 
    toggleProductAvailability, 
    updateProductPrice 
  } = useOrders();
  
  const [activeMode, setActiveMode] = useState("kds");
  
  // Kitchen Display System order categorization
  const pendingOrders = orders.filter(o => o.status === "pending");
  const preparingOrders = orders.filter(o => o.status === "preparing");
  const completedOrders = orders.filter(o => ["ready", "delivering", "delivered"].includes(o.status));

  // Inline editing state for prices
  const [editingProdId, setEditingProdId] = useState(null);
  const [tempPrice, setTempPrice] = useState("");

  const handleSavePrice = (id) => {
    const parsed = parseFloat(tempPrice);
    if (!isNaN(parsed) && parsed > 0) {
      updateProductPrice(id, parsed);
    }
    setEditingProdId(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 w-full max-w-7xl mx-auto">
      {/* KDS Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2">
            <ChefHat className="w-7 h-7 text-orange-600" /> Bakery Workspace
          </h1>
          <p className="text-gray-400 text-xs font-semibold mt-0.5">Live order preparation & menu control</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl w-full sm:w-auto shrink-0">
          <button
            onClick={() => setActiveMode("kds")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 justify-center ${
              activeMode === "kds" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Activity className="w-4 h-4" /> KDS Terminal
          </button>
          <button
            onClick={() => setActiveMode("inventory")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 justify-center ${
              activeMode === "inventory" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutList className="w-4 h-4" /> Store Inventory
          </button>
        </div>
      </div>

      {/* 1. KDS TERMINAL MODE */}
      {activeMode === "kds" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Column 1: New Orders */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 min-h-[500px]">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-50">
              <h2 className="text-sm font-black text-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                New Orders
              </h2>
              <span className="bg-red-50 text-red-600 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                {pendingOrders.length} New
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {pendingOrders.map(order => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    key={order.id} 
                    className="border border-red-100 bg-red-50/20 rounded-2xl p-4 flex flex-col shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-extrabold text-sm text-gray-900">{order.id}</span>
                      <span className="bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {order.type}
                      </span>
                    </div>

                    <div className="bg-white rounded-xl p-3 mb-4 border border-red-100/50 shadow-sm flex flex-col gap-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col text-xs font-bold text-gray-800">
                          <span>{item.quantity}x {item.name}</span>
                          {item.customDetails && (
                            <span className="text-[10px] text-gray-400 font-medium pl-3 mt-0.5">
                              ↳ Flavor: {item.customDetails.flavor} | Wt: {item.customDetails.weight} lbs
                              {item.customDetails.instructions && ` | Note: "${item.customDetails.instructions}"`}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="w-full bg-gray-950 hover:bg-gray-800 active:scale-[0.98] text-white font-extrabold h-11 rounded-xl text-xs transition-all shadow-md shadow-gray-950/10"
                    >
                      Start Prep
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {pendingOrders.length === 0 && (
                <div className="text-center text-gray-400 text-xs font-medium py-16">
                  No pending queue.
                </div>
              )}
            </div>
          </div>

          {/* Column 2: In Preparation */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 min-h-[500px]">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-50">
              <h2 className="text-sm font-black text-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                Preparing
              </h2>
              <span className="bg-orange-55 text-orange-600 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                {preparingOrders.length} Baking
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {preparingOrders.map(order => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    key={order.id} 
                    className="border border-orange-100 bg-orange-50/20 rounded-2xl p-4 flex flex-col shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-extrabold text-sm text-gray-900">{order.id}</span>
                      <span className="bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {order.type}
                      </span>
                    </div>

                    <div className="bg-white rounded-xl p-3 mb-4 border border-orange-100/50 shadow-sm flex flex-col gap-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col text-xs font-bold text-gray-800">
                          <span>{item.quantity}x {item.name}</span>
                          {item.customDetails && (
                            <span className="text-[10px] text-gray-400 font-medium pl-3 mt-0.5">
                              ↳ Flavor: {item.customDetails.flavor} | Wt: {item.customDetails.weight} lbs
                              {item.customDetails.instructions && ` | Note: "${item.customDetails.instructions}"`}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-gray-900 font-extrabold h-11 rounded-xl text-xs transition-all shadow-md shadow-green-500/10 flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Ready for Pickup
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {preparingOrders.length === 0 && (
                <div className="text-center text-gray-400 text-xs font-medium py-16">
                  Nothing in preparation.
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Completed & Ready Dispatched */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 min-h-[500px]">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-50">
              <h2 className="text-sm font-black text-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                Dispatched
              </h2>
              <span className="bg-green-50 text-green-600 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                {completedOrders.length} Done
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {completedOrders.map(order => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    key={order.id} 
                    className="border border-green-100 bg-green-50/20 rounded-2xl p-4 flex flex-col shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-extrabold text-sm text-gray-900">{order.id}</span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        order.status === "ready" ? "bg-blue-100 text-blue-700" :
                        order.status === "delivering" ? "bg-orange-100 text-orange-700 animate-pulse" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="bg-white rounded-xl p-3 mb-2 border border-green-100/50 shadow-sm flex flex-col gap-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-bold text-gray-700">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1 pt-1.5">
                      <span>Total</span>
                      <span className="font-black text-gray-800 text-xs">${order.total.toFixed(2)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {completedOrders.length === 0 && (
                <div className="text-center text-gray-400 text-xs font-medium py-16">
                  No completed jobs.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. STORE INVENTORY MODE */}
      {activeMode === "inventory" && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-3">
            <h2 className="text-base font-black text-gray-800 uppercase tracking-wider">Storefront Catalog Management</h2>
            <span className="text-xs text-gray-400 font-semibold">{products.length} Products Available</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-gray-600">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Image</th>
                  <th className="py-3 px-2">Product Name</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2 text-right">Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-2">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50" />
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-bold text-gray-900 text-sm">{product.name}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 max-w-[250px] font-medium">
                        {product.description}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-bold text-gray-800">
                      {editingProdId === product.id ? (
                        <div className="flex items-center gap-1 max-w-[90px]">
                          <span className="text-gray-400">$</span>
                          <input
                            type="text"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-14 px-1.5 py-1 border rounded outline-none text-xs"
                            autoFocus
                          />
                          <button 
                            onClick={() => handleSavePrice(product.id)}
                            className="bg-green-500 text-white rounded p-1 hover:bg-green-600"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-orange-600">${product.price.toFixed(2)}</span>
                          <button 
                            onClick={() => {
                              setEditingProdId(product.id);
                              setTempPrice(product.price.toString());
                            }}
                            className="text-gray-400 hover:text-gray-600 text-[10px] underline"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => toggleProductAvailability(product.id)}
                        className={`text-2xl transition-colors active:scale-95 ${
                          product.available ? "text-green-500" : "text-gray-300"
                        }`}
                      >
                        {product.available ? (
                          <ToggleRight className="w-10 h-6 stroke-1.5" />
                        ) : (
                          <ToggleLeft className="w-10 h-6 stroke-1.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
