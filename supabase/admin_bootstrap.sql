-- One-time, allowlisted bootstrap for the first MyChavrusa administrator.
-- Add an email to private.admin_bootstrap_allowlist through a trusted database
-- operation, then use /?admin-bootstrap=1. Each authorization can be consumed once.

create table if not exists private.admin_bootstrap_allowlist (
  email text primary key check (email = lower(trim(email))),
  created_at timestamptz not null default now(),
  consumed_at timestamptz,
  user_id uuid references auth.users(id) on delete set null
);

revoke all on private.admin_bootstrap_allowlist from public, anon, authenticated;
grant select, insert, update, delete on private.admin_bootstrap_allowlist to service_role;

create index if not exists admin_bootstrap_allowlist_user_idx
  on private.admin_bootstrap_allowlist(user_id)
  where user_id is not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  requested_role text;
  safe_role public.user_role;
  safe_first_name text;
  safe_last_name text;
  bootstrap_email text;
begin
  requested_role := coalesce(new.raw_user_meta_data ->> 'role', 'parent');
  safe_first_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'first_name', '')), '');
  safe_last_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'last_name', '')), '');

  if safe_first_name is null or safe_last_name is null then
    return new;
  end if;

  if requested_role = 'admin_bootstrap' then
    select email into bootstrap_email
    from private.admin_bootstrap_allowlist
    where email = lower(trim(new.email))
      and consumed_at is null
    for update;

    if bootstrap_email is null then
      raise exception 'This email is not authorized for Admin setup';
    end if;

    insert into public.profiles (id, role, first_name, last_name, email)
    values (new.id, 'admin', safe_first_name, safe_last_name, new.email)
    on conflict (id) do update
      set role = 'admin',
          first_name = excluded.first_name,
          last_name = excluded.last_name,
          email = excluded.email,
          updated_at = now();

    insert into public.admin_users (user_id)
    values (new.id)
    on conflict (user_id) do nothing;

    update private.admin_bootstrap_allowlist
    set consumed_at = now(), user_id = new.id
    where email = bootstrap_email;

    return new;
  end if;

  safe_role := case
    when requested_role = 'chavrusa' then 'chavrusa'::public.user_role
    else 'parent'::public.user_role
  end;

  insert into public.profiles (id, role, first_name, last_name, phone, email)
  values (
    new.id,
    safe_role,
    safe_first_name,
    safe_last_name,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), ''),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$function$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role;
