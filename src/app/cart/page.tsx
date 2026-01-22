'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const calculateTotals = () => {
    const totalRegular = cart.reduce((sum, cartItem) => {
      const regularPrice = (cartItem as any).regularPrice || cartItem.price || cartItem.finalPrice || 0;
      return sum + (regularPrice * cartItem.quantity);
    }, 0);
    const totalFinal = getTotalPrice();
    const totalSavings = totalRegular - totalFinal;
    return { totalRegular, totalFinal, totalSavings };
  };

  const placeOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const { totalRegular, totalFinal, totalSavings } = calculateTotals();

      const orderItems = cart.map((cartItem) => {
        const regularPrice = (cartItem as any).regularPrice || cartItem.price || cartItem.finalPrice || 0;
        return {
          itemId: cartItem.id,
          name: cartItem.name,
          quantity: cartItem.quantity,
          regularPrice,
          discountPercent: cartItem.currentDiscount || 0,
          finalPrice: cartItem.finalPrice || regularPrice
        };
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          totalRegular,
          totalFinal,
          totalSavings
        })
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        alert(`Order placed successfully! Order ID: ${data.order.id}\n\nStaff will review your order shortly.`);
        router.push('/menu');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'soup': return '🍜';
      case 'protein': return '🍗';
      case 'side': case 'sides': return '🥗';
      case 'pastry': return '🥐';
      case 'beverage': return '🥤';
      case 'coffee': return '☕';
      case 'desserts': return '🍰';
      case 'salads': return '🥬';
      case 'wines': return '🍷';
      case 'cocktails': return '🍸';
      default: return '🍽️';
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl" />
          <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center max-w-md">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-6"
            >
              🛒
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
            <p className="text-zinc-400 mb-8">Add some delicious items from our menu!</p>
            <Link
              href="/menu"
              className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-xl font-bold hover:from-amber-400 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/25"
            >
              Browse Menu
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const { totalRegular, totalFinal, totalSavings } = calculateTotals();
  const hasFlashDeals = cart.some(c => c.currentDiscount && c.currentDiscount > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/25">
                🛒
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Your Order</h1>
                <p className="text-sm text-zinc-500">{cart.length} {cart.length === 1 ? 'item' : 'items'} in cart</p>
              </div>
            </div>
            <Link
              href="/menu"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Menu
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((cartItem, index) => {
                const regularPrice = (cartItem as any).regularPrice || cartItem.price || cartItem.finalPrice || 0;
                const finalPrice = cartItem.finalPrice || regularPrice;
                const isFlashDeal = cartItem.currentDiscount && cartItem.currentDiscount > 0;
                const itemTotal = finalPrice * cartItem.quantity;
                const savings = isFlashDeal ? (regularPrice - finalPrice) * cartItem.quantity : 0;
                const category = (cartItem as any).category;

                return (
                  <motion.div
                    key={cartItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative group"
                  >
                    {isFlashDeal && (
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl blur-xl transition-all group-hover:from-amber-500/20 group-hover:to-orange-500/20" />
                    )}
                    <div className={`relative bg-zinc-900/60 backdrop-blur-xl border rounded-2xl p-5 transition-all hover:bg-zinc-900/80 ${
                      isFlashDeal ? 'border-amber-500/30' : 'border-white/10'
                    }`}>
                      <div className="flex gap-5">
                        {/* Item Icon */}
                        <div className={`w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isFlashDeal
                            ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                            : 'bg-white/5 border border-white/10'
                        }`}>
                          <span className="text-4xl">{getCategoryIcon(category)}</span>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0">
                              <h3 className="text-lg font-bold text-white flex items-center gap-2 flex-wrap">
                                <span className="truncate">{cartItem.name}</span>
                                {isFlashDeal && (
                                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap">
                                    <span className="animate-pulse">🔥</span> {cartItem.currentDiscount}% OFF
                                  </span>
                                )}
                              </h3>
                              <p className="text-zinc-500 text-sm mt-1 line-clamp-1">{cartItem.description}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(cartItem.id)}
                              className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          {/* Price and Quantity Controls */}
                          <div className="flex justify-between items-end mt-4 gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                {isFlashDeal ? (
                                  <>
                                    <span className="text-zinc-500 text-sm line-through">
                                      {formatCurrency(regularPrice)}
                                    </span>
                                    <span className="text-amber-400 font-bold text-lg">
                                      {formatCurrency(finalPrice)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-white font-bold text-lg">
                                    {formatCurrency(finalPrice)}
                                  </span>
                                )}
                              </div>
                              {savings > 0 && (
                                <div className="text-emerald-400 text-xs font-medium mt-1">
                                  Saving {formatCurrency(savings)}
                                </div>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                                <button
                                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                                  className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg font-bold text-white transition-all"
                                >
                                  −
                                </button>
                                <span className="w-10 text-center font-bold text-lg text-white">{cartItem.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                                  className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-lg font-bold text-black transition-all"
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-right min-w-[80px]">
                                <div className="text-zinc-500 text-xs">Subtotal</div>
                                <div className="text-xl font-bold text-white">
                                  {formatCurrency(itemTotal)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add More Items
              </Link>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl blur-xl" />
                <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-sm">📋</span>
                    Order Summary
                  </h2>

                  {/* Flash Deals Info */}
                  {hasFlashDeals && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🎉</span>
                        <span className="font-bold text-emerald-400 text-sm">Flash Deal Savings!</span>
                      </div>
                      <p className="text-xs text-emerald-400/70">
                        You&apos;re saving on {cart.filter(c => c.currentDiscount && c.currentDiscount > 0).length} {cart.filter(c => c.currentDiscount && c.currentDiscount > 0).length === 1 ? 'item' : 'items'}!
                      </p>
                    </motion.div>
                  )}

                  {/* Items Breakdown */}
                  <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {cart.map((cartItem) => {
                      const finalPrice = cartItem.finalPrice || cartItem.price || 0;
                      return (
                        <div key={cartItem.id} className="flex justify-between text-sm">
                          <span className="text-zinc-400 truncate pr-2">
                            {cartItem.name} × {cartItem.quantity}
                          </span>
                          <span className="font-medium text-white whitespace-nowrap">
                            {formatCurrency(finalPrice * cartItem.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-white/10 pt-4 space-y-2 mb-6">
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Original Price</span>
                        <span className="text-zinc-500 line-through">{formatCurrency(totalRegular)}</span>
                      </div>
                    )}
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-400">You Save</span>
                        <span className="text-emerald-400 font-medium">-{formatCurrency(totalSavings)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-white">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                        {formatCurrency(totalFinal)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black py-4 rounded-xl font-bold text-lg shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    onClick={placeOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Place Order
                      </>
                    )}
                  </motion.button>

                  <button
                    onClick={clearCart}
                    className="w-full mt-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
