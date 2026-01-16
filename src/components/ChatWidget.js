"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { PowerSoftMenu } from "@/menu/menu";

function ChatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

// Find menu item by ID
function findMenuItem(itemId) {
  for (const category of PowerSoftMenu.categories) {
    if (category.items) {
      const item = category.items.find((i) => i.id === itemId);
      if (item) return item;
    }
    if (category.subcategories) {
      for (const sub of category.subcategories) {
        const item = sub.items.find((i) => i.id === itemId);
        if (item) return item;
      }
    }
  }
  return null;
}

function ChatWindow({ onClose, messages, onSendMessage, isLoading }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute bottom-16 left-0 w-80 sm:w-96 h-112 flex flex-col bg-[#111113] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">AI Waiter</h3>
            <p className="text-xs text-zinc-500">Always here to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-white transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-zinc-500 text-sm">
              Hi! I'm your AI waiter. Ask me anything about the menu, get recommendations, or let me help you place an order.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-white text-black rounded-br-md"
                  : msg.role === "system"
                  ? "bg-emerald-500/10 text-emerald-400 rounded-bl-md text-xs italic"
                  : "bg-white/10 text-white rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 px-4 py-2 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 bg-white text-black rounded-xl font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:hover:bg-white"
          >
            Send
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { items: cartItems, addItem, removeItem, clearCart } = useCart();

  // Show tooltip after a short delay, then hide after some time
  useEffect(() => {
    if (tooltipDismissed || isOpen) return;

    const showTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);

    return () => clearTimeout(showTimer);
  }, [tooltipDismissed, isOpen]);

  // Auto-hide tooltip after 5 seconds
  useEffect(() => {
    if (!showTooltip) return;

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
      setTooltipDismissed(true);
    }, 5000);

    return () => clearTimeout(hideTimer);
  }, [showTooltip]);

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
    setTooltipDismissed(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Handle tool calls from the AI
  const handleToolCalls = (toolCalls) => {
    const results = [];

    for (const call of toolCalls) {
      const { function_name, arguments: args } = call;

      switch (function_name) {
        case "add_to_cart": {
          const menuItem = findMenuItem(args.item_id);
          if (menuItem) {
            const qty = args.quantity || 1;
            for (let i = 0; i < qty; i++) {
              addItem(menuItem);
            }
            results.push(`Added ${qty}x ${args.item_name} to cart`);
          } else {
            // Create a simple item if not found in menu
            const simpleItem = {
              id: args.item_id,
              name: args.item_name,
              price: args.price,
            };
            const qty = args.quantity || 1;
            for (let i = 0; i < qty; i++) {
              addItem(simpleItem);
            }
            results.push(`Added ${qty}x ${args.item_name} to cart`);
          }
          break;
        }
        case "remove_from_cart": {
          const qty = args.quantity || 999;
          for (let i = 0; i < qty; i++) {
            removeItem(args.item_id);
          }
          results.push(`Removed item from cart`);
          break;
        }
        case "clear_cart": {
          clearCart();
          results.push("Cart cleared");
          break;
        }
        case "get_cart": {
          if (cartItems.length === 0) {
            results.push("Cart is empty");
          } else {
            const cartSummary = cartItems
              .map((i) => `${i.quantity}x ${i.name}`)
              .join(", ");
            const total = cartItems.reduce((sum, item) => {
              const price = item.price || item.pricing?.bottle || item.pricing?.glass || 0;
              return sum + price * item.quantity;
            }, 0);
            results.push(`Cart: ${cartSummary} | Total: €${total.toFixed(2)}`);
          }
          break;
        }
        case "send_order": {
          results.push("Order sent to kitchen! 🎉");
          // In a real app, you'd send this to a backend
          break;
        }
      }
    }

    return results;
  };

  const handleSendMessage = async (content) => {
    // Add user message to display
    setMessages((prev) => [...prev, { role: "user", content }]);

    // Add to conversation history for API
    const newHistory = [...conversationHistory, { role: "user", content }];
    setConversationHistory(newHistory);

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory,
          cart: cartItems,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
        ]);
        return;
      }

      // Handle tool calls
      if (data.tool_calls && data.tool_calls.length > 0) {
        const toolResults = handleToolCalls(data.tool_calls);

        // Show system message for cart actions
        if (toolResults.length > 0) {
          setMessages((prev) => [
            ...prev,
            { role: "system", content: toolResults.join(" | ") },
          ]);
        }
      }

      // Add assistant message
      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
        setConversationHistory((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't connect. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissTooltip = () => {
    setShowTooltip(false);
    setTooltipDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute bottom-14 left-0 flex items-center gap-2"
          >
            <div className="px-4 py-2 bg-white text-black text-sm font-medium rounded-xl shadow-lg whitespace-nowrap">
              Need some help?
            </div>
            <button
              onClick={dismissTooltip}
              className="p-1 bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            onClose={handleClose}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        onClick={isOpen ? handleClose : handleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full shadow-lg shadow-black/20 hover:bg-zinc-100 transition-colors"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <CloseIcon />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ChatIcon />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
