"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { extractKeywords } from "@/lib/keywords";

interface Repo {
  id: number;
  name: string;
  description: string;
  summary?: string;
  keywords?: string[];
}

export default function ReposDashboard() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRepos() {
      setLoading(true);
      const res = await axios.get("/api/github-repos");
      const reposData = res.data;

      const processedRepos = await Promise.all(
        reposData.map(async (repo: Repo) => {
          let summary = "";
          if (repo.description) {
            const sumRes = await axios.post("/api/summarize", { text: repo.description });
            summary = sumRes.data.summary;
          }
          const keywords = extractKeywords(repo.description || "");
          return { ...repo, summary, keywords };
        })
      );

      setRepos(processedRepos);
      setLoading(false);
    }

    fetchRepos();
  }, []);

  if (loading) return <p className="text-center text-gray-500 py-8">Loading...</p>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Your Repositories</h2>
      <div className="space-y-4">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-bold mb-1">{repo.name}</h3>
            <p className="mb-1"><span className="font-semibold">Description:</span> {repo.description}</p>
            <p className="mb-1"><span className="font-semibold">Summary:</span> {repo.summary}</p>
            <p className="mb-1"><span className="font-semibold">Keywords:</span> {repo.keywords?.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}