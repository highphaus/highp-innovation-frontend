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
    info: <Info className="mb-4 h-12 w-12 text-blue-500" />,
    success: <CheckCircle2 className="mb-4 h-12 w-12 text-green-600" />,
    error: <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className={cn(
              "relative flex w-full max-w-sm flex-col items-center rounded-[28px] border border-[var(--border)] bg-white p-6 text-center shadow-2xl",
              "bg-[linear-gradient(180deg,#fff_0%,#fffdfb_100%)]"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {icons[type]}
            <h2 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
            <p className="mb-6 leading-7 text-[var(--text-3)]">{message}</p>

            <button
              onClick={() => {
                if (onAction) onAction();
                onClose();
              }}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--text-primary)] px-4 font-semibold text-white transition-transform active:scale-[0.98]"
            >
              {actionText}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
