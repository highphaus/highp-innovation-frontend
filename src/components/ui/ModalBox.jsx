import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function ModalBox({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  actionText = "Got it",
  onAction
}) {
  // Lock body scroll when modal is open
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

  const icons = {
    info: <Info className="w-12 h-12 text-blue-500 mb-4" />,
    success: <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />,
    error: <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center",
              "border border-gray-100"
            )}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {icons[type]}
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">{message}</p>
            
            <div className="w-full flex gap-3">
              <button
                onClick={() => {
                  if (onAction) onAction();
                  onClose();
                }}
                className="flex-1 bg-gray-900 text-white font-semibold h-12 rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center"
              >
                {actionText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
