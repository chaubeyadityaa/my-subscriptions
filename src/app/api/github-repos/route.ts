import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromRequest } from "@/lib/auth-token";
import { fetchGitHubRepos } from "@/lib/repos";

export async function GET(req: NextRequest) {
  const accessToken = await getAccessTokenFromRequest(req);
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const repos = await fetchGitHubRepos(accessToken, 10);
    return NextResponse.json(repos);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      if (status === 401 || status === 403) {
        return NextResponse.json({ error: "GitHub authorization failed or expired." }, { status: 401 });
      }
      if (status === 429) {
        return NextResponse.json({ error: "GitHub rate limit reached. Try again shortly." }, { status: 429 });
      }
    }

    return NextResponse.json({ error: "Failed to fetch repositories." }, { status: 502 });
  }
}
