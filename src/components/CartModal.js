"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { formatPrice, IMAGE_BASE_URL } from "@/lib/utils";

function CartItem({ item }) {
  const { addItem, removeItem, clearItem } = useCart();
  const price = item.price || item.pricing?.bottle || item.pricing?.glass || 0;
  const imageUrl = item.image ? `${IMAGE_BASE_URL}${item.image}` : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 py-4 border-b border-white/10"
    >
      {imageUrl && (
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-white text-sm leading-tight">{item.name}</h4>
          <button
            onClick={() => clearItem(item.id)}
            className="shrink-0 p-1 text-zinc-500 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <p className="text-sm text-zinc-400 mt-1">{formatPrice(price)}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => removeItem(item.id)}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span className="w-6 text-center text-white font-medium text-sm">{item.quantity}</span>
            <button
              onClick={() => addItem(item)}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <span className="text-white font-medium text-sm">{formatPrice(price * item.quantity)}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function CartModal({ isOpen, onClose, onSendOrder }) {
  const { items, totalPrice, totalItems, clearCart } = useCart();

  const handleSendOrder = () => {
    onSendOrder();
    clearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] flex flex-col bg-[#111113] rounded-t-3xl"
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Your Order</h2>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>

              {items.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-zinc-500">Your cart is empty</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {totalItems > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Total</span>
                  <span className="text-xl font-bold text-white">{formatPrice(totalPrice)}</span>
                </div>
                <button
                  onClick={handleSendOrder}
                  className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-100 transition-colors"
                >
                  Send Order
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
