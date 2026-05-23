"use client";

import { useState } from "react";

interface PracharakOption {
  id: string;
  name: string;
  email: string;
}

interface Props {
  pracharaks: PracharakOption[];
}

export default function GenerateCodesForm({ pracharaks }: Props) {
  const [pracharakId, setPracharakId] = useState(pracharaks[0]?.id || "");
  const [qty, setQty] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!pracharakId) {
      setError("Select a pracharak first.");
      return;
    }
    if (qty < 1 || qty > 500) {
      setError("Quantity must be between 1 and 500.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/codes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pracharakId, qty }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed.");
        return;
      }
      setResult(data.codes as string[]);
    } catch {
      setError("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (pracharaks.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        No approved pracharaks yet. Approve a pracharak first from the
        Pracharaks page.
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-wrap gap-3 items-end">
        <label className="flex-1 min-w-[200px]">
          <span className="text-sm font-semibold mb-1 block">Pracharak</span>
          <select
            value={pracharakId}
            onChange={(e) => setPracharakId(e.target.value)}
            className="w-full bg-bg-primary border border-saffron/30 rounded-lg px-3 py-2 text-text-primary"
          >
            {pracharaks.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.email})
              </option>
            ))}
          </select>
        </label>
        <label className="w-32">
          <span className="text-sm font-semibold mb-1 block">Quantity</span>
          <input
            type="number"
            value={qty}
            min={1}
            max={500}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full bg-bg-primary border border-saffron/30 rounded-lg px-3 py-2 text-text-primary"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
        >
          {submitting ? "Generating..." : "Generate + Email"}
        </button>
      </form>

      {error ? (
        <p className="text-sm text-red-300 bg-red-900/20 border border-red-500/40 rounded-lg p-3 mt-3">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-4 bg-green-900/20 border border-green-500/40 rounded-lg p-4">
          <p className="text-green-300 font-bold mb-2">
            ✓ Generated {result.length} codes
          </p>
          <p className="text-xs text-text-secondary mb-3">
            Emailed to pracharak. Also displayed here for admin reference
            (refresh page to hide).
          </p>
          <pre className="text-xs font-mono bg-bg-primary p-3 rounded overflow-x-auto whitespace-pre-wrap">
            {result.join("\n")}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
