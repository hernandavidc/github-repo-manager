"use client"

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { RepoFav } from "@/types/repos";

export default function Favorites() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<RepoFav[]>([]);

  useEffect(() => {
    if (session) {
      fetch("/api/favorites")
        .then(res => res.json())
        .then(data => setFavorites(data));
    }
  }, [session]);

  if (!session) return <p className="text-center">Not authenticated</p>;

  return (
    <div className="p-6 pt-40 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Your Favorite Repositories</h1>
        <div className="my-4 flex flex-row gap-2">
            <a href="/profile" className="bg-blue-500 text-white p-2 rounded text-center">
                Profile
            </a>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="bg-red-500 text-white p-2 rounded">
                Logout
            </button>
        </div>
        {favorites.length === 0 ? (
            <p>No favorite repositories yet.</p>
        ) : (
            <ul className="space-y-3">
            {favorites.map(repo => (
                <li key={repo.repoId} className="border-b py-2 flex justify-between">
                    <a href={repo.repoUrl} target="_blank" className="text-blue-500">{repo.repoName}</a>
                    <span className="text-gray-400">⭐</span>
                </li>
            ))}
            </ul>
        )}
    </div>
  );
}
