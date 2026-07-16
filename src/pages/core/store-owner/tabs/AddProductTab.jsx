import React, { useRef } from "react";
import { ArrowLeft, Camera, Plus, Trash2 } from "lucide-react";

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
  customCategoryInput,        // Added state prop
  setCustomCategoryInput,     // Added state setter prop
  customCategories,           // Added list array prop
  handleAddCustomCategory,    // Added functional handler
  handleRemoveCustomCategory, // Added functional handler
  editingProductId,
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

  return (
    <div className="w-full space-y-6 font-sans text-[#2d3748] max-w-5xl mx-auto pb-12">
      
      {/* TOP ACTION HEADER */}
      <div className="flex items-center gap-3 pb-2 px-1">
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
          {editingProductId ? "Edit Product" : "Add Product"}
        </h1>
      </div>

      <form onSubmit={handleAddNewProductSubmit} className="space-y-6">
        
        {/* 1. IMAGE UPLOAD BOX */}
        <div className="flex justify-center w-full">
          <div 
            onClick={triggerImageUpload}
            className="w-full sm:w-48 h-36 border-2 border-dashed border-[#cbd5e1] rounded-lg bg-white flex flex-col items-center justify-center p-4 cursor-pointer hover:border-neutral-400 transition-colors text-center relative overflow-hidden"
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />
            {newProdImage ? (
              <img src={newProdImage} alt="Product preview" className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <div className="space-y-2 text-[#64748b]">
                <Camera className="w-5 h-5 mx-auto text-[#64748b]" />
                <span className="text-[11px] block text-neutral-400 font-medium">Tap to add image</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. CORE SPECIFICATIONS PANEL */}
        <div className="bg-white border border-[#e2e8f0] rounded p-4 sm:p-6 shadow-sm space-y-4">
          
          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155]">Product Name *</label>
            <input 
              type="text" 
              value={newProdName}
              onChange={(e) => setNewProdName(e.target.value)}
              placeholder="e.g. Fresh Tomatoes"
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
              required
            />
          </div>

          {/* Price (INR) */}
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

          {/* Discounted Price */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155]">Discounted Price (₹)</label>
            <input 
              type="number" 
              value={newProdDiscountPrice}
              onChange={(e) => setNewProdDiscountPrice(e.target.value)}
              placeholder="Optional, must be less than Price"
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
            />
          </div>

          {/* Variants Segment */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-1">
              <label className="text-xs font-bold text-[#334155]">Variants (size + price)</label>
              <button 
                type="button" 
                onClick={handleQuickAddVariants}
                className="text-[11px] font-bold text-neutral-600 hover:text-black flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            
            {/* Quick Add Form */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <input 
                type="text"
                value={variantInputText}
                onChange={(e) => setVariantInputText(e.target.value)}
                placeholder="Quick add: e.g. 2, 5"
                className="flex-1 border border-[#cbd5e1] rounded px-3 py-1.5 text-xs focus:outline-none"
              />
              <div className="flex gap-2">
                <select 
                  value={variantInputUnit}
                  onChange={(e) => setVariantInputUnit(e.target.value)}
                  className="border border-[#cbd5e1] rounded px-2 py-1.5 text-xs bg-white text-neutral-700 font-medium"
                >
                  <option value="KG">KG</option>
                  <option value="GM">GM</option>
                  <option value="Ltr">Ltr</option>
                  <option value="ML">ML</option>
                  <option value="Pcs">Pcs</option>
                </select>
                <button
                  type="button"
                  onClick={handleQuickAddVariants}
                  className="bg-[#10b981] text-white text-xs font-bold px-4 py-1.5 rounded hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                >
                  Add all
                </button>
              </div>
            </div>

            {/* Custom Manual Variant Input */}
            <div className="flex gap-2 pt-1">
              <input 
                type="text"
                value={customVariantInput}
                onChange={(e) => setCustomVariantInput(e.target.value)}
                placeholder="Custom variant label (e.g. Small Pack)"
                className="flex-1 border border-[#cbd5e1] rounded px-3 py-1.5 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomVariant}
                className="bg-neutral-800 text-white text-xs font-bold px-4 py-1.5 rounded hover:bg-black cursor-pointer"
              >
                Add Custom
              </button>
            </div>

            <p className="text-[10px] text-neutral-400">Tip: type 2, 5 and pick KG to add multiple sizes at once.</p>

            {/* Render Active Variant Tags List */}
            {newProdVariants && newProdVariants.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {newProdVariants.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-1 rounded text-xs text-[#334155] font-medium">
                    <span>{v.variantLabel}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveCustomVariant(v)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Input Field + Custom Add Action Block */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-[#334155] block">Category *</label>
            
            {/* Main Primary Selection Text Field */}
            <input 
              type="text" 
              value={newProdCategory}
              onChange={(e) => setNewProdCategory(e.target.value)}
              placeholder="Selected Category (e.g. Fruits, Vegetables)"
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400 font-medium"
              required
            />

            {/* Add Custom Category Dynamic Form Action */}
            <div className="flex gap-2 pt-1">
              <input 
                type="text"
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                placeholder="Type new custom category title..."
                className="flex-1 border border-[#cbd5e1] rounded px-3 py-1.5 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomCategory}
                className="bg-neutral-800 text-white text-xs font-bold px-4 py-1.5 rounded hover:bg-black cursor-pointer whitespace-nowrap"
              >
                Add Category
              </button>
            </div>

            {/* Custom Created Category Tags Array Display */}
            {customCategories && customCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {customCategories.map((cat, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setNewProdCategory(cat)}
                    className={`flex items-center gap-2 border px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-all ${
                      newProdCategory === cat 
                        ? "bg-neutral-900 border-neutral-900 text-white" 
                        : "bg-[#f8fafc] border-[#e2e8f0] text-[#334155] hover:bg-neutral-100"
                    }`}
                  >
                    <span>{cat}</span>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation(); // Stops parent activation click trigger
                        handleRemoveCustomCategory(cat);
                      }}
                      className="text-neutral-400 hover:text-red-500 transition-colors pl-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-[#334155]">Description</label>
            <textarea 
              value={newProdDescription}
              onChange={(e) => setNewProdDescription(e.target.value)}
              placeholder="Optional description..."
              rows={3}
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400 resize-y"
            />
          </div>

        </div>

        {/* 3. EXTENDED ATTRIBUTES SECTION (Grid-arranged 2 Columns) */}
        <div className="bg-white border border-[#e2e8f0] rounded p-4 sm:p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Brand */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155]">Brand</label>
            <input 
              type="text" 
              value={newProdBrand}
              onChange={(e) => setNewProdBrand(e.target.value)}
              placeholder="e.g. Brand X"
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Tag */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155]">Tag</label>
            <input 
              type="text" 
              value={newProdTags}
              onChange={(e) => setNewProdTags(e.target.value)}
              placeholder="comma-separated"
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Stock */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155]">Stock</label>
            <input 
              type="number" 
              value={newProdStock}
              onChange={(e) => setNewProdStock(e.target.value)}
              placeholder="0"
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Availability Select Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155]">Availability</label>
            <select 
              value={newProdAvailability}
              onChange={(e) => setNewProdAvailability(e.target.value)}
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm bg-white focus:outline-none"
            >
              <option value="Show">Show</option>
              <option value="Hide">Hide</option>
            </select>
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155]">Weight</label>
            <input 
              type="text" 
              value={newProdWeight}
              onChange={(e) => setNewProdWeight(e.target.value)}
              placeholder="e.g. 500g"
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Package Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155]">Package Size</label>
            <input 
              type="text" 
              value={newProdPackageSize}
              onChange={(e) => setNewProdPackageSize(e.target.value)}
              placeholder="e.g. Pack of 6"
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Flavor */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155]">Flavor</label>
            <input 
              type="text" 
              value={newProdFlavor}
              onChange={(e) => setNewProdFlavor(e.target.value)}
              placeholder="e.g. Vanilla"
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Origin */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155]">Origin</label>
            <input 
              type="text" 
              value={newProdOrigin}
              onChange={(e) => setNewProdOrigin(e.target.value)}
              placeholder="e.g. India"
              className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* 4. DIETARY INFORMATION ACCENT BOX */}
        <div className="bg-white border border-[#e2e8f0] rounded p-4 sm:p-6 shadow-sm space-y-1.5">
          <label className="text-xs font-bold text-[#334155]">Dietary Info</label>
          <input 
            type="text" 
            value={newProdDietaryInfo}
            onChange={(e) => setNewProdDietaryInfo(e.target.value)}
            placeholder="e.g. Vegan, Gluten-free"
            className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none"
          />
        </div>

        {/* 5. FULL WIDTH SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-[#10b981] text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded shadow hover:opacity-95 transition-all active:scale-[0.99] text-center cursor-pointer block"
        >
          {editingProductId ? "Update Product" : "Add Product"}
        </button>

      </form>
    </div>
  );
}