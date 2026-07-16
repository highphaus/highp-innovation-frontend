import React, { useRef } from "react";
import { ArrowLeft, Camera, Plus, Trash2, Edit3, Eye, ShieldAlert } from "lucide-react";

export default function AddProductTab({
  newProdName,
  setNewProdName,
  newProdPrice,
  setNewProdPrice,
  newProdDiscountPrice,
  setNewProdDiscountPrice,
  newProdCategory,
  setNewProdCategory,
  newProdDescription,
  setNewProdDescription,
  newProdBrand,
  setNewProdBrand,
  newProdTags,
  setNewProdTags,
  newProdStock,
  setNewProdStock,
  newProdAvailability,
  setNewProdAvailability,
  newProdWeight,
  setNewProdWeight,
  newProdPackageSize,
  setNewProdPackageSize,
  newProdFlavor,
  setNewProdFlavor,
  newProdOrigin,
  setNewProdOrigin,
  newProdDietaryInfo,
  setNewProdDietaryInfo,
  newProdImage,
  newProdVariants,
  variantInputText,
  setVariantInputText,
  variantInputUnit,
  setVariantInputUnit,
  customVariantInput,
  setCustomVariantInput,
  customCategoryInput,
  setCustomCategoryInput,
  customCategories,
  handleAddCustomCategory,
  handleRemoveCustomCategory,
  
  // Edit & Core state management hooks
  editingProductId,
  selectedProductToEdit,
  setSelectedProductToEdit,
  productsList,
  handleLoadProductForEdit,
  
  handleAddNewProductSubmit,
  handleClearEditMode,
  handleImageFileChange,
  handleQuickAddVariants,
  handleAddCustomVariant,
  handleRemoveCustomVariant,
  navigate
}) {
  const fileInputRef = useRef(null);

  const triggerImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // UX Safe deletion triggers a clean alert hook before making structural state alterations
  const handleInlineDeleteProduct = async (productId, productName) => {
    const confirmDelete = window.confirm(`Are you absolutely sure you want to permanently delete "${productName}" from your store catalog?`);
    if (!confirmDelete) return;

    try {
      // Direct call to your existing product delete endpoint structure
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        alert("Product deleted successfully!");
        // Triggers parent store updates to hot-reload live counts automatically
        handleClearEditMode();
        window.location.reload(); 
      } else {
        alert("Failed to delete the product entry. Please try again.");
      }
    } catch (err) {
      console.error("Error executing product deletion:", err);
      alert("An error occurred while attempting to remove the item.");
    }
  };

  return (
    <div className="w-full space-y-8 font-sans text-[#2d3748] max-w-5xl mx-auto pb-16 px-1">
      
      {/* TOP ACTION HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              handleClearEditMode();
              navigate("/dashboard");
            }}
            className="p-1 hover:bg-neutral-100 rounded transition-colors text-neutral-700 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-[#0f172a]">
            {editingProductId ? "⚡ Editing Product Details" : "Create & Manage Inventory"}
          </h1>
        </div>

        {editingProductId && (
          <button
            type="button"
            onClick={handleClearEditMode}
            className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded font-bold transition-all cursor-pointer"
          >
            Cancel Edit Mode
          </button>
        )}
      </div>

      {/* CORE DATA ENTRY FORM SECTION */}
      <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 sm:p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#0f172a] mb-4 flex items-center gap-1.5">
          <span>{editingProductId ? "Modify Product Parameters" : "Product Registration Fields"}</span>
        </h2>

        <form onSubmit={handleAddNewProductSubmit} className="space-y-6">
          
          {/* IMAGE UPLOAD BOX */}
          <div className="flex justify-center w-full">
            <div 
              onClick={triggerImageUpload}
              className="w-full sm:w-48 h-36 border-2 border-dashed border-[#cbd5e1] rounded-lg bg-[#f8fafc] flex flex-col items-center justify-center p-4 cursor-pointer hover:border-neutral-400 transition-colors text-center relative overflow-hidden"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                className="hidden"
              />
              {newProdImage ? (
                <img src={newProdImage} alt="Product view" className="w-full h-full object-cover absolute inset-0" />
              ) : (
                <div className="space-y-2 text-[#64748b]">
                  <Camera className="w-5 h-5 mx-auto text-[#64748b]" />
                  <span className="text-[11px] block text-neutral-400 font-medium">Tap to add image</span>
                </div>
              )}
            </div>
          </div>

          {/* ATTRIBUTE INPUT FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#334155]">Product Name *</label>
              <input 
                type="text" 
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="Fresh Tomatoes"
                className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#334155]">Price (₹) *</label>
              <input 
                type="number" 
                value={newProdPrice}
                onChange={(e) => setNewProdPrice(e.target.value)}
                placeholder="0"
                className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#334155]">Discounted Price (₹)</label>
              <input 
                type="number" 
                value={newProdDiscountPrice}
                onChange={(e) => setNewProdDiscountPrice(e.target.value)}
                placeholder="Optional sale price"
                className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#334155]">Stock Level</label>
              <input 
                type="number" 
                value={newProdStock}
                onChange={(e) => setNewProdStock(e.target.value)}
                placeholder="0"
                className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          {/* DYNAMIC CUSTOM CATEGORY CONFIGURATION */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-[#334155] block">Category Assignment *</label>
            <input 
              type="text" 
              value={newProdCategory}
              onChange={(e) => setNewProdCategory(e.target.value)}
              placeholder="Selected Category (e.g. Fruits)"
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400 font-medium"
              required
            />
            <div className="flex gap-2">
              <input 
                type="text"
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                placeholder="Create custom category..."
                className="flex-1 border border-[#cbd5e1] rounded px-3 py-1.5 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomCategory}
                className="bg-neutral-800 text-white text-xs font-bold px-4 py-1.5 rounded hover:bg-black cursor-pointer"
              >
                Add Category
              </button>
            </div>

            {customCategories && customCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {customCategories.map((cat, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setNewProdCategory(cat)}
                    className={`flex items-center gap-2 border px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-all ${
                      newProdCategory === cat ? "bg-neutral-900 border-neutral-900 text-white" : "bg-[#f8fafc] border-[#e2e8f0] text-[#334155]"
                    }`}
                  >
                    <span>{cat}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveCustomCategory(cat); }} className="text-neutral-400 hover:text-red-500 pl-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DESCRIPTION TEXTAREA */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155]">Product Description</label>
            <textarea 
              value={newProdDescription}
              onChange={(e) => setNewProdDescription(e.target.value)}
              placeholder="Provide clean product info here..."
              rows={3}
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400 resize-y"
            />
          </div>

          {/* FORM CALL-TO-ACTION BUTTON */}
          <button
            type="submit"
            className={`w-full text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded shadow hover:opacity-95 transition-all active:scale-[0.99] text-center cursor-pointer block ${
              editingProductId ? "bg-amber-600" : "bg-[#10b981]"
            }`}
          >
            {editingProductId ? "Apply Updates to Product" : "Save New Product Entry"}
          </button>
        </form>
      </div>

      {/* NEW SECTION: VISUAL PRODUCT MANAGEMENT CATALOG & DELETION GRID */}
      <div className="bg-white border border-[#e2e8f0] rounded-lg shadow-sm overflow-hidden">
        <div className="bg-[#f8fafc] border-b border-[#e2e8f0] p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">Active Product Catalog</h3>
            <p className="text-xs text-[#64748b]">Review live storefront items, make edits, or remove products instantly.</p>
          </div>
          <span className="text-xs font-bold bg-neutral-100 text-[#334155] px-2.5 py-1 rounded-full border border-neutral-200">
            {productsList?.length || 0} Items Total
          </span>
        </div>

        {/* CONDITION A: NO PRODUCTS YET AVAILABLE */}
        {(!productsList || productsList.length === 0) ? (
          <div className="p-8 text-center text-sm text-[#64748b] font-medium space-y-1">
            <p>Your product catalog is empty.</p>
            <p className="text-xs text-neutral-400">Fill in the fields above to add items to your online dashboard storefront catalog.</p>
          </div>
        ) : (
          /* CONDITION B: RENDER PRODUCT TABLE (Responsive block format layouts on mobile viewports) */
          <div className="w-full overflow-x-auto">
            {/* Table layout visible on tablets and desktop screens */}
            <table className="w-full text-left border-collapse hidden sm:table">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  <th className="p-4 w-16">Item</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-sm text-[#334155]">
                {productsList.map((product) => (
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
                    <td className="p-4 font-bold text-[#0f172a]">{product.name}</td>
                    <td className="p-4 text-xs font-medium text-[#64748b]"><span className="bg-[#f1f5f9] px-2 py-0.5 rounded border border-[#e2e8f0]">{product.category || "General"}</span></td>
                    <td className="p-4 font-semibold text-[#10b981]">₹{product.price}</td>
                    <td className="p-4 font-medium text-neutral-500">{product.stock || 0}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProductToEdit(product._id);
                            // Simulates loading target fields securely
                            const mockEvent = { target: { value: product._id } };
                            setSelectedProductToEdit(product._id);
                            handleLoadProductForEdit();
                          }}
                          className="p-1.5 border border-[#cbd5e1] rounded text-neutral-600 hover:text-black bg-white hover:bg-neutral-50 shadow-sm cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInlineDeleteProduct(product._id, product.name)}
                          className="p-1.5 border border-red-200 rounded text-red-500 hover:text-white bg-white hover:bg-red-500 transition-colors shadow-sm cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Stack Layout View (Fires on phone viewports for high UX adaptability) */}
            <div className="sm:hidden divide-y divide-[#e2e8f0] px-2">
              {productsList.map((product) => (
                <div key={product._id} className="py-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 border border-[#e2e8f0] rounded bg-neutral-100 overflow-hidden flex-shrink-0 shadow-sm">
                      <img 
                        src={product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100"} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#0f172a] truncate">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[#10b981] font-bold text-xs">₹{product.price}</span>
                        <span className="text-[10px] text-neutral-400 font-medium">Stock: {product.stock || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action row switches configuration directly inside small block widths */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProductToEdit(product._id);
                        handleLoadProductForEdit();
                      }}
                      className="p-2 border border-[#cbd5e1] rounded bg-white text-neutral-700 active:bg-neutral-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInlineDeleteProduct(product._id, product.name)}
                      className="p-2 border border-red-200 bg-red-50 rounded text-red-600 active:bg-red-600 active:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}