import axios from "axios";

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  created_at: string;
  updated_at: string;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function toGitHubRepo(raw: unknown): GitHubRepo | null {
  if (!raw || typeof raw !== "object") return null;

  const repo = raw as Record<string, unknown>;
  const owner = repo.owner as Record<string, unknown> | undefined;

  if (
    !isNumber(repo.id) ||
    !isString(repo.name) ||
    !(repo.description === null || isString(repo.description)) ||
    !owner ||
    !isString(owner.login) ||
    !isString(owner.avatar_url) ||
    !isString(repo.html_url) ||
    !isString(repo.created_at) ||
    !isString(repo.updated_at)
  ) {
    return null;
  }

  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    owner: {
      login: owner.login,
      avatar_url: owner.avatar_url,
    },
    html_url: repo.html_url,
    created_at: repo.created_at,
    updated_at: repo.updated_at,
  };
}

export async function fetchGitHubRepos(accessToken: string, limit: number): Promise<GitHubRepo[]> {
  const response = await axios.get("https://api.github.com/user/repos", {
    headers: { Authorization: `token ${accessToken}` },
    params: {
      per_page: Math.max(limit, 10),
      sort: "updated",
      direction: "desc",
    },
  });

  if (!Array.isArray(response.data)) {
    throw new Error("Unexpected GitHub API response format");
  }

  return response.data
    .map(toGitHubRepo)
    .filter((repo): repo is GitHubRepo => repo !== null)
    .slice(0, limit);
}
