-- FinLedger MVP schema for manual execution in Supabase SQL Editor.
-- Run this in a new Supabase project or after reviewing existing objects.

create extension if not exists pgcrypto;

-- Roles control access. Business types below control the business workflow.
create type public.app_role as enum ('ADMIN', 'USER');
create type public.business_type as enum ('GROCERY', 'PULSE');
create type public.sale_payment_status as enum ('PAID', 'CREDIT', 'PARTIAL');
create type public.debt_status as enum ('NOT_DUE', 'DUE', 'OVERDUE', 'PAID');
create type public.cash_transaction_type as enum (
  'SALE_PAYMENT',
  'DEBT_PAYMENT',
  'EXPENSE',
  'CAPITAL_IN',
  'OWNER_WITHDRAWAL'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.app_role not null default 'USER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 2),
  business_type public.business_type not null,
  phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_members (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (business_id, user_id),
  unique (user_id)
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null check (char_length(trim(name)) >= 2),
  phone text,
  address text,
  notes text,
  is_active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id),
  description text not null check (char_length(trim(description)) >= 1),
  payment_status public.sale_payment_status not null,
  total_amount numeric(14, 2) not null check (total_amount > 0),
  paid_amount numeric(14, 2) not null default 0 check (paid_amount >= 0),
  outstanding_amount numeric(14, 2) not null check (outstanding_amount >= 0),
  service_type text,
  destination_phone text,
  cost_amount numeric(14, 2),
  selling_amount numeric(14, 2),
  margin_amount numeric(14, 2),
  sold_at timestamptz not null default now(),
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sales_amounts_consistent check (
    paid_amount + outstanding_amount = total_amount
  ),
  constraint sales_status_amounts_consistent check (
    (payment_status = 'PAID' and paid_amount = total_amount and outstanding_amount = 0)
    or (payment_status = 'CREDIT' and paid_amount = 0 and outstanding_amount = total_amount)
    or (payment_status = 'PARTIAL' and paid_amount > 0 and outstanding_amount > 0)
  ),
  constraint pulse_amounts_consistent check (
    (cost_amount is null and selling_amount is null and margin_amount is null)
    or (
      cost_amount is not null
      and selling_amount is not null
      and margin_amount = selling_amount - cost_amount
      and cost_amount >= 0
      and selling_amount > 0
    )
  )
);

create table public.debt_records (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid not null references public.customers(id),
  sale_id uuid not null unique references public.sales(id),
  total_amount numeric(14, 2) not null check (total_amount > 0),
  paid_amount numeric(14, 2) not null default 0 check (paid_amount >= 0),
  outstanding_amount numeric(14, 2) not null check (outstanding_amount >= 0),
  due_date date,
  status public.debt_status not null default 'NOT_DUE',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint debt_amounts_consistent check (
    paid_amount + outstanding_amount = total_amount
  )
);

create table public.debt_payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  debt_id uuid not null references public.debt_records(id),
  amount numeric(14, 2) not null check (amount > 0),
  paid_at timestamptz not null default now(),
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.cash_transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type public.cash_transaction_type not null,
  amount numeric(14, 2) not null check (amount > 0),
  sale_id uuid references public.sales(id),
  debt_payment_id uuid references public.debt_payments(id),
  description text,
  occurred_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  actor_id uuid not null references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index business_members_user_id_idx on public.business_members(user_id);
create index customers_business_id_idx on public.customers(business_id);
create index sales_business_sold_at_idx on public.sales(business_id, sold_at desc);
create index debt_records_business_status_idx on public.debt_records(business_id, status);
create index debt_records_customer_id_idx on public.debt_records(customer_id);
create index debt_payments_debt_id_idx on public.debt_payments(debt_id);
create index cash_transactions_business_date_idx
  on public.cash_transactions(business_id, occurred_at desc);
create index audit_logs_business_created_at_idx
  on public.audit_logs(business_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'User'
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.create_business_for_current_user(
  business_name text,
  business_type public.business_type,
  business_phone text default null,
  business_address text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_business_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if exists (
    select 1 from public.business_members where user_id = auth.uid()
  ) then
    raise exception 'User already has a business';
  end if;

  insert into public.businesses (name, business_type, phone, address)
  values (
    trim(business_name),
    business_type,
    nullif(trim(business_phone), ''),
    nullif(trim(business_address), '')
  )
  returning id into new_business_id;

  insert into public.business_members (business_id, user_id)
  values (new_business_id, auth.uid());

  return new_business_id;
end;
$$;

revoke execute on function public.create_business_for_current_user(
  text, public.business_type, text, text
) from public;

grant execute on function public.create_business_for_current_user(
  text, public.business_type, text, text
) to authenticated;

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.customers enable row level security;
alter table public.sales enable row level security;
alter table public.debt_records enable row level security;
alter table public.debt_payments enable row level security;
alter table public.cash_transactions enable row level security;
alter table public.audit_logs enable row level security;

create policy "Users can view own profile"
on public.profiles for select to authenticated
using (id = auth.uid());

create policy "Users can view own membership"
on public.business_members for select to authenticated
using (user_id = auth.uid());

create policy "Members can view their businesses"
on public.businesses for select to authenticated
using (
  exists (
    select 1 from public.business_members
    where business_members.business_id = businesses.id
      and business_members.user_id = auth.uid()
  )
);

create policy "Members can view business customers"
on public.customers for select to authenticated
using (
  exists (
    select 1 from public.business_members
    where business_members.business_id = customers.business_id
      and business_members.user_id = auth.uid()
  )
);

create policy "Members can view business sales"
on public.sales for select to authenticated
using (
  exists (
    select 1 from public.business_members
    where business_members.business_id = sales.business_id
      and business_members.user_id = auth.uid()
  )
);

create policy "Members can view business debts"
on public.debt_records for select to authenticated
using (
  exists (
    select 1 from public.business_members
    where business_members.business_id = debt_records.business_id
      and business_members.user_id = auth.uid()
  )
);

create policy "Members can view business debt payments"
on public.debt_payments for select to authenticated
using (
  exists (
    select 1 from public.business_members
    where business_members.business_id = debt_payments.business_id
      and business_members.user_id = auth.uid()
  )
);

create policy "Members can view business cash transactions"
on public.cash_transactions for select to authenticated
using (
  exists (
    select 1 from public.business_members
    where business_members.business_id = cash_transactions.business_id
      and business_members.user_id = auth.uid()
  )
);

create policy "Members can view business audit logs"
on public.audit_logs for select to authenticated
using (
  exists (
    select 1 from public.business_members
    where business_members.business_id = audit_logs.business_id
      and business_members.user_id = auth.uid()
  )
);
