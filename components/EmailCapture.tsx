"use client";

import { FormEvent, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function EmailCapture({ lang }: { lang: Lang }) {
  const tr = t[lang].home;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "unavailable">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const body = (await response.json()) as { error?: string; status?: string };
      if (response.ok) {
        setStatus("success");
        setEmail("");
        setMessage(
          lang === "en"
            ? "You're on the list. Check your inbox for future updates."
            : "Du bist eingetragen. Updates folgen per E-Mail."
        );
        return;
      }

      if (response.status === 503) {
        setStatus("unavailable");
        setMessage(
          lang === "en"
            ? "Newsletter backend is not configured yet."
            : "Das Newsletter-Backend ist noch nicht konfiguriert."
        );
        return;
      }

      setStatus("error");
      setMessage(
        body.error ||
          (lang === "en"
            ? "Signup failed. Please try again."
            : "Anmeldung fehlgeschlagen. Bitte erneut versuchen.")
      );
    } catch {
      setStatus("error");
      setMessage(
        lang === "en"
          ? "Network error. Please try again."
          : "Netzwerkfehler. Bitte erneut versuchen."
      );
    }
  }

  return (
    <div className="content-shell">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-black uppercase tracking-tight mt-0 mb-2">
            {tr.newsletter}
          </h2>
          <p className="text-ink-2 text-sm">{tr.newsletterDesc}</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={tr.emailPlaceholder}
              required
              className="min-w-[260px] rounded-lg border border-[rgba(15,23,42,0.15)] bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent-2"
            />
            <button
              type="submit"
              className="btn btn-primary whitespace-nowrap"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? lang === "en"
                  ? "Joining..."
                  : "Wird eingetragen..."
                : tr.joinList}
            </button>
          </div>

          {(status === "success" || status === "error" || status === "unavailable") && (
            <div className={`text-sm ${status === "success" ? "text-accent-4" : "text-accent"}`}>
              {message}
            </div>
          )}

          {status === "unavailable" && (
            <a
              href="mailto:golifehacks@gmx.de?subject=Newsletter%20signup"
              className="btn btn-secondary whitespace-nowrap text-center"
            >
              {lang === "en" ? "Join via email" : "Per E-Mail anmelden"}
            </a>
          )}
        </form>
      </div>
    </div>
  );
}
