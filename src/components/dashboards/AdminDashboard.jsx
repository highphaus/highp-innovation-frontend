import React, { useState } from "react";
import { Users, DollarSign, TrendingUp, Package, Clock, Plus, Trash2, ShieldAlert, Award, Coffee, Eye, EyeOff, UserCheck } from "lucide-react";
import { useOrders } from "@/lib/OrderContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { 
    orders, 
    products, 
    updateOrderStatus, 
    addProduct, 
    toggleProductAvailability, 
    updateProductPrice 
  } = useOrders();

  const [activeTab, setActiveTab] = useState("dashboard");

  // Dynamic calculations
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Count unique drivers involved in delivering/delivered orders
  const uniqueDrivers = new Set(
    orders.map(o => o.driverId).filter(Boolean)
  );
  const activeDriverCount = uniqueDrivers.size > 0 ? uniqueDrivers.size : 1; // default to 1 for visual polish

  // Add Product Form State
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Cakes");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState("");
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    const priceVal = parseFloat(newProdPrice);
    if (!newProdName || isNaN(priceVal) || priceVal <= 0) return;

    // Use default Unsplash image if none provided
    const imgUrl = newProdImage.trim() || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80";

    addProduct({
      name: newProdName,
      category: newProdCategory,
      price: priceVal,
      description: newProdDesc || "Baked fresh with premium ingredients.",
      image: imgUrl
    });

    // Reset Form
    setNewProdName("");
    setNewProdPrice("");
    setNewProdDesc("");
    setNewProdImage("");
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 2500);
  };

  const metrics = [
    { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50 border-green-150" },
    { title: "Total Orders", value: totalOrders.toString(), icon: Package, color: "text-blue-600", bg: "bg-blue-50 border-blue-150" },
    { title: "Average Basket", value: `$${aov.toFixed(2)}`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50 border-purple-150" },
    { title: "Active Partners", value: `${activeDriverCount} On Duty`, icon: Users, color: "text-orange-600", bg: "bg-orange-50 border-orange-150" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 w-full max-w-7xl mx-auto">
      {/* Admin header with custom tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-1.5">
            <ShieldAlert className="w-7 h-7 text-orange-600" /> Executive Dashboard
          </h1>
          <p className="text-gray-400 text-xs font-semibold mt-0.5">Taste N Park administrative command center</p>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex bg-gray-100 p-1 rounded-2xl w-full md:w-auto overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "dashboard" ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "orders" ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Live Logs ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "products" ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Menu Creator
          </button>
        </div>
      </div>

      {/* 1. DASHBOARD INSIGHTS TAB */}
      {activeTab === "dashboard" && (
        <div className="flex flex-col gap-6">
          {/* Metrics summary widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${metric.bg} border flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{metric.title}</p>
                    <p className="text-xl font-black text-gray-950 mt-0.5">{metric.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales breakdown by category visual */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-gray-900 text-sm mb-6 uppercase tracking-wider">Product Category Shares</h3>
              
              <div className="flex flex-col gap-4">
                {[
                  { name: "Cakes", percentage: 55, count: 8, color: "bg-orange-500" },
                  { name: "Breads", percentage: 20, count: 3, color: "bg-amber-500" },
                  { name: "Pastries", percentage: 15, count: 2, color: "bg-rose-500" },
                  { name: "Drinks & Meals", percentage: 10, count: 2, color: "bg-blue-500" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span>{item.name} ({item.count} items)</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats and loyalty info */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
              <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">Operational Status</h3>
              
              <div className="flex flex-col gap-3.5 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold">Kitchen Queue</span>
                  <span className="bg-red-50 text-red-600 font-black px-2 py-0.5 rounded-full">
                    {orders.filter(o => o.status === "pending").length} Pending
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold">In Oven / Prep</span>
                  <span className="bg-orange-50 text-orange-600 font-black px-2 py-0.5 rounded-full">
                    {orders.filter(o => o.status === "preparing").length} Preparing
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold">Out for Delivery</span>
                  <span className="bg-blue-50 text-blue-600 font-black px-2 py-0.5 rounded-full">
                    {orders.filter(o => o.status === "delivering").length} Dispatch
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold">Completed Today</span>
                  <span className="bg-green-50 text-green-600 font-black px-2 py-0.5 rounded-full">
                    {orders.filter(o => o.status === "delivered").length} Delivered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LIVE ORDERS LOGS TAB */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-50">
            <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">Live Transaction Logs</h3>
            <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              Real-time update
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-gray-600">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-55">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 font-bold text-gray-900">{order.id}</td>
                    <td className="py-4 px-2">
                      <div className="font-bold text-gray-800">{order.customerName}</div>
                      <div className="text-[10px] text-gray-400 font-medium">
                        {order.address || (order.tableNumber ? `Dine-in (${order.tableNumber})` : "Takeaway")}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {order.type}
                      </span>
                    </td>
                    <td className="py-4 px-2 font-bold text-orange-600">${order.total.toFixed(2)}</td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        order.status === "pending" ? "bg-red-50 text-red-600" :
                        order.status === "preparing" ? "bg-orange-50 text-orange-600" :
                        order.status === "ready" ? "bg-blue-50 text-blue-600" :
                        order.status === "delivering" ? "bg-purple-50 text-purple-600" :
                        "bg-green-50 text-green-600"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex justify-end gap-1.5">
                        {order.status === "pending" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "preparing")}
                            className="bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
                          >
                            Approve
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "ready")}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === "ready" && order.type === "delivery" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "delivering")}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
                          >
                            Ship (DRV-1)
                          </button>
                        )}
                        {["ready", "delivering"].includes(order.status) && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "delivered")}
                            className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
                          >
                            Complete
                          </button>
                        )}
                        {order.status !== "delivered" && (
                          <span className="text-gray-300">|</span>
                        )}
                        <button
                          onClick={() => updateOrderStatus(order.id, "delivered")}
                          className="text-gray-400 hover:text-red-500 font-bold text-[10px] px-1.5 py-1 hover:underline"
                        >
                          Force Done
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MENU PRODUCT CREATOR TAB */}
      {activeTab === "products" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Add Product Form */}
          <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-sm lg:col-span-1">
            <h3 className="font-extrabold text-gray-900 text-sm mb-4 uppercase tracking-wider">Publish New Product</h3>
            
            {showAddSuccess && (
              <div className="bg-green-50 border border-green-150 text-green-700 text-xs font-bold p-3 rounded-2xl mb-4 flex items-center gap-2">
                🧁 Product successfully added to menu!
              </div>
            )}

            <form onSubmit={handleAddProductSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="E.g., Raspberry Danish"
                  className="w-full px-3.5 h-11 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 h-11 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Cakes">Cakes</option>
                    <option value="Pastries">Pastries</option>
                    <option value="Breads">Breads</option>
                    <option value="Meals">Meals</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="4.50"
                    className="w-full px-3.5 h-11 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Short marketing description..."
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-500 min-h-[70px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unsplash Image URL (Optional)</label>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 h-11 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-semibold outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all shadow-md shadow-orange-600/10 text-xs flex items-center justify-center gap-1.5 mt-2"
              >
                <Plus className="w-4 h-4" /> Create Product
              </button>
            </form>
          </div>

          {/* Current Products Control Panel */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm lg:col-span-2 flex flex-col gap-4">
            <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">Active Inventory control</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-gray-600">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-1">Item</th>
                    <th className="py-2.5 px-1">Category</th>
                    <th className="py-2.5 px-1">Price</th>
                    <th className="py-2.5 px-1 text-right">Store Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-55">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-1">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-50 shrink-0" />
                          <div>
                            <div className="font-bold text-gray-900">{product.name}</div>
                            <div className="text-[9px] text-gray-450 truncate max-w-[150px]">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-1 text-[10px] font-bold uppercase text-gray-400">{product.category}</td>
                      <td className="py-3 px-1 text-orange-600 font-extrabold">${product.price.toFixed(2)}</td>
                      <td className="py-3 px-1 text-right">
                        <button
                          onClick={() => toggleProductAvailability(product.id)}
                          className={`text-xs font-bold px-2 py-1 rounded-lg transition-colors inline-flex items-center gap-1 ${
                            product.available 
                              ? "bg-green-50 text-green-700 border border-green-150" 
                              : "bg-gray-50 text-gray-500 border border-gray-200"
                          }`}
                        >
                          {product.available ? (
                            <>
                              <Eye className="w-3.5 h-3.5" /> Available
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" /> Disabled
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
