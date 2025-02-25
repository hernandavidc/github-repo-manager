import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const { repoId, repoName, repoUrl } = await req.json();

  try {
    console.log("****** ", session, repoId, repoName, repoUrl);
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        repoId,
        repoName,
        repoUrl,
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error(JSON.stringify(error));
    return NextResponse.json({ message: "Error adding favorite", error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const { repoId } = await req.json();

  try {
    await prisma.favorite.delete({
      where: {
        userId_repoId: {
          userId: session.user.id,
          repoId,
        },
      },
    });

    return NextResponse.json({ message: "Favorite removed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error removing favorite", error }, { status: 500 });
  }
}
