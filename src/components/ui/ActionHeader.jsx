import React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function ActionHeader({ title, onBack, rightAction, className }) {
  return (
    <div className={cn("sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm", className)}>
      <div className="flex items-center justify-between h-14 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center w-1/4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>
        
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
        </div>

        <div className="flex items-center justify-end w-1/4">
          {rightAction}
        </div>
      </div>
    </div>
  );
}
