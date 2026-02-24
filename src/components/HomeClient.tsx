"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import ReposDashboard from "./ReposDashboard";

export default function HomeClient() {
  const { data: session } = useSession();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {!session ? (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => signIn("github")}
        >
          Sign In with GitHub
        </button>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Welcome {session.user?.name}</h2>
          <button
            className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
          <ReposDashboard />
        </>
      )}
    </div>
  );
}
