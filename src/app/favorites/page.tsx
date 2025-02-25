"use client"

import { signOut, useSession } from "next-auth/react";
import { useFavorites } from "@/hooks/useFavorites";

export default function Favorites() {
  const { data: session } = useSession();
  const { favorites, toggleFavorite } = useFavorites();

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
                    <button onClick={() => toggleFavorite(repo.repoId, repo.repoName, repo.repoUrl)} className="text-gray-500 hover:text-red-500">
                        ❤️
                    </button>
                </li>
            ))}
            </ul>
        )}
    </div>
  );
}
