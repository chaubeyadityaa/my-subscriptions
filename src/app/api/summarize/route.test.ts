// src/app/api/summarize/route.test.ts
import { POST } from "./route";

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: (data: any) => ({ json: async () => data }),
  },
}));

describe("Summarize API route", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("returns a summary for posted text", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => [{ generated_text: "This is a long text summary." }],
    });

    // Minimal mock Request object
    const request = { json: async () => ({ text: "This is a long text to summarize." }) } as any;

    const res = await POST(request);
    const data = await res.json();

    expect(data.summary).toContain("This is a long text");
  });
});