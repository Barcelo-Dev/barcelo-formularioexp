import Link from "next/link";
import { getT, type Locale } from "@/lib/i18n";
import { PRIVACY_BLOCKS } from "@/lib/privacy-content";

export const dynamic = "force-dynamic";

export default function PrivacidadPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang: Locale = searchParams.lang === "en" ? "en" : "es";
  const t = getT(lang).privacy;

  return (
    <div className="min-h-[100svh] bg-barcelo-cream">
      {/* Cabecera */}
      <header className="bg-gradient-to-br from-barcelo-deep to-barcelo-teal">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 sm:px-8">
          <span className="font-display text-lg text-white">
            <strong>Barceló</strong>{" "}
            <span className="opacity-90">Guatemala City</span>
          </span>
          <Link
            href={`/?lang=${lang}`}
            className="rounded-full border border-white/30 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {t.back}
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <h1 className="font-display text-2xl font-bold text-barcelo-ink sm:text-3xl">
          {t.title}
        </h1>

        <div className="mt-6 space-y-3">
          {PRIVACY_BLOCKS.map((b, i) => {
            if (b.t === "h1") return null; // el título ya se muestra arriba
            if (b.t === "h")
              return (
                <h2
                  key={i}
                  className="pt-4 font-display text-lg font-bold text-barcelo-deep"
                >
                  {b.x}
                </h2>
              );
            if (b.t === "li")
              return (
                <p
                  key={i}
                  className="ml-4 border-l-2 border-barcelo-teal/30 pl-3 text-sm leading-relaxed text-barcelo-ink/80"
                >
                  {b.x}
                </p>
              );
            return (
              <p key={i} className="text-sm leading-relaxed text-barcelo-ink/80">
                {b.x}
              </p>
            );
          })}
        </div>

        <div className="mt-10 border-t border-barcelo-gray/20 pt-6">
          <Link
            href={`/?lang=${lang}`}
            className="text-sm font-medium text-barcelo-teal underline"
          >
            {t.back}
          </Link>
        </div>
      </main>
    </div>
  );
}
