-- ============================================================
--  Migración: permitir que un mismo correo se registre varias veces
--  (hasta 3 por mes, con límites de día/semana controlados por la app).
--  Ejecutar UNA vez en Supabase > SQL Editor.
-- ============================================================

-- Quita la restricción de correo único para permitir varios registros
-- (y por tanto varios cupones) por correo.
alter table public.subscribers
  drop constraint if exists subscribers_email_key;

-- Índice para que la consulta de "cuántas veces se registró este correo"
-- sea rápida.
create index if not exists idx_subscribers_email
  on public.subscribers (email);
