// Starter template: Nav + Hero + Footer
// Copy to your Next.js app/page.jsx and customize

"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useRef } from "react"

// ============================================
// ANIMATION VARIANTS
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.1, 0, 1] }
  }
}

// ============================================
// MAGNETIC BUTTON COMPONENT
// ============================================

const MagneticButton = ({ children, className = "" }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouse = (e) => {
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
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// ============================================
// BUTTON COMPONENT
// ============================================

const Button = ({ 
  children, 
  variant = "primary",
  size = "md",
  className = ""
}) => {
  const variants = {
    primary: "bg-white text-zinc-900 hover:bg-zinc-200",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
    outline: "bg-transparent text-white border border-white/20 hover:bg-white/5",
  }
  
  const sizes = {
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        font-medium rounded-xl transition-colors
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}

// ============================================
// NAVIGATION
// ============================================

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
]

const Navigation = () => (
  <motion.nav
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
    className="fixed top-0 inset-x-0 z-50 px-4 py-4"
  >
    <div className="
      max-w-6xl mx-auto
      bg-white/[0.02] 
      backdrop-blur-xl 
      border border-white/[0.08] 
      rounded-2xl 
      px-6 py-3 
      flex items-center justify-between
    ">
      {/* Logo */}
      <a href="/" className="text-xl font-bold text-white tracking-tight">
        Logo
      </a>
      
      {/* Links - hidden on mobile */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <motion.a
            key={link.href}
            href={link.href}
            whileHover={{ opacity: 0.6 }}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            {link.label}
          </motion.a>
        ))}
      </div>
      
      {/* CTA */}
      <Button size="md">Get Started</Button>
    </div>
  </motion.nav>
)

// ============================================
// HERO SECTION
// ============================================

const Hero = () => (
  <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl"
    >
      {/* Tagline */}
      <motion.p 
        variants={itemVariants} 
        className="text-zinc-500 text-sm uppercase tracking-[0.2em] mb-8"
      >
        The future of design
      </motion.p>
      
      {/* Headline */}
      <motion.h1 
        variants={itemVariants} 
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-white"
      >
        Build something
        <br />
        <span className="text-zinc-500">extraordinary</span>
      </motion.h1>
      
      {/* Description */}
      <motion.p 
        variants={itemVariants} 
        className="mt-8 text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed"
      >
        Create award-winning interfaces with our design system. 
        Glassmorphism, bold typography, and sophisticated animations.
      </motion.p>
      
      {/* CTAs */}
      <motion.div 
        variants={itemVariants} 
        className="mt-12 flex flex-col sm:flex-row gap-4"
      >
        <MagneticButton className="bg-white text-zinc-900 px-8 py-4 rounded-xl font-medium hover:bg-zinc-200 transition-colors">
          Start Building
        </MagneticButton>
        <Button variant="ghost" size="lg">
          View Examples →
        </Button>
      </motion.div>
    </motion.div>
  </section>
)

// ============================================
// FOOTER
// ============================================

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Changelog", href: "#" },
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ]
  },
]

const Footer = () => (
  <footer className="border-t border-white/10 py-16 px-6 mt-32">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <a href="/" className="text-xl font-bold text-white tracking-tight">
            Logo
          </a>
          <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
            Building the future of web design.
          </p>
        </div>
        
        {/* Links */}
        {footerSections.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-medium text-white mb-4">
              {section.title}
            </h4>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Bottom */}
      <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-zinc-600">
          © 2025 Company. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-zinc-600 hover:text-white transition-colors">
            Twitter
          </a>
          <a href="#" className="text-zinc-600 hover:text-white transition-colors">
            GitHub
          </a>
          <a href="#" className="text-zinc-600 hover:text-white transition-colors">
            Discord
          </a>
        </div>
      </div>
    </div>
  </footer>
)

// ============================================
// PAGE
// ============================================

export default function Page() {
  return (
    <main className="bg-[#0a0a0b] min-h-screen">
      <Navigation />
      <Hero />
      {/* Add your content sections here */}
      <Footer />
    </main>
  )
}
