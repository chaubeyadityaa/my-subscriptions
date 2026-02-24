import { GET } from "./route";
import { getAccessTokenFromRequest } from "@/lib/auth-token";
import { fetchGitHubRepos } from "@/lib/repos";
import { summarizeText } from "@/lib/summarize";

jest.mock("@/lib/auth-token", () => ({
  getAccessTokenFromRequest: jest.fn(),
}));

jest.mock("@/lib/repos", () => ({
  fetchGitHubRepos: jest.fn(),
}));

jest.mock("@/lib/keywords", () => ({
  extractKeywords: () => ["typescript", "nextjs"],
}));

jest.mock("@/lib/summarize", () => ({
  summarizeText: jest.fn(),
}));

describe("Repo insights API route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when auth token is missing", async () => {
    (getAccessTokenFromRequest as jest.Mock).mockResolvedValue(null);

    const res = await GET({} as never);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data).toEqual({ error: "Unauthorized" });
  });

  it("returns enriched repo insights", async () => {
    (getAccessTokenFromRequest as jest.Mock).mockResolvedValue("token-1");
    (fetchGitHubRepos as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: "repo-1",
        description: "This repository contains a production-ready Next.js example application.",
        owner: { login: "user1", avatar_url: "https://avatars.githubusercontent.com/u/1?v=4" },
        html_url: "https://github.com/user1/repo-1",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-02T00:00:00Z",
      },
    ]);
    (summarizeText as jest.Mock).mockResolvedValue({ summary: "Generated summary", available: true });

    const res = await GET({} as never);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].summary).toBe("Generated summary");
    expect(data[0].summaryStatus).toBe("ok");
    expect(data[0].keywords).toEqual(["typescript", "nextjs"]);
  });
});
