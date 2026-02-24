// src/app/api/github/route.test.ts
import { GET } from "./route";
import axios from "axios";
import { getServerSession } from "next-auth/next";

// Mock NextAuth session
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Provide a global Response for Node/Jest
(global as any).Response = class {
  status: number;
  body: any;
  constructor(body: any, init?: { status?: number }) {
    this.body = body;
    this.status = init?.status || 200;
  }
  async json() {
    return JSON.parse(this.body);
  }
};

describe("GitHub API route GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 if session is missing or has no accessToken", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const req = {} as Request;
    const res = await GET(req);

    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data).toEqual({ error: "Unauthorized" });
  });

  it("returns first 10 repos if session exists", async () => {
    // Mock session with accessToken
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      accessToken: "mock-token",
    });

    // Mock axios response
    mockedAxios.get.mockResolvedValueOnce({
      data: Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: `repo-${i + 1}` })),
    });

    const req = {} as Request;
    const res = await GET(req);

    const data = await res.json();
    expect(data).toHaveLength(10);
    expect(data[0]).toEqual({ id: 1, name: "repo-1" });

    // Axios called with correct headers
    expect(mockedAxios.get).toHaveBeenCalledWith("https://api.github.com/user/repos", {
      headers: { Authorization: "token mock-token" },
    });
  });
});