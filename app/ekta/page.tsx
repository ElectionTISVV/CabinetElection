import { PrismaClient } from "@prisma/client";
import MainForm from "../../components/mainportal";
const prisma = new PrismaClient();

export default async function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#00a3ff] px-4 py-10">
      <h1 className="text-4xl font-bold text-white mb-6">
        🗳️ Ekta House Voting
      </h1>
      <MainForm house="ekta" />
    </main>
  );
}
