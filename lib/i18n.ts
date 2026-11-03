export type Locale = "es" | "en";

export const translations = {
  es: {
    langName: "ES",
    switchTo: "English",
    landing: {
      eyebrow: "Solo para huéspedes registrados",
      headline: "Recibe un regalo de bienvenida",
      subtext:
        "Recibe un cupón de promoción y disfruta de las experiencias en Barceló Guatemala City.",
      requireNote: "Registra tu correo para obtener la promoción.",
      footer:
        "Barceló Guatemala City. Uso de datos según nuestra política de privacidad.",
    },
    form: {
      title: "Recibe tu cupón",
      subtitle: "Registra tu correo y te lo enviamos. Toma menos de un minuto.",
      nameLabel: "Nombre",
      optional: "(opcional)",
      namePlaceholder: "Tu nombre",
      roomLabel: "Número de habitación",
      roomPlaceholder: "",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tucorreo@ejemplo.com",
      consentText:
        "Autorizo a Barceló Guatemala City a enviarme ofertas y comunicaciones por correo, y acepto la",
      privacyLink: "política de privacidad",
      submit: "Quiero mi cupón",
      sending: "Enviando…",
      errInvalidEmail: "Escribe un correo electrónico válido.",
      errConsent: "Necesitamos tu autorización para poder enviarte ofertas.",
      errRoomRequired: "Ingresa tu número de habitación.",
      errRoomInvalid: "Ese número de habitación no existe. Verifícalo.",
      errGeneric: "No pudimos completar el registro.",
      errConnection: "Hubo un problema de conexión. Inténtalo de nuevo.",
      errSameDay: "Ya te registraste hoy. Podrás volver a hacerlo más adelante.",
      errSameWeek: "Ya te registraste esta semana. Podrás volver la próxima semana.",
      errMonthLimit: "Alcanzaste el máximo de 3 cupones este mes.",
      successTitle: "¡Listo! Tu cupón va en camino",
      successBodyA: "Enviamos tu cupón a",
      successBodyB: "Ábrelo para ver tu código de descuento.",
      spamNote: "¿No lo ves? Revisa la carpeta de spam o promociones.",
    },
    confirm: {
      invalidTitle: "Enlace no válido",
      invalidIncomplete:
        "El enlace está incompleto. Revisa el correo que te enviamos e inténtalo de nuevo.",
      invalidNotFound:
        "Este enlace no existe o ya expiró. Vuelve a registrarte para recibir uno nuevo.",
      okTitle: "¡Correo confirmado!",
      okInstruction:
        "Guarda este código y preséntalo en recepción o al hacer tu reserva.",
      couponLabel: "Cupón de bienvenida",
      footerNote:
        "Te enviaremos también futuras ofertas exclusivas. Puedes darte de baja cuando quieras.",
    },
    privacy: { title: "Política de privacidad", back: "← Volver" },
  },
  en: {
    langName: "EN",
    switchTo: "Español",
    landing: {
      eyebrow: "For registered guests only",
      headline: "Get a welcome gift",
      subtext:
        "Get a promotional coupon and enjoy the experiences at Barceló Guatemala City.",
      requireNote: "Register your email to get the promotion.",
      footer:
        "Barceló Guatemala City. Data use according to our privacy policy.",
    },
    form: {
      title: "Get your coupon",
      subtitle: "Register your email and we'll send it. Takes less than a minute.",
      nameLabel: "Name",
      optional: "(optional)",
      namePlaceholder: "Your name",
      roomLabel: "Room number",
      roomPlaceholder: "",
      emailLabel: "Email address",
      emailPlaceholder: "youremail@example.com",
      consentText:
        "I authorize Barceló Guatemala City to send me offers and communications by email, and I accept the",
      privacyLink: "privacy policy",
      submit: "I want my coupon",
      sending: "Sending…",
      errInvalidEmail: "Please enter a valid email address.",
      errConsent: "We need your authorization to send you offers.",
      errRoomRequired: "Please enter your room number.",
      errRoomInvalid: "That room number doesn't exist. Please check it.",
      errGeneric: "We couldn't complete your registration.",
      errConnection: "There was a connection problem. Please try again.",
      errSameDay: "You already registered today. You can register again later.",
      errSameWeek: "You already registered this week. Come back next week.",
      errMonthLimit: "You've reached the maximum of 3 coupons this month.",
      successTitle: "Done! Your coupon is on its way",
      successBodyA: "We sent your coupon to",
      successBodyB: "Open it to see your discount code.",
      spamNote: "Don't see it? Check your spam or promotions folder.",
    },
    confirm: {
      invalidTitle: "Invalid link",
      invalidIncomplete:
        "The link is incomplete. Please check the email we sent and try again.",
      invalidNotFound:
        "This link doesn't exist or has expired. Please register again to get a new one.",
      okTitle: "Email confirmed!",
      okInstruction:
        "Save this code and present it at reception or when making your booking.",
      couponLabel: "Welcome coupon",
      footerNote:
        "We'll also send you future exclusive offers. You can unsubscribe anytime.",
    },
    privacy: { title: "Privacy policy", back: "← Back" },
  },
} as const;

export function getT(locale: Locale) {
  return translations[locale];
}

export type T = ReturnType<typeof getT>;
export type FormT = T["form"];
export type ConfirmT = T["confirm"];

// Detecta el idioma del dispositivo. Devuelve "en" solo si el navegador
// está en inglés; en cualquier otro caso, español.
export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "es";
  const lang = (navigator.language || "es").toLowerCase();
  return lang.startsWith("en") ? "en" : "es";
}
