import { useState } from "react";
import { Clock, Heart, ShoppingCart, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const [activeImage, setActiveImage] = useState(product.images?.[0] || "");
  const [liked, setLiked] = useState(false);

  return (
    <div className="group flex flex-col overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
      <div className="relative">
        <img
          src={activeImage || "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=80"}
          alt={product.name}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
        <button
          type="button"
          onClick={() => setLiked((prev) => !prev)}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-neutral-500 shadow-sm backdrop-blur transition-all hover:scale-105 hover:text-red-500"
        >
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-neutral-700 backdrop-blur">
          <Clock className="h-3 w-3" />
          18 mins
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-[#fff5f7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D03D56]">
            Popular
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span className="text-[11px] font-semibold text-neutral-700">4.8</span>
          </div>
        </div>

        <h3 className="text-sm font-black leading-snug tracking-[-0.01em] text-neutral-900 transition-colors group-hover:text-[#D03D56]">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Price</p>
            <p className="font-numbers text-base font-black text-neutral-900">₹{product.price}</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#D03D56] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition-all hover:bg-[#a02240] active:scale-95"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}