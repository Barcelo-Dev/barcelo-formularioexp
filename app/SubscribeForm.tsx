"use client";

import { useState } from "react";
import type { Locale, FormT } from "@/lib/i18n";
import { isValidRoom } from "@/lib/rooms";

type Status = "idle" | "loading" | "success" | "error";

export default function SubscribeForm({ lang, t }: { lang: Locale; t: FormT }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sentTo, setSentTo] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Traduce el código de error del backend al mensaje del idioma actual.
  function messageForCode(code: string, fallback: string) {
    switch (code) {
      case "room_invalid": return t.errRoomInvalid;
      case "same_day": return t.errSameDay;
      case "same_week": return t.errSameWeek;
      case "month_limit": return t.errMonthLimit;
      default: return fallback || t.errGeneric;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!emailValid) return setErrorMsg(t.errInvalidEmail);
    if (!roomNumber.trim()) return setErrorMsg(t.errRoomRequired);
    if (!isValidRoom(roomNumber)) return setErrorMsg(t.errRoomInvalid);
    if (!consent) return setErrorMsg(t.errConsent);

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, roomNumber, consent, lang }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(messageForCode(data.code, data.error));
        return;
      }

      setSentTo(data.email ?? email);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg(t.errConnection);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-barcelo-teal/10">
          <svg className="h-7 w-7 text-barcelo-teal" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold text-barcelo-ink">{t.successTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-barcelo-gray">
          {t.successBodyA} <span className="font-medium text-barcelo-ink">{sentTo}</span>.{" "}
          {t.successBodyB}
        </p>
        <p className="mt-4 text-xs text-barcelo-gray">{t.spamNote}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-10">
      <h2 className="font-display text-xl font-bold text-barcelo-ink sm:text-2xl">{t.title}</h2>
      <p className="mt-1 text-sm text-barcelo-gray">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 sm:mt-6 sm:space-y-5" noValidate>
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-barcelo-ink">
            {t.nameLabel} <span className="text-barcelo-gray">{t.optional}</span>
          </label>
          <input
            id="fullName" type="text" value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t.namePlaceholder}
            className="w-full rounded-lg border border-barcelo-gray/30 px-4 py-3 text-base text-barcelo-ink outline-none transition focus:border-barcelo-teal focus:ring-2 focus:ring-barcelo-teal/20 sm:py-2.5"
          />
        </div>

        <div>
          <label htmlFor="roomNumber" className="mb-1.5 block text-sm font-medium text-barcelo-ink">
            {t.roomLabel}
          </label>
          <input
            id="roomNumber" type="text" inputMode="numeric" value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            placeholder={t.roomPlaceholder}
            className="w-full rounded-lg border border-barcelo-gray/30 px-4 py-3 text-base text-barcelo-ink outline-none transition focus:border-barcelo-teal focus:ring-2 focus:ring-barcelo-teal/20 sm:py-2.5"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-barcelo-ink">
            {t.emailLabel}
          </label>
          <input
            id="email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="w-full rounded-lg border border-barcelo-gray/30 px-4 py-3 text-base text-barcelo-ink outline-none transition focus:border-barcelo-teal focus:ring-2 focus:ring-barcelo-teal/20 sm:py-2.5"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox" checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-barcelo-gray/40 text-barcelo-teal focus:ring-barcelo-teal/30 sm:h-4 sm:w-4"
          />
          <span className="text-xs leading-relaxed text-barcelo-gray">
            {t.consentText}{" "}
            <a href={`/privacidad?lang=${lang}`} target="_blank" rel="noopener noreferrer" className="font-medium text-barcelo-teal underline">
              {t.privacyLink}
            </a>.
          </span>
        </label>

        {errorMsg && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</p>
        )}

        <button
          type="submit" disabled={status === "loading"}
          className="w-full rounded-lg bg-barcelo-teal px-4 py-3.5 text-base font-semibold text-white transition hover:bg-barcelo-deep focus:outline-none focus:ring-2 focus:ring-barcelo-teal/40 disabled:cursor-not-allowed disabled:opacity-60 sm:py-3"
        >
          {status === "loading" ? t.sending : t.submit}
        </button>
      </form>
    </div>
  );
}
