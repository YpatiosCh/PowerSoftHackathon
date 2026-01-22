'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Analytics, ItemWithStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function OwnerPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [items, setItems] = useState<ItemWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, itemsRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/items')
        ]);

        const analyticsData = await analyticsRes.json();
        const itemsData = await itemsRes.json();

        setAnalytics(analyticsData.analytics);
        setItems(itemsData.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-zinc-400 text-lg">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center"
        >
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-400 text-xl font-bold">Failed to load analytics</p>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-violet-500/25">
                📊
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
                <p className="text-sm text-zinc-500">Your impact at a glance</p>
              </div>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Home
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
                <span className="text-emerald-400 text-sm font-semibold">Total Saved</span>
              </div>
              <div className="text-3xl font-bold text-white">{formatCurrency(analytics.totalSaved)}</div>
              <div className="text-sm text-zinc-500 mt-1">This week</div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-xl">🍽️</span>
                </div>
                <span className="text-blue-400 text-sm font-semibold">Meals Rescued</span>
              </div>
              <div className="text-3xl font-bold text-white">{analytics.mealsRescued}</div>
              <div className="text-sm text-zinc-500 mt-1">This week</div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <span className="text-xl">💵</span>
                </div>
                <span className="text-violet-400 text-sm font-semibold">Revenue Generated</span>
              </div>
              <div className="text-3xl font-bold text-white">{formatCurrency(analytics.revenueGenerated)}</div>
              <div className="text-sm text-zinc-500 mt-1">Flash sales only</div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <span className="text-xl">📉</span>
                </div>
                <span className="text-amber-400 text-sm font-semibold">Waste Reduced</span>
              </div>
              <div className="text-3xl font-bold text-white">{analytics.wasteReduced}%</div>
              <div className="text-sm text-zinc-500 mt-1">Compared to baseline</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Daily Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-2xl blur-xl" />
          <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-lg">📈</span>
              7-Day Trend
            </h2>
            <div className="space-y-3">
              {analytics.dailyTrend.map((day, index) => {
                const maxSaved = Math.max(...analytics.dailyTrend.map(d => d.saved));
                const barWidth = maxSaved > 0 ? (day.saved / maxSaved) * 100 : 0;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-20 text-sm text-zinc-400 font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1 bg-white/5 rounded-full h-8 relative overflow-hidden border border-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                        className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full flex items-center px-3"
                      >
                        {barWidth > 20 && (
                          <span className="text-black text-sm font-bold whitespace-nowrap">
                            {formatCurrency(day.saved)}
                          </span>
                        )}
                      </motion.div>
                      {barWidth <= 20 && day.saved > 0 && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">
                          {formatCurrency(day.saved)}
                        </span>
                      )}
                    </div>
                    <div className="w-20 text-sm text-zinc-500 text-right">
                      {day.meals} meals
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl blur-xl" />
            <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-lg">🏆</span>
                Top Flash Sale Items
              </h2>
              <div className="space-y-3">
                {analytics.topItems.map((item, index) => (
                  <motion.div
                    key={item.itemId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all"
                  >
                    <div className={`text-2xl font-bold w-8 ${
                      index === 0 ? 'text-amber-400' :
                      index === 1 ? 'text-zinc-300' :
                      index === 2 ? 'text-amber-600' :
                      'text-zinc-500'
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate">{item.itemName}</div>
                      <div className="text-sm text-zinc-500">{item.unitsSold} units sold</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">
                        {formatCurrency(item.revenue)}
                      </div>
                      <div className="text-xs text-zinc-500">revenue</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Current Inventory Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-violet-500/5 rounded-2xl blur-xl" />
            <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-lg">📦</span>
                Inventory Status
              </h2>
              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.02 }}
                    className={`p-3 rounded-xl border transition-all ${
                      item.currentBucket === 'high' ? 'bg-emerald-500/10 border-emerald-500/30' :
                      item.currentBucket === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
                      item.currentBucket === 'low' ? 'bg-orange-500/10 border-orange-500/30' :
                      'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="font-bold text-white text-sm mb-1 truncate">{item.name}</div>
                    <div className={`text-xs font-semibold ${
                      item.currentBucket === 'high' ? 'text-emerald-400' :
                      item.currentBucket === 'medium' ? 'text-amber-400' :
                      item.currentBucket === 'low' ? 'text-orange-400' :
                      'text-red-400'
                    }`}>
                      {item.currentBucket.toUpperCase()}
                    </div>
                    {item.isFlashActive && item.currentDiscount > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                        <span className="animate-pulse">🔥</span> {item.currentDiscount}% OFF
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl blur-xl" />
          <div className="relative bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                className="text-6xl"
              >
                🌟
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  You saved {formatCurrency(analytics.totalSaved)} this week!
                </h3>
                <p className="text-zinc-300">
                  That&apos;s {analytics.mealsRescued} meals rescued from waste and {formatCurrency(analytics.revenueGenerated)} in additional revenue.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
