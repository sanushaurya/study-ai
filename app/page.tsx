export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4">
          AI-Powered Learning OS
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-5xl">
          Transform Study Material Into
          <span className="block text-gray-300">
            Summaries, Quizzes & AI Tutoring
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-2xl text-gray-400 max-w-3xl leading-relaxed">
          StudyAI helps students convert notes, PDFs, and concepts into
          premium Mind Notes, adaptive quizzes, and personalized tutoring.
        </p>

        <div className="mt-10 flex flex-col md:flex-row gap-4">
          <a
            href="/signup"
            className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
          >
            Get Started Free
          </a>

          <a
            href="/dashboard"
            className="border border-gray-700 px-8 py-4 rounded-2xl font-bold hover:border-white transition"
          >
            Explore Dashboard
          </a>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-8 px-8 pb-24 max-w-7xl mx-auto">
        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950 hover:border-gray-600 transition">
          <h2 className="text-2xl font-bold mb-4">🧠 AI Summarizer</h2>
          <p className="text-gray-400 leading-relaxed">
            Convert chapters, notes, and PDFs into premium Mind Notes built
            for memory, revision, and deep understanding.
          </p>
        </div>

        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950 hover:border-gray-600 transition">
          <h2 className="text-2xl font-bold mb-4">🧪 AI Quiz Generator</h2>
          <p className="text-gray-400 leading-relaxed">
            Generate exam-focused quizzes with explanations to test recall,
            understanding, and concept mastery.
          </p>
        </div>

        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950 hover:border-gray-600 transition">
          <h2 className="text-2xl font-bold mb-4">🤖 AI Tutor</h2>
          <p className="text-gray-400 leading-relaxed">
            Ask questions, break down difficult topics, and learn from a
            personal AI tutor anytime.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="text-center px-6 pb-24">
        <h2 className="text-3xl md:text-5xl font-bold">
          Learn Faster. Remember Longer.
        </h2>

        <p className="mt-4 text-gray-400 text-lg">
          Built for modern students who want more than passive studying.
        </p>

        <a
          href="/signup"
          className="inline-block mt-8 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
        >
          Start Learning Smarter
        </a>
      </section>
    </main>
  );
}