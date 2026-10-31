-- Adds admin/staff roles. Run once in Supabase Dashboard → SQL Editor
-- on projects that already ran schema.sql before this change.

alter table public.profiles add column if not exists is_admin boolean not null default false;

-- Signups are disabled, so every existing account was created by the owner: keep them as admins.
update public.profiles set is_admin = true where not is_admin;

-- Users must not be able to change their own role or admin flag.
drop policy if exists "Users can update own profile" on public.profiles;

-- The very first account on a fresh project becomes admin; later ones default to staff.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  first_user boolean := not exists (select 1 from public.profiles);
begin
  insert into public.profiles (id, full_name, role, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    case when first_user then 'Administrator' else 'Staff' end,
    first_user
  );
  return new;
end;
$$;
