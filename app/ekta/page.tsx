import { PrismaClient } from "@prisma/client";
import MainForm from "../../components/mainportal";
const prisma = new PrismaClient();

export default async function Page() {
	return (
		<main className="flex flex-col justify-evenly items-center w-full h-screen">
			<h1>EKTA HOUSE</h1>
			<MainForm house="ekta" />
		</main>
	);
}
