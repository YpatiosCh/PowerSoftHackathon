# Extended Animation Patterns

Advanced Framer Motion patterns for award-worthy interactions.

## Page Transitions (App Router)

Use `template.tsx` for page-level animations:

```tsx
// app/template.tsx
"use client"
import { motion } from "framer-motion"

const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

## Parallax Scrolling

Simple parallax using `useScroll` and `useTransform`:

```tsx
"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const ParallaxSection = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        {/* Content moves slower than scroll */}
      </motion.div>
    </section>
  )
}
```

## Horizontal Scroll Gallery

Scroll-driven horizontal movement:

```tsx
"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const HorizontalGallery = ({ items }: { items: any[] }) => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(items.length - 1) * 100}%`])

  return (
    <section ref={containerRef} className="h-[300vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div style={{ x }} className="flex">
          {items.map((item, i) => (
            <div key={i} className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-20">
              {/* Card content */}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

## Stacked Card Reveal

Cards stack and reveal on scroll:

```tsx
"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const StackedCards = ({ cards }: { cards: any[] }) => {
  return (
    <section className="relative">
      {cards.map((card, i) => (
        <StackedCard key={i} index={i} total={cards.length} card={card} />
      ))}
    </section>
  )
}

const StackedCard = ({ index, total, card }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"]
  })
  
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])

  return (
    <motion.div
      ref={ref}
      style={{ scale, y }}
      className="sticky top-20 h-[80vh] rounded-3xl bg-zinc-900 p-8"
    >
      {card.content}
    </motion.div>
  )
}
```

## Cursor Follower

Custom cursor that follows with delay:

```tsx
"use client"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect } from "react"

const CursorFollower = () => {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 200 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }
    window.addEventListener("mousemove", moveCursor)
    return () => window.removeEventListener("mousemove", moveCursor)
  }, [cursorX, cursorY])

  return (
    <motion.div
      style={{ x, y }}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-white pointer-events-none z-50 mix-blend-difference"
    />
  )
}
```

## Line Draw Animation

SVG path reveal:

```tsx
"use client"
import { motion } from "framer-motion"

const LineDrawIcon = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24">
    <motion.path
      d="M10 50 L40 80 L90 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  </svg>
)
```

## Counter Animation

Animated number counting:

```tsx
"use client"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

const AnimatedCounter = ({ value }: { value: number }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, value, { duration: 2 })
    return controls.stop
  }, [count, value])

  return <motion.span>{rounded}</motion.span>
}
```

## Staggered Grid Entrance

Grid items enter with stagger:

```tsx
const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    }
  }
}

const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0, 1] }
  }
}

<motion.div
  variants={gridContainerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  className="grid grid-cols-3 gap-4"
>
  {items.map((item, i) => (
    <motion.div key={i} variants={gridItemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

## Blur Entrance

Content fades in with blur reduction:

```tsx
const blurVariants = {
  hidden: { 
    opacity: 0, 
    filter: "blur(20px)",
    y: 30 
  },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)",
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.1, 0, 1] 
    }
  }
}
```

## Marquee / Infinite Scroll

Continuous horizontal scroll:

```tsx
"use client"
import { motion } from "framer-motion"

const Marquee = ({ items }: { items: string[] }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: [0, "-50%"] }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="inline-flex gap-8"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-4xl font-bold text-zinc-700">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
```

## Spring Physics Presets

Commonly used spring configs:

```tsx
const springs = {
  // Snappy, quick response
  snappy: { type: "spring", stiffness: 400, damping: 30 },
  
  // Bouncy, playful
  bouncy: { type: "spring", stiffness: 300, damping: 10 },
  
  // Smooth, elegant
  smooth: { type: "spring", stiffness: 100, damping: 20 },
  
  // Heavy, deliberate
  heavy: { type: "spring", stiffness: 50, damping: 15 },
}
```

## Easing Presets

Custom cubic-bezier easings:

```tsx
const easings = {
  // Sharp deceleration (good for entrances)
  easeOutExpo: [0.16, 1, 0.3, 1],
  
  // Smooth both ends
  easeInOutCubic: [0.65, 0, 0.35, 1],
  
  // Quick start, slow end
  easeOutQuart: [0.25, 1, 0.5, 1],
  
  // Apple-style
  appleEase: [0.25, 0.1, 0, 1],
}
```
