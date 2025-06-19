import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(request: Request, response: Response) {
	const { id, vote1, vote2, vote3, house } = await request.json();
	const a = await prisma.uidKey.findUnique({
		where: {
			uid: id,
		},
	});
	if (a == null) {
		return NextResponse.json(
			{ message: "Inorrect ID entered, try again" },
			{ status: 200 }
		);
	}
	console.log(a, vote1, vote2, vote3);
	if (a.used == false) {
		await prisma.candidate.update({
			where: {
				candidateName: vote1,
			},
			data: {
				votes: {
					increment: 1,
				},
			},
		});
		await prisma.candidate.update({
			where: {
				candidateName: vote2,
			},
			data: {
				votes: {
					increment: 1,
				},
			},
		});
		await prisma.candidate.update({
			where: {
				candidateName: vote3,
			},
			data: {
				votes: {
					increment: 1,
				},
			},
		});
		await prisma.uidKey.update({
			where: {
				uid: id,
			},
			data: {
				used: true,
			},
		});
		return NextResponse.json({ message: "success" }, { status: 200 });
	} else if (a.used == true) {
		return NextResponse.json(
			{ message: "ID already used. Try again with different ID" },
			{ status: 200 }
		);
	}
}
