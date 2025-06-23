"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type Stats = {
  totalVotes: number;
  houseVotes: Record<string, number>;
  houseCandidateVotes: Record<string, { name: string; votes: number }[]>;
};

export default function LiveResults() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await axios.post("/api/results", { password });
      if (res.data.error) {
        setError(res.data.error);
        setAuthorized(false);
        setStats(null);
      } else {
        setStats(res.data);
        setAuthorized(true);
        setError("");
      }
    } catch (err) {
      setError("⚠️ Server error.");
      console.error(err);
    }
  };

  // ⏱️ Poll every 5 seconds after login
  useEffect(() => {
    if (!authorized) return;
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [authorized]);

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-6">
        <h2 className="text-2xl font-bold mb-4">🔒 Enter Admin Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password..."
          className="px-4 py-2 border rounded-md w-full max-w-sm"
        />
        <button
          onClick={fetchStats}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          View Live Results
        </button>
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-800">
        📊 Live Voting Results
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <p className="text-lg font-semibold">
          🗳️ Total Votes Cast: {stats.totalVotes}
        </p>
        <div className="mt-4 space-y-1">
          {Object.entries(stats.houseVotes).map(([house, count]) => (
            <p key={house}>
              <span className="capitalize font-medium">{house}</span>: {count}
            </p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(stats.houseCandidateVotes).map(
          ([house, results]: [string, { name: string; votes: number }[]]) => (
            <div
              key={house}
              className="bg-white p-5 rounded-xl shadow border border-slate-200"
            >
              <h2 className="text-xl font-bold mb-3 capitalize text-indigo-700">
                {house} House
              </h2>
              <ul className="space-y-1 text-slate-800">
                {results.map((r) => (
                  <li key={r.name}>
                    {r.name}: <span className="font-medium">{r.votes}</span>
                  </li>
                ))}
                <li className="font-semibold mt-2 text-indigo-700">
                  Total : {results.reduce((sum, r) => sum + r.votes, 0)}
                </li>
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
}
