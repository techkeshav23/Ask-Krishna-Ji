"use client";

import { useState } from "react";
import Link from "next/link";

interface FormState {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
  state: string;
  whatsapp: string;
  reference: string;
}

const EMPTY: FormState = {
  name: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  city: "",
  state: "",
  whatsapp: "",
  reference: "",
};

export default function PracharakSignupPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const update = (k: keyof FormState) => (v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Minimal client-side validation. Server re-validates everything.
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setErrorMsg("Please fill name, phone and email.");
      return;
    }
    if (!/^\+?[0-9]{10,13}$/.test(form.phone.replace(/\s/g, ""))) {
      setErrorMsg("Phone number looks invalid.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg("Email looks invalid.");
      return;
    }
    if (form.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/pracharak-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
          city: form.city,
          state: form.state,
          whatsapp: form.whatsapp,
          reference: form.reference,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }
      // Signup API issues a session cookie. Hard-redirect so the server
      // layout sees the new cookie and renders the portal.
      window.location.href = "/pracharak-portal";
    } catch {
      setErrorMsg("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-xl mx-auto">
        <Link
          href="/"
          className="text-text-secondary hover:text-text-primary text-sm"
        >
          ← Home
        </Link>

        <div className="text-center mt-4 mb-8">
          <div className="text-4xl mb-2">🪷</div>
          <h1 className="text-3xl font-bold mb-2">
            गीता के प्रचारक बनें
          </h1>
          <p className="text-text-secondary text-sm">
            Become a Geeta Pracharak — spread Krishna Ji's message and earn
            by selling premium subscriptions at bulk-rate.
          </p>
        </div>

        <form onSubmit={onSubmit} className="card space-y-4">
          <Field
            label="पूरा नाम / Full name *"
            value={form.name}
            onChange={update("name")}
            required
            placeholder="आपका नाम"
          />
          <Field
            label="फ़ोन / Phone *"
            value={form.phone}
            onChange={update("phone")}
            required
            placeholder="10-digit Indian mobile"
            inputMode="tel"
          />
          <Field
            label="WhatsApp (if different from phone)"
            value={form.whatsapp}
            onChange={update("whatsapp")}
            placeholder="Optional"
            inputMode="tel"
          />
          <Field
            label="ईमेल / Email *"
            value={form.email}
            onChange={update("email")}
            required
            placeholder="you@example.com"
            inputMode="email"
            autoCapitalize="none"
          />
          <Field
            label="Password * (min 8 characters)"
            value={form.password}
            onChange={update("password")}
            required
            placeholder="Choose a strong password"
            type="password"
            autoCapitalize="none"
          />
          <Field
            label="Confirm Password *"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            required
            placeholder="Re-type password"
            type="password"
            autoCapitalize="none"
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="शहर / City"
              value={form.city}
              onChange={update("city")}
              placeholder="e.g. Lucknow"
            />
            <Field
              label="राज्य / State"
              value={form.state}
              onChange={update("state")}
              placeholder="e.g. UP"
            />
          </div>
          <Field
            label="किसने बताया? / How did you hear about us?"
            value={form.reference}
            onChange={update("reference")}
            placeholder="Optional"
          />

          {errorMsg ? (
            <p className="text-sm text-red-300 bg-red-900/20 border border-red-500/40 rounded-lg p-3">
              {errorMsg}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? "Creating account..." : "Sign up + continue →"}
          </button>

          <p className="text-xs text-text-muted text-center">
            You'll be taken to your dashboard to activate by purchasing
            your first batch of codes (₹2,500 for 5).
          </p>

          <p className="text-xs text-text-muted text-center pt-2">
            Already a pracharak?{" "}
            <Link
              href="/pracharak-portal/login"
              className="text-saffron hover:text-saffron-light"
            >
              Login →
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  type?: "text" | "password";
}
const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  required,
  placeholder,
  inputMode = "text",
  autoCapitalize,
  type = "text",
}) => (
  <label className="block">
    <span className="text-sm font-semibold text-text-primary mb-1 block">
      {label}
    </span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      inputMode={inputMode}
      autoCapitalize={autoCapitalize}
      className="w-full bg-bg-primary border border-saffron/30 rounded-lg
                 px-3 py-2 text-text-primary placeholder:text-text-muted
                 focus:outline-none focus:border-saffron transition-colors"
    />
  </label>
);
