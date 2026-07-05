import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomSheet({ isOpen, onClose, title, children, height = "auto" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const heightClasses = {
    auto: "h-auto max-h-[90vh]",
    full: "h-[90vh]",
    half: "h-[50vh]"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl shadow-2xl flex flex-col",
              "max-w-md mx-auto", // Ensure it looks good on tablet/desktop too
              heightClasses[height]
            )}
          >
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-100">
              <div className="w-10" /> {/* Spacer for centering */}
              <h3 className="font-bold text-gray-900 text-lg flex-1 text-center truncate">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
