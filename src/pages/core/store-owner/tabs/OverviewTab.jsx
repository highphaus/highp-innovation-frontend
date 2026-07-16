import React from "react";
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Copy, 
  ExternalLink
} from "lucide-react";

export default function OverviewTab({
  storeData,
  productsCount,
  ordersCount,
  salesTotal,
  storeUrl,
  copied,
  handleCopyLink
}) {
  // Fallback URL if storeUrl is missing initially
  const dynamicStoreUrl = storeUrl || `https://towncart.co.in/store/${storeData?.slug || "trying-to-do"}`;

  // Encodes the unique store URL dynamically into a standard open API generator link
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(dynamicStoreUrl)}`;

  const handleDownloadQRCode = async () => {
    try {
      const response = await fetch(qrCodeApiUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = `${storeData?.slug || "store"}-qrcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download QR code:", err);
      alert("Could not download the QR code image. Please try again.");
    }
  };

  return (
    <div className="w-full space-y-6 font-sans text-[#2d3748]">
      
      {/* 1. WELCOME HEADER */}
      <div className="space-y-1 px-1">
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
          Welcome back, {storeData?.ownerName || "syam"}
        </h1>
        <p className="text-sm text-[#64748b]">
          {storeData?.tagline || "trying to do"}
        </p>
      </div>

      {/* 2. STATS SECTION - Horizontal scrolling container on mobile, Grid on desktop */}
      <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin">
        <div className="flex flex-row md:grid md:grid-cols-3 gap-4 min-w-max md:min-w-full">
          
          {/* Products Card */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded shadow-sm flex flex-col justify-between min-h-[110px] w-[280px] sm:w-[320px] md:w-full">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#64748b] uppercase">
              <Package className="w-4 h-4 text-[#64748b]" />
              <span>Products</span>
            </div>
            <div className="text-3xl font-bold text-[#0f172a] mt-2">
              {productsCount || 0}
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded shadow-sm flex flex-col justify-between min-h-[110px] w-[280px] sm:w-[320px] md:w-full">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#64748b] uppercase">
              <ShoppingCart className="w-4 h-4 text-[#64748b]" />
              <span>Orders</span>
            </div>
            <div className="text-3xl font-bold text-[#0f172a] mt-2">
              {ordersCount || 0}
            </div>
          </div>

          {/* Sales Card */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded shadow-sm flex flex-col justify-between min-h-[110px] w-[280px] sm:w-[320px] md:w-full">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#64748b] uppercase">
              <DollarSign className="w-4 h-4 text-[#64748b]" />
              <span>Sales</span>
            </div>
            <div className="text-3xl font-bold text-[#10b981] mt-2 flex items-center">
              <span>₹</span>
              <span>{salesTotal || 0}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. MAIN UTILITIES CONTAINER */}
      <div className="bg-white border border-[#e2e8f0] rounded p-4 sm:p-6 shadow-sm space-y-6">
        
        {/* Store Link Section */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#0f172a] block">
            Store Link
          </label>
          <div className="flex items-center bg-[#f1f5f9] border border-[#e2e8f0] rounded px-4 py-3 justify-between gap-4">
            <span className="text-sm text-[#334155] break-all select-all font-medium">
              {dynamicStoreUrl}
            </span>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer p-1"
                title={copied ? "Copied!" : "Copy link"}
              >
                <Copy className={`w-4 h-4 ${copied ? "text-[#10b981]" : ""}`} />
              </button>
              <a
                href={dynamicStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#64748b] hover:text-[#0f172a] transition-colors p-1"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">Share your store</h3>
            <p className="text-xs text-[#64748b]">Share across social media for wider reach</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Facebook SVGs */}
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(dynamicStoreUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 bg-[#2563eb] text-white flex items-center justify-center rounded hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            
            {/* WhatsApp */}
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(dynamicStoreUrl)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 bg-[#22c55e] text-white flex items-center justify-center rounded hover:opacity-90 transition-opacity"
            >
              <span className="font-bold text-lg leading-none select-none">💬</span>
            </a>

            {/* Twitter / X */}
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(dynamicStoreUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 bg-[#0e172a] text-white flex items-center justify-center rounded hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(dynamicStoreUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 bg-[#1d4ed8] text-white flex items-center justify-center rounded hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <hr className="border-[#f1f5f9]" />

        {/* Dynamic Store Specific QR Code & Verified Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-4">
            <div className="p-1 border border-[#e2e8f0] rounded bg-white flex-shrink-0 shadow-sm w-[58px] h-[58px] flex items-center justify-center overflow-hidden">
              <img 
                src={qrCodeApiUrl} 
                alt="Store Custom QR Code" 
                className="w-full h-full object-contain animate-pulse bg-slate-50"
                onLoad={(e) => e.target.classList.remove('animate-pulse')}
                crossOrigin="anonymous"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0f172a]">QR Code</h4>
              <button
                type="button"
                onClick={handleDownloadQRCode}
                className="text-xs text-[#64748b] hover:underline cursor-pointer bg-transparent border-none p-0 block text-left font-medium"
              >
                Click to view & download
              </button>
            </div>
          </div>

          {/* Inline Verified Block */}
          <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] px-4 py-2.5 rounded text-xs font-medium text-[#334155] self-start sm:self-auto">
            <span className="text-[#10b981] font-bold text-sm">✓</span>
            <span>Verified successfully!</span>
          </div>
        </div>

      </div>

    </div>
  );
}