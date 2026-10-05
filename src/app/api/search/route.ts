import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { GroqOutput } from "@/types";
import { matchPhotos } from "@/lib/matcher";

// 9.13 Validate GROQ_API_KEY at module load
if (!process.env.GROQ_API_KEY) {
  console.error("CRITICAL ERROR: GROQ_API_KEY is not set in environment variables.");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });

const SYSTEM_PROMPT = `You are the query translation engine for a photo retrieval system.
Translate the user's fragmented memory (conversational text + structured clues) into a JSON search query.

RULES:
1. Expand vague temporal terms (e.g., "Summer 2022" -> "2022-06-01 to 2022-08-31").
2. Translate abstract activities into concrete visual realities (e.g., "eating something messy" -> "food, dirty, eating").
3. If a variable is missing, output null.

OUTPUT FORMAT (Valid JSON only):
{
  "metadata_filters": {
    "people": ["array of strings"],
    "location_inference": ["array of strings"]
  },
  "semantic_search_string": "comma-separated string combining visual details and actions"
}`;

export type SearchRequest = {
  conversational_text: string;
  clues: {
    person: string | null;
    timeframe: string | null;
    visual_detail: string | null;
  };
};

async function translateMemory(body: SearchRequest): Promise<GroqOutput> {
  const userMessage = JSON.stringify({
    conversational_text: body.conversational_text,
    clues: body.clues,
  });

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      model: "openai/gpt-oss-20b",
      response_format: { type: "json_object" },
    }, {
      // 9.15 Set AbortSignal.timeout(10_000) on the Groq SDK call
      timeout: 10000 
    });

    const content = completion.choices[0]?.message?.content || "{}";
    
    // 9.16 Wrap Groq JSON parsing in try/catch
    try {
      const parsed = JSON.parse(content) as GroqOutput;
      
      // 9.17 Apply defensive defaults
      parsed.metadata_filters = parsed.metadata_filters || { people: [], location_inference: [] };
      parsed.metadata_filters.people = parsed.metadata_filters.people || [];
      parsed.metadata_filters.location_inference = parsed.metadata_filters.location_inference || [];
      parsed.semantic_search_string = parsed.semantic_search_string || "";
      
      return parsed;
    } catch (parseError) {
      throw new Error("502: Failed to parse LLM output");
    }
  } catch (error: any) {
    // 9.14 Catch Groq 429 rate-limit errors
    if (error?.status === 429) {
      throw new Error("429: Too many searches — please wait");
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check key again at request time to give a nice 503 response if missing
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Server configuration error: Missing API Key" }, { status: 503 });
    }

    const body: SearchRequest = await req.json();

    if (!body.conversational_text && !body.clues.person && !body.clues.timeframe && !body.clues.visual_detail) {
      return NextResponse.json(
        { error: "Search query cannot be completely empty" },
        { status: 400 }
      );
    }

    const groqOutput = await translateMemory(body);

    let queryEmbedding: number[] | undefined = undefined;
    if (groqOutput.semantic_search_string) {
      try {
        const { pipeline } = await import("@xenova/transformers");
        const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        const output = await extractor(groqOutput.semantic_search_string, { pooling: 'mean', normalize: true });
        queryEmbedding = Array.from(output.data);
      } catch (err) {
        console.error("Embedding generation failed, falling back to keywords:", err);
      }
    }

    const results = matchPhotos(groqOutput, queryEmbedding);

    return NextResponse.json(results);
  } catch (error: any) {
    const msg = error.message || "";
    if (msg.includes("429:")) {
      return NextResponse.json({ error: msg.replace("429: ", "") }, { status: 429 });
    }
    if (msg.includes("502:")) {
      return NextResponse.json({ error: msg.replace("502: ", "") }, { status: 502 });
    }
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
