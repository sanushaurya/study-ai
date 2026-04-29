"use client";

import { useState } from "react";

export default function TutorPage() {
  const [tutorMode, setTutorMode] = useState<"topic" | "pdf">("topic");
  const [learningMode, setLearningMode] = useState("Beginner");

  const [topic, setTopic] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePDFUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://study-ai-rag.onrender.com/extract-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.text) {
        setPdfText(data.text);
        alert("PDF uploaded successfully!");
      } else {
        alert(data.error || "Failed to extract PDF.");
      }
    } catch (error) {
      console.error(error);
      alert(
        "Python RAG service not running. Start rag-service first."
      );
    }

    setUploading(false);
  };

  const askTutor = async () => {
    if (tutorMode === "topic" && !topic.trim()) {
      alert("Enter a topic first.");
      return;
    }

    if (tutorMode === "pdf" && !pdfText.trim()) {
      alert("Upload a PDF first.");
      return;
    }

    if (!question.trim()) {
      alert("Ask a question first.");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: tutorMode === "topic" ? topic : undefined,
          pdfText: tutorMode === "pdf" ? pdfText : undefined,
          question,
          mode: learningMode,
        }),
      });

      const data = await response.json();

      if (data.answer) {
        setAnswer(data.answer);

        if (typeof window !== "undefined") {
          const currentXP = Number(
            localStorage.getItem("studyai_xp") || 0
          );

          const currentProgress = Number(
            localStorage.getItem("studyai_progress") || 0
          );

          localStorage.setItem(
            "studyai_xp",
            String(currentXP + 15)
          );

          localStorage.setItem(
            "studyai_progress",
            String(
              Math.min(currentProgress + 7, 100)
            )
          );
        }
      } else {
        setAnswer(
          data.error || "Failed to generate answer."
        );
      }
    } catch (error) {
      console.error(error);
      setAnswer("Something went wrong.");
    }

    setLoading(false);
  };

  const formatAnswer = (text: string) => {
    return text.split("\n").map((line, index) => {
      const cleanLine = line.trim();

      if (!cleanLine) {
        return <div key={index} className="mb-3" />;
      }

      if (
        cleanLine.startsWith("##") ||
        cleanLine.endsWith(":")
      ) {
        return (
          <h2
            key={index}
            className="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2"
          >
            {cleanLine.replace(/##/g, "")}
          </h2>
        );
      }

      if (
        cleanLine.startsWith("-") ||
        cleanLine.startsWith("•")
      ) {
        return (
          <li
            key={index}
            className="ml-6 mb-3 text-gray-300 leading-7"
          >
            {cleanLine.replace(/^[-•]\s*/, "")}
          </li>
        );
      }

      return (
        <p
          key={index}
          className="text-gray-300 leading-8 mb-4"
        >
          {cleanLine}
        </p>
      );
    });
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      {/* Header */}
      <header className="text-center mb-10">
        <a
          href="/dashboard"
          className="text-gray-400 hover:text-white"
        >
          ← Back to Dashboard
        </a>

        <h1 className="text-5xl font-extrabold mt-4">
          🎓 AI Tutor
        </h1>

        <p className="text-gray-400 mt-3">
          Your personal AI Professor.
        </p>
      </header>

      {/* Main Grid */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950">
          {/* Source */}
          <label className="block text-lg font-bold mb-3">
            📚 Choose Source
          </label>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              onClick={() => setTutorMode("topic")}
              className={`py-3 rounded-2xl font-bold ${
                tutorMode === "topic"
                  ? "bg-white text-black"
                  : "bg-black border border-gray-700"
              }`}
            >
              🧠 Topic
            </button>

            <button
              onClick={() => setTutorMode("pdf")}
              className={`py-3 rounded-2xl font-bold ${
                tutorMode === "pdf"
                  ? "bg-white text-black"
                  : "bg-black border border-gray-700"
              }`}
            >
              📄 PDF
            </button>
          </div>

          {/* Topic or PDF */}
          {tutorMode === "topic" ? (
            <input
              type="text"
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
              placeholder="Enter topic..."
              className="w-full p-4 rounded-2xl bg-black border border-gray-700 mb-6"
            />
          ) : (
            <div className="mb-6">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePDFUpload}
                className="block w-full"
              />

              {uploading && (
                <p className="text-gray-400 mt-3">
                  Extracting PDF...
                </p>
              )}
            </div>
          )}

          {/* Learning Mode */}
          <label className="block text-lg font-bold mb-3">
            🧠 Learning Mode
          </label>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {["Beginner", "Exam", "Genius"].map(
              (mode) => (
                <button
                  key={mode}
                  onClick={() =>
                    setLearningMode(mode)
                  }
                  className={`py-3 rounded-2xl font-bold ${
                    learningMode === mode
                      ? "bg-white text-black"
                      : "bg-black border border-gray-700"
                  }`}
                >
                  {mode}
                </button>
              )
            )}
          </div>

          {/* Question */}
          <textarea
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Ask your question..."
            className="w-full h-40 p-4 rounded-2xl bg-black border border-gray-700 resize-none mb-6"
          />

          <button
            onClick={askTutor}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold"
          >
            {loading
              ? "Thinking..."
              : "Ask AI Tutor 🚀 (+15 XP)"}
          </button>
        </div>

        {/* Output Panel */}
        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎯 Tutor Response
          </h2>

          <div className="h-[700px] rounded-2xl bg-black border border-gray-700 p-6 overflow-y-auto">
            {answer ? (
              <div>{formatAnswer(answer)}</div>
            ) : (
              <div className="text-center text-gray-500 py-20">
                Ask anything to begin learning.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}