"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("studyai_user");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const parsedUser = JSON.parse(user);
    setUserName(parsedUser.name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("studyai_user");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            Welcome, {userName || "Student"} 👋
          </h1>

          <p className="text-gray-400 mt-2">
            Your AI-powered learning workspace
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="border border-white px-5 py-2 rounded-xl hover:bg-white hover:text-black transition"
        >
          Logout
        </button>
      </header>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-8">
        <a
          href="/summarizer"
          className="border border-gray-800 rounded-2xl p-8 bg-gray-950 hover:border-white transition"
        >
          <h2 className="text-2xl font-bold mb-3">🧠 AI Summarizer</h2>

          <p className="text-gray-400">
            Upload notes and generate premium Mind Notes instantly.
          </p>
        </a>

        <a
          href="/quiz"
          className="border border-gray-800 rounded-2xl p-8 bg-gray-950 hover:border-white transition"
        >
          <h2 className="text-2xl font-bold mb-3">🧪 AI Quiz Generator</h2>

          <p className="text-gray-400">
            Generate quizzes to test understanding and retention.
          </p>
        </a>

        <a
          href="/tutor"
          className="border border-gray-800 rounded-2xl p-8 bg-gray-950 hover:border-white transition"
        >
          <h2 className="text-2xl font-bold mb-3">🤖 AI Tutor</h2>

          <p className="text-gray-400">
            Ask questions and learn from your personal AI tutor.
          </p>
        </a>
      </section>
    </main>
  );
}