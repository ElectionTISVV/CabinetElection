"use client";

import Link from "next/link";

export default function Home() {
  const pages = [
    { name: "Ekta", path: "/ekta", color: "#00a3ff" },
    { name: "Pragati", path: "/pragati", color: "#009411" },
    { name: "Shakti", path: "/shakti", color: "#e8101d" },
    { name: "Shanti", path: "/shanti", color: "#f4fc00", textColor: "black" },
    { name: "Live Results", path: "/live", color: "#7e22ce" },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 bg-slate-100 px-6 py-20">
      <h1 className="text-4xl font-bold text-slate-800 mb-8">
        🗳️ Welcome to Student CampusCabinet
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-2xl">
        {pages.map((page) => (
          <Link key={page.name} href={page.path}>
            <div
              className="w-full text-center py-5 rounded-xl shadow-md hover:scale-105 transition cursor-pointer font-semibold text-lg"
              style={{
                backgroundColor: page.color,
                color: page.textColor || "white",
              }}
            >
              {page.name}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
