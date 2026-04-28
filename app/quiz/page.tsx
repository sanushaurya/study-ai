"use client";

import { useState } from "react";

export default function QuizPage() {
  const [inputText, setInputText] = useState("");
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setQuiz("");

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
        }),
      });

      const data = await response.json();

      if (data.quiz) {
        setQuiz(data.quiz);
      } else {
        setQuiz("Failed to generate quiz.");
      }
    } catch (error) {
      console.error(error);
      setQuiz("Something went wrong while generating quiz.");
    }

    setLoading(false);
  };

  const formatQuiz = (text: string) => {
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

      if (
        line.match(/^\d+\./) ||
        line.startsWith("A)") ||
        line.startsWith("B)") ||
        line.startsWith("C)") ||
        line.startsWith("D)") ||
        line.startsWith("Answer:") ||
        line.startsWith("Explanation:")
      ) {
        return (
          <p key={index} className="text-gray-300 leading-7 mb-2">
            {line}
          </p>
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
          🧪 AI Quiz Generator
        </h1>

        <p className="text-gray-400 mt-3 max-w-2xl">
          Transform your notes into intelligent quizzes for revision, testing,
          and deeper understanding.
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
            placeholder="Paste notes, textbook chapters, lecture material, or concepts here..."
            className="w-full h-96 p-4 rounded-xl bg-black border border-gray-700 focus:outline-none focus:border-white resize-none text-gray-200"
          />

          <button
            onClick={handleGenerateQuiz}
            className="w-full mt-4 bg-white text-black py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            {loading ? "Generating AI Quiz..." : "Generate Quiz"}
          </button>
        </div>

        {/* Output */}
        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-950 shadow-lg">
          <h2 className="text-xl font-bold mb-4">📝 AI-Generated Quiz</h2>

          <div className="h-96 rounded-xl bg-black border border-gray-700 p-5 overflow-y-auto">
            {quiz ? (
              <div>{formatQuiz(quiz)}</div>
            ) : (
              <div className="text-gray-500 leading-8">
                Your AI-generated quiz will appear here.
                {"\n\n"}
                Includes:
                {"\n"}• MCQs
                {"\n"}• Answers
                {"\n"}• Explanations
                {"\n"}• Revision Practice
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}