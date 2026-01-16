"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PowerSoftMenu } from "@/menu/menu";
import { CartProvider } from "@/lib/CartContext";
import { CategoryNav } from "@/components/CategoryNav";
import { CategorySection } from "@/components/CategorySection";
import { CartBar } from "@/components/CartBar";
import { CartModal } from "@/components/CartModal";
import { ChatWidget } from "@/components/ChatWidget";

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(PowerSoftMenu.categories[0]?.id);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
        }
      });
    }, options);

    PowerSoftMenu.categories.forEach((cat) => {
      const element = document.getElementById(cat.id);
      if (element) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleSendOrder = () => {
    // TODO: Implement order submission
    alert("Order sent! (This will be connected to a backend later)");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-center py-4">
            <img
              src={PowerSoftMenu.restaurant.logo}
              alt={PowerSoftMenu.restaurant.name}
              className="h-10 object-contain"
            />
          </div>
          <CategoryNav
            categories={PowerSoftMenu.categories}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {PowerSoftMenu.categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-sm text-zinc-500">
            {PowerSoftMenu.restaurant.name}
          </p>
        </div>
      </footer>

      {/* Cart Bar */}
      <CartBar onOpenCart={() => setIsCartOpen(true)} />

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onSendOrder={handleSendOrder}
      />

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <MenuPage />
    </CartProvider>
  );
}
