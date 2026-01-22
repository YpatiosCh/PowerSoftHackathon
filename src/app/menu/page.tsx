'use client';

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PowerSoftMenu } from "@/menu/menu";
import { CartProvider, useCart } from "@/lib/CartContext";
import { CategoryNav } from "@/components/CategoryNav";
import { CategorySection } from "@/components/CategorySection";
import { CartBar } from "@/components/CartBar";
import { CartModal } from "@/components/CartModal";
import { ChatWidget } from "@/components/ChatWidget";
import type { ItemWithStatus, MenuCategory } from "@/types";

function MenuPageContent() {
  const [activeCategory, setActiveCategory] = useState(PowerSoftMenu.categories[0]?.id);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [enrichedCategories, setEnrichedCategories] = useState<MenuCategory[]>(PowerSoftMenu.categories);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { items: cartItems } = useCart();
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<'pending' | 'accepted' | 'declined' | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        const data = await response.json();
        const items: ItemWithStatus[] = data.items;
        
        const discountMap = new Map();
        items.forEach(item => {
          discountMap.set(item.id, {
            currentDiscount: item.currentDiscount,
            finalPrice: item.finalPrice,
            isFlashActive: item.isFlashActive,
            currentBucket: item.currentBucket,
          });
        });
        
        const enriched = PowerSoftMenu.categories.map(category => ({
          ...category,
          items: category.items?.map(item => {
            const discount = discountMap.get(item.id);
            return discount ? { ...item, ...discount } : item;
          }),
          subcategories: category.subcategories?.map(sub => ({
            ...sub,
            items: sub.items.map(item => {
              const discount = discountMap.get(item.id);
              return discount ? { ...item, ...discount } : item;
            }),
          })),
        }));
        
        setEnrichedCategories(enriched as MenuCategory[]);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
    const interval = setInterval(fetchItems, 5000); // Refresh every 5 seconds to see discount changes
    return () => clearInterval(interval);
  }, []);

  // Poll for order status updates
  useEffect(() => {
    if (!pendingOrderId) return;

    const checkOrderStatus = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        const order = data.orders.find((o: any) => o.id === pendingOrderId);
        
        if (order && order.status !== 'pending') {
          setOrderStatus(order.status);
          setPendingOrderId(null); // Stop polling
          
          if (order.status === 'accepted') {
            alert('🎉 Great News!\n\nYour order has been accepted and is being prepared!\n\nThank you for your order. It will be ready soon!');
          } else if (order.status === 'declined') {
            alert('😔 Order Update\n\nWe\'re sorry, but your order could not be accepted at this time.\n\nSome items may be unavailable. Please contact staff for assistance.');
          }
        }
      } catch (error) {
        console.error('Error checking order status:', error);
      }
    };

    checkOrderStatus();
    const interval = setInterval(checkOrderStatus, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, [pendingOrderId]);

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

    enrichedCategories.forEach((cat) => {
      const element = document.getElementById(cat.id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enrichedCategories]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleSendOrder = async () => {
    try {
      const orderItems = cartItems.map(item => {
        const regularPrice = item.price || item.pricing?.bottle || item.pricing?.glass || 0;
        const finalPrice = item.finalPrice || regularPrice;
        return {
          itemId: item.id,
          name: item.name,
          quantity: item.quantity,
          regularPrice,
          discountPercent: item.currentDiscount || 0,
          finalPrice
        };
      });

      const totalRegular = orderItems.reduce((sum, item) => sum + (item.regularPrice * item.quantity), 0);
      const totalFinal = orderItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
      const totalSavings = totalRegular - totalFinal;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: orderItems,
          totalRegular,
          totalFinal,
          totalSavings
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPendingOrderId(data.order.id); // Start tracking this order
        alert("✅ Order sent! Staff will review your order shortly.\n\nYou'll be notified when your order is accepted.");
      } else {
        alert("❌ Failed to send order. Please try again.");
      }
    } catch (error) {
      console.error('Error sending order:', error);
      alert("❌ Failed to send order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center justify-center py-4">
            <img
              src={PowerSoftMenu.restaurant.logo}
              alt={PowerSoftMenu.restaurant.name}
              className="h-10 object-contain items-center"
            />
          </div>

          </motion.div>

          <CategoryNav
            categories={enrichedCategories}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-16 pb-32">
        {enrichedCategories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </main>

      <CartBar onOpenCart={() => setIsCartOpen(true)} />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onSendOrder={handleSendOrder}
      />

      <ChatWidget />
    </div>
  );
}

export default function MenuPage() {
  return (
    <CartProvider>
      <MenuPageContent />
    </CartProvider>
  );
}