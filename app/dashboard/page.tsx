"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const savedXP = Number(
      localStorage.getItem("studyai_xp") || 0
    );

    const savedStreak = Number(
      localStorage.getItem("studyai_streak") || 1
    );

    const savedProgress = Number(
      localStorage.getItem("studyai_progress") || 0
    );

    setXp(savedXP);
    setStreak(savedStreak);
    setProgress(savedProgress);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold">
            🚀 StudyAI Dashboard
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Learn smarter. Revise faster. Master anything.
          </p>
        </div>

        <a
          href="/"
          className="mt-6 md:mt-0 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
        >
          Home
        </a>
      </header>

      {/* Stats */}
      <section className="grid md:grid-cols-3 gap-6 mb-12">
        {/* XP */}
        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950 shadow-lg">
          <h2 className="text-2xl font-bold mb-3">
            ⚡ XP Points
          </h2>

          <p className="text-5xl font-extrabold">
            {xp}
          </p>

          <p className="text-gray-400 mt-2">
            Earn XP through learning actions.
          </p>
        </div>

        {/* Streak */}
        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950 shadow-lg">
          <h2 className="text-2xl font-bold mb-3">
            🔥 Streak
          </h2>

          <p className="text-5xl font-extrabold">
            {streak} Day
            {streak > 1 ? "s" : ""}
          </p>

          <p className="text-gray-400 mt-2">
            Daily consistency compounds.
          </p>
        </div>

        {/* Progress */}
        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950 shadow-lg">
          <h2 className="text-2xl font-bold mb-3">
            🎯 Progress
          </h2>

          <p className="text-5xl font-extrabold">
            {progress}%
          </p>

          <p className="text-gray-400 mt-2">
            Your personal growth meter.
          </p>
        </div>
      </section>

      {/* Continue Learning */}
      <section className="mb-12 border border-gray-800 rounded-3xl p-8 bg-gray-950 shadow-lg">
        <h2 className="text-3xl font-bold mb-4">
          📚 Continue Your Study Journey
        </h2>

        <p className="text-gray-400 mb-6">
          Choose your next high-impact action.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="/summarizer"
            className="border border-gray-800 rounded-2xl p-6 hover:border-white transition"
          >
            <h3 className="text-2xl font-bold mb-2">
              📝 Summarizer
            </h3>

            <p className="text-gray-400">
              Turn notes & PDFs into Mind Notes.
            </p>
          </a>

          <a
            href="/quiz"
            className="border border-gray-800 rounded-2xl p-6 hover:border-white transition"
          >
            <h3 className="text-2xl font-bold mb-2">
              🧪 Quiz Arena
            </h3>

            <p className="text-gray-400">
              Gamified quizzes for mastery.
            </p>
          </a>

          <a
            href="/tutor"
            className="border border-gray-800 rounded-2xl p-6 hover:border-white transition"
          >
            <h3 className="text-2xl font-bold mb-2">
              🎓 AI Tutor
            </h3>

            <p className="text-gray-400">
              Personal professor for any topic.
            </p>
          </a>
        </div>
      </section>

      {/* Daily Missions */}
      <section className="border border-gray-800 rounded-3xl p-8 bg-gray-950 shadow-lg">
        <h2 className="text-3xl font-bold mb-4">
          🏆 Daily Mission
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between border border-gray-800 rounded-2xl p-4">
            <span>Complete 1 Quiz</span>
            <span>+10 XP</span>
          </div>

          <div className="flex justify-between border border-gray-800 rounded-2xl p-4">
            <span>Summarize 1 PDF</span>
            <span>+20 XP</span>
          </div>

          <div className="flex justify-between border border-gray-800 rounded-2xl p-4">
            <span>Ask Tutor 3 Questions</span>
            <span>+15 XP</span>
          </div>
        </div>
      </section>
    </main>
  );
}