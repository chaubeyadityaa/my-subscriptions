import axios from "axios";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromRequest } from "@/lib/auth-token";
import { TTLCache } from "@/lib/cache";
import { extractKeywords } from "@/lib/keywords";
import { fetchGitHubRepos, GitHubRepo } from "@/lib/repos";
import { summarizeText } from "@/lib/summarize";

interface RepoInsight extends GitHubRepo {
  summary: string;
  keywords: string[];
  summaryStatus: "ok" | "fallback";
}

const reposCache = new TTLCache<GitHubRepo[]>(60_000);
const summaryCache = new TTLCache<{ summary: string; status: "ok" | "fallback" }>(10 * 60_000);

function hash(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const current = cursor;
      cursor += 1;
      results[current] = await mapper(items[current], current);
    }
  });

  await Promise.all(workers);
  return results;
}

async function getSummaryForRepo(description: string | null): Promise<{ summary: string; status: "ok" | "fallback" }> {
  if (!description || description.trim().length === 0) {
    return { summary: "No description to summarize.", status: "fallback" };
  }

  const cacheKey = hash(description);
  const cached = summaryCache.get(cacheKey);
  if (cached) return cached;

  const result = await summarizeText(description);
  const normalized = {
    summary: result.summary,
    status: result.available ? "ok" : "fallback",
  } as const;

  summaryCache.set(cacheKey, normalized);
  return normalized;
}

export async function GET(req: NextRequest) {
  const accessToken = await getAccessTokenFromRequest(req);
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cacheKey = hash(accessToken);

  try {
    const repos = reposCache.get(cacheKey) ?? (await fetchGitHubRepos(accessToken, 10));
    reposCache.set(cacheKey, repos);

    const insights = await mapWithConcurrency(repos, 3, async (repo) => {
      const summaryResult = await getSummaryForRepo(repo.description);
      return {
        ...repo,
        summary: summaryResult.summary,
        summaryStatus: summaryResult.status,
        keywords: extractKeywords(repo.description || ""),
      } as RepoInsight;
    });

    return NextResponse.json(insights);
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

    return NextResponse.json({ error: "Unable to build repository insights." }, { status: 502 });
  }
}
