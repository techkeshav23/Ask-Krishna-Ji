"use client";

import { useState } from "react";
import Link from "next/link";

export default function PracharakLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "pracharak" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setSubmitting(false);
        return;
      }
      window.location.href = "/pracharak-portal";
    } catch {
      setError("Network error.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="card max-w-md w-full">
        <Link
          href="/"
          className="text-text-secondary hover:text-text-primary text-sm"
        >
          ← Home
        </Link>
        <div className="text-center my-6">
          <div className="text-4xl mb-2">🪷</div>
          <h1 className="text-2xl font-bold">Pracharak Portal</h1>
          <p className="text-text-secondary text-sm mt-1">
            Login with the email + password you chose at signup.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold mb-1 block">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoCapitalize="none"
              className="w-full bg-bg-primary border border-saffron/30 rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-saffron"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold mb-1 block">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-bg-primary border border-saffron/30 rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-saffron"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-300 bg-red-900/20 border border-red-500/40 rounded-lg p-3">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-xs text-text-muted text-center pt-2">
            Not a pracharak yet?{" "}
            <Link
              href="/pracharak"
              className="text-saffron hover:text-saffron-light"
            >
              Apply here →
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
