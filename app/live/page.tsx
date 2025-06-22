"use client";
import { useState } from "react";
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
      } else {
        setStats(res.data);
        setAuthorized(true);
        setError("");
      }
    } catch {
      setError("Server error.");
    }
  };

  if (!authorized) {
    return (
      <div className="p-10">
        <h2 className="text-2xl mb-4">Enter Admin Password</h2>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border"
          type="password"
        />
        <button
          onClick={fetchStats}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded"
        >
          View Results
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }
  if (!stats) return null;
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">📊 Live Results</h1>
      <p>Total Votes: {stats.totalVotes}</p>
      {Object.entries(stats.houseVotes).map(([house, count]) => (
        <p key={house}>
          {house.charAt(0).toUpperCase() + house.slice(1)}: {count}
        </p>
      ))}

      <div className="grid grid-cols-2 gap-8 mt-6">
        {Object.entries(stats.houseCandidateVotes).map(
          ([house, results]: [string, { name: string; votes: number }[]]) => (
            <div key={house}>
              <h2 className="font-bold text-xl mb-2 capitalize">{house}</h2>
              <ul className="space-y-1">
                {results.map((r: any) => (
                  <li key={r.name}>
                    {r.name}: {r.votes}
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
}
