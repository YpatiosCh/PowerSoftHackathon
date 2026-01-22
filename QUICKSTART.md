# 🚀 FlashBite - Quick Start Guide

Get FlashBite running in under 5 minutes!

## ⚡ Installation

### 1. Prerequisites
Ensure you have:
- **Node.js 18+** ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)

Check your versions:
```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Server starts at: **http://localhost:3000**

---

## 📱 Try These Interfaces

### 1. Home Page (http://localhost:3000)
- Central navigation hub
- Links to all interfaces

### 2. Customer Menu (http://localhost:3000/menu)
**What to try:**
- Browse 25 menu items with ingredients
- Click test clock buttons (8PM, 9PM, 10PM, 11PM)
- Filter by category or flash sales only
- Add items to cart (🛒 badge shows count)
- See flash badges (🔥) on discounted items

### 3. Staff Panel (http://localhost:3000/staff)
**What to try:**
- Update inventory: Plenty / Low / Sold Out / Add Batch (<2 seconds!)
- Enable auto-sale on waste-risk items (checkbox)
- Set custom discounts (💰 Set Custom Sale button)
- Filter to show only flash sales
- Watch auto-refresh every 30 seconds

### 4. Owner Dashboard (http://localhost:3000/owner)
**What to see:**
- 4 metric cards: Saved, Meals, Revenue, Waste%
- 7-day trend chart
- Top 3 performing items
- Live inventory status grid

### 5. Shopping Cart (http://localhost:3000/cart)
**What to try:**
- View selected items with details
- Adjust quantities with +/- buttons
- See subtotals and savings
- Remove items or clear cart

---

## 🧪 Quick Feature Tests

### Test 1: Enable Auto-Sale (30 seconds)
1. Go to http://localhost:3000/staff
2. Find "Tomato Basil Soup" (yellow "⚠️ Waste Risk" badge)
3. Check box: "⏰ Enable Auto-Sale Discounts"
4. Go to http://localhost:3000/menu
5. Click "11PM" test clock button
6. Watch it get 50% off automatically!

### Test 2: Manual Discount (20 seconds)
1. Go to http://localhost:3000/staff
2. Find "Grilled Chicken Breast"
3. Click "💰 Set Custom Sale"
4. Enter "30" (30% off)
5. Click "✓ Set"
6. See flash badge on menu!

### Test 3: Shopping Cart (40 seconds)
1. Go to http://localhost:3000/menu
2. Click "Add to Order" on 3-4 items
3. Cart badge shows count
4. Click "🛒 Cart" in header
5. Use +/- to change quantities
6. See total with savings

### Test 4: Inventory Update (15 seconds)
1. Go to http://localhost:3000/staff
2. Click "⚠️ Low" on any item
3. Go to menu - see "⚠️ Last Few!" badge
4. Go back to staff
5. Click "❌ Sold Out"
6. Item disappears from menu

---

## 🎮 Test Clock Feature

Located in **menu header** - perfect for demos!

**Buttons:**
- **8PM** → 10% discount tier
- **9PM** → 20% discount tier
- **10PM** → 35% discount tier
- **11PM** → 50% discount tier (closing time!)
- **Reset** → Return to real time

**Pro tip:** Click "11PM" to instantly see maximum discounts without waiting!

---

## 📊 What's Included

**25 Menu Items:**
- 2 Soups, 3 Proteins, 9 Sides
- 3 Pastries, 6 Beverages, 2 Other
- All with ingredient lists
- 20 waste-risk items, 5 non-waste-risk

**Core Features:**
- ✅ Bucket inventory (High/Medium/Low/Sold Out)
- ✅ Auto-sale system (per-item toggle)
- ✅ Manual discounts (0-100%)
- ✅ Time-based pricing (10% → 50%)
- ✅ Shopping cart with savings
- ✅ Test clock for demos
- ✅ Real-time updates

---

## 🔧 Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npx tsc --noEmit

# Lint code
npm run lint
```

---

## 🎯 5-Minute Demo Script

Perfect for showing FlashBite:

1. **Staff Panel** (1 min) - Show one-tap updates and auto-sale checkbox
2. **Test Clock** (1 min) - Click "11PM" and watch discounts appear
3. **Customer Menu** (1 min) - Browse items, ingredients, add to cart
4. **Shopping Cart** (1 min) - Show quantities and savings
5. **Owner Dashboard** (1 min) - Point to impact metrics and charts

---

## 🎨 Quick Customization

### Add a Menu Item
Edit `src/lib/mockData.ts`:
```typescript
{
  id: 'item-26',
  name: 'Your Dish',
  category: 'soup',
  description: 'Description here',
  regularPrice: 9.99,
  isWasteRisk: true,
  typicalBatchSize: 20,
  earliestFlashTime: '21:00',
  ingredients: ['Ingredient 1', 'Ingredient 2']
}
```

### Change Discount Tiers
Edit `src/lib/mockData.ts`:
```typescript
discountTiers: [
  { startTime: '20:00', discountPercent: 10 },
  { startTime: '21:00', discountPercent: 20 },
  { startTime: '22:00', discountPercent: 35 },
  { startTime: '22:30', discountPercent: 50 }
]
```

### Update Restaurant Name
Edit `MOCK_CONFIG` in `src/lib/mockData.ts`:
```typescript
{
  name: 'Your Restaurant',
  closingTime: '23:00'
}
```

---

## 🚨 Troubleshooting

**Port 3000 in use?**
```bash
npx kill-port 3000
# Or use different port
npm run dev -- -p 3001
```

**Dependencies not installing?**
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

**TypeScript errors?**
- Restart VS Code TypeScript server (Ctrl+Shift+P → "TypeScript: Restart TS Server")

---

## 💡 Key Concepts

**Bucket Inventory:**
- High = Plenty in stock
- Medium = Running low
- Low = Last few left
- Sold Out = All gone

**Auto-Sale:**
- Only for waste-risk items
- Enable per item with checkbox
- Automatic time-based discounts
- Overridden by manual discounts

**Flash Sale:**
- Active discount (auto or manual)
- Shows 🔥 badge
- Red border styling
- Savings highlighted

---

## 📖 Next Steps

1. ✅ **Try all features** using tests above
2. 📚 **Read README.md** for full documentation
3. 📊 **Read PRESENTATION.md** for business overview
4. 🎨 **Customize menu** with your items
5. 🧪 **Use test clock** for demos
6. 💻 **Explore code** in `src/` folder

---

## 🤝 Need Help?

- **Full Docs:** README.md
- **Product Info:** PRESENTATION.md
- **Data Types:** `src/types/index.ts`
- **Questions:** Open a GitHub issue

---

**You're all set!** 🚀

**Start:** `npm run dev`  
**Visit:** http://localhost:3000

**Let's fight food waste together!** 🍽️ 🔥

### Change Colors
Edit `tailwind.config.ts`

### Adjust Auto-Decay Logic
Edit `autoDecayBucket()` in `src/lib/utils.ts`

## 📊 What's Working

✅ Bucket-based inventory (no counting!)
✅ Time-based auto-discounting
✅ One-tap staff updates
✅ Owner dashboard with metrics
✅ Customer flash menu
✅ Auto-refresh every 30s
✅ Responsive design
✅ TypeScript type safety

## 🔌 Next Steps for Production

1. **Connect Real Backend**
   - Replace mock API in `src/app/api/*/route.ts`
   - Add database for persistence
   - Integrate with your existing ERP/POS

2. **Add Authentication**
   - Staff login
   - Owner admin panel
   - Role-based access

3. **Deploy**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or your server

## 💡 Key Insights

This MVP proves:
- ✅ Restaurants can manage inventory with buckets (not exact counts)
- ✅ Time-based pricing eliminates manual work
- ✅ Staff interface can be <2 seconds
- ✅ System works even without constant updates
- ✅ Focus on impact, not precision

## 🐛 Troubleshooting

### Port already in use?
```bash
# Stop the server (Ctrl+C) and run:
npm run dev -- -p 3001
```

### Changes not showing?
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Check terminal for errors

### Dependencies issue?
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- **README.md**: Full project documentation
- **.github/copilot-instructions.md**: Development guidelines
- **Comments in code**: Explains key logic

## 🎉 Success!

You now have a working MVP that demonstrates:
- Simple inventory (buckets)
- Time-based discounts
- Fast staff updates
- Impact-focused analytics
- Customer-facing flash sales

**No ERP integration needed yet** - this proves the concept works!

---

Need help? Check the code comments or README.md for more details.

**Happy food rescuing! 🍽️♻️**
