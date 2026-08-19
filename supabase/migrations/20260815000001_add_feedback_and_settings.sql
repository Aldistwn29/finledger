create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category text not null check (category in ('BUG', 'IDEA', 'OTHER')),
  message text not null check (char_length(trim(message)) between 5 and 1000),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists feedback_business_created_at_idx
  on public.feedback(business_id, created_at desc);

alter table public.feedback enable row level security;

drop policy if exists "Members can insert business feedback" on public.feedback;
create policy "Members can insert business feedback"
on public.feedback for insert to authenticated
with check (
  created_by = (select auth.uid())
  and exists (
    select 1
    from public.business_members
    where business_members.business_id = feedback.business_id
      and business_members.user_id = (select auth.uid())
  )
);

drop policy if exists "Members can view business feedback" on public.feedback;
create policy "Members can view business feedback"
on public.feedback for select to authenticated
using (
  exists (
    select 1
    from public.business_members
    where business_members.business_id = feedback.business_id
      and business_members.user_id = (select auth.uid())
  )
);

create or replace function public.create_feedback(
  p_category text,
  p_message text
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
  v_feedback_id uuid;
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

  insert into public.feedback (
    business_id,
    category,
    message,
    created_by
  )
  values (
    v_business_id,
    p_category,
    trim(p_message),
    v_user_id
  )
  returning id into v_feedback_id;

  return v_feedback_id;
end;
$$;

revoke execute on function public.create_feedback(text, text) from public;
revoke execute on function public.create_feedback(text, text) from anon;
grant execute on function public.create_feedback(text, text) to authenticated;

create or replace function public.update_current_user_settings(
  p_full_name text,
  p_business_name text,
  p_business_phone text default null,
  p_business_address text default null
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

  update public.profiles
  set full_name = trim(p_full_name), updated_at = now()
  where id = v_user_id;

  update public.businesses
  set
    name = trim(p_business_name),
    phone = nullif(trim(p_business_phone), ''),
    address = nullif(trim(p_business_address), ''),
    updated_at = now()
  where id = v_business_id;
end;
$$;

revoke execute on function public.update_current_user_settings(text, text, text, text) from public;
revoke execute on function public.update_current_user_settings(text, text, text, text) from anon;
grant execute on function public.update_current_user_settings(text, text, text, text) to authenticated;

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists "Members can update their businesses" on public.businesses;
create policy "Members can update their businesses"
on public.businesses for update to authenticated
using (
  exists (
    select 1
    from public.business_members
    where business_members.business_id = businesses.id
      and business_members.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.business_members
    where business_members.business_id = businesses.id
      and business_members.user_id = (select auth.uid())
  )
);
