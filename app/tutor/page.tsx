"use client";

import { useState } from "react";

export default function TutorPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskTutor = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await response.json();

      if (data.answer) {
        setAnswer(data.answer);
      } else {
        setAnswer("Failed to generate answer.");
      }
    } catch (error) {
      console.error(error);
      setAnswer("Something went wrong while asking AI Tutor.");
    }

    setLoading(false);
  };

  const formatAnswer = (text: string) => {
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
          🤖 AI Tutor
        </h1>

        <p className="text-gray-400 mt-3 max-w-2xl">
          Ask questions, clarify concepts, and learn with your personal
          AI-powered tutor.
        </p>
      </header>

      {/* Main Grid */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Input */}
        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-950 shadow-lg">
          <label className="block mb-3 text-lg font-semibold">
            ❓ Ask Your Question
          </label>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask any study-related question here..."
            className="w-full h-96 p-4 rounded-xl bg-black border border-gray-700 focus:outline-none focus:border-white resize-none text-gray-200"
          />

          <button
            onClick={handleAskTutor}
            className="w-full mt-4 bg-white text-black py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            {loading ? "Thinking..." : "Ask AI Tutor"}
          </button>
        </div>

        {/* Output */}
        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-950 shadow-lg">
          <h2 className="text-xl font-bold mb-4">🧠 Tutor Response</h2>

          <div className="h-96 rounded-xl bg-black border border-gray-700 p-5 overflow-y-auto">
            {answer ? (
              <div>{formatAnswer(answer)}</div>
            ) : (
              <div className="text-gray-500 leading-8">
                Your AI Tutor response will appear here.
                {"\n\n"}
                Includes:
                {"\n"}• Direct Answer
                {"\n"}• Step-by-Step Explanation
                {"\n"}• Examples
                {"\n"}• Quick Revision
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}