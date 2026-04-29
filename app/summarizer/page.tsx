"use client";

import { useState } from "react";

export default function SummarizerPage() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
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
        "http://127.0.0.1:5001/extract-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.text) {
        setInputText(data.text);
      } else {
        alert(
          data.error ||
            "Failed to extract PDF text."
        );
      }
    } catch (error) {
      console.error(error);
      alert(
        "Python RAG service not running. Start rag-service first."
      );
    }

    setUploading(false);
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      alert(
        "Please paste notes or upload a PDF first."
      );
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      const response = await fetch(
        "/api/summarize",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            text: inputText,
          }),
        }
      );

      const data = await response.json();

      if (data.summary) {
        setSummary(data.summary);

        if (
          typeof window !==
          "undefined"
        ) {
          const currentXP =
            Number(
              localStorage.getItem(
                "studyai_xp"
              ) || 0
            );

          const currentProgress =
            Number(
              localStorage.getItem(
                "studyai_progress"
              ) || 0
            );

          localStorage.setItem(
            "studyai_xp",
            String(
              currentXP + 20
            )
          );

          localStorage.setItem(
            "studyai_progress",
            String(
              Math.min(
                currentProgress +
                  10,
                100
              )
            )
          );
        }
      } else {
        setSummary(
          "Failed to generate Mind Notes."
        );
      }
    } catch (error) {
      console.error(error);
      setSummary(
        "Something went wrong while generating Mind Notes."
      );
    }

    setLoading(false);
  };

  const formatSummary = (
    text: string
  ) => {
    return text
      .split("\n")
      .map((line, index) => {
        const cleanLine =
          line.trim();

        if (!cleanLine) {
          return (
            <div
              key={index}
              className="mb-3"
            />
          );
        }

        if (
          cleanLine.startsWith(
            "##"
          ) ||
          cleanLine.includes(
            "Summary:"
          ) ||
          cleanLine.includes(
            "Key Concepts:"
          ) ||
          cleanLine.includes(
            "Important Points:"
          )
        ) {
          return (
            <h2
              key={index}
              className="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2"
            >
              {cleanLine.replace(
                /##/g,
                ""
              )}
            </h2>
          );
        }

        if (
          cleanLine.startsWith(
            "-"
          ) ||
          cleanLine.startsWith(
            "•"
          )
        ) {
          return (
            <li
              key={index}
              className="ml-6 mb-3 text-gray-300 leading-7"
            >
              {cleanLine.replace(
                /^[-•]\s*/,
                ""
              )}
            </li>
          );
        }

        if (
          cleanLine.startsWith(
            "Example:"
          ) ||
          cleanLine.startsWith(
            "Pro Tip:"
          )
        ) {
          return (
            <div
              key={index}
              className="mt-4 mb-4 p-4 border border-gray-800 rounded-2xl bg-black"
            >
              <p className="text-gray-300 italic leading-7">
                {
                  cleanLine
                }
              </p>
            </div>
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
      <header className="mb-10">
        <a
          href="/dashboard"
          className="text-gray-400 hover:text-white transition"
        >
          ← Back to Dashboard
        </a>

        <h1 className="text-4xl md:text-6xl font-extrabold mt-4">
          🧠 AI Summarizer + RAG
        </h1>

        <p className="text-gray-400 mt-3 text-lg max-w-3xl">
          Upload PDFs, extract intelligently, and
          generate premium Mind Notes.
        </p>
      </header>

      {/* Main */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Input */}
        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950 shadow-lg">
          <label className="block mb-3 text-xl font-bold">
            📚 Your Study Material
          </label>

          {/* PDF Upload */}
          <div className="mb-6 p-4 border border-white rounded-2xl bg-black">
            <p className="text-white font-semibold mb-3">
              📄 Upload PDF File
            </p>

            <input
              type="file"
              accept=".pdf"
              onChange={
                handlePDFUpload
              }
              className="block w-full text-white"
            />
          </div>

          {uploading && (
            <p className="text-sm text-gray-400 mb-4">
              Extracting PDF via Python RAG...
            </p>
          )}

          {/* Text */}
          <textarea
            value={inputText}
            onChange={(e) =>
              setInputText(
                e.target.value
              )
            }
            placeholder="Paste notes here or upload a PDF..."
            className="w-full h-80 p-4 rounded-2xl bg-black border border-gray-700 focus:outline-none focus:border-white resize-none text-gray-200"
          />

          {/* Button */}
          <button
            onClick={
              handleSummarize
            }
            className="w-full mt-6 bg-white text-black py-4 rounded-2xl text-lg font-extrabold hover:scale-[1.02] transition"
          >
            {loading
              ? "Generating Mind Notes..."
              : "Generate Premium Mind Notes 🚀 (+20 XP)"}
          </button>
        </div>

        {/* Output */}
        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            📝 Premium Mind Notes
          </h2>

          <div className="h-[700px] rounded-2xl bg-black border border-gray-700 p-6 overflow-y-auto">
            {summary ? (
              <div>
                {formatSummary(
                  summary
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-20 leading-8">
                Upload a PDF or paste notes to generate premium,
                structured Mind Notes.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}