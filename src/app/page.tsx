'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">

        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-24">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full px-4 py-2 mb-6"
            >
              <img src="https://powersoft365.com/wp-content/uploads/2023/01/Powersoft-30years-logo-F.png" alt=""
                className='w-30 h-20'
              />
            </motion.div>

            <p className="text-2xl md:text-3xl text-white font-semibold mb-4">
              Smart Flash Sales for Restaurants
            </p>

            <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
              Turn food waste into revenue with intelligent time-based discounts.
              No complex inventory systems—just smart automation that works.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/menu"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-xl font-bold text-lg hover:from-amber-400 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/25"
              >
                Try the Menu
              </Link>
              <Link
                href="/staff"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-lg transition-all"
              >
                Staff Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      

      {/* How It Works */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How FlashBite Works
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              A simple 3-step process that runs on autopilot
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Staff Enables Auto-Sale',
                description: 'One checkbox to enable time-based discounts for items at risk of waste. Takes 2 seconds.',
                icon: '☑️',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '02',
                title: 'System Auto-Discounts',
                description: 'As closing time approaches, discounts automatically increase: 10% → 20% → 35% → 50%',
                icon: '🔄',
                color: 'from-amber-500 to-orange-500'
              },
              {
                step: '03',
                title: 'Customers Buy & Save',
                description: 'Customers see flash deals, add to cart, and order. Everyone wins—less waste, more sales.',
                icon: '🎉',
                color: 'from-emerald-500 to-green-500'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-5 rounded-2xl blur-xl`} />
                <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full">
                  <div className={`text-6xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-4`}>
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Everything you need to reduce waste and increase revenue
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: '⏰', title: 'Time-Based Discounts', desc: 'Automatic discounts that increase as closing time approaches' },
              { icon: '🎚️', title: 'Manual Override', desc: 'Staff can set custom discounts anytime for full flexibility' },
              { icon: '📦', title: 'Bucket Inventory', desc: 'No counting—just High, Medium, Low, or Sold Out' },
              { icon: '📊', title: 'Real-Time Analytics', desc: 'Track savings, rescued meals, and revenue live' },
              { icon: '🛒', title: 'Shopping Cart', desc: 'Customers browse deals and see their total savings' },
              { icon: '⚙️', title: 'Custom Schedule', desc: 'Set your own discount tiers and timing' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-amber-500/30 transition-all group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Try the Demo
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Explore FlashBite from every perspective
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Staff Panel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <Link href="/staff" className="block group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full hover:border-blue-500/30 transition-all group-hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-blue-500/25">
                      👨‍🍳
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Staff Panel</h3>
                    <p className="text-zinc-400 text-sm mb-4">Quick inventory & discount management</p>
                    <ul className="text-xs text-zinc-500 space-y-1">
                      <li>• Update stock in 2 seconds</li>
                      <li>• Enable/disable auto-sales</li>
                      <li>• Set custom discounts</li>
                      <li>• Process orders</li>
                    </ul>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Owner Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/owner" className="block group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full hover:border-violet-500/30 transition-all group-hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-violet-500/25">
                      📊
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Owner Dashboard</h3>
                    <p className="text-zinc-400 text-sm mb-4">Analytics & business insights</p>
                    <ul className="text-xs text-zinc-500 space-y-1">
                      <li>• Total savings tracked</li>
                      <li>• Meals rescued count</li>
                      <li>• Revenue analytics</li>
                      <li>• Performance charts</li>
                    </ul>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Flash Menu */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/menu" className="block group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full hover:border-amber-500/30 transition-all group-hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-amber-500/25">
                      🛒
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Flash Menu</h3>
                    <p className="text-zinc-400 text-sm mb-4">Customer-facing deals & ordering</p>
                    <ul className="text-xs text-zinc-500 space-y-1">
                      <li>• Browse flash deals</li>
                      <li>• See live discounts</li>
                      <li>• Add to cart</li>
                      <li>• Track savings</li>
                    </ul>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-xl" />
                <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 h-full flex flex-col">
                  <div className="flex-1">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-emerald-500/25">
                      📱
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Scan to Try</h3>
                    <p className="text-zinc-400 text-sm mb-4">Open the menu on your phone</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 flex items-center justify-center">
                    <Image
                      src="/QR.png"
                      alt="Scan to open FlashBite Menu"
                      width={150}
                      height={150}
                      className="w-full max-w-[150px] h-auto"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-500 text-sm">
            Built with 💚 for PowerSoft 2025 — Reducing food waste, one flash sale at a time
          </p>
        </div>
      </footer>
    </div>
  );
}
