import { NextResponse } from "next/server";
import { summarizeText } from "@/lib/summarize";

interface SummarizeRequest {
  text: string;
}

function parseRequestBody(body: unknown): SummarizeRequest | null {
  if (!body || typeof body !== "object") return null;
  const candidate = body as Record<string, unknown>;
  if (typeof candidate.text !== "string") return null;

  return { text: candidate.text.trim() };
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const parsedBody = parseRequestBody(rawBody);

    if (!parsedBody) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const result = await summarizeText(parsedBody.text);
    return NextResponse.json(
      { summary: result.summary },
      { status: result.available ? 200 : 503 }
    );
  } catch {
    return NextResponse.json({ summary: "Summarization failed." }, { status: 500 });
  }
}
