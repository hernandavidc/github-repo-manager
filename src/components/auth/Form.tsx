"use client"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthForm({ isSignUp }: { isSignUp: boolean }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const searchParams = useSearchParams();
    const errorUrl = searchParams.get('error');

    const validateForm = () => {
        if (!email || (isSignUp && !name) || !password) {
            setError('All fields are required');
            return false;
        }

        if (password.length < 6) {
            setError('The password must have least 6 characters');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            if (isSignUp) {
                await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });
            }
            
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password
            });
            
            if (result?.error) {
                setError('Error when logging in automatically');
                return;
            }

            router.push('/profile');
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred while registering. Please try again later');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-40 flex flex-col gap-4 p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-black">{isSignUp ? "Sign Up" : "Login"}</h2>
          
            {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-red-900">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {isSignUp && (
                    <div className="mb-4">
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                )}
                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-blue-600 py-2 px-4 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : (isSignUp ? "Sign Up" : "Login")}
                </button>
            </form>
            <button onClick={() => signIn("github")} className="bg-gray-800 text-white p-2 rounded">
                Login with GitHub 
                <svg className="ml-2 h-5 w-5 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z" clipRule="evenodd" />
                </svg>
            </button>

          
            <div className="mt-4 text-center">
                {isSignUp ? <>
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Login
                        </a>
                    </p>
                </> : <>
                    <p className="text-sm text-gray-600">
                        Don't have an account yet? {' '}
                        <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up
                        </a>
                    </p>
                </>}
            </div>
        </div>
    )
}