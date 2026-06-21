"use client";

import { useState } from "react";
import Link from "next/link";
import { ChapterMark } from "@/components/Ornaments";

export default function AdminLoginPage() {
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
        body: JSON.stringify({ email, password, role: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed. Check your credentials.");
        setSubmitting(false);
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <div className="w-full max-w-md">
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

        <div className="form-card">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-3 flex items-center gap-2 text-gold-deep">
              <ChapterMark className="h-4 w-auto" />
              <span className="eyebrow">Restricted</span>
              <ChapterMark className="h-4 w-auto" />
            </div>
            <h1 className="font-display text-3xl font-bold text-ink-deep">
              Admin Sign-in
            </h1>
            <p className="mt-2 text-sm italic text-ink-soft">
              Authorised personnel only.
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <div className="mb-5">
              <label htmlFor="adm-email" className="form-label">
                Email Address
              </label>
              <input
                id="adm-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoCapitalize="none"
                autoComplete="username"
                placeholder="admin@example.com"
                className="form-input"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="adm-pass" className="form-label">
                Password
              </label>
              <input
                id="adm-pass"
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
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
