import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" });
  }

  const totalVotes = await prisma.uidKey.count({ where: { used: true } });

  const houseVotes: Record<string, number> = {};
  const houseCandidateVotes: Record<string, any[]> = {};

  const houses = ["ekta", "pragati", "shakti", "shanti"];

  for (const house of houses) {
    houseVotes[house] = await prisma.uidKey.count({
      where: {
        used: true,
        house: house,
      },
    });

    const candidates = await prisma.candidate.findMany({
      where: {
        House: {
          hname: house,
        },
      },
      orderBy: { votes: "desc" },
    });

    houseCandidateVotes[house] = candidates.map((c) => ({
      name: c.candidateName,
      votes: c.votes,
    }));
  }

  return NextResponse.json({ totalVotes, houseVotes, houseCandidateVotes });
}
