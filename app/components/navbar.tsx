export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-800 bg-black/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl md:text-3xl font-extrabold tracking-tight text-white hover:opacity-90 transition"
        >
          StudyAI
        </a>

        {/* Navigation */}
        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm md:text-base">
          <a
            href="/dashboard"
            className="text-gray-300 hover:text-white transition"
          >
            Dashboard
          </a>

          <a
            href="/summarizer"
            className="text-gray-300 hover:text-white transition"
          >
            Summarizer
          </a>

          <a
            href="/quiz"
            className="text-gray-300 hover:text-white transition"
          >
            Quiz
          </a>

          <a
            href="/tutor"
            className="text-gray-300 hover:text-white transition"
          >
            Tutor
          </a>

          <a
            href="/signup"
            className="bg-white text-black px-4 py-2 rounded-xl font-semibold hover:scale-105 transition"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}