import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { id, vote1, vote2, vote3, house } = await request.json();

  // Basic check
  if (!id || !vote1 || !vote2 || !vote3 || !house) {
    return NextResponse.json(
      { message: "Missing fields in vote submission." },
      { status: 400 }
    );
  }

  const existing = await prisma.uidKey.findUnique({ where: { uid: id } });

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
    // Update vote counts
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

    // Update uidKey with used = true and house
    await prisma.uidKey.update({
      where: { uid: id },
      data: {
        used: true,
        house, // ✅ this will now be saved and not null
      },
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (e) {
    console.error("Vote submission error:", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
