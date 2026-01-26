import { analysisSchema } from "./schema.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function assertEnv() {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY in environment.");
}

export async function analyzeJournal({ languageHint, text, imageDataUrl }) {
  assertEnv();

  const system = `
You are a meticulous language tutor and proofreader.
Your job:
1) If an image is provided, transcribe it first (preserve line breaks).
2) Produce corrected_text (natural, fluent, but keep the author's meaning).
3) Identify grammar issues with precise character offsets into the ORIGINAL user text (the text you transcribed, or the typed input).
4) For Ukrainian: prioritize cases, verb aspect, tense, agreement, prepositions; be explicit (e.g., "genitive after negation", "instrumental after з/із").
5) Keep explanations intuitive, not academic—teach the rule, show how to notice it next time.
Return ONLY valid JSON matching the provided schema.
`.trim();

  const userInstruction = `
Language hint (may be wrong): ${languageHint || "unknown"}

If text is provided, analyze it.
If an image is provided, transcribe it accurately first, then analyze that transcription.
Be strict about offsets.
`.trim();

  const input = [];

  input.push({
    role: "system",
    content: [{ type: "input_text", text: system }]
  });

  // User content: include both text + image if available
  const userContent = [{ type: "input_text", text: userInstruction }];

  if (text && text.trim().length > 0) {
    userContent.push({
      type: "input_text",
      text: `USER_TEXT:\n${text}`
    });
  }

  if (imageDataUrl) {
    userContent.push({
      type: "input_image",
      image_url: imageDataUrl
    });
  }

  input.push({ role: "user", content: userContent });

  const body = {
    model: "gpt-4.1-mini", 
    input,
    // Structured Outputs:
    text: {
      format: {
        type: "json_schema",
        json_schema: analysisSchema
      }
    }
  };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${errText}`);
  }

  const data = await res.json();

  // Responses API typically returns output text in a content block; safest is to find the first json text.
  const outputText =
    data.output_text ||
    (data.output?.[0]?.content?.find?.(c => c.type === "output_text")?.text ?? null);

  if (!outputText) {
    throw new Error("No output_text found in OpenAI response.");
  }

  // outputText should already be JSON because of json_schema strict mode
  return JSON.parse(outputText);
}
