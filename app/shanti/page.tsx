import { PrismaClient } from "@prisma/client";
import MainForm from "../../components/mainportal";
const prisma = new PrismaClient();

export default async function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f4fc00] px-4 py-10">
      <h1 className="text-4xl font-bold text-black mb-6">
        🗳️ Shanti House Voting
      </h1>
      <MainForm house="shanti" />
    </main>
  );
}
