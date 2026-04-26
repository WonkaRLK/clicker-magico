-- Clicker Mágico — Supabase Schema
-- Ejecutar en el SQL Editor del dashboard de Supabase

-- Tabla principal: un registro por usuario
create table if not exists cloud_saves (
  user_id     uuid        primary key references auth.users(id) on delete cascade,
  username    text        not null default 'Mago',
  save_data   jsonb       not null default '{}',
  highest_zone integer   not null default 1,
  total_prestiges integer not null default 0,
  updated_at  timestamptz not null default now()
);

-- Seguridad a nivel fila
alter table cloud_saves enable row level security;

-- Cualquiera puede leer (para el leaderboard)
create policy "leaderboard_read" on cloud_saves
  for select using (true);

-- Cada usuario solo puede escribir su propia fila
create policy "own_save_write" on cloud_saves
  for all using (auth.uid() = user_id);
