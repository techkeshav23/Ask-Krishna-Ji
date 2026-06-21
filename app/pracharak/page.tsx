"use client";

import { useState } from "react";
import Link from "next/link";
import { ChapterMark, Danda, DiamondRule, Lotus } from "@/components/Ornaments";

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
      window.location.href = "/pracharak-portal";
    } catch {
      setErrorMsg("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <div className="w-full max-w-2xl">
        {/* Breadcrumb */}
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

        {/* Page header */}
        <div className="mb-8 text-center">
          <Lotus className="mx-auto mb-4 h-10 w-auto text-saffron-deep" />
          <div className="mb-4 inline-flex items-center gap-3 text-gold-deep">
            <ChapterMark className="h-4 w-auto" />
            <span className="eyebrow">An Invitation</span>
            <ChapterMark className="h-4 w-auto" />
          </div>
          <h1 className="font-display text-display-md font-bold text-balance text-ink-deep">
            Become a{" "}
            <span className="italic text-saffron-deep">Gita Pracharak.</span>
          </h1>
          <p className="mt-3 font-deva text-xl font-semibold text-ink-soft">
            गीता के प्रचारक बनें।
          </p>
          <p className="mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-ink-soft">
            Spread Krishna Ji's message and earn by selling premium
            subscriptions at the special bulk rate.
          </p>
        </div>

        {/* Existing-pracharak shortcut — gold-foil card linking to login */}
        <div className="foil-card relative mx-auto mb-10 max-w-md p-5 text-center">
          <p className="eyebrow mb-2 text-gold-deep">Already Signed Up?</p>
          <Link
            href="/pracharak-portal/login"
            className="form-link inline-flex items-center gap-1.5 text-base"
          >
            Open the Pracharak Portal
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="mb-10 flex items-center justify-center gap-4 text-gold-deep">
          <span className="h-px w-16 bg-gold-deep/40" />
          <span className="eyebrow">Or Create a New Account</span>
          <span className="h-px w-16 bg-gold-deep/40" />
        </div>

        {/* The signup form */}
        <form onSubmit={onSubmit} noValidate className="form-card">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-ink-deep">
              Apply to be a Pracharak
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Fields marked <span className="text-saffron-deep">*</span> are
              required.
            </p>
          </div>

          {/* Section 1 — identity */}
          <SectionLabel>Identity</SectionLabel>
          <Field
            id="px-name"
            label="Full Name *"
            placeholder="आपका नाम"
            value={form.name}
            onChange={update("name")}
            required
            autoCapitalize="words"
            autoComplete="name"
          />
          <Field
            id="px-email"
            label="Email *"
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
            required
            type="email"
            inputMode="email"
            autoCapitalize="none"
            autoComplete="email"
          />

          {/* Section 2 — contact */}
          <SectionLabel>Contact</SectionLabel>
          <Field
            id="px-phone"
            label="Mobile Number *"
            placeholder="10-digit Indian mobile"
            value={form.phone}
            onChange={update("phone")}
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
          <Field
            id="px-whatsapp"
            label="WhatsApp (if different)"
            placeholder="Optional"
            value={form.whatsapp}
            onChange={update("whatsapp")}
            type="tel"
            inputMode="tel"
          />

          {/* Section 3 — credentials */}
          <SectionLabel>Choose a Password</SectionLabel>
          <Field
            id="px-pass"
            label="Password *"
            placeholder="Minimum 8 characters"
            value={form.password}
            onChange={update("password")}
            required
            type="password"
            autoCapitalize="none"
            autoComplete="new-password"
            help="Use a strong password — you'll log in with this and your email."
          />
          <Field
            id="px-pass-c"
            label="Confirm Password *"
            placeholder="Re-type your password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            required
            type="password"
            autoCapitalize="none"
            autoComplete="new-password"
          />

          {/* Section 4 — optional */}
          <SectionLabel>About You (Optional)</SectionLabel>
          <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              id="px-city"
              label="City"
              placeholder="e.g. Lucknow"
              value={form.city}
              onChange={update("city")}
              inline
            />
            <Field
              id="px-state"
              label="State"
              placeholder="e.g. Uttar Pradesh"
              value={form.state}
              onChange={update("state")}
              inline
            />
          </div>
          <Field
            id="px-ref"
            label="How did you hear about us?"
            placeholder="A friend, social media, etc."
            value={form.reference}
            onChange={update("reference")}
          />

          {errorMsg ? (
            <div role="alert" className="form-alert mb-5">
              {errorMsg}
            </div>
          ) : null}

          <button type="submit" disabled={submitting} className="btn-solid">
            {submitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-parchment border-t-transparent" />
                Creating your account…
              </>
            ) : (
              <>
                <Danda className="text-gold-soft" />
                Apply &amp; Continue
              </>
            )}
          </button>

          <p className="form-help mt-4 text-center">
            After signup you&apos;ll land on your dashboard. Activate by
            purchasing your first batch of codes (₹2,500 for 5 memberships).
          </p>
        </form>

        {/* Closing divider */}
        <div className="mt-12 flex items-center justify-center text-gold-deep">
          <DiamondRule className="w-full max-w-md opacity-80" />
        </div>
        <p className="mt-6 text-center font-deva text-sm font-semibold text-ink-fade">
          🙏 गीता का प्रचार करने में आपके सहयोग के लिए धन्यवाद।
        </p>
      </div>
    </main>
  );
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 mt-6 flex items-center gap-3 first:mt-0">
    <span className="eyebrow text-gold-deep">{children}</span>
    <span className="h-px flex-1 bg-gold-deep/30" />
  </div>
);

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: string;
  type?: "text" | "password" | "email" | "tel";
  help?: string;
  inline?: boolean;
}

const Field: React.FC<FieldProps> = ({
  id,
  label,
  value,
  onChange,
  required,
  placeholder,
  inputMode = "text",
  autoCapitalize,
  autoComplete,
  type = "text",
  help,
  inline = false,
}) => (
  <div className={inline ? "" : "mb-5"}>
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      inputMode={inputMode}
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      className="form-input"
    />
    {help ? <span className="form-help">{help}</span> : null}
  </div>
);
