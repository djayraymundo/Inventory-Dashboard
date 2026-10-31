-- StockPilot schema. Run once in Supabase Dashboard → SQL Editor, then run seed.sql.

-- Profiles: display name/role for each auth user (created automatically on sign-up).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null default 'Administrator',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Inventory items. Status is derived from quantity/min_threshold in the app.
create sequence if not exists public.item_number_seq start 1001;

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  item_number text not null unique default ('ITM-' || nextval('public.item_number_seq')),
  name text not null,
  sku text not null,
  batch_number text not null default '',
  category text not null,
  location text not null,
  quantity integer not null default 0 check (quantity >= 0),
  unit text not null default 'pcs',
  min_threshold integer not null default 0 check (min_threshold >= 0),
  supplier text not null default '',
  last_updated date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.item_history (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.inventory_items (id) on delete cascade,
  type text not null check (type in ('Received', 'Moved', 'Adjusted', 'Restocked', 'Note')),
  description text not null,
  date date not null default current_date,
  user_name text not null,
  created_at timestamptz not null default now()
);

create index if not exists item_history_item_id_idx on public.item_history (item_id);

-- Row Level Security: only signed-in users can read or change data.
alter table public.profiles enable row level security;
alter table public.inventory_items enable row level security;
alter table public.item_history enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id);

drop policy if exists "Signed-in users manage items" on public.inventory_items;
create policy "Signed-in users manage items" on public.inventory_items
  for all to authenticated using (true) with check (true);

drop policy if exists "Signed-in users manage history" on public.item_history;
create policy "Signed-in users manage history" on public.item_history
  for all to authenticated using (true) with check (true);

grant usage on sequence public.item_number_seq to authenticated;
