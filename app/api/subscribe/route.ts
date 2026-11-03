import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendCouponEmail } from "@/lib/email";
import { isValidRoom } from "@/lib/rooms";

const schema = z.object({
  email: z.string().email("Correo inválido").max(255),
  fullName: z.string().max(120).optional().nullable(),
  roomNumber: z.string().max(20),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Se requiere autorización." }),
  }),
  lang: z.enum(["es", "en"]).default("es"),
});

// Fecha local de Guatemala (UTC-6) en año/mes/día.
function gtYMD(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Guatemala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

// Semana ISO (año + número de semana) a partir de un año/mes/día.
function isoWeek(y: number, m: number, d: number) {
  const date = new Date(Date.UTC(y, m - 1, d));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const fdn = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - fdn + 3);
  const week =
    1 + Math.round((date.getTime() - firstThursday.getTime()) / (7 * 864e5));
  return { isoYear: date.getUTCFullYear(), week };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Datos inválidos.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { email, fullName, roomNumber, consent, lang } = parsed.data;
  const cleanEmail = email.toLowerCase().trim();
  const cleanRoom = roomNumber.trim();
  const nowIso = new Date().toISOString();

  // Validación de habitación en el servidor (no confiar solo en el cliente).
  if (!isValidRoom(cleanRoom)) {
    return NextResponse.json(
      { code: "room_invalid", error: "Habitación no válida." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // --- Límite de frecuencia por correo (3/mes, no mismo día, no misma semana) ---
  const since = new Date(Date.now() - 40 * 864e5).toISOString();
  const { data: prev } = await supabase
    .from("subscribers")
    .select("created_at")
    .eq("email", cleanEmail)
    .gte("created_at", since);

  if (prev && prev.length > 0) {
    const today = gtYMD(new Date());
    const todayWeek = isoWeek(today.y, today.m, today.d);
    let monthCount = 0;

    for (const row of prev) {
      const p = gtYMD(new Date(row.created_at));
      // mismo mes calendario
      if (p.y === today.y && p.m === today.m) monthCount++;
      // mismo día
      if (p.y === today.y && p.m === today.m && p.d === today.d) {
        return NextResponse.json(
          { code: "same_day", error: "Ya te registraste hoy." },
          { status: 429 }
        );
      }
      // misma semana ISO
      const w = isoWeek(p.y, p.m, p.d);
      if (w.isoYear === todayWeek.isoYear && w.week === todayWeek.week) {
        return NextResponse.json(
          { code: "same_week", error: "Ya te registraste esta semana." },
          { status: 429 }
        );
      }
    }

    if (monthCount >= 3) {
      return NextResponse.json(
        { code: "month_limit", error: "Máximo de 3 este mes." },
        { status: 429 }
      );
    }
  }

  // --- Crear registro (cada registro válido genera su propio cupón) ---
  // El código ahora se envía directo en el correo, así que el registro
  // queda confirmado de una vez: recibir el correo ya valida la dirección.
  const { data, error } = await supabase
    .from("subscribers")
    .insert({
      email: cleanEmail,
      full_name: fullName?.trim() || null,
      room_number: cleanRoom,
      consent,
      consent_at: nowIso,
      confirmed: true,
      confirmed_at: nowIso,
      source: "web_form",
    })
    .select("coupon_code")
    .single();

  if (error) {
    console.error("Error al guardar suscriptor:", error);
    return NextResponse.json(
      { error: "No pudimos completar el registro. Inténtalo más tarde." },
      { status: 500 }
    );
  }

  // Enviar el correo con el código del cupón visible.
  // baseUrl: para que la imagen del banner cargue con ruta absoluta.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  try {
    await sendCouponEmail({
      to: cleanEmail,
      name: fullName?.trim() || null,
      couponCode: data.coupon_code,
      lang,
      baseUrl,
    });
  } catch (e) {
    console.error("Error al enviar el correo:", e);
    return NextResponse.json(
      { error: "Guardamos tu registro, pero no pudimos enviar el correo." },
      { status: 502 }
    );
  }

  return NextResponse.json({ emailSent: true, email: cleanEmail });
}
