"use client"

import { useSession, signOut } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) return <p className="text-center">Not authenticated</p>

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl">Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      <button onClick={() => signOut()} className="bg-red-500 text-white p-2 rounded">
        Logout
      </button>
    </div>
  )
}
