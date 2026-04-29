"use client";

import { useState } from "react";

type QuizQuestion = {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
};

export default function QuizPage() {
  const [quizMode, setQuizMode] = useState<
    "topic" | "pdf"
  >("topic");

  const [topic, setTopic] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [difficulty, setDifficulty] =
    useState("Easy");

  const [questions, setQuestions] =
    useState<QuizQuestion[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState("");

  const [showExplanation, setShowExplanation] =
    useState(false);

  const [score, setScore] = useState(0);

  const [quizStarted, setQuizStarted] =
    useState(false);

  const [quizComplete, setQuizComplete] =
    useState(false);

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
        setPdfText(data.text);
        alert("PDF uploaded successfully!");
      } else {
        alert(
          data.error ||
            "Failed to extract PDF."
        );
      }
    } catch (error) {
      console.error(error);
      alert(
        "Python RAG service not running."
      );
    }

    setUploading(false);
  };

  const generateQuiz = async () => {
    if (
      quizMode === "topic" &&
      !topic.trim()
    ) {
      alert("Enter a topic first.");
      return;
    }

    if (
      quizMode === "pdf" &&
      !pdfText.trim()
    ) {
      alert("Upload a PDF first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/quiz",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            topic:
              quizMode === "topic"
                ? topic
                : undefined,
            pdfText:
              quizMode === "pdf"
                ? pdfText
                : undefined,
            difficulty,
          }),
        }
      );

      const data = await response.json();

      if (data.quiz) {
        setQuestions(data.quiz);
        setQuizStarted(true);
        setCurrentQuestion(0);
        setSelectedAnswer("");
        setShowExplanation(false);
        setScore(0);
        setQuizComplete(false);
      } else {
        alert(
          data.error ||
            "Failed to generate quiz."
        );
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);

    if (
      answer ===
      questions[currentQuestion]
        .correctAnswer
    ) {
      setScore((prev) => prev + 1);
    }

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (
      currentQuestion + 1 <
      questions.length
    ) {
      setCurrentQuestion(
        (prev) => prev + 1
      );

      setSelectedAnswer("");
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (!quizStarted) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <header className="text-center mb-10">
          <a
            href="/dashboard"
            className="text-gray-400 hover:text-white"
          >
            ← Back to Dashboard
          </a>

          <h1 className="text-5xl font-extrabold mt-4">
            🧪 AI Quiz Arena
          </h1>

          <p className="text-gray-400 mt-3">
            Topic mastery or PDF exam revision.
          </p>
        </header>

        <section className="max-w-3xl mx-auto border border-gray-800 rounded-3xl p-8 bg-gray-950">
          {/* Mode */}
          <label className="block text-lg font-bold mb-3">
            🎮 Choose Quiz Mode
          </label>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              onClick={() =>
                setQuizMode("topic")
              }
              className={`py-3 rounded-2xl font-bold ${
                quizMode === "topic"
                  ? "bg-white text-black"
                  : "bg-black border border-gray-700"
              }`}
            >
              🧠 Topic Quiz
            </button>

            <button
              onClick={() =>
                setQuizMode("pdf")
              }
              className={`py-3 rounded-2xl font-bold ${
                quizMode === "pdf"
                  ? "bg-white text-black"
                  : "bg-black border border-gray-700"
              }`}
            >
              📄 PDF Revision
            </button>
          </div>

          {/* Input */}
          {quizMode === "topic" ? (
            <input
              type="text"
              value={topic}
              onChange={(e) =>
                setTopic(
                  e.target.value
                )
              }
              placeholder="Enter topic..."
              className="w-full p-4 rounded-2xl bg-black border border-gray-700 mb-6"
            />
          ) : (
            <div className="mb-6">
              <input
                type="file"
                accept=".pdf"
                onChange={
                  handlePDFUpload
                }
                className="block w-full"
              />

              {uploading && (
                <p className="text-gray-400 mt-3">
                  Extracting PDF...
                </p>
              )}
            </div>
          )}

          {/* Difficulty */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              "Easy",
              "Medium",
              "Hard",
            ].map((level) => (
              <button
                key={level}
                onClick={() =>
                  setDifficulty(
                    level
                  )
                }
                className={`py-3 rounded-2xl font-bold ${
                  difficulty ===
                  level
                    ? "bg-white text-black"
                    : "bg-black border border-gray-700"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <button
            onClick={generateQuiz}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold"
          >
            {loading
              ? "Generating..."
              : "Start Quiz Challenge 🚀"}
          </button>
        </section>
      </main>
    );
  }

  if (quizComplete) {
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

      if (
        !localStorage.getItem(
          "quiz_rewarded"
        )
      ) {
        localStorage.setItem(
          "studyai_xp",
          String(
            currentXP + 10
          )
        );

        localStorage.setItem(
          "studyai_progress",
          String(
            Math.min(
              currentProgress +
                5,
              100
            )
          )
        );

        localStorage.setItem(
          "quiz_rewarded",
          "true"
        );
      }
    }

    return (
      <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6">
        <h1 className="text-5xl font-extrabold mb-6">
          🏆 Quiz Complete!
        </h1>

        <p className="text-2xl mb-4">
          Your Score: {score}/
          {questions.length}
        </p>

        <p className="text-green-400 mb-6">
          +10 XP Earned ⚡
        </p>

        <button
          onClick={() => {
            localStorage.removeItem(
              "quiz_rewarded"
            );

            setQuizStarted(false);
            setTopic("");
            setPdfText("");
          }}
          className="bg-white text-black px-8 py-4 rounded-2xl font-bold"
        >
          Play Again
        </button>
      </main>
    );
  }

  const question =
    questions[currentQuestion];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Progress */}
        <div className="w-full bg-gray-800 rounded-full h-4 mb-4">
          <div
            className="bg-white h-4 rounded-full"
            style={{
              width: `${((currentQuestion + 1) /
                questions.length) *
                100}%`,
            }}
          />
        </div>

        <p className="text-center text-gray-400 mb-8">
          Question{" "}
          {currentQuestion + 1} of{" "}
          {questions.length}
        </p>

        {/* Question */}
        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950">
          <h2 className="text-3xl font-bold mb-8">
            {question.question}
          </h2>

          <div className="grid gap-4">
            {Object.entries(
              question.options
            ).map(
              ([key, value]) => {
                const isCorrect =
                  key ===
                  question.correctAnswer;

                const isSelected =
                  selectedAnswer ===
                  key;

                return (
                  <button
                    key={key}
                    onClick={() =>
                      handleAnswer(
                        key
                      )
                    }
                    className={`p-4 rounded-2xl text-left border transition ${
                      showExplanation
                        ? isCorrect
                          ? "border-green-500"
                          : isSelected
                          ? "border-red-500"
                          : "border-gray-700"
                        : "border-gray-700 hover:border-white"
                    }`}
                  >
                    <span className="font-bold mr-2">
                      {key})
                    </span>
                    {value}
                  </button>
                );
              }
            )}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-8 p-6 border border-gray-800 rounded-2xl bg-black">
              <p className="font-bold mb-3">
                {selectedAnswer ===
                question.correctAnswer
                  ? "✅ Correct!"
                  : "❌ Incorrect!"}
              </p>

              <p className="text-green-400 mb-3">
                Correct Answer:{" "}
                {
                  question.correctAnswer
                }
              </p>

              <p className="text-gray-300 leading-7">
                {
                  question.explanation
                }
              </p>

              <button
                onClick={
                  nextQuestion
                }
                className="w-full mt-6 bg-white text-black py-3 rounded-2xl font-bold"
              >
                Next Question →
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}