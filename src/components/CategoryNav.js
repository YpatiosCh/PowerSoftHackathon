"use client";

import { useRef, useEffect } from "react";

export function CategoryNav({ categories, activeCategory, onCategoryClick }) {
  const navRef = useRef(null);
  const buttonRefs = useRef({});

  useEffect(() => {
    if (activeCategory && buttonRefs.current[activeCategory] && navRef.current) {
      const button = buttonRefs.current[activeCategory];
      const nav = navRef.current;
      const buttonRect = button.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();

      if (buttonRect.left < navRect.left + 40 || buttonRect.right > navRect.right - 40) {
        button.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [activeCategory]);

  return (
    <nav
      ref={navRef}
      className="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-3 -mx-4"
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          ref={(el) => (buttonRefs.current[cat.id] = el)}
          onClick={() => onCategoryClick(cat.id)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeCategory === cat.id
              ? "bg-white text-black"
              : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
}
