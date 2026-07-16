import React from "react";
import { Search } from "lucide-react";

export default function PricesTab({
  productsList = [],
  priceSearchQuery,
  setPriceSearchQuery,
  handleInlinePriceChange
}) {
  return (
    <div className="w-full font-sans text-[#2d3748] max-w-6xl mx-auto pb-16 px-1 animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Prices</h1>
        <p className="text-sm text-[#64748b]">Auto-saves and syncs to your Google Sheet.</p>
      </div>

      {/* SEARCH FIELD INPUT BAR */}
      <div className="relative border border-[#cbd5e1] rounded bg-[#f8fafc] focus-within:border-neutral-400 focus-within:bg-white transition-all max-w-full mb-8 flex items-center">
        <Search className="w-4 h-4 text-[#64748b] absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={priceSearchQuery || ""}
          onChange={(e) => setPriceSearchQuery?.(e.target.value)}
          placeholder="Search products or variants..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-[#0f172a]"
        />
      </div>

      {/* DYNAMIC LIST CONTENT AREA */}
      {(!productsList || productsList.length === 0) ? (
        
        /* CONDITION A: SCREENSHOT EMPTY STATE LAYOUT */
        <div className="w-full text-center py-20 px-4 text-sm font-medium text-[#64748b]">
          No products yet. Add one from the Products page to set prices here.
        </div>
      ) : (
        
        /* CONDITION B: EDITABLE PRICES INVENTORY LIST TABLE */
        <div className="bg-white border border-[#e2e8f0] rounded-lg shadow-sm overflow-hidden w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                <th className="p-4 w-16">Image</th>
                <th className="p-4">Product / Variant Name</th>
                <th className="p-4 w-40">Base Price (₹)</th>
                <th className="p-4 w-40 text-right">Sale Price (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-sm text-[#334155]">
              {productsList
                .filter(p => 
                  !priceSearchQuery || 
                  p.name.toLowerCase().includes(priceSearchQuery.toLowerCase())
                )
                .map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="w-10 h-10 border border-[#e2e8f0] rounded bg-neutral-100 overflow-hidden shadow-sm flex items-center justify-center">
                        <img 
                          src={product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100"} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#0f172a] block">{product.name}</span>
                      {product.category && (
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-[#64748b] border border-slate-200 mt-0.5 inline-block">
                          {product.category}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="relative flex items-center max-w-[120px] border border-[#cbd5e1] rounded px-2 bg-[#f8fafc] focus-within:border-neutral-400 focus-within:bg-white">
                        <span className="text-xs text-neutral-400 font-medium mr-1">₹</span>
                        <input
                          type="number"
                          defaultValue={product.price}
                          onBlur={(e) => handleInlinePriceChange?.(product._id, "price", e.target.value)}
                          className="w-full bg-transparent border-none p-1 text-sm text-[#0f172a] font-semibold focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-right flex justify-end">
                      <div className="relative flex items-center w-[120px] border border-[#cbd5e1] rounded px-2 bg-[#f8fafc] focus-within:border-neutral-400 focus-within:bg-white">
                        <span className="text-xs text-neutral-400 font-medium mr-1">₹</span>
                        <input
                          type="number"
                          defaultValue={product.discountPrice || ""}
                          placeholder="Optional"
                          onBlur={(e) => handleInlinePriceChange?.(product._id, "discountPrice", e.target.value)}
                          className="w-full bg-transparent border-none p-1 text-sm text-[#0f172a] font-semibold focus:outline-none"
                        />
                      </div>
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