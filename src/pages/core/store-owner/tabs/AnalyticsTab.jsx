import React from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  BarChart3,
  PieChart,
  Target
} from "lucide-react";

export default function AnalyticsTab({
  analyticsData = {
    grossSales: 48250,
    salesChange: 12.5,
    totalOrders: 148,
    ordersChange: 8.2,
    avgOrderValue: 326,
    aovChange: -1.4,
    storeViews: 3420,
    viewsChange: 24.8,
    conversionRate: 4.3,
    conversionChange: 0.6,
    topProducts: [
      { id: 1, name: "Fresh Tomatoes", sales: 120, revenue: 4800, image: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=100" },
      { id: 2, name: "Organic Bananas", sales: 95, revenue: 2850, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100" },
      { id: 3, name: "Whole Milk 1L", sales: 84, revenue: 5880, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100" }
    ],
    categoryBreakdown: [
      { name: "Fruits & Vegetables", percentage: 55, color: "bg-emerald-500" },
      { name: "Dairy & Bakery", percentage: 30, color: "bg-blue-500" },
      { name: "Packaged Foods", percentage: 15, color: "bg-amber-500" }
    ],
    recentActivity: [
      { id: "1024", customer: "Rahul Sharma", items: 3, amount: 840, time: "10 mins ago", status: "Pending" },
      { id: "1023", customer: "Anjali Menon", items: 1, amount: 120, time: "45 mins ago", status: "Confirmed" },
      { id: "1022", customer: "Syam Kumar", items: 5, amount: 1450, time: "2 hours ago", status: "Shipped" }
    ]
  },
  analyticsTimePeriod = "7days",
  setAnalyticsTimePeriod
}) {
  
  return (
    <div className="w-full font-sans text-[#2d3748] max-w-6xl mx-auto pb-16 px-1 animate-fade-in space-y-6">
      
      {/* HEADER ROW & TIMEFRAME SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#e2e8f0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Detailed Analytics</h1>
          <p className="text-sm text-[#64748b]">Deep-dive store performance metrics and customer insights.</p>
        </div>
        
        <div className="relative border border-[#cbd5e1] rounded bg-white flex items-center px-3 gap-2 focus-within:border-neutral-400 self-start sm:self-auto min-w-[140px]">
          <Calendar className="w-3.5 h-3.5 text-[#64748b]" />
          <select
            value={analyticsTimePeriod}
            onChange={(e) => setAnalyticsTimePeriod?.(e.target.value)}
            className="w-full bg-transparent border-none py-2 pr-4 text-sm focus:outline-none appearance-none font-semibold text-[#334155]"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="year">This Year</option>
          </select>
          <div className="pointer-events-none absolute right-3 text-[10px] text-neutral-400">▼</div>
        </div>
      </div>

      {/* CORE PERFORMANCE METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Gross Sales */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[#64748b]">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="p-1.5 bg-emerald-50 text-[#10b981] rounded-lg"><DollarSign className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#0f172a]">₹{analyticsData.grossSales.toLocaleString("en-IN")}</span>
            <span className={`text-xs font-bold flex items-center ${analyticsData.salesChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {analyticsData.salesChange >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {Math.abs(analyticsData.salesChange)}%
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[#64748b]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#0f172a]">{analyticsData.totalOrders}</span>
            <span className={`text-xs font-bold flex items-center ${analyticsData.ordersChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {analyticsData.ordersChange >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {Math.abs(analyticsData.ordersChange)}%
            </span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[#64748b]">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#0f172a]">₹{analyticsData.avgOrderValue}</span>
            <span className={`text-xs font-bold flex items-center ${analyticsData.aovChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {analyticsData.aovChange >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {Math.abs(analyticsData.aovChange)}%
            </span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[#64748b]">
            <span className="text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
            <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><Target className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#0f172a]">{analyticsData.conversionRate}%</span>
            <span className={`text-xs font-bold flex items-center ${analyticsData.conversionChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {analyticsData.conversionChange >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {Math.abs(analyticsData.conversionChange)}%
            </span>
          </div>
        </div>
      </div>

      {/* GRAPH CHART & SALES VOLUME AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Trend Bar Chart */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-neutral-400" />
              <span>Sales Performance Graph</span>
            </h3>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 pt-6 px-2 border-b border-l border-[#e2e8f0]">
            {[35, 45, 25, 60, 75, 50, 90].map((heightVal, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="opacity-0 group-hover:opacity-100 bg-neutral-900 text-white font-bold text-[10px] px-1.5 py-0.5 rounded mb-1 absolute translate-y-[-45px] transition-opacity pointer-events-none shadow">
                  ₹{(heightVal * 150).toLocaleString()}
                </div>
                <div 
                  className="w-full bg-neutral-800 group-hover:bg-[#10b981] transition-colors rounded-t cursor-pointer" 
                  style={{ height: `${heightVal}%` }}
                />
                <span className="text-[10px] text-[#64748b] font-medium mt-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Share Breakdown */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-neutral-400" />
            <span>Category Share</span>
          </h3>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {analyticsData.categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#334155]">{cat.name}</span>
                  <span className="text-[#0f172a]">{cat.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* TOP SELLING PRODUCTS & RECENT ACTIVITY FEEDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Selling Items */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider mb-4">Top Products</h3>
          <div className="divide-y divide-[#f1f5f9]">
            {analyticsData.topProducts.map((product, idx) => (
              <div key={product.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-neutral-400 w-4">{idx + 1}</span>
                  <div className="w-10 h-10 border border-[#e2e8f0] rounded bg-neutral-50 overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#0f172a] truncate">{product.name}</h4>
                    <span className="text-xs text-[#64748b] font-medium">{product.sales} sales</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#10b981]">₹{product.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Traffic / Conversion Flow */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider mb-4">Recent Sales Activity</h3>
          <div className="divide-y divide-[#f1f5f9]">
            {analyticsData.recentActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#0f172a] truncate">{act.customer}</h4>
                  <div className="flex items-center gap-2 text-xs text-[#64748b] font-medium mt-0.5">
                    <span>{act.items} items</span>
                    <span>•</span>
                    <span>{act.time}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-bold text-[#0f172a] block">₹{act.amount}</span>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{act.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}