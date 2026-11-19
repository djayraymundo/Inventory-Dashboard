-- Adds a per-unit cost so the dashboard can show total inventory value. Run once in Supabase Dashboard → SQL Editor.

alter table public.inventory_items add column if not exists unit_cost numeric(12,2) not null default 0 check (unit_cost >= 0);
