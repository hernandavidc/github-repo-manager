"use client"

import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

interface Repo {
    id: string;
    name: string;
    url: string;
    stargazerCount: number;
  }

export default function Profile() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [search, setSearch] = useState("");
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (session?.user.githubId) {
      fetch("/api/github/repos")
        .then(res => res.json())
        .then(data => {
            setRepos(!data.message ? data.repositories : [])
            setUsername(data?.username);
            setProfileUrl(data?.profileUrl);
        });
    }
  }, [session]);

  useEffect(() => {
    setFilteredRepos(repos.filter(repo => repo.name.toLowerCase().includes(search.toLowerCase())));
  }, [search, repos]);

  const toggleFavorite = async (repoId: string, repoName: string, repoUrl: string) => {
    if (favorites.includes(repoId)) {
      await fetch("/api/favorites", {
        method: "DELETE",
        body: JSON.stringify({ repoId }),
        headers: { "Content-Type": "application/json" },
      });
      setFavorites(favorites.filter(id => id !== repoId));
    } else {
      await fetch("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ repoId, repoName, repoUrl }),
        headers: { "Content-Type": "application/json" },
      });
      setFavorites([...favorites, repoId]);
    }
  };

  const handleGitHubConnect = async () => {
    if (!session?.user?.email) return;
    
    setIsConnecting(true);

    try {
      await fetch('/api/auth/prepare-github-connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: session.user.email,
        })
      });
      
      await signIn("github", { callbackUrl: "/profile" });
    } catch (error) {
      console.error("Error al conectar con GitHub:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (!session) return <p className="text-center">Not authenticated</p>

  return (
    <div className="p-6 pt-40 max-w-md mx-auto">
        <h1 className="text-2xl">Welcome, {session.user?.name}</h1>
        <p className="mb-10">Email: {session.user?.email}</p>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="bg-red-500 text-white p-2 rounded">
            Logout
        </button>

        {!session.user?.githubId && (
            <button
                onClick={handleGitHubConnect}
                disabled={isConnecting}
                className="bg-gray-900 text-white p-2 rounded mt-4 block"
            >
                {isConnecting ? "Connecting..." : "Connect to GitHub"}
                <svg className="ml-2 h-5 w-5 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z" clipRule="evenodd" />
                </svg>
            </button>
        )}

        {username && (
            <p className="mt-10 text-lg">
                GitHub User:{" "}
                <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {username}
                </a>
            </p>
        )}

        {session.user?.githubId && (
            <div className="mt-6">
                <h2 className="text-xl font-bold">Your Repositories</h2>
                <input
                    type="text"
                    placeholder="Search repositories..."
                    className="w-full p-2 border rounded my-4 text-black"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <ul className="mt-2">
                {filteredRepos.map(repo => (
                    <li key={repo.id} className="border-b py-2 flex justify-between">
                        <div>
                            <a href={repo.url} target="_blank" className="text-blue-500">{repo.name}</a>
                            <span className="ml-2">⭐ {repo.stargazerCount}</span>
                        </div>
                        <button onClick={() => toggleFavorite(repo.id, repo.name, repo.url)} className="text-gray-500 hover:text-red-500">
                            {favorites.includes(repo.id) ? "❤️" : "🤍"}
                        </button>
                  </li>
                ))}
                </ul>
            </div>
        )}
    </div>
  )
}
