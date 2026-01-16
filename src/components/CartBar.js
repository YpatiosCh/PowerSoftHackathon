"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/utils";

export function CartBar({ onOpenCart }) {
  const { totalItems, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe"
        >
          <div className="max-w-2xl mx-auto">
            <button
              onClick={onOpenCart}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-white text-black rounded-2xl font-medium shadow-lg shadow-black/20 hover:bg-zinc-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 bg-black text-white text-sm font-bold rounded-full">
                  {totalItems}
                </span>
                <span className="text-base">View Order</span>
              </div>
              <span className="text-lg font-semibold">{formatPrice(totalPrice)}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
