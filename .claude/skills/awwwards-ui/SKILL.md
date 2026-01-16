---
name: awwwards-ui
description: Design system for Next.js applications using Tailwind CSS and Framer Motion. Triggers on ANY UI request — components, pages, layouts, forms, dashboards, landing pages. Enforces consistent dark metallic glassmorphism aesthetic, bold typography, bento grid layouts, and glass panel styling across the entire app. Applies cinematic animations for landing/hero sections, subtle micro-interactions elsewhere. Produces human-indistinguishable designs that avoid AI-generic patterns (no gradients, no Inter headings, no centered-everything layouts). Use this skill for all frontend work to maintain design consistency.
---

# Awwwards-Level UI Design

Build Next.js interfaces that win design awards. Dark metallic glassmorphism, bold typography, bento grids, sophisticated Framer Motion animations.

## Tech Stack

- Next.js 14+ (App Router)
- Tailwind CSS
- Framer Motion
- shadcn/ui + Radix UI primitives
- JavaScript (no TypeScript)

All components require `"use client"` directive for Framer Motion.

## Core Aesthetic

**Dark Metallic Glassmorphism + Minimalist Bold Typography + Bento Grids**

Reference sites: Autodesk.com, maxmilkin.com, Westbourne Grammar School — characterized by parallax depth, 3D canvas elements, adaptive interfaces, performance-first philosophy with motion serving meaning.

### Color Philosophy

Dark metallic palette. NO gradients (AI tells on itself with gradients).

```tsx
// Metallic dark theme
const colors = {
  bg: {
    primary: '#0a0a0b',      // Near-black base
    secondary: '#111113',    // Elevated surfaces
    tertiary: '#18181b',     // Cards, panels
  },
  surface: {
    glass: 'rgba(255,255,255,0.03)',  // Glass panels
    glassBorder: 'rgba(255,255,255,0.08)',
    hover: 'rgba(255,255,255,0.05)',
  },
  text: {
    primary: '#fafafa',      // High contrast headings
    secondary: '#a1a1aa',    // Body text
    muted: '#52525b',        // Subtle labels
  },
  accent: '#e4e4e7',         // Silver/platinum accent
  // User defines brand accent per project
}
```

### Typography

Bold, distinctive display fonts. Never Inter, Roboto, Arial, or system fonts for headings.

**Recommended pairings:**
- Display: `Bulevar Heavy`, `Clash Display`, `Cabinet Grotesk`, `Satoshi`, `General Sans`, `Syne`
- Body: `DM Sans`, `Plus Jakarta Sans`, `Geist`

```tsx
// Tailwind config extension
fontFamily: {
  display: ['Clash Display', 'sans-serif'],
  body: ['DM Sans', 'sans-serif'],
}
```

Typography scale — go extreme:
- Hero headlines: `text-6xl md:text-8xl lg:text-[10rem]` with `font-bold tracking-tighter`
- Section titles: `text-4xl md:text-6xl`
- Body: `text-base md:text-lg` with generous `leading-relaxed`

### Glass Panels

```tsx
// Reusable glass panel styles
const glassPanel = `
  bg-white/[0.02]
  backdrop-blur-xl
  border border-white/[0.08]
  rounded-2xl
`
```

### Bento Grid Pattern

```tsx
<div className="grid grid-cols-4 md:grid-cols-6 gap-4">
  <div className="col-span-4 row-span-2">{/* Large feature */}</div>
  <div className="col-span-2">{/* Small card */}</div>
  <div className="col-span-2">{/* Small card */}</div>
</div>
```

## Animation System

### Landing Pages: Full Cinematic

For landing pages, go aggressive with animations. Scroll-triggered sequences, staggered reveals, parallax depth.

```tsx
// Page entrance orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.25, 0.1, 0, 1] }
  }
}

// Usage
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.h1 variants={itemVariants}>...</motion.h1>
  <motion.p variants={itemVariants}>...</motion.p>
</motion.div>
```

### Scroll-Triggered Reveals

```tsx
<motion.div
  initial={{ opacity: 0, y: 100 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
>
```

### Text Reveal Animation

Character-by-character or word-by-word reveals for headlines:

```tsx
const TextReveal = ({ text }: { text: string }) => {
  const words = text.split(' ')
  return (
    <motion.h1 className="text-7xl font-bold tracking-tighter">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          className="inline-block mr-4"
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  )
}
```

### Other Pages: Smart Micro-interactions

For dashboards, settings, non-landing pages — subtle but polished:

```tsx
// Hover lift effect
<motion.div
  whileHover={{ y: -4, transition: { duration: 0.2 } }}
  className={glassPanel}
>

// Button press
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>

// Loading skeleton pulse
<motion.div
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ repeat: Infinity, duration: 1.5 }}
  className="bg-white/5 rounded-lg"
/>
```

### Magnetic Cursor Effect (Hero sections)

```tsx
const MagneticButton = ({ children }) => {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouse = (e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  )
}
```

## Component Patterns

### Navigation

Sticky, minimal, glass effect. Logo left, links center or right.

```tsx
<motion.nav
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  className="fixed top-0 inset-x-0 z-50 px-6 py-4"
>
  <div className={`${glassPanel} px-6 py-3 flex items-center justify-between`}>
    <Logo />
    <div className="flex gap-8">
      {links.map(link => (
        <motion.a
          key={link.href}
          href={link.href}
          whileHover={{ opacity: 0.7 }}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          {link.label}
        </motion.a>
      ))}
    </div>
    <Button>Get Started</Button>
  </div>
</motion.nav>
```

### Hero Section

Full viewport, massive typography, clear CTA, entrance animation.

```tsx
<section className="min-h-screen flex flex-col justify-center px-6 md:px-12">
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="max-w-6xl"
  >
    <motion.p variants={itemVariants} className="text-zinc-500 text-sm uppercase tracking-widest mb-6">
      Tagline here
    </motion.p>
    <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
      Headline that<br />makes impact
    </motion.h1>
    <motion.p variants={itemVariants} className="mt-8 text-xl text-zinc-400 max-w-xl">
      Supporting copy that explains the value proposition clearly.
    </motion.p>
    <motion.div variants={itemVariants} className="mt-10 flex gap-4">
      <Button size="lg">Primary CTA</Button>
      <Button variant="ghost" size="lg">Secondary</Button>
    </motion.div>
  </motion.div>
</section>
```

### Footer

Minimal, structured, no clutter.

```tsx
<footer className="border-t border-white/10 py-16 px-6">
  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
    <div>
      <Logo />
      <p className="mt-4 text-sm text-zinc-500">Brief tagline.</p>
    </div>
    {footerSections.map(section => (
      <div key={section.title}>
        <h4 className="text-sm font-medium text-white mb-4">{section.title}</h4>
        <ul className="space-y-2">
          {section.links.map(link => (
            <li key={link.href}>
              <a href={link.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</footer>
```

## Anti-Patterns (AI Tells)

**NEVER do these:**

1. **Gradient backgrounds** — Especially purple/blue gradients. Instant AI tell.
2. **Inter font for headings** — Use distinctive display fonts.
3. **Rounded-full everything** — Mix border radii intentionally.
4. **Generic illustrations** — No blob people, abstract shapes.
5. **Centered everything** — Use asymmetry, left-aligned heroes.
6. **Card grids with identical spacing** — Vary card sizes, use bento.
7. **Rainbow hover effects** — Stick to monochromatic or single accent.
8. **Placeholder stock photos** — Better to use typography-only designs.
9. **Cookie-cutter shadows** — Use `shadow-2xl` sparingly, prefer border/backdrop.
10. **Excessive border-radius** — Sharp corners can be more modern.

## Light Mode Support

When needed, invert the palette:

```tsx
const lightColors = {
  bg: {
    primary: '#fafafa',
    secondary: '#f4f4f5',
    tertiary: '#ffffff',
  },
  surface: {
    glass: 'rgba(0,0,0,0.02)',
    glassBorder: 'rgba(0,0,0,0.06)',
  },
  text: {
    primary: '#09090b',
    secondary: '#52525b',
    muted: '#a1a1aa',
  },
}
```

Use Tailwind's `dark:` variants with `prefers-color-scheme` or manual toggle.

## Implementation Checklist

Before delivering any component:

- [ ] `"use client"` at top if using Framer Motion
- [ ] Distinctive font (not Inter for headings)
- [ ] No gradients
- [ ] Entrance animations with stagger
- [ ] Hover states on interactive elements
- [ ] Glass panels with proper blur + border
- [ ] Typography scale is extreme (not timid)
- [ ] Generous whitespace
- [ ] Mobile responsive
- [ ] Accessible (proper contrast, focus states)

## Reference Files

See `references/animations.md` for extended animation patterns including parallax, horizontal scroll galleries, page transitions, cursor followers.

See `references/components.md` for additional component patterns beyond nav/hero/footer.
