"use client";

import { motion } from "framer-motion";
import { Tag } from "./Tag";
import { IMAGE_BASE_URL, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/CartContext";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  tags?: string[];
  pricing?: {
    glass?: number;
    bottle?: number;
  };
  currentDiscount?: number;
  finalPrice?: number;
  isFlashActive?: boolean;
  currentBucket?: string;
}

interface QuantityControlProps {
  item: MenuItem;
}

function QuantityControl({ item }: QuantityControlProps) {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  if (quantity === 0) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          addItem(item);
        }}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeItem(item.id);
        }}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <span className="w-6 text-center text-white font-medium">{quantity}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          addItem(item);
        }}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
}

interface MenuItemProps {
  item: MenuItem;
  index: number;
}

export function MenuItem({ item, index }: MenuItemProps) {
  const hasImage = item.image;
  const imageUrl = hasImage ? `${IMAGE_BASE_URL}${item.image}` : null;
  const displayPrice = item.price || item.pricing?.bottle || item.pricing?.glass;
  
  // Discount badge display
  const hasDiscount = item.currentDiscount && item.currentDiscount > 0;
  const originalPrice = item.price || item.pricing?.bottle || item.pricing?.glass;
  const discountedPrice = item.finalPrice || originalPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="glass-panel rounded-xl overflow-hidden relative"
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {item.currentDiscount}% OFF
          </div>
        </div>
      )}

      {imageUrl && (
        <div className="aspect-4/3 overflow-hidden">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-base text-white leading-tight">{item.name}</h3>
          <div className="text-right shrink-0">
            {hasDiscount ? (
              <div className="flex flex-col items-end">
                <span className="text-sm text-zinc-500 line-through">
                  {formatPrice(originalPrice!)}
                </span>
                <span className="text-white font-bold text-lg">
                  {formatPrice(discountedPrice!)}
                </span>
              </div>
            ) : (
              <>
                {item.price && (
                  <span className="text-white font-medium">{formatPrice(item.price)}</span>
                )}
                {item.pricing && (
                  <div className="flex flex-col items-end gap-0.5">
                    {item.pricing.glass && (
                      <span className="text-sm text-zinc-400">
                        Glass {formatPrice(item.pricing.glass)}
                      </span>
                    )}
                    {item.pricing.bottle && (
                      <span className="text-sm text-white">
                        Bottle {formatPrice(item.pricing.bottle)}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {item.description && (
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            {item.description}
          </p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}

        {/* Stock status indicators */}
        {item.currentBucket === 'sold-out' && (
          <div className="mt-3 px-3 py-2 bg-red-900/30 border border-red-500/50 rounded-lg text-xs text-red-400 font-bold">
            ❌ SOLD OUT
          </div>
        )}
        {item.currentBucket === 'low' && (
          <div className="mt-3 text-xs text-orange-400 font-medium">
            ⚠️ Limited availability
          </div>
        )}

        {/* Quantity controls */}
        {displayPrice && item.currentBucket !== 'sold-out' && (
          <div className="mt-4 flex justify-end">
            <QuantityControl item={item} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
