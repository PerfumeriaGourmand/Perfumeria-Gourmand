-- ============================================================
-- GOURMAND — Migration: admin_todos (checklist del panel admin)
-- Ejecutar en Supabase SQL Editor
--
-- Checklist simple de tareas internas. Se lee y escribe SOLO desde
-- src/app/admin/page.tsx y src/app/api/admin/todos/route.ts, ambos con
-- createAdminClient() (service_role, bypassa RLS). Por eso se habilita RLS
-- sin ninguna policy: el anon key no puede ni leer ni escribir.
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_todos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text        TEXT NOT NULL CHECK (char_length(text) BETWEEN 1 AND 200),
  done        BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admin_todos ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- INSTRUCCIONES: Supabase Dashboard → SQL Editor → pegar y ejecutar.
-- ============================================================
