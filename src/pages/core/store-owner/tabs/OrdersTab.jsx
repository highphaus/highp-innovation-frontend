import React from "react";
import { Search, Filter, Download, ShoppingCart } from "lucide-react";

export default function OrdersTab({
  orders = [],
  ordersFilter,
  setOrdersFilter,
  searchQuery,
  setSearchQuery,
  timeRange,
  setTimeRange,
  handleExportOrders
}) {
  const currentFilter = ordersFilter || "all";

  // Filter labels as seen in the navigation sub-header row
  const filterTabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Confirmed" },
    { id: "shipped", label: "Shipped" },
    { id: "cancelled", label: "Cancelled" }
  ];

  return (
    <div className="w-full font-sans text-[#2d3748] max-w-6xl mx-auto pb-16 px-1 animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="space-y-1 mb-5">
        <h1 className="text-2xl font-bold text-[#0f172a]">Orders</h1>
        <p className="text-sm text-[#64748b]">{orders.length} orders</p>
      </div>

      {/* SUB-NAV FILTER TABS */}
      <div className="flex items-center gap-6 border-b border-[#e2e8f0] mb-5 overflow-x-auto scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setOrdersFilter?.(tab.id)}
              className={`pb-3 text-sm font-medium transition-all relative cursor-pointer whitespace-nowrap ${
                isActive 
                  ? "text-[#10b981] font-semibold" 
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#10b981]" />
              )}
            </button>
          );
        })}
      </div>

      {/* FILTER CONTROL TOOLBAR ROW */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
        
        {/* Search & Date Filter Wrap */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch gap-2 max-w-xl">
          {/* Search Box */}
          <div className="relative flex-1 flex items-center border border-[#cbd5e1] rounded bg-[#f8fafc] focus-within:border-neutral-400 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery?.(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-[#0f172a]"
            />
          </div>

          {/* Timeframe Selector Dropdown */}
          <div className="relative border border-[#cbd5e1] rounded bg-white flex items-center px-3 gap-2 focus-within:border-neutral-400 min-w-[130px]">
            <Filter className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={timeRange || "all"}
              onChange={(e) => setTimeRange?.(e.target.value)}
              className="w-full bg-transparent border-none py-2 pr-4 text-sm focus:outline-none appearance-none font-medium text-[#334155]"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <div className="pointer-events-none absolute right-3 text-[10px] text-neutral-400">▼</div>
          </div>
        </div>

        {/* Action Button Section */}
        <button
          type="button"
          onClick={handleExportOrders}
          className="border border-[#cbd5e1] hover:bg-neutral-50 px-4 py-2 rounded text-sm font-medium text-[#475569] flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#64748b]" />
          <span>Export</span>
        </button>
      </div>

      {/* DYNAMIC CONTENT AREA BLOCK */}
      {orders.length === 0 ? (
        
        /* CONDITION A: EMPTY STATE DISPLAYER CARD VIEW */
        <div className="flex flex-col items-center justify-center pt-16 pb-24 text-center space-y-3">
          <div className="p-4 bg-slate-50 border border-[#e2e8f0] rounded-full text-slate-400 shadow-inner">
            <ShoppingCart className="w-10 h-10 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#0f172a]">No orders found</h3>
            <p className="text-xs sm:text-sm text-[#64748b]">Try adjusting your filters</p>
          </div>
        </div>
      ) : (
        
        /* CONDITION B: INVENTORY RENDER DATA GRID TABLE */
        <div className="bg-white border border-[#e2e8f0] rounded-lg shadow-sm overflow-hidden w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-sm text-[#334155]">
              {orders.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-semibold text-[#0f172a]">#{item.orderNumber || item._id.slice(-6)}</td>
                  <td className="p-4 font-medium">{item.customerName || "Walk-in Guest"}</td>
                  <td className="p-4">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                      item.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-200" :
                      item.status === "confirmed" ? "bg-blue-50 text-blue-600 border-blue-200" :
                      item.status === "shipped" ? "bg-indigo-50 text-indigo-600 border-indigo-200" :
                      "bg-emerald-50 text-emerald-600 border-emerald-200"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#0f172a]">₹{item.totalAmount}</td>
                  <td className="p-4 text-right text-xs font-medium text-[#64748b]">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}