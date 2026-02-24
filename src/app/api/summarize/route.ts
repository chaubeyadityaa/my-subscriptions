import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.length < 30) {
      return NextResponse.json({
        summary: "Text too short to summarize.",
      });
    }

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Summarize the following text:\n\n${text}`,
          parameters: {
            max_new_tokens: 120,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("HF Router Error:", data.error);
      return NextResponse.json({
        summary: "AI temporarily unavailable.",
      });
    }

    return NextResponse.json({
      summary: data[0]?.generated_text || "No summary available.",
    });

  } catch (error) {
    console.error("Summarization failed:", error);
    return NextResponse.json(
      { summary: "Summarization failed." },
      { status: 500 }
    );
  }
}