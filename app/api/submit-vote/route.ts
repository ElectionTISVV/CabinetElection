import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { id, vote1, vote2, vote3, house } = await request.json();
  const normalizedId = id.toUpperCase(); // 🔁 Case-insensitive

  const validPrefixes: Record<string, string> = {
    ekta: "EK",
    pragati: "PR",
    shakti: "SK",
    shanti: "SH",
  };

  const prefix = validPrefixes[house?.toLowerCase()];
  if (!prefix || !normalizedId.startsWith(prefix)) {
    return NextResponse.json(
      { message: `❌ This ID is not valid for ${house} house.` },
      { status: 200 }
    );
  }

  const existing = await prisma.uidKey.findUnique({
    where: { uid: normalizedId },
  });

  if (!existing) {
    return NextResponse.json(
      { message: "Incorrect ID entered. Try again." },
      { status: 200 }
    );
  }

  if (existing.used) {
    return NextResponse.json(
      { message: "ID already used. Try again with a different ID." },
      { status: 200 }
    );
  }

  try {
    await Promise.all([
      prisma.candidate.update({
        where: { candidateName: vote1 },
        data: { votes: { increment: 1 } },
      }),
      prisma.candidate.update({
        where: { candidateName: vote2 },
        data: { votes: { increment: 1 } },
      }),
      prisma.candidate.update({
        where: { candidateName: vote3 },
        data: { votes: { increment: 1 } },
      }),
    ]);

    await prisma.uidKey.update({
      where: { uid: normalizedId },
      data: { used: true, house },
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (e) {
    console.error("Vote submission error:", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
