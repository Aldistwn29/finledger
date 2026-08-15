create index if not exists customers_business_name_idx
  on public.customers(business_id, name);

create index if not exists customers_business_phone_idx
  on public.customers(business_id, phone);

drop policy if exists "Members can insert business customers" on public.customers;
create policy "Members can insert business customers"
on public.customers for insert to authenticated
with check (
  created_by = (select auth.uid())
  and exists (
    select 1
    from public.business_members
    where business_members.business_id = customers.business_id
      and business_members.user_id = (select auth.uid())
  )
);

drop policy if exists "Members can update business customers" on public.customers;
create policy "Members can update business customers"
on public.customers for update to authenticated
using (
  exists (
    select 1
    from public.business_members
    where business_members.business_id = customers.business_id
      and business_members.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.business_members
    where business_members.business_id = customers.business_id
      and business_members.user_id = (select auth.uid())
  )
);

create or replace function public.create_customer(
  p_name text,
  p_phone text default null,
  p_address text default null,
  p_notes text default null
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
  v_customer_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select business_id
  into v_business_id
  from public.business_members
  where user_id = v_user_id
  limit 1;

  if v_business_id is null then
    raise exception 'Business membership not found';
  end if;

  insert into public.customers (
    business_id,
    name,
    phone,
    address,
    notes,
    created_by
  )
  values (
    v_business_id,
    trim(p_name),
    nullif(trim(p_phone), ''),
    nullif(trim(p_address), ''),
    nullif(trim(p_notes), ''),
    v_user_id
  )
  returning id into v_customer_id;

  return v_customer_id;
end;
$$;

create or replace function public.update_customer(
  p_customer_id uuid,
  p_name text,
  p_phone text default null,
  p_address text default null,
  p_notes text default null
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select business_id
  into v_business_id
  from public.business_members
  where user_id = v_user_id
  limit 1;

  if v_business_id is null then
    raise exception 'Business membership not found';
  end if;

  update public.customers
  set
    name = trim(p_name),
    phone = nullif(trim(p_phone), ''),
    address = nullif(trim(p_address), ''),
    notes = nullif(trim(p_notes), ''),
    updated_at = now()
  where id = p_customer_id
    and business_id = v_business_id;

  if not found then
    raise exception 'Customer not found';
  end if;
end;
$$;

create or replace function public.deactivate_customer(
  p_customer_id uuid
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select business_id
  into v_business_id
  from public.business_members
  where user_id = v_user_id
  limit 1;

  if v_business_id is null then
    raise exception 'Business membership not found';
  end if;

  update public.customers
  set is_active = false, updated_at = now()
  where id = p_customer_id
    and business_id = v_business_id;

  if not found then
    raise exception 'Customer not found';
  end if;
end;
$$;

revoke execute on function public.create_customer(text, text, text, text) from public;
revoke execute on function public.create_customer(text, text, text, text) from anon;
grant execute on function public.create_customer(text, text, text, text) to authenticated;

revoke execute on function public.update_customer(uuid, text, text, text, text) from public;
revoke execute on function public.update_customer(uuid, text, text, text, text) from anon;
grant execute on function public.update_customer(uuid, text, text, text, text) to authenticated;

revoke execute on function public.deactivate_customer(uuid) from public;
revoke execute on function public.deactivate_customer(uuid) from anon;
grant execute on function public.deactivate_customer(uuid) to authenticated;
