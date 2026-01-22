"use client";

import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";

interface MenuItemType {
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

interface Subcategory {
  id: string;
  name: string;
  items: MenuItemType[];
}

interface Category {
  id: string;
  name: string;
  note?: string;
  items?: MenuItemType[];
  subcategories?: Subcategory[];
}

interface CategorySectionProps {
  category: Category;
}

export function CategorySection({ category }: CategorySectionProps) {
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  const hasItems = category.items && category.items.length > 0;

  return (
    <section id={category.id} className="scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {category.name}
        </h2>
        {category.note && (
          <p className="mt-2 text-sm text-zinc-500">{category.note}</p>
        )}
      </motion.div>

      {hasItems && category.items && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {category.items.map((item, index) => (
            <MenuItem key={item.id} item={item} index={index} />
          ))}
        </div>
      )}

      {hasSubcategories && category.subcategories && (
        <div className="space-y-8">
          {category.subcategories.map((sub) => (
            <div key={sub.id}>
              <h3 className="text-lg font-semibold text-zinc-300 mb-4">{sub.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sub.items.map((item, index) => (
                  <MenuItem key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
