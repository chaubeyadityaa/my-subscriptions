"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

interface RepoInsight {
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
  summary: string;
  keywords: string[];
  summaryStatus: "ok" | "fallback";
}

type SortOption = "updated-desc" | "created-desc" | "name-asc";

function sortRepos(items: RepoInsight[], sortBy: SortOption): RepoInsight[] {
  const next = [...items];

  if (sortBy === "name-asc") {
    next.sort((a, b) => a.name.localeCompare(b.name));
    return next;
  }

  if (sortBy === "created-desc") {
    next.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    return next;
  }

  next.sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));
  return next;
}

export default function ReposDashboard() {
  const [repos, setRepos] = useState<RepoInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated-desc");

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<RepoInsight[]>("/api/repo-insights");
      setRepos(response.data);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const status = requestError.response?.status;
        if (status === 401) {
          setError("Session expired. Sign in again.");
        } else if (status === 429) {
          setError("Rate limit reached. Retry in a moment.");
        } else {
          setError("Failed to load repository insights.");
        }
      } else {
        setError("Failed to load repository insights.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInsights();
  }, [fetchInsights]);

  const filteredAndSorted = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const filtered = normalized
      ? repos.filter((repo) => {
          const combined = `${repo.name} ${repo.description || ""} ${repo.owner.login}`.toLowerCase();
          return combined.includes(normalized);
        })
      : repos;

    return sortRepos(filtered, sortBy);
  }, [repos, search, sortBy]);

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Your Repositories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="loading-skeletons">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow animate-pulse">
              <div className="h-4 w-2/3 bg-slate-200 rounded mb-3" />
              <div className="h-3 w-full bg-slate-200 rounded mb-2" />
              <div className="h-3 w-4/5 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-3/5 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-3">{error}</p>
        <button
          className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-700 transition"
          onClick={() => void fetchInsights()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Your Repositories</h2>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search repos"
            className="w-full sm:w-56 rounded border border-slate-300 px-3 py-2 text-sm"
            aria-label="Search repositories"
          />
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            aria-label="Sort repositories"
          >
            <option value="updated-desc">Last updated</option>
            <option value="created-desc">Newest created</option>
            <option value="name-asc">Name A-Z</option>
          </select>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No repositories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.map((repo) => (
            <div
              key={repo.id}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition overflow-hidden break-words"
            >
              <div className="flex items-center mb-2">
                <Image
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="font-semibold">{repo.owner.login}</span>
              </div>

              <h3 className="text-lg font-bold mb-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {repo.name}
                </a>
              </h3>

              <p className="mb-1 text-sm text-gray-600">
                Created: {new Date(repo.created_at).toLocaleDateString()} | Updated: {" "}
                {new Date(repo.updated_at).toLocaleDateString()}
              </p>

              {repo.description && (
                <p className="mb-1">
                  <span className="font-semibold">Description:</span> {repo.description}
                </p>
              )}

              <p className="mb-1">
                <span className="font-semibold">Summary:</span> {repo.summary}
              </p>

              {repo.summaryStatus === "fallback" && (
                <p className="mb-1 text-xs text-amber-700">Summary generated from fallback mode.</p>
              )}

              {repo.keywords.length > 0 && (
                <p className="mb-1">
                  <span className="font-semibold">Keywords:</span> {repo.keywords.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
