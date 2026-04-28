"use client";

import { useState } from "react";

export default function SummarizerPage() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setSummary("");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
        }),
      });

      const data = await response.json();

      if (data.summary) {
        setSummary(data.summary);
      } else {
        setSummary("Failed to generate Mind Notes.");
      }
    } catch (error) {
      console.error(error);
      setSummary("Something went wrong while generating Mind Notes.");
    }

    setLoading(false);
  };

  const formatSummary = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("##")) {
        return (
          <h2
            key={index}
            className="text-xl font-bold text-white mt-6 mb-3"
          >
            {line.replace(/##/g, "").trim()}
          </h2>
        );
      }

      if (line.startsWith("-")) {
        return (
          <li key={index} className="ml-5 text-gray-300 mb-2">
            {line.replace("-", "").trim()}
          </li>
        );
      }

      if (line.trim() === "") {
        return <div key={index} className="mb-2" />;
      }

      return (
        <p key={index} className="text-gray-300 leading-7 mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      {/* Header */}
      <header className="mb-10">
        <a
          href="/dashboard"
          className="text-gray-400 hover:text-white transition"
        >
          ← Back to Dashboard
        </a>

        <h1 className="text-4xl md:text-5xl font-bold mt-4">
          🧠 AI Summarizer
        </h1>

        <p className="text-gray-400 mt-3 max-w-2xl">
          Transform raw notes, chapters, and study material into premium
          AI-powered Mind Notes built for comprehension, retention, and revision.
        </p>
      </header>

      {/* Main Grid */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Input */}
        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-950 shadow-lg">
          <label className="block mb-3 text-lg font-semibold">
            📚 Your Study Material
          </label>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste notes, textbook chapters, lecture material, or educational content here..."
            className="w-full h-96 p-4 rounded-xl bg-black border border-gray-700 focus:outline-none focus:border-white resize-none text-gray-200"
          />

          <button
            onClick={handleSummarize}
            className="w-full mt-4 bg-white text-black py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            {loading ? "Generating Premium Mind Notes..." : "Generate Mind Notes"}
          </button>
        </div>

        {/* Output */}
        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-950 shadow-lg">
          <h2 className="text-xl font-bold mb-4">📝 Premium Mind Notes</h2>

          <div className="h-96 rounded-xl bg-black border border-gray-700 p-5 overflow-y-auto">
            {summary ? (
              <div>{formatSummary(summary)}</div>
            ) : (
              <div className="text-gray-500 leading-8">
                Your AI-generated premium Mind Notes will appear here.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}