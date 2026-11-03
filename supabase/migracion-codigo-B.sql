-- ============================================================
--  Migración: nuevo formato de cupón "B-#####" (5 dígitos aleatorios)
--  Ejecutar UNA vez en Supabase > SQL Editor.
--  Cambia SOLO cómo se generan los cupones NUEVOS; los cupones
--  ya existentes conservan su código anterior.
-- ============================================================

-- Reemplaza la función que genera el código al insertar un registro.
-- Genera "B-" seguido de 5 dígitos aleatorios (ej. B-04837) y repite
-- hasta encontrar uno que no exista, para no chocar con otro cupón.
create or replace function public.set_coupon_code()
returns trigger as $$
declare
  nuevo text;
begin
  if new.coupon_code is null then
    loop
      nuevo := 'B-' || lpad((floor(random() * 100000))::int::text, 5, '0');
      exit when not exists (
        select 1 from public.subscribers where coupon_code = nuevo
      );
    end loop;
    new.coupon_code := nuevo;
  end if;
  return new;
end;
$$ language plpgsql;

-- El trigger ya existe (creado en schema.sql); esta migración solo
-- actualiza la función, así que no hace falta recrearlo.
