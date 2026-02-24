"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { extractKeywords } from "@/lib/keywords";

interface Repo {
  id: number;
  name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  created_at: string;
  updated_at: string;
  summary?: string;
  keywords?: string[];
}

export default function ReposDashboard() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepos() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/github-repos");
        const reposData: Repo[] = res.data;

        const processedRepos = await Promise.all(
          reposData.map(async (repo) => {
            let summary = "";
            try {
              if (repo.description) {
                const sumRes = await axios.post("/api/summarize", { text: repo.description });
                summary = sumRes.data.summary;
              }
            } catch {
              summary = "Summary unavailable";
            }
            const keywords = extractKeywords(repo.description || "");
            return { ...repo, summary, keywords };
          })
        );

        setRepos(processedRepos);
      } catch {
        setError("Failed to fetch repositories.");
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  if (loading) return <p className="text-center text-gray-500 py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (repos.length === 0) return <p className="text-center text-gray-500 py-8">No repositories found.</p>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6">Your Repositories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition overflow-hidden break-words"
          >
            {/* Owner Info */}
            <div className="flex items-center mb-2">
              <img
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="font-semibold">{repo.owner.login}</span>
            </div>

            {/* Repo Name */}
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

            {/* Metadata */}
            <p className="mb-1 text-sm text-gray-600">
              Created: {new Date(repo.created_at).toLocaleDateString()} | Updated:{" "}
              {new Date(repo.updated_at).toLocaleDateString()}
            </p>

            {/* Description */}
            {repo.description && (
              <p className="mb-1">
                <span className="font-semibold">Description:</span> {repo.description}
              </p>
            )}

            {/* AI Summary */}
            {repo.summary && (
              <p className="mb-1">
                <span className="font-semibold">Summary:</span> {repo.summary}
              </p>
            )}

            {/* Keywords */}
            {repo.keywords && repo.keywords.length > 0 && (
              <p className="mb-1">
                <span className="font-semibold">Keywords:</span> {repo.keywords.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}