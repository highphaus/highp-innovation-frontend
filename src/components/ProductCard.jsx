import { useState } from "react";

export default function ProductCard({ product }) {
  // Gracefully set the first image from the array as the initial state
  const [activeImage, setActiveImage] = useState(product.images?.[0] || "");

  return (
    <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* IMAGE CONTAINER SECTION */}
      <div className="p-4 bg-neutral-50 flex flex-col gap-3">
        {/* Main Display Image */}
        <div className="w-full h-52 rounded-xl overflow-hidden relative bg-white border border-neutral-200/60 flex items-center justify-center">
          {activeImage ? (
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
            />
          ) : (
            <div className="text-neutral-400 text-xs">No image available</div>
          )}
        </div>

        {/* Multiple Thumbnail Previews */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {product.images?.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                activeImage === img 
                  ? "border-red-600 scale-95 ring-2 ring-red-600/10" 
                  : "border-neutral-200 hover:border-red-300"
              }`}
            >
              <img 
                src={img} 
                alt={`${product.name} thumbnail ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT & RED/WHITE BRAND ACTION SECTION */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
            {product.category}
          </span>
          <h3 className="text-lg font-bold text-neutral-900 mt-2.5 mb-1 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-neutral-500 text-sm line-clamp-2 mb-4">
            {product.description}
          </p>
        </div>

        {/* Pricing and Brand Button Layout */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400 font-medium">Price</span>
            <span className="text-xl font-extrabold text-neutral-900">
              ₹{product.price}
            </span>
          </div>
          <button 
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm tracking-wide shadow-sm shadow-red-600/10 active:scale-95 transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}