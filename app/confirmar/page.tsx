import { createAdminClient } from "@/lib/supabase/admin";
import { getT, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero.jpg')" }} aria-hidden />
      <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(20,50,61,0.93) 0%, rgba(31,92,120,0.78) 42%, rgba(48,157,186,0.42) 100%)" }} aria-hidden />
      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <header className="px-5 pt-6 sm:px-10 sm:pt-8">
          <img src="/logo-white.png" alt="Barceló Guatemala City" className="h-6 w-auto sm:h-8" />
        </header>
        <div className="flex flex-1 items-center justify-center px-5 py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </main>
  );
}

function ErrorCard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-10">
      <h1 className="font-display text-2xl font-bold text-barcelo-ink">{title}</h1>
      <p className="mt-3 text-sm text-barcelo-gray">{message}</p>
    </div>
  );
}

export default async function ConfirmarPage({ searchParams }: { searchParams: { token?: string; lang?: string } }) {
  const lang: Locale = searchParams.lang === "en" ? "en" : "es";
  const t = getT(lang).confirm;
  const token = searchParams.token;

  if (!token) {
    return <Shell><ErrorCard title={t.invalidTitle} message={t.invalidIncomplete} /></Shell>;
  }

  const supabase = createAdminClient();
  const { data: sub } = await supabase
    .from("subscribers")
    .select("id, confirmed, coupon_code")
    .eq("confirm_token", token)
    .single();

  if (!sub) {
    return <Shell><ErrorCard title={t.invalidTitle} message={t.invalidNotFound} /></Shell>;
  }

  if (!sub.confirmed) {
    await supabase
      .from("subscribers")
      .update({ confirmed: true, confirmed_at: new Date().toISOString() })
      .eq("id", sub.id);
  }

  return (
    <Shell>
      <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-barcelo-teal/10">
            <svg className="h-6 w-6 text-barcelo-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-barcelo-ink">{t.okTitle}</h1>
          <p className="mt-2 text-sm text-barcelo-gray">{t.okInstruction}</p>
        </div>
        <div className="ticket mt-7 overflow-hidden rounded-xl bg-barcelo-cream">
          <div className="bg-gradient-to-br from-barcelo-deep to-barcelo-teal px-6 py-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-barcelo-gold">{t.couponLabel}</p>
            <p className="mt-1 text-sm text-white/80">Barceló Guatemala City</p>
          </div>
          <div className="border-t-2 border-dashed border-barcelo-gray/30 px-6 py-6 text-center">
            <p className="font-mono text-2xl font-bold tracking-wider text-barcelo-ink">{sub.coupon_code}</p>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-barcelo-gray">{t.footerNote}</p>
      </div>
    </Shell>
  );
}
