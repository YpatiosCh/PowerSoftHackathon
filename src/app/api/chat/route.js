import OpenAI from "openai";
import { PowerSoftMenu } from "@/menu/menu";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate menu knowledge for the AI
function generateMenuKnowledge() {
  let menuText = `# ${PowerSoftMenu.restaurant.name} Menu\n\n`;

  for (const category of PowerSoftMenu.categories) {
    menuText += `## ${category.name}\n`;
    if (category.note) {
      menuText += `Note: ${category.note}\n`;
    }

    if (category.items) {
      for (const item of category.items) {
        const price = item.price
          ? `€${item.price.toFixed(2)}`
          : item.pricing
          ? `Glass: €${item.pricing.glass?.toFixed(2) || "N/A"}, Bottle: €${item.pricing.bottle?.toFixed(2) || "N/A"}`
          : "Price varies";

        menuText += `- **${item.name}** (ID: ${item.id}) - ${price}\n`;
        if (item.description) {
          menuText += `  Ingredients: ${item.description}\n`;
        }
        if (item.tags && item.tags.length > 0) {
          menuText += `  Tags: ${item.tags.join(", ")}\n`;
        }
        if (item.addons && item.addons.length > 0) {
          menuText += `  Add-ons: ${item.addons.map((a) => `${a.name} (+€${a.price.toFixed(2)})`).join(", ")}\n`;
        }

        // Estimate prep time based on category and complexity
        let prepTime = "5-10 min";
        if (category.id === "breakfast-brunch") prepTime = "10-15 min";
        if (category.id === "salads") prepTime = "8-12 min";
        if (category.id === "lunch-light-dinner") prepTime = "15-25 min";
        if (category.id === "desserts") prepTime = "5-8 min";
        if (category.id === "coffee" || category.id === "not-coffee") prepTime = "3-5 min";
        if (category.id === "smoothies") prepTime = "5-7 min";
        if (item.name.toLowerCase().includes("soup")) prepTime = "5 min (pre-made)";
        if (item.name.toLowerCase().includes("steak") || item.name.toLowerCase().includes("fillet")) prepTime = "20-30 min";

        menuText += `  Estimated prep time: ${prepTime}\n`;
      }
    }

    if (category.subcategories) {
      for (const sub of category.subcategories) {
        menuText += `### ${sub.name}\n`;
        for (const item of sub.items) {
          const price = item.price
            ? `€${item.price.toFixed(2)}`
            : item.pricing
            ? `Glass: €${item.pricing.glass?.toFixed(2) || "N/A"}, Bottle: €${item.pricing.bottle?.toFixed(2) || "N/A"}`
            : "Price varies";

          menuText += `- **${item.name}** (ID: ${item.id}) - ${price}\n`;
          if (item.description) {
            menuText += `  Description: ${item.description}\n`;
          }
        }
      }
    }

    menuText += "\n";
  }

  return menuText;
}

const SYSTEM_PROMPT = `You are a friendly and professional AI waiter for ${PowerSoftMenu.restaurant.name}. Your role is to help customers with the menu, make recommendations, and assist with their orders.

## Your Personality
- Warm, welcoming, and professional
- Knowledgeable about food and ingredients
- Helpful and attentive to customer needs
- Concise but informative responses

## Rules
1. ONLY answer questions related to the menu, food, drinks, and ordering. Politely redirect off-topic questions.
2. Know every dish, its ingredients, dietary tags (vegan, gluten-free), and estimated preparation time.
3. Make personalized suggestions based on customer needs:
   - Post-workout: High protein options (eggs, chicken, salmon, quinoa bowls)
   - Light meal: Salads, soups, yogurt bowls
   - Indulgent: Pancakes, French toast, desserts
   - Quick bite: Coffee, smoothies, simple toasts
   - Healthy: Vegan options, gluten-free items, fresh salads

## IMPORTANT: Before finalizing any order, you MUST:
1. Ask if the customer has any allergies or food intolerances
2. If they do, scan their order for potential allergens
3. Warn them about any items containing their allergens
4. Suggest safe alternatives

## Common Allergens to Watch For:
- Gluten: bread, pasta, pancakes, crepes (suggest gluten-free alternatives)
- Dairy: cheese, yogurt, cream, milk (suggest vegan alternatives with coconut/almond/oat milk)
- Nuts: almonds, walnuts, pistachios, hazelnuts, peanuts
- Eggs: omelets, pancakes, french toast, mayonnaise
- Seafood: salmon, shrimp, octopus, fish
- Soy: some sauces and vegan items

## Cart Management
You can help customers manage their cart using the available tools:
- Add items to cart
- Update quantities
- Remove items
- View current cart
- Send/submit the order

When adding items, always confirm what you're adding and the price.

## Menu Knowledge
${generateMenuKnowledge()}

Remember: Be helpful, be safe with allergies, and make the dining experience enjoyable!`;

// Tools for cart manipulation
const tools = [
  {
    type: "function",
    function: {
      name: "add_to_cart",
      description: "Add an item to the customer's cart",
      parameters: {
        type: "object",
        properties: {
          item_id: {
            type: "string",
            description: "The unique ID of the menu item",
          },
          item_name: {
            type: "string",
            description: "The name of the item",
          },
          price: {
            type: "number",
            description: "The price of the item",
          },
          quantity: {
            type: "number",
            description: "How many to add (default 1)",
          },
        },
        required: ["item_id", "item_name", "price"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "remove_from_cart",
      description: "Remove an item from the cart or reduce its quantity",
      parameters: {
        type: "object",
        properties: {
          item_id: {
            type: "string",
            description: "The unique ID of the menu item to remove",
          },
          quantity: {
            type: "number",
            description: "How many to remove (if not specified, removes all)",
          },
        },
        required: ["item_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "clear_cart",
      description: "Clear all items from the cart",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_cart",
      description: "Get the current cart contents and total",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "send_order",
      description: "Submit the order to the kitchen. Only call this after confirming allergies and the customer approves.",
      parameters: {
        type: "object",
        properties: {
          special_instructions: {
            type: "string",
            description: "Any special instructions for the order",
          },
        },
      },
    },
  },
];

export async function POST(request) {
  try {
    const { messages, cart } = await request.json();

    // Add cart context to the conversation
    let cartContext = "";
    if (cart && cart.length > 0) {
      const total = cart.reduce((sum, item) => {
        const price = item.price || item.pricing?.bottle || item.pricing?.glass || 0;
        return sum + price * item.quantity;
      }, 0);
      cartContext = `\n\n[Current Cart: ${cart.map((i) => `${i.quantity}x ${i.name}`).join(", ")} | Total: €${total.toFixed(2)}]`;
    } else {
      cartContext = "\n\n[Current Cart: Empty]";
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + cartContext },
        ...messages,
      ],
      tools: tools,
      tool_choice: "auto",
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0].message;

    // Check if the model wants to call tools
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolResults = [];

      for (const toolCall of assistantMessage.tool_calls) {
        const args = JSON.parse(toolCall.function.arguments);
        toolResults.push({
          tool_call_id: toolCall.id,
          function_name: toolCall.function.name,
          arguments: args,
        });
      }

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
    return Response.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
