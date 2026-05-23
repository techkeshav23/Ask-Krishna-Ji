"use client";

import { useState } from "react";

type Status = "pending" | "approved" | "rejected";

interface Props {
  id: string;
  status: Status;
  email: string;
  name: string;
}

export default function PracharakActions({ id, status, email, name }: Props) {
  const [busy, setBusy] = useState<"approve" | "reject" | "resend" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const call = async (
    action: "approve" | "reject" | "resend",
    body?: Record<string, unknown>
  ) => {
    setBusy(action);
    setMsg(null);
    setError(null);
    setGeneratedPassword(null);
    try {
      const res = await fetch(`/api/admin/pracharaks/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Action failed.");
        return;
      }
      setMsg(data.message || "Done.");
      if (data.password) setGeneratedPassword(data.password as string);
      // Refresh server data
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(null);
    }
  };

  if (status === "approved") {
    return (
      <div className="flex flex-col items-end gap-2 min-w-[140px]">
        <button
          disabled={busy === "resend"}
          onClick={() => call("resend")}
          className="text-xs px-3 py-1.5 rounded-md bg-gold text-white font-semibold hover:bg-gold-dim disabled:opacity-60"
        >
          {busy === "resend" ? "..." : "🔁 Resend password"}
        </button>
        {generatedPassword ? (
          <div className="text-[11px] bg-yellow-900/30 border border-yellow-500/40 rounded p-2 max-w-[180px] break-all">
            <div className="font-bold text-yellow-200">New password:</div>
            <code className="text-yellow-100">{generatedPassword}</code>
            <div className="text-yellow-300 mt-1">
              Share with pracharak via WhatsApp.
            </div>
          </div>
        ) : null}
        {msg ? <span className="text-[11px] text-green-300">{msg}</span> : null}
        {error ? <span className="text-[11px] text-red-300">{error}</span> : null}
      </div>
    );
  }

  if (status === "rejected") {
    return <span className="text-xs text-text-muted">Closed</span>;
  }

  return (
    <div className="flex flex-col items-end gap-2 min-w-[140px]">
      <div className="flex gap-2">
        <button
          disabled={busy === "approve"}
          onClick={() => call("approve")}
          className="text-xs px-3 py-1.5 rounded-md bg-green-700 text-white font-semibold hover:bg-green-600 disabled:opacity-60"
        >
          {busy === "approve" ? "..." : "✓ Approve"}
        </button>
        <button
          disabled={busy === "reject"}
          onClick={() => {
            if (!confirm(`Reject ${name}? They will not be able to log in.`)) return;
            void call("reject");
          }}
          className="text-xs px-3 py-1.5 rounded-md bg-red-700 text-white font-semibold hover:bg-red-600 disabled:opacity-60"
        >
          {busy === "reject" ? "..." : "✗ Reject"}
        </button>
      </div>
      {generatedPassword ? (
        <div className="text-[11px] bg-yellow-900/30 border border-yellow-500/40 rounded p-2 max-w-[180px] break-all">
          <div className="font-bold text-yellow-200">Password set:</div>
          <code className="text-yellow-100">{generatedPassword}</code>
          <div className="text-yellow-300 mt-1">
            Emailed to <strong>{email}</strong>. Also share via WhatsApp for backup.
          </div>
        </div>
      ) : null}
      {msg ? <span className="text-[11px] text-green-300">{msg}</span> : null}
      {error ? <span className="text-[11px] text-red-300">{error}</span> : null}
    </div>
  );
}
