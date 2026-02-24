const MIN_SUMMARY_LENGTH = 30;

function parseGeneratedText(payload: unknown): string | null {
  if (!Array.isArray(payload) || payload.length === 0) return null;
  const first = payload[0];
  if (!first || typeof first !== "object") return null;

  const text = (first as Record<string, unknown>).generated_text;
  return typeof text === "string" ? text.trim() : null;
}

export async function summarizeText(text: string): Promise<{ summary: string; available: boolean }> {
  const normalized = text.trim();

  if (normalized.length < MIN_SUMMARY_LENGTH) {
    return { summary: "Text too short to summarize.", available: true };
  }

  if (!process.env.HUGGINGFACE_API_KEY) {
    return { summary: "AI temporarily unavailable.", available: false };
  }

  const response = await fetch("https://router.huggingface.co/hf-inference/models/google/flan-t5-base", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: `Summarize the following text:\n\n${normalized}`,
      parameters: {
        max_new_tokens: 120,
      },
    }),
  });

  if (!response.ok) {
    return { summary: "AI temporarily unavailable.", available: false };
  }

  const data = await response.json();
  const generatedText = parseGeneratedText(data);

  return {
    summary: generatedText || "No summary available.",
    available: true,
  };
}
