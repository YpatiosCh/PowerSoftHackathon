import OpenAI from "openai";
import { PowerSoftMenu } from "@/menu/menu";
import { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Fetch the SAME data the menu page uses!
async function fetchFlashSales(baseUrl: string): Promise<{ flashItems: any[], soldOut: any[] }> {
  try {
    const response = await fetch(`${baseUrl}/api/items`, { cache: 'no-store' });
    const data = await response.json();
    const items = data.items || [];

    const flashItems = items.filter((item: any) => item.isFlashActive && item.currentDiscount > 0);
    const soldOut = items.filter((item: any) => item.currentBucket === 'sold-out');

    return { flashItems, soldOut };
  } catch (error) {
    console.error('Error fetching items:', error);
    return { flashItems: [], soldOut: [] };
  }
}

// Generate COMPACT menu knowledge (just names and prices)
function generateMenuKnowledge(): string {
  let menuText = `## Full Menu Reference\n`;

  for (const category of PowerSoftMenu.categories) {
    menuText += `\n**${category.name}:**\n`;

    if (category.items) {
      for (const item of category.items) {
        const price = item.price
          ? `€${item.price.toFixed(2)}`
          : item.pricing
          ? `€${item.pricing.glass?.toFixed(2) || item.pricing.bottle?.toFixed(2)}`
          : "varies";
        menuText += `- ${item.name} (${item.id}) - ${price}\n`;
      }
    }

    if (category.subcategories) {
      for (const sub of category.subcategories) {
        for (const item of sub.items) {
          const price = item.price
            ? `€${item.price.toFixed(2)}`
            : item.pricing
            ? `€${item.pricing.glass?.toFixed(2) || item.pricing.bottle?.toFixed(2)}`
            : "varies";
          menuText += `- ${item.name} (${item.id}) - ${price}\n`;
        }
      }
    }
  }

  return menuText;
}

// Generate the CRITICAL flash sale info
function generateFlashSalesSection(flashItems: any[], soldOut: any[]): string {
  let section = `\n═══════════════════════════════════════════════════════════════
🔥🔥🔥 ACTIVE FLASH SALES - MENTION THESE FIRST! 🔥🔥🔥
═══════════════════════════════════════════════════════════════\n`;

  if (flashItems.length === 0) {
    section += `\nNo flash sales active right now. Regular prices apply.\n`;
  } else {
    section += `\n⚡ YOU HAVE ${flashItems.length} ITEMS ON SALE RIGHT NOW! ⚡\n`;
    section += `ALWAYS mention these deals when greeting customers or making suggestions!\n\n`;

    // Sort by discount (highest first)
    const sorted = [...flashItems].sort((a: any, b: any) => b.currentDiscount - a.currentDiscount);

    for (const item of sorted) {
      const savings = (item.regularPrice - item.finalPrice).toFixed(2);
      section += `🏷️ **${item.name}**\n`;
      section += `   Was: €${item.regularPrice.toFixed(2)} → NOW: €${item.finalPrice.toFixed(2)} (${item.currentDiscount}% OFF - Save €${savings}!)\n`;
      if (item.currentBucket === 'low') {
        section += `   ⚠️ LOW STOCK!\n`;
      }
      section += `\n`;
    }
  }

  if (soldOut.length > 0) {
    section += `\n❌ SOLD OUT - DO NOT OFFER:\n`;
    for (const item of soldOut) {
      section += `- ${item.name}\n`;
    }
  }

  section += `\n═══════════════════════════════════════════════════════════════\n`;

  return section;
}

function buildSystemPrompt(flashItems: any[], soldOut: any[]): string {
  const flashSales = generateFlashSalesSection(flashItems, soldOut);
  const menu = generateMenuKnowledge();

  return `You are a SALES-FOCUSED AI waiter for ${PowerSoftMenu.restaurant.name}.

YOUR #1 PRIORITY: PROMOTE FLASH SALE ITEMS!

${flashSales}

## YOUR BEHAVIOR - READ CAREFULLY:

1. **FIRST MESSAGE**: When a customer says hi/hello, IMMEDIATELY mention the flash sales:
   "Welcome! Great timing - we have some amazing deals right now! [list 2-3 top deals with prices]"

2. **RECOMMENDATIONS**: When asked for suggestions, ALWAYS lead with discounted items:
   "I'd recommend our [SALE ITEM] - it's X% off right now! Originally €X, now just €Y!"

3. **ANY FOOD QUESTION**: Work in the flash sales naturally:
   "Looking for [category]? Perfect! Our [SALE ITEM] is on special today..."

4. **BE SPECIFIC**: Always say the EXACT discount, original price, and sale price.

5. **CREATE URGENCY**: "This deal won't last!" / "Limited time!" / "While supplies last!"

## WHAT NOT TO DO:
- DON'T just say "check out our flash sales" vaguely
- DON'T recommend full-price items when a similar item is on sale
- DON'T forget to mention prices and savings amounts
- DON'T offer SOLD OUT items

## Cart Tools Available:
- add_to_cart: Add items (use SALE PRICE for discounted items!)
- remove_from_cart: Remove items
- clear_cart: Empty the cart
- get_cart: See cart contents
- send_order: Submit order (⚠️ ONLY after allergy check!)

## ⚠️⚠️⚠️ CRITICAL: ALLERGY CHECK REQUIRED ⚠️⚠️⚠️
Before calling send_order, you MUST:
1. Ask: "Before I send this order, do you have any food allergies or dietary restrictions I should know about?"
2. Wait for their response
3. If they have allergies, check their order items and WARN them about potential allergens
4. Only proceed with send_order AFTER they confirm it's safe

Common allergens to watch for:
- GLUTEN: bread, pasta, pancakes, crepes, toast, muffins
- DAIRY: cheese, yogurt, cream, milk, butter
- NUTS: almonds, walnuts, pistachios, hazelnuts, peanuts
- EGGS: omelets, pancakes, french toast, mayonnaise
- SEAFOOD: salmon, shrimp, octopus, fish, sea bass
- SOY: some sauces and vegan items

NEVER skip this step! Customer safety is more important than speed.

${menu}

REMEMBER: Your job is to SELL the flash sale items! Every response should naturally work in the current deals. Be enthusiastic about the savings!`;
}

const tools = [
  {
    type: "function",
    function: {
      name: "add_to_cart",
      description: "Add item to cart. IMPORTANT: Use the flash sale price if item is discounted!",
      parameters: {
        type: "object",
        properties: {
          item_id: { type: "string", description: "Menu item ID" },
          item_name: { type: "string", description: "Item name" },
          price: { type: "number", description: "Price (use SALE price if on sale!)" },
          quantity: { type: "number", description: "Quantity (default 1)" },
        },
        required: ["item_id", "item_name", "price"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "remove_from_cart",
      description: "Remove item from cart",
      parameters: {
        type: "object",
        properties: {
          item_id: { type: "string", description: "Item ID to remove" },
        },
        required: ["item_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "clear_cart",
      description: "Clear all items from cart",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_cart",
      description: "Get current cart contents",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "send_order",
      description: "Submit order to kitchen. CRITICAL: You MUST ask about allergies BEFORE calling this function! Never call this without first asking the customer about food allergies.",
      parameters: {
        type: "object",
        properties: {
          special_instructions: { type: "string", description: "Special requests" },
          allergy_check_confirmed: { type: "boolean", description: "Set to true ONLY if you asked about allergies and customer confirmed it's safe to proceed" },
        },
        required: ["allergy_check_confirmed"],
      },
    },
  },
];

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "OpenAI API key not configured" }, { status: 503 });
    }

    const { messages, cart } = await request.json();

    // Get the base URL from the request
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    // Fetch flash sales from the SAME API the menu uses!
    const { flashItems, soldOut } = await fetchFlashSales(baseUrl);

    // Build cart context
    let cartContext = "";
    if (cart && cart.length > 0) {
      const total = cart.reduce((sum: number, item: any) => {
        const price = item.finalPrice || item.price || 0;
        return sum + price * item.quantity;
      }, 0);
      cartContext = `\n\n[Cart: ${cart.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")} | Total: €${total.toFixed(2)}]`;
    } else {
      cartContext = "\n\n[Cart: Empty]";
    }

    // Generate system prompt with LIVE flash sale data
    const systemPrompt = buildSystemPrompt(flashItems, soldOut);

    console.log(`[Chat API] Flash sales found: ${flashItems.length}, Sold out: ${soldOut.length}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt + cartContext },
        ...messages,
      ],
      tools: tools as any,
      tool_choice: "auto",
      max_tokens: 500,
      temperature: 0.8,
    });

    const assistantMessage = response.choices[0].message;

    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolResults = assistantMessage.tool_calls
        .filter((tc): tc is OpenAI.Chat.Completions.ChatCompletionMessageToolCall & { function: { name: string; arguments: string } } => 'function' in tc)
        .map(toolCall => ({
          tool_call_id: toolCall.id,
          function_name: toolCall.function.name,
          arguments: JSON.parse(toolCall.function.arguments),
        }));

      return Response.json({
        message: assistantMessage.content,
        tool_calls: toolResults,
      });
    }

    return Response.json({
      message: assistantMessage.content,
      tool_calls: null,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}
