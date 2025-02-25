"use client"

import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Profile() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [repos, setRepos] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredRepos, setFilteredRepos] = useState([]);

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
                onClick={() => signIn("github")}
                className="bg-gray-900 text-white p-2 rounded mt-4 block"
            >
                Connect to GitHub
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
                        <a href={repo.url} target="_blank" className="text-blue-500">{repo.name}</a>
                        <span>⭐ {repo.stargazerCount}</span>
                    </li>
                ))}
                </ul>
            </div>
        )}
    </div>
  )
}
