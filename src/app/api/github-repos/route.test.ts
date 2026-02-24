import { GET } from "./route";
import { getAccessTokenFromRequest } from "@/lib/auth-token";
import { fetchGitHubRepos } from "@/lib/repos";

jest.mock("@/lib/auth-token", () => ({
  getAccessTokenFromRequest: jest.fn(),
}));

jest.mock("@/lib/repos", () => ({
  fetchGitHubRepos: jest.fn(),
}));

describe("GitHub repos API route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when auth token is missing", async () => {
    (getAccessTokenFromRequest as jest.Mock).mockResolvedValue(null);

    const req = {} as unknown as Request;
    const res = await GET(req as never);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data).toEqual({ error: "Unauthorized" });
  });

  it("returns repos for authenticated requests", async () => {
    (getAccessTokenFromRequest as jest.Mock).mockResolvedValue("token-1");
    (fetchGitHubRepos as jest.Mock).mockResolvedValue([{ id: 1, name: "repo-1" }]);

    const req = {} as unknown as Request;
    const res = await GET(req as never);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual([{ id: 1, name: "repo-1" }]);
    expect(fetchGitHubRepos).toHaveBeenCalledWith("token-1", 10);
  });
});
