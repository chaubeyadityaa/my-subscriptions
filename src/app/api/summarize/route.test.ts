import { POST } from "./route";
import { summarizeText } from "@/lib/summarize";

jest.mock("@/lib/summarize", () => ({
  summarizeText: jest.fn(),
}));

describe("Summarize API route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 for invalid request body", async () => {
    const request = { json: async () => ({}) } as unknown as Request;

    const res = await POST(request);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ error: "Invalid request body." });
  });

  it("returns summary for valid text", async () => {
    (summarizeText as jest.Mock).mockResolvedValue({
      summary: "Concise summary",
      available: true,
    });

    const request = {
      json: async () => ({ text: "This is a long enough repository description for summarization." }),
    } as unknown as Request;

    const res = await POST(request);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.summary).toBe("Concise summary");
  });

  it("returns 503 when AI is unavailable", async () => {
    (summarizeText as jest.Mock).mockResolvedValue({
      summary: "AI temporarily unavailable.",
      available: false,
    });

    const request = {
      json: async () => ({ text: "This is another long enough text for summarization API route." }),
    } as unknown as Request;

    const res = await POST(request);

    expect(res.status).toBe(503);
  });
});
