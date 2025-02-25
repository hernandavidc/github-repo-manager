"use client"

import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Profile() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [repos, setRepos] = useState([]);

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
                <ul className="mt-2">
                    {repos.map(repo => (
                        <li key={repo.id} className="border-b py-2">
                        <a href={repo.url} target="_blank" className="text-blue-500">{repo.name}</a> ⭐ {repo.stargazerCount}
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  )
}
