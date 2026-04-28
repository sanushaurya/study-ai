"use client";

import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setMessage("Please fill all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setMessage(data.error || "Signup failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-gray-800 rounded-2xl p-8 bg-gray-950 shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Start using StudyAI today
        </p>

        <div className="space-y-5">
          <div>
            <label className="block mb-2 text-sm">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-black border border-gray-700 focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-black border border-gray-700 focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-black border border-gray-700 focus:outline-none focus:border-white"
            />
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>

        {message && (
          <p className="text-center text-sm text-gray-300 mt-4">
            {message}
          </p>
        )}

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-white font-semibold">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}