"use client"

import { useSession, signOut, signIn } from "next-auth/react"

export default function Profile() {
  const { data: session } = useSession();

  if (!session) return <p className="text-center">Not authenticated</p>

  return (
    <div className="p-6 pt-40 max-w-md mx-auto">
        <h1 className="text-2xl">Welcome, {session.user?.name}</h1>
        <p className="mb-10">Email: {session.user?.email}</p>
        <button onClick={() => signOut()} className="bg-red-500 text-white p-2 rounded">
            Logout
        </button>

        {!session.user?.githubId && (
            <button
                onClick={() => signIn("github")}
                className="bg-gray-900 text-white p-2 rounded mt-4 block"
            >
                Conectar con GitHub
            </button>
        )}
    </div>
  )
}
