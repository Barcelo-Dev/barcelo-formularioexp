"use client";

import { useEffect, useState } from "react";
import { getT, detectLocale, type Locale } from "@/lib/i18n";
import SubscribeForm from "./SubscribeForm";

export default function FormLanding() {
  const [lang, setLang] = useState<Locale>("es");
  const t = getT(lang);

  // Detecta el idioma del dispositivo al cargar (cambio 2).
  useEffect(() => {
    setLang(detectLocale());
  }, []);

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Foto del hotel de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
        aria-hidden
      />
      {/* Degradado teal */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(20,50,61,0.93) 0%, rgba(31,92,120,0.78) 42%, rgba(48,157,186,0.42) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        {/* Cabecera */}
        <header className="flex items-center justify-between gap-3 px-5 pt-6 sm:px-10 sm:pt-8">
          <img
            src="/logo-white.png"
            alt="Barceló Guatemala City"
            className="h-6 w-auto sm:h-8"
          />
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
            aria-label={t.switchTo}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a8.25 8.25 0 005.25-14.325M12 21a8.25 8.25 0 01-5.25-14.325M3 12h18" />
            </svg>
            {t.switchTo}
          </button>
        </header>

        {/* Bloque central */}
        <div className="flex flex-1 items-center px-5 py-8 sm:px-10">
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
            <div className="max-w-xl text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-barcelo-gold sm:tracking-[0.25em]">
                {t.landing.eyebrow}
              </span>
              <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] sm:mt-5 sm:text-4xl lg:text-5xl">
                {t.landing.headline}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/85 sm:mt-5 sm:text-lg">
                {t.landing.subtext}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <svg className="h-4 w-4 shrink-0 text-barcelo-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {t.landing.requireNote}
              </p>
            </div>

            <div className="w-full">
              <SubscribeForm lang={lang} t={t.form} />
            </div>
          </div>
        </div>

        <footer className="px-5 pb-5 text-xs text-white/60 sm:px-10">
          © {new Date().getFullYear()} {t.landing.footer}
        </footer>
      </div>
    </main>
  );
}
