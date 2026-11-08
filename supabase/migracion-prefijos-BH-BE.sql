-- ============================================================
--  Migración: prefijo de cupón según el sitio de origen
--    • Registros de Expedia  -> "BE-#####"
--    • Cualquier otro sitio   -> "BH-#####"
--  Ejecutar UNA vez en Supabase > SQL Editor.
--  Reemplaza a migracion-prefijo-BH.sql (esta ya cubre ambos casos).
--  Cambia SOLO los cupones NUEVOS; los existentes conservan su código.
-- ============================================================

-- El trigger decide el prefijo mirando la columna "source" del registro
-- que se está insertando. El sitio de Expedia debe guardar
-- source = 'expedia' (o algo que contenga "expedia"); el formulario
-- general guarda 'web_form', por lo que cae en el prefijo "BH-".
create or replace function public.set_coupon_code()
returns trigger as $$
declare
  nuevo    text;
  prefijo  text;
begin
  if new.coupon_code is null then
    -- Elegir prefijo: Expedia -> BE-, el resto -> BH-
    if coalesce(new.source, '') ilike '%expedia%' then
      prefijo := 'BE-';
    else
      prefijo := 'BH-';
    end if;

    -- 5 dígitos aleatorios; repetir hasta encontrar uno libre para
    -- no chocar con otro cupón ya existente.
    loop
      nuevo := prefijo || lpad((floor(random() * 100000))::int::text, 5, '0');
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
