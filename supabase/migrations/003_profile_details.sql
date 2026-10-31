-- Adds personal details to profiles. Run once in Supabase Dashboard → SQL Editor.
-- Users edit these from Settings via a server action that only touches these columns.

alter table public.profiles add column if not exists phone text not null default '';
alter table public.profiles add column if not exists address text not null default '';
