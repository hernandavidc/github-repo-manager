import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });
    }

    if (!session.user.githubId) {
        return NextResponse.json({ message: "Bad Request: GitHub not linked" }, { status: 400 });
    }

    const token = session.user.accessToken;
  
    if (!token) {
        return NextResponse.json({ message: "Missing GitHub token" }, { status: 500 })
    }

    const query = `
        query {
            viewer {
                login
                url
                repositories(first: 100) {
                    nodes {
                        id
                        name
                        url
                        stargazerCount
                    }
                }
            }
        }
    `;

    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        const error = await response.json()
        return NextResponse.json({ message: "GitHub API error", error }, { status: response.status })
    }

    const data = await response.json();

    return NextResponse.json({
        username: data.data.viewer.login,
        profileUrl: data.data.viewer.url,
        repositories: data.data.viewer.repositories.nodes,
    })
}
