"use client";

import { useState } from "react";

type Status =
  | "pending"
  | "pending_activation"
  | "approved"
  | "rejected"
  | "revoked";

interface Props {
  id: string;
  status: Status;
  name: string;
}

export default function PracharakActions({ id, status, name }: Props) {
  const [busy, setBusy] = useState<"revoke" | "restore" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const call = async (action: "revoke" | "restore") => {
    setBusy(action);
    setMsg(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/pracharaks/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Action failed.");
        return;
      }
      setMsg(data.message || "Done.");
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(null);
    }
  };

  // Approved pracharaks: admin can revoke if they misuse the platform.
  if (status === "approved") {
    return (
      <div className="flex flex-col items-end gap-2 min-w-[140px]">
        <button
          disabled={busy === "revoke"}
          onClick={() => {
            if (
              !confirm(
                `Revoke ${name}? They will not be able to log in. Codes already redeemed stay valid for end users.`
              )
            )
              return;
            void call("revoke");
          }}
          className="text-xs px-3 py-1.5 rounded-md bg-red-700 text-white font-semibold hover:bg-red-600 disabled:opacity-60"
        >
          {busy === "revoke" ? "..." : "🚫 Revoke"}
        </button>
        {msg ? <span className="text-[11px] text-green-300">{msg}</span> : null}
        {error ? <span className="text-[11px] text-red-300">{error}</span> : null}
      </div>
    );
  }

  // Revoked pracharaks: admin can restore them.
  if (status === "revoked") {
    return (
      <div className="flex flex-col items-end gap-2 min-w-[140px]">
        <button
          disabled={busy === "restore"}
          onClick={() => call("restore")}
          className="text-xs px-3 py-1.5 rounded-md bg-green-700 text-white font-semibold hover:bg-green-600 disabled:opacity-60"
        >
          {busy === "restore" ? "..." : "♻️ Restore"}
        </button>
        {msg ? <span className="text-[11px] text-green-300">{msg}</span> : null}
        {error ? <span className="text-[11px] text-red-300">{error}</span> : null}
      </div>
    );
  }

  // pending_activation: signed up but hasn't paid first batch yet — no
  // admin action needed (it's self-service; payment auto-approves).
  // pending (legacy) / rejected: no actions, just informational.
  if (status === "pending_activation") {
    return (
      <span className="text-[11px] text-text-muted text-right">
        Awaiting first purchase
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="text-[11px] text-text-muted text-right">
        Legacy record — user must re-signup
      </span>
    );
  }
  return <span className="text-xs text-text-muted">Closed</span>;
}
