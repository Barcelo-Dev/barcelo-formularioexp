# Barceló Guatemala City — Formulario público

## Cambios recientes
- Bilingüe con detección automática del idioma del dispositivo (+ botón ES/EN).
- Número de habitación obligatorio y validado contra la lista real (lib/rooms.ts).
- Un correo puede registrarse hasta 3 veces por mes (no mismo día ni misma semana).
- Página de política de privacidad en /privacidad.
- Diseño responsive mejorado para móvil.

## IMPORTANTE antes de usar
1. Ejecuta en Supabase (SQL Editor) el archivo
   `supabase/migracion-registros-multiples.sql` (permite varios registros por correo).
2. **Verifica la lista de habitaciones** en `lib/rooms.ts` contra el listado
   oficial del hotel. Se generó desde las imágenes; revisa que no falte ni sobre ninguna.

## Variables de entorno (Vercel)
NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY,
EMAIL_FROM, NEXT_PUBLIC_SITE_URL
