export const analysisSchema = {
  name: "journal_grammar_analysis",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      detected_language: { type: "string" },
      overall_feedback: { type: "string" },
      corrected_text: { type: "string" },
      issues: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            type: {
              type: "string",
              enum: [
                "case",
                "tense",
                "aspect",
                "agreement",
                "word_order",
                "preposition",
                "spelling",
                "punctuation",
                "style",
                "other"
              ]
            },
            severity: { type: "string", enum: ["low", "medium", "high"] },

            // Offsets refer to the user's ORIGINAL input text (after OCR if photo).
            start: { type: "integer", minimum: 0 },
            end: { type: "integer", minimum: 0 },

            original_snippet: { type: "string" },
            suggested_fix: { type: "string" },

            explanation: { type: "string" },

            // Very useful for Ukrainian:
            grammar_tags: {
              type: "array",
              items: { type: "string" }
            },

            mini_lesson: { type: "string" },

            // Optional: 1-3 short examples (correct usage)
            examples: {
              type: "array",
              items: { type: "string" },
              maxItems: 3
            }
          },
          required: [
            "id",
            "type",
            "severity",
            "start",
            "end",
            "original_snippet",
            "suggested_fix",
            "explanation",
            "grammar_tags",
            "mini_lesson",
            "examples"
          ]
        }
      }
    },
    required: ["detected_language", "overall_feedback", "corrected_text", "issues"]
  }
};
