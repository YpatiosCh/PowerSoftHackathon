'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemWithStatus, DiscountTier } from '@/types';
import { getBucketInfo, formatCurrency } from '@/lib/utils';
import { PowerSoftMenu } from '@/menu/menu';
import Link from 'next/link';

interface Order {
  id: string;
  items: Array<{
    itemId: string;
    name: string;
    quantity: number;
    regularPrice: number;
    discountPercent: number;
    finalPrice: number;
  }>;
  totalRegular: number;
  totalFinal: number;
  totalSavings: number;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

export default function StaffPage() {
  const [items, setItems] = useState<ItemWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showFlashOnly, setShowFlashOnly] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<string | null>(null);
  const [customDiscount, setCustomDiscount] = useState<string>('');
  const [autoSaleSettings, setAutoSaleSettings] = useState<Record<string, boolean>>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [testTime, setTestTime] = useState<string>('');
  const [showTimePanel, setShowTimePanel] = useState(false);

  const [showTiersPanel, setShowTiersPanel] = useState(false);
  const [discountTiers, setDiscountTiers] = useState<DiscountTier[]>([]);
  const [isCustomTiers, setIsCustomTiers] = useState(false);
  const [editingTiers, setEditingTiers] = useState<DiscountTier[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrdersPanel, setShowOrdersPanel] = useState(false);

  const fetchItems = async () => {
    try {
      const [itemsRes, autoSaleRes, tiersRes, ordersRes] = await Promise.all([
        fetch('/api/items'),
        fetch('/api/auto-sale'),
        fetch('/api/discount-tiers'),
        fetch('/api/orders?status=pending')
      ]);

      const itemsData = await itemsRes.json();
      const autoSaleData = await autoSaleRes.json();
      const tiersData = await tiersRes.json();
      const ordersData = await ordersRes.json();

      setItems(itemsData.items || []);
      setAutoSaleSettings(autoSaleData.autoSaleSettings || {});
      setDiscountTiers(tiersData.tiers || []);
      setIsCustomTiers(tiersData.isCustom || false);
      setOrders(ordersData.orders || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateInventory = async (itemId: string, action: 'plenty' | 'low' | 'sold-out' | 'add-batch') => {
    // Prevent multiple simultaneous updates
    if (updating !== null) return;
    
    setUpdating(itemId);
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, action })
      });

      if (response.ok) {
        await fetchItems();
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
    } finally {
      setUpdating(null);
    }
  };

  const setManualDiscount = async (itemId: string) => {
    const discount = parseFloat(customDiscount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      alert('Please enter a valid discount between 0 and 100');
      return;
    }

    // Prevent multiple simultaneous updates
    if (updating !== null) return;
    
    setUpdating(itemId);
    try {
      const response = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, discount })
      });

      if (response.ok) {
        setEditingDiscount(null);
        setCustomDiscount('');
        await fetchItems();
      }
    } catch (error) {
      console.error('Error setting discount:', error);
    } finally {
      setUpdating(null);
    }
  };

  const clearManualDiscount = async (itemId: string) => {
    // Prevent multiple simultaneous updates
    if (updating !== null) return;
    
    setUpdating(itemId);
    try {
      const response = await fetch('/api/discount', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });

      if (response.ok) {
        await fetchItems();
      }
    } catch (error) {
      console.error('Error clearing discount:', error);
    } finally {
      setUpdating(null);
    }
  };

  const toggleAutoSale = async (itemId: string, currentlyEnabled: boolean) => {
    // Prevent multiple simultaneous updates
    if (updating !== null) return;
    
    const enable = !currentlyEnabled;
    setUpdating(itemId);
    
    try {
      const response = await fetch('/api/auto-sale', {
        method: enable ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });

      if (response.ok) {
        await fetchItems();
      } else {
        // If request failed, revert the optimistic update
        console.error('Failed to toggle auto-sale');
      }
    } catch (error) {
      console.error('Error toggling auto-sale:', error);
    } finally {
      setUpdating(null);
    }
  };

  const openTiersEditor = () => {
    setEditingTiers([...discountTiers]);
    setShowTiersPanel(true);
  };

  const addTier = () => {
    setEditingTiers([...editingTiers, { startTime: '20:00', discountPercent: 10 }]);
  };

  const updateTier = (index: number, field: 'startTime' | 'discountPercent', value: string | number) => {
    const newTiers = [...editingTiers];
    if (field === 'discountPercent') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      newTiers[index] = { ...newTiers[index], discountPercent: isNaN(numValue) ? 0 : numValue };
    } else {
      newTiers[index] = { ...newTiers[index], startTime: value as string };
    }
    setEditingTiers(newTiers);
  };

  const removeTier = (index: number) => {
    setEditingTiers(editingTiers.filter((_, i) => i !== index));
  };

  const saveTiers = async () => {
    setUpdating('tiers');
    try {
      const response = await fetch('/api/discount-tiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tiers: editingTiers })
      });

      if (response.ok) {
        setShowTiersPanel(false);
        await fetchItems();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save discount tiers');
      }
    } catch (error) {
      console.error('Error saving discount tiers:', error);
      alert('Failed to save discount tiers');
    } finally {
      setUpdating(null);
    }
  };

  const resetTiers = async () => {
    if (!confirm('Reset to default discount schedule?')) return;

    setUpdating('tiers');
    try {
      const response = await fetch('/api/discount-tiers', {
        method: 'DELETE'
      });

      if (response.ok) {
        setShowTiersPanel(false);
        await fetchItems();
      }
    } catch (error) {
      console.error('Error resetting discount tiers:', error);
    } finally {
      setUpdating(null);
    }
  };

  const setTimeForTesting = async (time: string) => {
    try {
      const [hour, minute] = time.split(':').map(Number);

      const response = await fetch('/api/test-clock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hour, minute })
      });

      if (response.ok) {
        await fetchItems();
      }
    } catch (error) {
      console.error('Error setting test time:', error);
    }
  };

  const resetTimeToNow = async () => {
    try {
      const response = await fetch('/api/test-clock', {
        method: 'DELETE'
      });

      if (response.ok) {
        setTestTime('');
        await fetchItems();
      }
    } catch (error) {
      console.error('Error resetting time:', error);
    }
  };

  const handleOrder = async (orderId: string, status: 'accepted' | 'declined') => {
    // Prevent multiple simultaneous updates
    if (updating !== null) return;
    
    setUpdating(orderId);
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status })
      });

      if (response.ok) {
        await fetchItems();
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const displayItems = showFlashOnly
    ? items.filter(item => item.isFlashActive && item.currentDiscount > 0)
    : items;

  const menuCategories = PowerSoftMenu.categories.map(cat => ({
    id: cat.id,
    name: cat.name
  }));

  const itemCategoryMap: Record<string, string> = {};
  PowerSoftMenu.categories.forEach(category => {
    if (category.items) {
      category.items.forEach(item => {
        itemCategoryMap[item.id] = category.id;
      });
    }
    if (category.subcategories) {
      category.subcategories.forEach(sub => {
        sub.items.forEach(item => {
          itemCategoryMap[item.id] = category.id;
        });
      });
    }
  });

  const filteredItems = displayItems.filter(item => {
    const itemCategory = itemCategoryMap[item.id] || 'other';
    const matchesCategory = selectedCategory === 'all' || itemCategory === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const itemsByCategory: Record<string, { name: string; items: ItemWithStatus[] }> = {};

  filteredItems.forEach(item => {
    const categoryId = itemCategoryMap[item.id] || 'other';
    const categoryName = menuCategories.find(c => c.id === categoryId)?.name || 'Other';

    if (!itemsByCategory[categoryId]) {
      itemsByCategory[categoryId] = { name: categoryName, items: [] };
    }
    itemsByCategory[categoryId].items.push(item);
  });

  const isUpdating = updating !== null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-zinc-400 text-lg">Loading staff panel...</p>
        </motion.div>
      </div>
    );
  }

  const flashCount = items.filter(item => item.isFlashActive && item.currentDiscount > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/25">
                👨‍🍳
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Staff Panel</h1>
                <p className="text-sm text-zinc-500">Quick inventory & discounts</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowTimePanel(!showTimePanel)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-xl font-semibold flex items-center gap-2 hover:from-amber-400 hover:to-orange-400 transition-all"
              >
                🕐 Test Time
              </button>
              <button
                onClick={() => setShowOrdersPanel(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-black rounded-xl font-semibold flex items-center gap-2 hover:from-emerald-400 hover:to-green-400 transition-all relative"
              >
                📦 Orders
                {orders.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {orders.length}
                  </span>
                )}
              </button>
              <button
                onClick={openTiersEditor}
                className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:from-violet-400 hover:to-purple-400 transition-all"
              >
                ⚙️ Schedule
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Time Control Panel */}
      <AnimatePresence>
        {showTimePanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-amber-500/30 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-xl">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🕐</span> Time Machine - Test Discount Schedule
                </h2>
                <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <p className="text-zinc-400 mb-4">
                    Control time to test how discounts change throughout the day.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-white mb-3">Quick Jump:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { time: '14:00', label: '🌅 14:00 - No Discounts', color: 'from-emerald-500 to-green-500' },
                          { time: '20:00', label: '🌆 20:00 - First Discount', color: 'from-amber-500 to-yellow-500' },
                          { time: '21:00', label: '🌇 21:00 - Second Discount', color: 'from-orange-500 to-red-500' },
                          { time: '21:30', label: '🌃 21:30 - Max Discount', color: 'from-red-500 to-pink-500' }
                        ].map(({ time, label, color }) => (
                          <button
                            key={time}
                            onClick={() => { setTestTime(time); setTimeForTesting(time); }}
                            className={`px-4 py-3 bg-gradient-to-r ${color} text-black rounded-xl font-semibold hover:opacity-90 transition-all`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-white mb-3">Custom Time:</h3>
                      <div className="flex gap-2 mb-4">
                        <input
                          type="time"
                          value={testTime}
                          onChange={(e) => setTestTime(e.target.value)}
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500 focus:outline-none text-white text-lg"
                        />
                        <button
                          onClick={() => testTime && setTimeForTesting(testTime)}
                          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-xl font-semibold hover:from-amber-400 hover:to-orange-400 transition-all"
                        >
                          Set
                        </button>
                      </div>
                      <button
                        onClick={resetTimeToNow}
                        className="w-full px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl font-semibold transition-all"
                      >
                        🔄 Reset to Real Time
                      </button>
                    </div>
                  </div>

                  {testTime && (
                    <div className="mt-4 p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                      <span className="text-amber-400 font-bold">⚠️ TIME OVERRIDE ACTIVE: {testTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Feature Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4 text-center">📚 Staff Panel Features</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '⏰', title: 'Auto-Sale Toggle', items: ['Enable automatic time-based discounts', 'Discounts increase as closing approaches', 'Manual discounts always override'] },
              { icon: '📦', title: 'Inventory Buttons', items: ['Plenty: High stock (green)', 'Low: Running out (orange)', 'Sold Out: None left (red)', 'Add Batch: Just prepped more'] },
              { icon: '💰', title: 'Manual Discounts', items: ['Click "Set Custom Sale"', 'Enter any discount 0-100%', 'Overrides auto-discount', 'Click "Clear" to remove'] },
              { icon: '⚙️', title: 'Discount Schedule', items: ['Click "Schedule" button', 'Add/remove discount tiers', 'Set time and percentage', 'Reset to default anytime'] }
            ].map(({ icon, title, items: listItems }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">{icon}</span> {title}
                </h3>
                <ul className="text-sm text-zinc-400 space-y-1">
                  {listItems.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
          >
            <h3 className="font-bold text-white mb-3">🔍 Search</h3>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-white"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
          >
            <h3 className="font-bold text-white mb-3">🔥 Flash Filter</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFlashOnly(false)}
                className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all ${
                  !showFlashOnly
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-black'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setShowFlashOnly(true)}
                className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all ${
                  showFlashOnly
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                🔥 Flash ({flashCount})
              </button>
            </div>
          </motion.div>
        </div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-black'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            📋 All ({displayItems.length})
          </button>
          {menuCategories.map(category => {
            const count = displayItems.filter(item => itemCategoryMap[item.id] === category.id).length;
            if (count === 0) return null;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-black'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10'
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </motion.div>

        {/* Items Grid */}
        <div className="space-y-8">
          {Object.entries(itemsByCategory).map(([categoryId, { name, items: categoryItems }]) => (
            <motion.div
              key={categoryId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                📂 {name}
                <span className="text-sm font-normal text-zinc-500">({categoryItems.length} items)</span>
              </h3>

              <div className="grid gap-4">
                {categoryItems.map((item, index) => {
                  const bucketInfo = getBucketInfo(item.currentBucket);
                  const isFlashItem = item.isFlashActive && item.currentDiscount > 0;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`rounded-xl p-5 transition-all ${
                        isFlashItem
                          ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      {/* Item Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="text-lg font-bold text-white">{item.name}</h4>
                            {item.currentBucket === 'sold-out' && (
                              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
                                ❌ SOLD OUT
                              </span>
                            )}
                            {item.currentBucket === 'low' && (
                              <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30">
                                ⚠️ LOW STOCK
                              </span>
                            )}
                            {item.currentBucket === 'high' && (
                              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                                ✅ PLENTY
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-500 text-sm">{item.description}</p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="text-zinc-400">
                              Regular: {formatCurrency(item.regularPrice)}
                            </span>
                            {item.currentDiscount > 0 && (
                              <>
                                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                                  <span className="animate-pulse">🔥</span> {item.currentDiscount}% OFF
                                </span>
                                <span className="text-emerald-400 font-bold">
                                  Sale: {formatCurrency(item.finalPrice)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                          item.currentBucket === 'high' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          item.currentBucket === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          item.currentBucket === 'low' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {bucketInfo.label}
                        </span>
                      </div>

                      {/* Auto-Sale Toggle */}
                      <div className={`mb-4 rounded-xl p-4 ${
                        item.isWasteRisk
                          ? 'bg-amber-500/10 border border-amber-500/30'
                          : 'bg-blue-500/10 border border-blue-500/30'
                      }`}>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={autoSaleSettings[item.id] || false}
                            onChange={() => toggleAutoSale(item.id, autoSaleSettings[item.id] || false)}
                            disabled={isUpdating}
                            className="w-6 h-6 accent-amber-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <div className="flex-1">
                            <span className={`font-bold ${item.isWasteRisk ? 'text-amber-400' : 'text-blue-400'}`}>
                              ⏰ Enable Scheduled Discounts
                            </span>
                            <p className={`text-xs mt-1 ${item.isWasteRisk ? 'text-amber-400/70' : 'text-blue-400/70'}`}>
                              Automatic discounts as closing time approaches
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Inventory Buttons */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-zinc-500 mb-2">INVENTORY STATUS:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[
                            { action: 'plenty' as const, label: '✅ Plenty', color: 'from-emerald-500 to-green-500' },
                            { action: 'low' as const, label: '⚠️ Low', color: 'from-orange-500 to-amber-500' },
                            { action: 'sold-out' as const, label: '❌ Sold Out', color: 'from-red-500 to-pink-500' },
                            { action: 'add-batch' as const, label: '➕ Add Batch', color: 'from-blue-500 to-cyan-500' }
                          ].map(({ action, label, color }) => (
                            <button
                              key={action}
                              onClick={() => updateInventory(item.id, action)}
                              disabled={isUpdating}
                              className={`bg-gradient-to-r ${color} text-black font-bold py-2 px-3 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 text-sm`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Manual Discount */}
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-xs font-semibold text-zinc-500 mb-2">MANUAL DISCOUNT:</p>
                        {editingDiscount === item.id ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="5"
                              value={customDiscount}
                              onChange={(e) => setCustomDiscount(e.target.value)}
                              placeholder="% off"
                              className="flex-1 px-3 py-2 bg-white/5 border border-violet-500/30 rounded-xl focus:border-violet-500 focus:outline-none text-white"
                            />
                            <button
                              onClick={() => setManualDiscount(item.id)}
                              disabled={isUpdating}
                              className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-bold hover:from-violet-400 hover:to-purple-400 disabled:opacity-50"
                            >
                              ✓ Set
                            </button>
                            <button
                              onClick={() => {
                                setEditingDiscount(null);
                                setCustomDiscount('');
                              }}
                              className="px-4 py-2 bg-zinc-700 text-white rounded-xl font-bold hover:bg-zinc-600"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingDiscount(item.id);
                                setCustomDiscount(item.currentDiscount.toString());
                              }}
                              disabled={isUpdating}
                              className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-2 px-4 rounded-xl hover:from-violet-400 hover:to-purple-400 disabled:opacity-50"
                            >
                              💰 Set Custom Sale
                            </button>
                            {item.currentDiscount > 0 && (
                              <button
                                onClick={() => clearManualDiscount(item.id)}
                                disabled={isUpdating}
                                className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded-xl disabled:opacity-50"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {updating === item.id && (
                        <div className="mt-2 text-center text-sm text-zinc-500">
                          Updating...
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Discount Tiers Modal */}
      <AnimatePresence>
        {showTiersPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  ⚙️ Auto-Discount Schedule
                </h2>
                <p className="text-violet-100 mt-1">
                  Customize when discounts start and how much
                </p>
              </div>

              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-zinc-500">Current Schedule:</p>
                    <p className="font-bold text-lg text-white">
                      {isCustomTiers ? '🎨 Custom' : '📋 Default'}
                    </p>
                  </div>
                  {isCustomTiers && (
                    <button
                      onClick={resetTiers}
                      disabled={updating === 'tiers'}
                      className="px-4 py-2 bg-zinc-700 text-white rounded-xl hover:bg-zinc-600 disabled:opacity-50 font-semibold"
                    >
                      🔄 Reset
                    </button>
                  )}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <h3 className="font-bold text-blue-400 mb-2">💡 How it works:</h3>
                  <ul className="text-sm text-blue-300 space-y-1">
                    <li>• Set multiple discount tiers with start times</li>
                    <li>• Items with auto-sale enabled follow this schedule</li>
                    <li>• Use 24-hour format (20:00 = 8:00 PM)</li>
                  </ul>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3 mb-4">
                  {editingTiers.map((tier, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-zinc-500 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={tier.startTime}
                          onChange={(e) => updateTier(index, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-violet-500 focus:outline-none text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-zinc-500 mb-1">
                          Discount %
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="5"
                          value={tier.discountPercent}
                          onChange={(e) => updateTier(index, 'discountPercent', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-violet-500 focus:outline-none text-white"
                        />
                      </div>
                      <button
                        onClick={() => removeTier(index)}
                        className="mt-5 px-3 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 font-bold border border-red-500/30"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addTier}
                  className="w-full py-3 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 font-bold mb-4 border border-emerald-500/30"
                >
                  ➕ Add Tier
                </button>

                {editingTiers.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                    <h3 className="font-bold text-amber-400 mb-2">📋 Preview:</h3>
                    <div className="space-y-1">
                      {editingTiers
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((tier, index) => (
                          <p key={index} className="text-sm text-amber-300">
                            <strong>{tier.startTime}</strong> → <strong>{tier.discountPercent}% OFF</strong>
                          </p>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={saveTiers}
                    disabled={updating === 'tiers' || editingTiers.length === 0}
                    className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl hover:from-violet-400 hover:to-purple-400 disabled:opacity-50 font-bold"
                  >
                    {updating === 'tiers' ? 'Saving...' : '✓ Save Schedule'}
                  </button>
                  <button
                    onClick={() => setShowTiersPanel(false)}
                    className="flex-1 py-3 bg-zinc-700 text-white rounded-xl hover:bg-zinc-600 font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orders Modal */}
      <AnimatePresence>
        {showOrdersPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 rounded-t-2xl sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                      📦 Incoming Orders
                    </h2>
                    <p className="text-emerald-900 mt-1">
                      {orders.length} pending {orders.length === 1 ? 'order' : 'orders'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOrdersPanel(false)}
                    className="text-black hover:bg-black/10 rounded-xl p-2 font-bold text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-zinc-500 text-lg">No pending orders</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-6"
                      >
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                          <div>
                            <h3 className="font-bold text-lg text-white">
                              Order #{order.id.slice(-8)}
                            </h3>
                            <p className="text-sm text-zinc-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-zinc-500">Total</div>
                            <div className="text-2xl font-bold text-emerald-400">
                              {formatCurrency(order.totalFinal)}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2">
                              <div className="flex-1">
                                <div className="font-semibold text-white">
                                  {item.name} × {item.quantity}
                                </div>
                                {item.discountPercent > 0 && (
                                  <div className="text-xs text-amber-400 font-bold">
                                    🔥 {item.discountPercent}% OFF
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                {item.discountPercent > 0 ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-zinc-500 text-sm line-through">
                                      {formatCurrency(item.regularPrice * item.quantity)}
                                    </span>
                                    <span className="font-bold text-emerald-400">
                                      {formatCurrency(item.finalPrice * item.quantity)}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-bold text-white">
                                    {formatCurrency(item.finalPrice * item.quantity)}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.totalSavings > 0 && (
                          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-emerald-400 font-semibold">
                                🎉 Customer saved:
                              </span>
                              <span className="text-emerald-400 font-bold text-lg">
                                {formatCurrency(order.totalSavings)}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleOrder(order.id, 'accepted')}
                            disabled={updating === order.id}
                            className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-black rounded-xl hover:from-emerald-400 hover:to-green-400 disabled:opacity-50 font-bold flex items-center justify-center gap-2"
                          >
                            {updating === order.id ? '...' : '✓ Accept'}
                          </button>
                          <button
                            onClick={() => handleOrder(order.id, 'declined')}
                            disabled={updating === order.id}
                            className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-400 hover:to-pink-400 disabled:opacity-50 font-bold flex items-center justify-center gap-2"
                          >
                            {updating === order.id ? '...' : '✕ Decline'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
