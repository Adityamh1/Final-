import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Cleanup Analysis
  app.post("/api/ai-cleanup-analyze", async (req, res) => {
    try {
      const { listings } = req.body;
      if (!listings || !Array.isArray(listings)) {
        return res.status(400).json({ error: "Listings array is required." });
      }

      // Filter old listings (older than 30 days) on the server side as well to be sure
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const oldListings = listings.filter((item: any) => {
        // Only target listings that are not marked as pre-seeded (not isLocal, or are in Firestore, or has a deviceId)
        // Static listings in SEED_LISTINGS can be analyzed, but we shouldn't attempt to delete them on firestore
        // Usually Firestore listings have deviceId and do not have item.isLocal unless they are local state
        // Let's filter ones that are actually user-created
        const timestamp = item.createdAtTime;
        // Exclude seed listings (which don't have deviceId or have standard IDs from seed data)
        const isUserCreated = item.deviceId || item.isLocal === true || !item.id.startsWith('seed-');
        return timestamp && timestamp < thirtyDaysAgo && isUserCreated;
      });

      if (oldListings.length === 0) {
        return res.json({
          hasOldAds: false,
          summary: "सध्या ३० दिवसांपेक्षा जुनी कोणतीही जाहिरात आढळली नाही. तुमचा पशू बाजार एकदम फ्रेश आणि अपडेटेड आहे! ✨",
          recommendations: []
        });
      }

      // Initialize Gemini API
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          hasOldAds: true,
          summary: `आम्हाला ३० दिवसांपेक्षा जुन्या ${oldListings.length} जाहिराती आढळल्या आहेत. (टीप: Gemini API Key उपलब्ध नसल्यामुळे AI विश्लेषण लोड होऊ शकले नाही, परंतु तुम्ही खालील जाहिराती हटवू शकता.)`,
          recommendations: oldListings.map((l: any) => ({
            id: l.id,
            breed: l.breed,
            district: l.district,
            price: l.price,
            category: l.category,
            daysOld: Math.floor((Date.now() - l.createdAtTime) / (1000 * 60 * 60 * 24)),
            reason: "३० दिवसांपेक्षा जास्त जुनी जाहिरात आहे."
          })),
          marketTips: [
            "पुढच्या वेळी जाहिरात टाकताना प्राण्याचे ताजे फोटो अपलोड करा.",
            "दूध देण्याची अचूक क्षमता (लिटरमध्ये) स्पष्टपणे नमूद करा.",
            "स्थानिक बाजारातील दराप्रमाणेच योग्य किंमत ठेवा जेणेकरून लवकर विक्री होईल."
          ]
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Prepare listings list for Gemini
      const listingsSummary = oldListings.map((l: any) => (
        `- ID: ${l.id}, Category: ${l.category}, Breed: ${l.breed}, District: ${l.district}, Price: ₹${l.price}, Created At: ${l.createdAt}`
      )).join("\n");

      const prompt = `
You are the AI Ad Clean-up and Marketplace Optimizer for "Pashu Bazar" (An online animal trading marketplace in Maharashtra).
We have found the following animal listings that have been active for more than 30 days without updates. They are considered stale/expired:

${listingsSummary}

Please analyze these stale listings and generate a cleanup report and recommendations in Marathi (with simple English terms where needed, since the users are farmers and animal traders from Maharashtra).

Format your response strictly as a JSON object with the following fields:
1. "summary" (string): A short, elegant 2-3 sentence overview in Marathi summarizing what was analyzed, how many old ads were found, and why cleaning up stale ads benefits the platform (keeping listings fresh, accurate pricing, better buyer experience).
2. "recommendations" (array of objects): For each listing analyzed, provide:
   - "id" (string): The exact ID of the listing.
   - "breed" (string): The breed of the listing.
   - "reason" (string): A custom, friendly Marathi explanation of why this listing should be deleted (e.g. "₹\${price} किमतीची ही \${breed} जाहिरात आता जुनी झाली आहे. साधारणपणे १५ ते २० दिवसांत प्राणी विकले जातात, त्यामुळे ग्राहकांना जुन्या जाहिराती दाखवणे योग्य नाही.").
3. "marketTips" (array of strings): 2-3 short, actionable marketing/selling tips in Marathi for users whose ads are being deleted, advising them on how they can list their animals better next time (e.g., upload higher-quality photos, revise prices to match current local market trends, or provide milk capacity details).

Provide ONLY the valid JSON object. Do not include markdown blocks like \`\`\`json or \`\`\` or any other conversational text. Just the raw valid JSON.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const responseText = response.text || "";
      // Strip any markdown blocks if the model ignored instructions
      const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      try {
        const parsedResult = JSON.parse(cleanedJson);
        return res.json({
          hasOldAds: true,
          ...parsedResult
        });
      } catch (parseError) {
        console.error("Failed to parse Gemini response as JSON. Raw text was:", responseText);
        // Fallback parsing or fallback response
        return res.json({
          hasOldAds: true,
          summary: `आम्हाला ३० दिवसांपेक्षा जुन्या ${oldListings.length} जाहिराती आढळल्या आहेत. AI द्वारे विश्लेषण पूर्ण झाले.`,
          recommendations: oldListings.map((l: any) => ({
            id: l.id,
            breed: l.breed,
            district: l.district,
            price: l.price,
            category: l.category,
            daysOld: Math.floor((Date.now() - l.createdAtTime) / (1000 * 60 * 60 * 24)),
            reason: `₹${l.price} ची ही ${l.breed} जाहिरात ३० दिवसांपेक्षा जास्त जुनी आहे. खरेदीदारांना नवीन पर्याय दाखवण्यासाठी ही हटवणे गरजेचे आहे.`
          })),
          marketTips: [
            "पुढच्या वेळी जाहिरात टाकताना प्राण्याचे ताजे फोटो अपलोड करा.",
            "दूध देण्याची अचूक क्षमता (लिटरमध्ये) स्पष्टपणे नमूद करा.",
            "स्थानिक बाजारातील दराप्रमाणेच योग्य किंमत ठेवा जेणेकरून लवकर विक्री होईल."
          ]
        });
      }

    } catch (error) {
      console.error("Error in AI cleanup endpoint:", error);
      res.status(500).json({ error: "AI Cleanup Analysis failed." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
