import React, { useRef } from "react";
import { LayoutGrid, Image as ImageIcon, FileSpreadsheet, Upload, ImagePlus } from "lucide-react";

export default function CatalogTab({
  catalogSubTab = "manage",
  setCatalogSubTab,
  isGoogleConnected = false,
  handleConnectGoogle,
  uploadedImages = [
    { id: 1, name: "mandi.jpg", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300" }
  ],
  handleImageUpload
}) {
  const fileInputRef = useRef(null);
  const currentTab = catalogSubTab || "manage";

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full font-sans text-[#2d3748] max-w-6xl mx-auto pb-16 px-1 animate-fade-in space-y-6">
      
      {/* HEADER TITLE */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#0f172a]">Catalog</h1>
      </div>

      {/* TOP NAVIGATION TABS */}
      <div className="flex items-center gap-6 border-b border-[#e2e8f0]">
        <button
          type="button"
          onClick={() => setCatalogSubTab?.("manage")}
          className={`pb-2.5 text-sm font-semibold flex items-center gap-2 relative transition-all cursor-pointer ${
            currentTab === "manage" ? "text-[#0f172a]" : "text-[#64748b] hover:text-[#0f172a]"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Manage</span>
          {currentTab === "manage" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f172a]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setCatalogSubTab?.("images")}
          className={`pb-2.5 text-sm font-semibold flex items-center gap-2 relative transition-all cursor-pointer ${
            currentTab === "images" ? "text-[#0f172a]" : "text-[#64748b] hover:text-[#0f172a]"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Images</span>
          {currentTab === "images" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f172a]" />
          )}
        </button>
      </div>

      {/* SUB-TAB CONTENTS AREA */}
      <div className="w-full">
        
        {/* VIEW A: MANAGE / PRODUCT SHEET CONTAINER */}
        {currentTab === "manage" && (
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-5 sm:p-6 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-[#e8f5e9] text-[#10b981] rounded-full flex-shrink-0 mt-0.5">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0f172a]">Product Sheet</h3>
                <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed font-medium">
                  Manage your products directly in Google Sheets. Auto-syncs every 5 minutes — tap Sync now for instant updates. Edit the Categories tab to control the Subcategory dropdown, and the Units tab to control the Unit dropdown. If long Image URLs look messy, click Reset from Master Catalog in Settings → General to apply the narrow clipped Image column.
                </p>
              </div>
            </div>

            {/* Google Authentication Box Row */}
            <div className="border border-[#e2e8f0] rounded-lg p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-sm font-medium text-[#475569]">
                Connect your Google account to create and sync a product sheet.
              </span>
              <button
                type="button"
                onClick={handleConnectGoogle}
                className="border border-[#cbd5e1] hover:bg-neutral-50 px-4 py-2 text-sm font-semibold rounded text-[#0f172a] shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto bg-white"
              >
                Connect Google
              </button>
            </div>
          </div>
        )}

        {/* VIEW B: IMAGES UPLOAD AND MANAGEMENT GRID */}
        {currentTab === "images" && (
          <div className="space-y-6">
            {/* Upload Area Accent Box */}
            <div className="bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-lg p-8 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
              <ImagePlus className="w-8 h-8 text-neutral-400 stroke-[1.5]" />
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-[#0f172a]">Upload product images</h3>
                <p className="text-xs text-[#64748b] font-medium">
                  Images are auto-compressed. Use the filename in your Sheet's "Image" column.
                </p>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="hidden"
              />
              
              <button
                type="button"
                onClick={triggerFileSelect}
                className="bg-[#10b981] text-white text-xs font-bold px-4 py-2.5 rounded shadow-sm hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Choose Files</span>
              </button>
            </div>

            {/* Uploaded Images Gallery Deck Grid Layout */}
            {uploadedImages && uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="bg-white border border-[#e2e8f0] rounded shadow-sm overflow-hidden flex flex-col group hover:border-neutral-300 transition-all">
                    {/* Square Image frame */}
                    <div className="w-full aspect-square bg-neutral-100 border-b border-[#f1f5f9] relative overflow-hidden">
                      <img 
                        src={img.url} 
                        alt={img.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* Label row section footprint */}
                    <div className="p-2.5 bg-[#f8fafc] mt-auto">
                      <p className="text-xs font-medium text-[#475569] truncate select-all" title={img.name}>
                        {img.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}