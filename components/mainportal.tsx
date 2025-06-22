"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";
import candidatesData from "@/data/candidates.json";

type Candidate = {
  name: string;
  image: string;
};

const houses = ["ekta", "pragati", "shakti", "shanti"];

export default function VoteForm({ house }: { house: string }) {
  const [id, setId] = useState("");
  const [vote1, setVote1] = useState("");
  const [vote2, setVote2] = useState("");
  const [vote3, setVote3] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const houseCandidates =
      (candidatesData as Record<string, Candidate[]>)[house] || [];
    setCandidates(houseCandidates);
  }, [house]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    // 15-second delay
    const lastVote = localStorage.getItem("lastVoteTime");
    if (lastVote && Date.now() - parseInt(lastVote) < 15000) {
      setMessage("⏳ Please wait 15 seconds before voting again.");
      setError(true);
      return;
    }

    if (!vote1 || !vote2 || !vote3 || !id.trim()) {
      setMessage("❗ Please fill in all fields.");
      setError(true);
      return;
    }

    try {
      const res = await axios.post("/api/submit-vote", {
        id,
        vote1,
        vote2,
        vote3,
        house,
      });
      setMessage(res.data.message);
      setError(res.data.message !== "success");

      if (res.data.message === "success") {
        setId("");
        setVote1("");
        setVote2("");
        setVote3("");
        localStorage.setItem("lastVoteTime", Date.now().toString());
      }
    } catch (err) {
      console.error(err);
      setMessage("🚫 Server error while submitting your vote.");
      setError(true);
    }
  };

  const renderOptions = (
    label: string,
    selected: string,
    setSelected: (val: string) => void,
    groupName: string
  ) => (
    <div className="space-y-2 mt-3">
      <h3 className="text-center text-lg font-semibold text-indigo-600">
        {label}
      </h3>
      {candidates.map((candidate) => (
        <label
          key={candidate.name}
          className={clsx(
            "flex items-center p-3 border rounded-lg cursor-pointer transition gap-3",
            selected === candidate.name
              ? "border-indigo-500 bg-indigo-50"
              : "border-slate-200 hover:border-indigo-300"
          )}
        >
          <input
            type="radio"
            name={groupName}
            value={candidate.name}
            checked={selected === candidate.name}
            onChange={() => setSelected(candidate.name)}
            className="w-4 h-4 text-indigo-600"
          />
          <div className="relative group">
            <img
              src={candidate.image}
              alt={candidate.name}
              className="w-10 h-10 object-cover rounded-full transition-transform duration-300 group-hover:scale-150 z-10"
            />
          </div>
          <span className="text-slate-800 font-medium">{candidate.name}</span>
        </label>
      ))}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-5xl space-y-8"
    >
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          🔑 Unique Voting ID
        </label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full p-3 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Enter your unique ID..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderOptions("🥇 First Choice", vote1, setVote1, "vote1")}
        {renderOptions("🥈 Second Choice", vote2, setVote2, "vote2")}
        {renderOptions("🥉 Third Choice", vote3, setVote3, "vote3")}
      </div>

      <div className="text-center pt-4">
        <button
          type="submit"
          className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
        >
          🗳️ Submit Your Vote
        </button>

        <div
          className={clsx(
            "mt-4 p-3 rounded-md font-medium min-h-[40px]",
            error ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
          )}
        >
          {message}
        </div>
      </div>
    </form>
  );
}
