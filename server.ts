import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { LUXURY_PROPERTIES } from "./src/data/properties";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for telemetry
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return a mock or handle gracefully
    console.warn("WARNING: GEMINI_API_KEY is not configured or using default placeholder. AI responses will be elegant luxury fallbacks.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Elegant fallback generator if API key is missing
const generateFallbackResponse = (message: string) => {
  const lowercaseMsg = message.toLowerCase();
  
  if (lowercaseMsg.includes("vancouver") || lowercaseMsg.includes("harbour") || lowercaseMsg.includes("coal")) {
    return {
      reply: "Welcome to Maison d'Or. Based on your request for Vancouver's premium properties, I highly recommend our Harbourfront Luminary Residence. Located directly near Vancouver Harbour, this 2-bedroom executive suite has an elegant marina view, fine marble finishes, and fits perfectly within your budget at $3,950/month. Shall I schedule an exclusive private showing for you?",
      filters: {
        city: "Vancouver",
        type: "Condo",
        minPrice: 0,
        maxPrice: 4500,
        bedrooms: 2,
        amenities: ["Waterfront"]
      }
    };
  } else if (lowercaseMsg.includes("toronto") || lowercaseMsg.includes("yorkville") || lowercaseMsg.includes("bloor")) {
    return {
      reply: "Bonjour. For Toronto's premier high-end standard, I would suggest the Bloor-West Imperial Penthouse or the Yorkville Gilded Conservatory Loft. Yorkville features our absolute best bespoke shopping and culinary options. Our luxury conservatory loft at $5,200/month features sublime design pairings that suite your corporate lifestyle. May I assist in making a booking?",
      filters: {
        city: "Toronto",
        type: "Loft",
        minPrice: 0,
        maxPrice: 8000,
        bedrooms: 1,
        amenities: ["Skyline View"]
      }
    };
  } else {
    return {
      reply: "Good day to you. Welcome to Maison d'Or, where Vancouver and Toronto's finest modular accommodations are tailored to our elite residents. Whether you are an international executive, a creative director, or seeking a spacious private penthouse, our portfolio ranges from $3,950 to $16,500/month with fully-furnished prestige appointments. Please tell me more about your desired location, budget, or preferred amenities (such as a Private Pool or Waterfront access).",
      filters: {
        city: "all",
        type: "all",
        minPrice: 0,
        maxPrice: 20000,
        bedrooms: "all",
        amenities: []
      }
    };
  }
};

// AI Concierge Chat Endpoint
app.post("/api/concierge", async (req, res) => {
  const { message, chatHistory } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // If no key, return beautiful mock luxury output
    const fallback = generateFallbackResponse(message);
    return res.json(fallback);
  }

  try {
    const formattedHistory = (chatHistory || [])
      .map((msg: any) => `${msg.sender === "user" ? "Client" : "Concierge"}: ${msg.text}`)
      .join("\n");

    const prompt = `
      You are the AI Rental Concierge for "Maison d'Or" (Golden House), an ultra-luxury real estate platform with high-end fully furnished listings in Vancouver and Toronto.
      Your voice is extremely professional, highly refined, elegant, elite, and welcoming. Do not use slang, excessive exclamation marks, or casual tone. Provide bespoke advice suitable for luxury travelers and international executives.

      Here is the complete registry of available luxury properties at Maison d'Or:
      ${JSON.stringify(LUXURY_PROPERTIES, null, 2)}

      And here is our active conversation history for context:
      ${formattedHistory}

      Current client query: "${message}"

      Generate a structured JSON output with two keys:
      1. "reply": A beautifully crafted, detailed response indicating which properties fit best or clarifying their luxury lifestyle wants. (Always refer to specific listings by name, like "The Sovereign Harbour Penthouse" or "Harbourfront Luminary Residence", and explain why they suit the user.)
      2. "filters": Precise filter adjustments matching their inputs. You MUST infer these fields from their prompt:
         - "city": "Vancouver" | "Toronto" | "all" (Default is "all" if not mentioned or both)
         - "type": "Condo" | "Penthouse" | "Loft" | "Townhouse" | "all" (Default is "all")
         - "minPrice": number (Default is 0)
         - "maxPrice": number (Default is 25000 if not specified. If they say "under $4000", maxPrice should be 4000)
         - "bedrooms": number or "all" (Default is "all". If they ask for 2-bedroom, set this to 2)
         - "amenities": array of strings containing any relevant matching amenities (exact strings from: "Waterfront", "Skyline View", "Private Pool", "Valet Parking", "24/7 Concierge", "Fireplace", "Double-Height Ceilings", "Smart Home Tech", "Rooftop Garden", "Private Garage", "Personal Sauna"). Choose ONLY matching amenities mentioned, e.g. "by the water" -> ["Waterfront"].
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["reply", "filters"],
          properties: {
            reply: {
              type: Type.STRING,
              description: "Elegant, customized response emphasizing elite luxury properties aligning with criteria."
            },
            filters: {
              type: Type.OBJECT,
              required: ["city", "type", "minPrice", "maxPrice", "bedrooms", "amenities"],
              properties: {
                city: {
                  type: Type.STRING,
                  enum: ["Vancouver", "Toronto", "all"],
                  description: "Derived city choice."
                },
                type: {
                  type: Type.STRING,
                  enum: ["Condo", "Penthouse", "Loft", "Townhouse", "all"],
                  description: "Property type."
                },
                minPrice: {
                  type: Type.INTEGER,
                  description: "Minimum monthly budget."
                },
                maxPrice: {
                  type: Type.INTEGER,
                  description: "Maximum monthly budget."
                },
                bedrooms: {
                  type: Type.STRING, // Since we need to support either string "all" or specific number parsed as string
                  description: "Number of bedrooms requested (e.g. '1', '2', '3', '4' or 'all')."
                },
                amenities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Extracted required luxury amenities."
                }
              }
            }
          }
        }
      }
    });

    const textOutput = response.text?.trim() || "";
    const parsedData = JSON.parse(textOutput);
    
    // Normalize bedrooms if returned as number or string representing number
    if (parsedData.filters && parsedData.filters.bedrooms !== "all") {
      const parsedBedrooms = parseInt(parsedData.filters.bedrooms, 10);
      parsedData.filters.bedrooms = isNaN(parsedBedrooms) ? "all" : parsedBedrooms;
    }

    res.json(parsedData);
  } catch (error) {
    console.error("Gemini Concierge parsing error:", error);
    // Graceful fallback response on error
    const fallback = generateFallbackResponse(message);
    res.json(fallback);
  }
});

// Setup development or production build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Maison d'Or Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
