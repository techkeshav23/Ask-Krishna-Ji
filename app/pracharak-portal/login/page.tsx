"use client";

import { useState } from "react";
import Link from "next/link";
import { ChapterMark, Danda, Lotus } from "@/components/Ornaments";

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
        setError(data.error || "Login failed. Check your email and password.");
        setSubmitting(false);
        return;
      }
      window.location.href = "/pracharak-portal";
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <div className="w-full max-w-md">
        {/* Top breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-saffron-deep"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M14 8 H3 M7 4 L3 8 L7 12" />
            </svg>
            Home
          </Link>
        </div>

        {/* The card */}
        <div className="form-card">
          {/* Crown ornament */}
          <div className="mb-8 flex flex-col items-center text-center">
            <Lotus className="mb-3 h-8 w-auto text-saffron-deep" />
            <div className="mb-3 flex items-center gap-2 text-gold-deep">
              <ChapterMark className="h-4 w-auto" />
              <span className="eyebrow">Pracharak Portal</span>
              <ChapterMark className="h-4 w-auto" />
            </div>
            <h1 className="font-display text-3xl font-bold text-ink-deep">
              Sign in to your seat
            </h1>
            <p className="mt-3 max-w-xs text-base leading-relaxed text-ink-soft">
              Use the email and password you chose when you applied.
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <div className="mb-5">
              <label htmlFor="px-email" className="form-label">
                Email Address
              </label>
              <input
                id="px-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoCapitalize="none"
                autoComplete="email"
                placeholder="you@example.com"
                className="form-input"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="px-password" className="form-label">
                Password
              </label>
              <input
                id="px-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            {error ? (
              <div role="alert" className="form-alert mb-5">
                {error}
              </div>
            ) : null}

            <button type="submit" disabled={submitting} className="btn-solid">
              {submitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-parchment border-t-transparent" />
                  Signing in…
                </>
              ) : (
                <>
                  <Danda className="text-gold-soft" />
                  Sign in
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-8 border-t border-ink/15 pt-6 text-center">
            <p className="text-sm text-ink-soft">
              Not a pracharak yet?{" "}
              <Link href="/pracharak" className="form-link">
                Apply here →
              </Link>
            </p>
          </div>
        </div>

        {/* Sub-card devotional line */}
        <p className="mt-8 text-center font-deva text-sm font-semibold text-ink-fade">
          🙏 गीता का प्रचार करने वालों का स्वागत है।
        </p>
      </div>
    </main>
  );
}
