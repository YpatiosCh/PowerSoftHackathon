# Extended Component Patterns

Additional UI patterns beyond navigation, hero, and footer.

## Buttons

### Primary Button

```tsx
"use client"
import { motion } from "framer-motion"

const Button = ({ children, variant = "primary", size = "md" }) => {
  const baseStyles = "relative font-medium transition-colors"
  
  const variants = {
    primary: "bg-white text-zinc-900 hover:bg-zinc-200",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
    outline: "bg-transparent text-white border border-white/20 hover:bg-white/5",
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-xl",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </motion.button>
  )
}
```

### Animated Border Button

```tsx
const BorderButton = ({ children }) => (
  <motion.button
    className="relative px-8 py-4 text-white overflow-hidden group"
    whileHover="hover"
  >
    {/* Animated border */}
    <motion.span
      className="absolute inset-0 border border-white/30"
      variants={{
        hover: { 
          borderColor: "rgba(255,255,255,0.8)",
          transition: { duration: 0.3 }
        }
      }}
    />
    {/* Fill on hover */}
    <motion.span
      className="absolute inset-0 bg-white origin-left"
      initial={{ scaleX: 0 }}
      variants={{
        hover: { scaleX: 1, transition: { duration: 0.4 } }
      }}
    />
    <span className="relative z-10 group-hover:text-zinc-900 transition-colors">
      {children}
    </span>
  </motion.button>
)
```

## Cards

### Glass Card

```tsx
const GlassCard = ({ children }) => (
  <motion.div
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    className="
      bg-white/[0.02] 
      backdrop-blur-xl 
      border border-white/[0.08] 
      rounded-2xl 
      p-6
      hover:border-white/[0.15]
      transition-colors
    "
  >
    {children}
  </motion.div>
)
```

### Feature Card with Icon

```tsx
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -4 }}
    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 group"
  >
    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-zinc-700 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">{description}</p>
  </motion.div>
)
```

### Bento Card

```tsx
const BentoCard = ({ 
  size = "default",
  children 
}: { 
  size?: "default" | "wide" | "tall" | "large"
  children: React.ReactNode 
}) => {
  const sizeClasses = {
    default: "col-span-1 row-span-1",
    wide: "col-span-2 row-span-1",
    tall: "col-span-1 row-span-2",
    large: "col-span-2 row-span-2",
  }
  
  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        ${sizeClasses[size]}
        bg-zinc-900 
        border border-zinc-800 
        rounded-3xl 
        p-8 
        overflow-hidden
      `}
    >
      {children}
    </motion.div>
  )
}
```

## Form Elements

### Input Field

```tsx
const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="text-sm text-zinc-400">{label}</label>
    )}
    <input
      {...props}
      className="
        w-full 
        bg-zinc-900 
        border border-zinc-800 
        rounded-xl 
        px-4 py-3 
        text-white 
        placeholder:text-zinc-600
        focus:outline-none 
        focus:border-zinc-600 
        focus:ring-1 
        focus:ring-zinc-600
        transition-colors
      "
    />
  </div>
)
```

### Toggle Switch

```tsx
"use client"
import { motion } from "framer-motion"

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`
      w-12 h-6 rounded-full p-1 transition-colors
      ${checked ? 'bg-white' : 'bg-zinc-700'}
    `}
  >
    <motion.div
      animate={{ x: checked ? 24 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`
        w-4 h-4 rounded-full
        ${checked ? 'bg-zinc-900' : 'bg-zinc-400'}
      `}
    />
  </button>
)
```

## Sections

### Section Header

```tsx
const SectionHeader = ({ label, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="max-w-3xl mb-16"
  >
    {label && (
      <p className="text-sm uppercase tracking-widest text-zinc-500 mb-4">
        {label}
      </p>
    )}
    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
      {title}
    </h2>
    {description && (
      <p className="text-xl text-zinc-400 leading-relaxed">
        {description}
      </p>
    )}
  </motion.div>
)
```

### CTA Section

```tsx
const CTASection = ({ title, description, primaryCTA, secondaryCTA }) => (
  <section className="py-32 px-6">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="
        max-w-4xl mx-auto 
        bg-zinc-900 
        border border-zinc-800 
        rounded-3xl 
        p-12 md:p-20 
        text-center
      "
    >
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
        {title}
      </h2>
      <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg">{primaryCTA}</Button>
        {secondaryCTA && (
          <Button variant="ghost" size="lg">{secondaryCTA}</Button>
        )}
      </div>
    </motion.div>
  </section>
)
```

## Lists & Tables

### Feature List

```tsx
const FeatureList = ({ features }) => (
  <ul className="space-y-4">
    {features.map((feature, i) => (
      <motion.li
        key={i}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        className="flex items-start gap-4"
      >
        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Check className="w-3 h-3 text-white" />
        </div>
        <span className="text-zinc-300">{feature}</span>
      </motion.li>
    ))}
  </ul>
)
```

### Stats Row

```tsx
const StatsRow = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-zinc-800">
    {stats.map((stat, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        className="text-center"
      >
        <div className="text-4xl md:text-5xl font-bold text-white mb-2">
          {stat.value}
        </div>
        <div className="text-sm text-zinc-500 uppercase tracking-wider">
          {stat.label}
        </div>
      </motion.div>
    ))}
  </div>
)
```

## Loading States

### Skeleton

```tsx
const Skeleton = ({ className }) => (
  <motion.div
    animate={{ opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={`bg-zinc-800 rounded-lg ${className}`}
  />
)

// Usage
<Skeleton className="h-4 w-3/4" />
<Skeleton className="h-4 w-1/2" />
```

### Spinner

```tsx
const Spinner = ({ size = "md" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }
  
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizes[size]} border-2 border-zinc-700 border-t-white rounded-full`}
    />
  )
}
```

## Modals & Overlays

### Modal

```tsx
"use client"
import { motion, AnimatePresence } from "framer-motion"

const Modal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        />
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 z-50"
        >
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
)
```

## Badges & Tags

### Badge

```tsx
const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-zinc-800 text-zinc-300",
    success: "bg-emerald-900/50 text-emerald-400 border-emerald-800",
    warning: "bg-amber-900/50 text-amber-400 border-amber-800",
    error: "bg-red-900/50 text-red-400 border-red-800",
  }
  
  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-transparent
      ${variants[variant]}
    `}>
      {children}
    </span>
  )
}
```

## Dividers

### Gradient Line

```tsx
const GradientDivider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
)
```

### Section Break

```tsx
const SectionBreak = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="w-2 h-2 rounded-full bg-zinc-700" />
  </div>
)
```
