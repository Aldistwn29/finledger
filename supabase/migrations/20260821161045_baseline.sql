set local check_function_bodies = off;

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "service_role";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "service_role";

create table "public"."audit_logs" (
  "id"          uuid                     not null default gen_random_uuid(),
  "business_id" uuid,
  "actor_id"    uuid                     not null,
  "action"      text                     not null,
  "entity_type" text                     not null,
  "entity_id"   uuid,
  "metadata"    jsonb                    not null default '{}'::jsonb,
  "created_at"  timestamp with time zone not null default now(),
  constraint "audit_logs_pkey" primary key (id)
);

alter table "public"."audit_logs"
  enable row level security;

create table "public"."business_members" (
  "business_id" uuid                     not null,
  "user_id"     uuid                     not null,
  "created_at"  timestamp with time zone not null default now(),
  constraint "business_members_pkey" primary key (business_id, user_id),
  constraint "business_members_user_id_key" unique (user_id)
);

alter table "public"."business_members"
  enable row level security;

create table "public"."businesses" (
  "id"         uuid                     not null default gen_random_uuid(),
  "name"       text                     not null,
  "phone"      text,
  "address"    text,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  constraint "businesses_name_length" check ((char_length(TRIM(BOTH FROM name)) >= 2)),
  constraint "businesses_pkey" primary key (id)
);

alter table "public"."businesses"
  enable row level security;

create table "public"."cash_transactions" (
  "id"              uuid                     not null default gen_random_uuid(),
  "business_id"     uuid                     not null,
  "amount"          numeric(14,2)            not null,
  "sale_id"         uuid,
  "debt_payment_id" uuid,
  "description"     text,
  "occurred_at"     timestamp with time zone not null default now(),
  "created_by"      uuid                     not null,
  "created_at"      timestamp with time zone not null default now(),
  constraint "cash_transactions_amount_positive" check ((amount > (0)::numeric)),
  constraint "cash_transactions_pkey" primary key (id)
);

alter table "public"."cash_transactions"
  enable row level security;

create table "public"."customers" (
  "id"          uuid                     not null default gen_random_uuid(),
  "business_id" uuid                     not null,
  "name"        text                     not null,
  "phone"       text,
  "address"     text,
  "notes"       text,
  "is_active"   boolean                  not null default true,
  "created_by"  uuid                     not null,
  "created_at"  timestamp with time zone not null default now(),
  "updated_at"  timestamp with time zone not null default now(),
  constraint "customers_name_length" check ((char_length(TRIM(BOTH FROM name)) >= 2)),
  constraint "customers_pkey" primary key (id)
);

alter table "public"."customers"
  enable row level security;

create table "public"."debt_payments" (
  "id"          uuid                     not null default gen_random_uuid(),
  "business_id" uuid                     not null,
  "debt_id"     uuid                     not null,
  "amount"      numeric(14,2)            not null,
  "paid_at"     timestamp with time zone not null default now(),
  "notes"       text,
  "created_by"  uuid                     not null,
  "created_at"  timestamp with time zone not null default now(),
  constraint "debt_payments_amount_positive" check ((amount > (0)::numeric)),
  constraint "debt_payments_pkey" primary key (id)
);

alter table "public"."debt_payments"
  enable row level security;

create table "public"."debt_records" (
  "id"                 uuid                     not null default gen_random_uuid(),
  "business_id"        uuid                     not null,
  "customer_id"        uuid                     not null,
  "sale_id"            uuid                     not null,
  "total_amount"       numeric(14,2)            not null,
  "paid_amount"        numeric(14,2)            not null default 0,
  "outstanding_amount" numeric(14,2)            not null,
  "due_date"           date,
  "created_by"         uuid                     not null,
  "created_at"         timestamp with time zone not null default now(),
  "updated_at"         timestamp with time zone not null default now(),
  constraint "debt_records_pkey" primary key (id),
  constraint "debt_records_sale_id_key" unique (sale_id),
  constraint "debts_amounts_consistent" check (((paid_amount + outstanding_amount) = total_amount)),
  constraint "debts_outstanding_positive_or_zero" check ((outstanding_amount >= (0)::numeric)),
  constraint "debts_paid_positive_or_zero" check ((paid_amount >= (0)::numeric)),
  constraint "debts_total_positive" check ((total_amount > (0)::numeric))
);

alter table "public"."debt_records"
  enable row level security;

create table "public"."feedback" (
  "id"             uuid                     not null default gen_random_uuid(),
  "user_id"        uuid                     not null,
  "business_id"    uuid,
  "message"        text                     not null,
  "admin_response" text,
  "handled_by"     uuid,
  "created_at"     timestamp with time zone not null default now(),
  "updated_at"     timestamp with time zone not null default now(),
  constraint "feedback_message_length" check ((char_length(TRIM(BOTH FROM message)) >= 5)),
  constraint "feedback_pkey" primary key (id)
);

alter table "public"."feedback"
  enable row level security;

create table "public"."profiles" (
  "id"         uuid                     not null,
  "full_name"  text                     not null,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  constraint "profiles_pkey" primary key (id)
);

alter table "public"."profiles"
  enable row level security;

create table "public"."sales" (
  "id"                 uuid                     not null default gen_random_uuid(),
  "business_id"        uuid                     not null,
  "customer_id"        uuid,
  "description"        text                     not null,
  "total_amount"       numeric(14,2)            not null,
  "paid_amount"        numeric(14,2)            not null default 0,
  "outstanding_amount" numeric(14,2)            not null,
  "service_type"       text,
  "destination_phone"  text,
  "cost_amount"        numeric(14,2),
  "selling_amount"     numeric(14,2),
  "margin_amount"      numeric(14,2),
  "sold_at"            timestamp with time zone not null default now(),
  "notes"              text,
  "created_by"         uuid                     not null,
  "created_at"         timestamp with time zone not null default now(),
  "updated_at"         timestamp with time zone not null default now(),
  constraint "sales_amounts_consistent" check (((paid_amount + outstanding_amount) = total_amount)),
  constraint "sales_outstanding_positive_or_zero" check ((outstanding_amount >= (0)::numeric)),
  constraint "sales_paid_positive_or_zero" check ((paid_amount >= (0)::numeric)),
  constraint "sales_pkey" primary key (id),
  constraint "sales_pulse_amounts_consistent" check ((((cost_amount IS NULL) AND (selling_amount IS NULL) AND (margin_amount IS NULL)) OR ((cost_amount IS
    NOT NULL) AND (selling_amount IS NOT NULL) AND (margin_amount IS
    NOT NULL) AND (cost_amount >= (0)::numeric) AND (selling_amount > (0)::numeric) AND (margin_amount = (selling_amount - cost_amount))))),
  constraint "sales_total_positive" check ((total_amount > (0)::numeric))
);

alter table "public"."sales"
  enable row level security;

create type "public"."app_role" as enum (
  'Admin',
  'User'
);

alter table "public"."profiles"
  add column "role" public.app_role not null default 'User'::public.app_role;

create type "public"."business_type" as enum (
  'GROCERY',
  'PULSE'
);

alter table "public"."businesses"
  add column "business_type" public.business_type not null;

create type "public"."cash_transaction_type" as enum (
  'SALE_PAYMENT',
  'DEBT_PAYMENT',
  'EXPENSE',
  'CAPITAL_IN',
  'OWNER_WITHDRAWAL'
);

alter table "public"."cash_transactions"
  add column "type" public.cash_transaction_type not null;

create type "public"."debt_status" as enum (
  'NOT_DUE',
  'DUE',
  'OVERDUE',
  'PAID'
);

alter table "public"."debt_records"
  add column "status" public.debt_status not null default 'NOT_DUE'::public.debt_status;

create type "public"."feedback_category" as enum (
  'BUG',
  'SUGGESTION',
  'QUESTION',
  'OTHER'
);

alter table "public"."feedback"
  add column "category" public.feedback_category not null default 'OTHER'::public.feedback_category;

create type "public"."feedback_status" as enum (
  'OPEN',
  'IN_REVIEW',
  'RESOLVED',
  'CLOSED'
);

alter table "public"."feedback"
  add column "status" public.feedback_status not null default 'OPEN'::public.feedback_status;

create type "public"."sale_payment_status" as enum (
  'PAID',
  'CREDIT',
  'PARTIAL'
);

alter table "public"."sales"
  add column "payment_status" public.sale_payment_status not null;

create or replace function public.create_business_for_current_user (
  business_name          text,
  selected_business_type public.business_type,
  business_phone         text                 default null::text,
  business_address       text                 default null::text
)
  returns uuid
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
declare
  new_business_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
  ) then
    raise exception 'Profile not found';
  end if;

  if nullif(trim(business_name), '') is null then
    raise exception 'Business name is required';
  end if;

  if exists (
    select 1
    from public.business_members
    where user_id = auth.uid()
  ) then
    raise exception 'User already has a business';
  end if;

  insert into public.businesses (
    name,
    business_type,
    phone,
    address
  )
  values (
    trim(business_name),
    selected_business_type,
    nullif(trim(business_phone), ''),
    nullif(trim(business_address), '')
  )
  returning id into new_business_id;

  insert into public.business_members (
    business_id,
    user_id
  )
  values (
    new_business_id,
    auth.uid()
  );

  return new_business_id;
end;
$function$;

create or replace function public.create_customer (
  p_name    text,
  p_phone   text default null::text,
  p_address text default null::text,
  p_notes   text default null::text
)
  returns uuid
  language plpgsql
  set search_path to 'public'
  AS $function$
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
$function$;

create or replace function public.create_feedback (
  p_category public.feedback_category,
  p_message  text
)
  returns uuid
  language plpgsql
  set search_path to 'public'
  AS $function$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
  v_feedback_id uuid;
begin
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select business_id into v_business_id
  from public.business_members
  where user_id = v_user_id
  limit 1;

  if v_business_id is null then raise exception 'Business membership not found'; end if;

  insert into public.feedback (user_id, business_id, category, message)
  values (v_user_id, v_business_id, p_category, trim(p_message))
  returning id into v_feedback_id;

  return v_feedback_id;
end;
$function$;

create or replace function public.create_pulse_sale (
  p_customer_id    uuid,
  p_description    text,
  p_payment_status public.sale_payment_status,
  p_paid_amount    numeric,
  p_service_type   text,
  p_cost_amount    numeric,
  p_selling_amount numeric
)
  returns uuid
  language plpgsql
  set search_path to 'public'
  AS $function$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
  v_sale_id uuid;
  v_total_amount numeric(14, 2);
  v_paid_amount numeric(14, 2);
  v_outstanding_amount numeric(14, 2);
  v_margin_amount numeric(14, 2);
begin
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select business_id into v_business_id
  from public.business_members
  where user_id = v_user_id
  limit 1;

  if v_business_id is null then raise exception 'Business membership not found'; end if;
  if nullif(trim(p_description), '') is null then raise exception 'Description is required'; end if;
  if nullif(trim(p_service_type), '') is null then raise exception 'Service type is required'; end if;
  if p_cost_amount is null or p_cost_amount < 0 then raise exception 'Cost amount is invalid'; end if;
  if p_selling_amount is null or p_selling_amount <= 0 then raise exception 'Selling amount is invalid'; end if;

  if p_customer_id is not null and not exists (
    select 1 from public.customers
    where id = p_customer_id and business_id = v_business_id and is_active = true
  ) then
    raise exception 'Customer does not belong to this business';
  end if;

  if p_payment_status <> 'PAID' and p_customer_id is null then
    raise exception 'A customer is required for an unpaid sale';
  end if;

  v_total_amount := p_selling_amount;
  case p_payment_status
    when 'PAID' then v_paid_amount := v_total_amount;
    when 'CREDIT' then v_paid_amount := 0;
    when 'PARTIAL' then
      v_paid_amount := coalesce(p_paid_amount, 0);
      if v_paid_amount <= 0 or v_paid_amount >= v_total_amount then
        raise exception 'Partial payment must be between zero and total amount';
      end if;
  end case;

  v_outstanding_amount := v_total_amount - v_paid_amount;
  v_margin_amount := p_selling_amount - p_cost_amount;

  insert into public.sales (
    business_id, customer_id, description, payment_status, total_amount,
    paid_amount, outstanding_amount, service_type, destination_phone,
    cost_amount, selling_amount, margin_amount, created_by
  )
  values (
    v_business_id, p_customer_id, trim(p_description), p_payment_status,
    v_total_amount, v_paid_amount, v_outstanding_amount, trim(p_service_type),
    null, p_cost_amount, p_selling_amount, v_margin_amount, v_user_id
  )
  returning id into v_sale_id;

  if v_outstanding_amount > 0 then
    insert into public.debt_records (
      business_id, customer_id, sale_id, total_amount, paid_amount,
      outstanding_amount, status, created_by
    )
    values (
      v_business_id, p_customer_id, v_sale_id, v_total_amount, v_paid_amount,
      v_outstanding_amount, 'NOT_DUE', v_user_id
    );
  end if;

  if v_paid_amount > 0 then
    insert into public.cash_transactions (
      business_id, type, amount, sale_id, description, created_by
    )
    values (
      v_business_id, 'SALE_PAYMENT', v_paid_amount, v_sale_id,
      trim(p_description), v_user_id
    );
  end if;

  return v_sale_id;
end;
$function$;

create or replace function public.deactivate_customer (
  p_customer_id uuid
)
  returns void
  language plpgsql
  set search_path to 'public'
  AS $function$
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
$function$;

create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
begin
  insert into public.profiles (
    id,
    full_name,
    role
  )
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'User'
    ),
    'User'
  );

  return new;
end;
$function$;

create or replace function public.is_admin()
  returns boolean
  language sql
  stable
  security definer
  set search_path to 'public'
  AS $function$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'Admin'
  );
$function$;

create or replace function public.pay_debt (
  p_debt_id uuid,
  p_amount  numeric
)
  returns uuid
  language plpgsql
  set search_path to 'public'
  AS $function$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
  v_outstanding_amount numeric(14, 2);
  v_paid_amount numeric(14, 2);
  v_new_outstanding numeric(14, 2);
  v_payment_id uuid;
  v_due_date date;
  v_status public.debt_status;
begin
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select business_id into v_business_id
  from public.business_members
  where user_id = v_user_id
  limit 1;

  if v_business_id is null then raise exception 'Business membership not found'; end if;
  if p_amount is null or p_amount <= 0 then raise exception 'Payment amount is invalid'; end if;

  select outstanding_amount, paid_amount, due_date
  into v_outstanding_amount, v_paid_amount, v_due_date
  from public.debt_records
  where id = p_debt_id
    and business_id = v_business_id
    and status <> 'PAID'
  for update;

  if not found then raise exception 'Debt not found'; end if;
  if p_amount > v_outstanding_amount then raise exception 'Payment exceeds outstanding debt'; end if;

  v_new_outstanding := v_outstanding_amount - p_amount;
  v_status := case
    when v_new_outstanding = 0 then 'PAID'::public.debt_status
    when v_due_date is null then 'NOT_DUE'::public.debt_status
    when v_due_date < current_date then 'OVERDUE'::public.debt_status
    else 'DUE'::public.debt_status
  end;

  update public.debt_records
  set paid_amount = v_paid_amount + p_amount,
      outstanding_amount = v_new_outstanding,
      status = v_status,
      updated_at = now()
  where id = p_debt_id;

  insert into public.debt_payments (business_id, debt_id, amount, created_by)
  values (v_business_id, p_debt_id, p_amount, v_user_id)
  returning id into v_payment_id;

  insert into public.cash_transactions (
    business_id, type, amount, debt_payment_id, description, created_by
  )
  values (
    v_business_id, 'DEBT_PAYMENT', p_amount, v_payment_id,
    'Pembayaran piutang', v_user_id
  );

  return v_payment_id;
end;
$function$;

create or replace function public.set_updated_at()
  returns trigger
  language plpgsql
  AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create or replace function public.update_current_user_settings (
  p_full_name        text,
  p_business_name    text,
  p_business_phone   text default null::text,
  p_business_address text default null::text
)
  returns void
  language plpgsql
  set search_path to 'public'
  AS $function$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
begin
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select business_id into v_business_id
  from public.business_members
  where user_id = v_user_id
  limit 1;

  if v_business_id is null then raise exception 'Business membership not found'; end if;

  update public.profiles
  set full_name = trim(p_full_name), updated_at = now()
  where id = v_user_id;

  update public.businesses
  set name = trim(p_business_name),
      phone = nullif(trim(p_business_phone), ''),
      address = nullif(trim(p_business_address), ''),
      updated_at = now()
  where id = v_business_id;
end;
$function$;

create or replace function public.update_customer (
  p_customer_id uuid,
  p_name        text,
  p_phone       text default null::text,
  p_address     text default null::text,
  p_notes       text default null::text
)
  returns void
  language plpgsql
  set search_path to 'public'
  AS $function$
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
$function$;

alter table "public"."audit_logs"
  add constraint "audit_logs_business_id_fkey" foreign key (business_id) references public.businesses(id) on delete cascade;

alter table "public"."business_members"
  add constraint "business_members_business_id_fkey" foreign key (business_id) references public.businesses(id) on delete cascade;

alter table "public"."cash_transactions"
  add constraint "cash_transactions_business_id_fkey" foreign key (business_id) references public.businesses(id) on delete cascade;

alter table "public"."customers"
  add constraint "customers_business_id_fkey" foreign key (business_id) references public.businesses(id) on delete cascade;

alter table "public"."debt_payments"
  add constraint "debt_payments_business_id_fkey" foreign key (business_id) references public.businesses(id) on delete cascade;

alter table "public"."cash_transactions"
  add constraint "cash_transactions_debt_payment_id_fkey" foreign key (debt_payment_id) references public.debt_payments(id);

alter table "public"."debt_records"
  add constraint "debt_records_business_id_fkey" foreign key (business_id) references public.businesses(id) on delete cascade;

alter table "public"."debt_records"
  add constraint "debt_records_customer_id_fkey" foreign key (customer_id) references public.customers(id);

alter table "public"."debt_payments"
  add constraint "debt_payments_debt_id_fkey" foreign key (debt_id) references public.debt_records(id);

alter table "public"."feedback"
  add constraint "feedback_business_id_fkey" foreign key (business_id) references public.businesses(id) on delete set null;

alter table "public"."profiles"
  add constraint "profiles_id_fkey" foreign key (id) references auth.users(id) on delete cascade;

alter table "public"."audit_logs"
  add constraint "audit_logs_actor_id_fkey" foreign key (actor_id) references public.profiles(id);

alter table "public"."business_members"
  add constraint "business_members_user_id_fkey" foreign key (user_id) references public.profiles(id) on delete cascade;

alter table "public"."cash_transactions"
  add constraint "cash_transactions_created_by_fkey" foreign key (created_by) references public.profiles(id);

alter table "public"."customers"
  add constraint "customers_created_by_fkey" foreign key (created_by) references public.profiles(id);

alter table "public"."debt_payments"
  add constraint "debt_payments_created_by_fkey" foreign key (created_by) references public.profiles(id);

alter table "public"."debt_records"
  add constraint "debt_records_created_by_fkey" foreign key (created_by) references public.profiles(id);

alter table "public"."feedback"
  add constraint "feedback_handled_by_fkey" foreign key (handled_by) references public.profiles(id) on delete set null;

alter table "public"."feedback"
  add constraint "feedback_user_id_fkey" foreign key (user_id) references public.profiles(id) on delete cascade;

alter table "public"."sales"
  add constraint "sales_business_id_fkey" foreign key (business_id) references public.businesses(id) on delete cascade;

alter table "public"."sales"
  add constraint "sales_created_by_fkey" foreign key (created_by) references public.profiles(id);

alter table "public"."sales"
  add constraint "sales_customer_id_fkey" foreign key (customer_id) references public.customers(id);

alter table "public"."sales"
  add constraint "sales_payment_status_consistent"
    check
    ((((payment_status = 'PAID'::public.sale_payment_status) AND (paid_amount = total_amount) AND (outstanding_amount = (0)::numeric)) OR ((payment_status =
    'CREDIT'::public.sale_payment_status) AND (paid_amount = (0)::numeric) AND (outstanding_amount = total_amount) AND (customer_id IS
    NOT NULL)) OR ((payment_status = 'PARTIAL'::public.sale_payment_status) AND (paid_amount > (0)::numeric) AND (outstanding_amount > (0)::numeric) AND (customer_id IS
    NOT NULL))));

alter table "public"."cash_transactions"
  add constraint "cash_transactions_sale_id_fkey" foreign key (sale_id) references public.sales(id);

alter table "public"."debt_records"
  add constraint "debt_records_sale_id_fkey" foreign key (sale_id) references public.sales(id);

create index audit_logs_business_created_at_idx on public.audit_logs using btree (business_id, created_at desc);

create index business_members_user_id_idx on public.business_members using btree (user_id);

create index cash_transactions_business_date_idx on public.cash_transactions using btree (business_id, occurred_at desc);

create index customers_business_id_idx on public.customers using btree (business_id);

create index debt_payments_debt_id_idx on public.debt_payments using btree (debt_id);

create index debt_records_business_status_idx on public.debt_records using btree (business_id, status);

create index debt_records_customer_id_idx on public.debt_records using btree (customer_id);

create index feedback_status_idx on public.feedback using btree (status);

create index feedback_user_id_idx on public.feedback using btree (user_id);

create index sales_business_sold_at_idx on public.sales using btree (business_id, sold_at desc);

create index sales_customer_id_idx on public.sales using btree (customer_id);

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create trigger businesses_set_updated_at
  before update on public.businesses
  for each row
  execute function public.set_updated_at();

create trigger customers_set_updated_at
  before update on public.customers
  for each row
  execute function public.set_updated_at();

create trigger debt_records_set_updated_at
  before update on public.debt_records
  for each row
  execute function public.set_updated_at();

create trigger feedback_set_updated_at
  before update on public.feedback
  for each row
  execute function public.set_updated_at();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

create trigger sales_set_updated_at
  before update on public.sales
  for each row
  execute function public.set_updated_at();

create policy "Users can view own business audit logs" on "public"."audit_logs"
  for select
  to "authenticated"
  using ((exists ( select 1
   from public.business_members
  where ((business_members.business_id = audit_logs.business_id) AND (business_members.user_id = auth.uid())))));

create policy "Admins can view memberships" on "public"."business_members"
  for select
  to "authenticated"
  using (public.is_admin());

create policy "Users can view own membership" on "public"."business_members"
  for select
  to "authenticated"
  using ((user_id = auth.uid()));

create policy "Admins can view businesses" on "public"."businesses"
  for select
  to "authenticated"
  using (public.is_admin());

create policy "Users can update own business" on "public"."businesses"
  for update
  to "authenticated"
  using ((exists ( select 1
   from public.business_members
  where ((business_members.business_id = businesses.id) AND (business_members.user_id = auth.uid())))))
  with check ((EXISTS ( SELECT 1
   FROM public.business_members
  WHERE ((business_members.business_id = businesses.id) AND (business_members.user_id = auth.uid())))));

create policy "Users can view own business" on "public"."businesses"
  for select
  to "authenticated"
  using ((exists ( select 1
   from public.business_members
  where ((business_members.business_id = businesses.id) AND (business_members.user_id = auth.uid())))));

create policy "Members can insert cash transactions" on "public"."cash_transactions"
  for insert
  to "authenticated"
  with check (((created_by = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.business_members
  WHERE ((business_members.business_id = cash_transactions.business_id) AND (business_members.user_id = auth.uid()))))));

create policy "Members can view cash transactions" on "public"."cash_transactions"
  for select
  to "authenticated"
  using ((exists ( select 1
   from public.business_members
  where ((business_members.business_id = cash_transactions.business_id) AND (business_members.user_id = auth.uid())))));

create policy "Members can insert customers" on "public"."customers"
  for insert
  to "authenticated"
  with check (((created_by = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.business_members
  WHERE ((business_members.business_id = customers.business_id) AND (business_members.user_id = auth.uid()))))));

create policy "Members can update customers" on "public"."customers"
  for update
  to "authenticated"
  using ((exists ( select 1
   from public.business_members
  where ((business_members.business_id = customers.business_id) AND (business_members.user_id = auth.uid())))))
  with check ((EXISTS ( SELECT 1
   FROM public.business_members
  WHERE ((business_members.business_id = customers.business_id) AND (business_members.user_id = auth.uid())))));

create policy "Members can view customers" on "public"."customers"
  for select
  to "authenticated"
  using ((exists ( select 1
   from public.business_members
  where ((business_members.business_id = customers.business_id) AND (business_members.user_id = auth.uid())))));

create policy "Members can insert debt payments" on "public"."debt_payments"
  for insert
  to "authenticated"
  with check (((created_by = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.business_members
  WHERE ((business_members.business_id = debt_payments.business_id) AND (business_members.user_id = auth.uid()))))));

create policy "Members can view debt payments" on "public"."debt_payments"
  for select
  to "authenticated"
  using ((exists ( select 1
   from public.business_members
  where ((business_members.business_id = debt_payments.business_id) AND (business_members.user_id = auth.uid())))));

create policy "Members can insert debt records" on "public"."debt_records"
  for insert
  to "authenticated"
  with check (((created_by = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.business_members
  WHERE ((business_members.business_id = debt_records.business_id) AND (business_members.user_id = auth.uid()))))));

create policy "Members can update debt records" on "public"."debt_records"
  for update
  to "authenticated"
  using ((exists ( select 1
   from public.business_members
  where ((business_members.business_id = debt_records.business_id) AND (business_members.user_id = auth.uid())))))
  with check ((EXISTS ( SELECT 1
   FROM public.business_members
  WHERE ((business_members.business_id = debt_records.business_id) AND (business_members.user_id = auth.uid())))));

create policy "Members can view debt records" on "public"."debt_records"
  for select
  to "authenticated"
  using ((exists ( select 1
   from public.business_members
  where ((business_members.business_id = debt_records.business_id) AND (business_members.user_id = auth.uid())))));

create policy "Admins can update feedback" on "public"."feedback"
  for update
  to "authenticated"
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can view all feedback" on "public"."feedback"
  for select
  to "authenticated"
  using (public.is_admin());

create policy "Users can create own feedback" on "public"."feedback"
  for insert
  to "authenticated"
  with check ((user_id = auth.uid()));

create policy "Users can view own feedback" on "public"."feedback"
  for select
  to "authenticated"
  using ((user_id = auth.uid()));

create policy "Admins can view all profiles" on "public"."profiles"
  for select
  to "authenticated"
  using (public.is_admin());

create policy "Users can update own profile" on "public"."profiles"
  for update
  to "authenticated"
  using ((id = auth.uid()))
  with check ((id = auth.uid()));

create policy "Users can view own profile" on "public"."profiles"
  for select
  to "authenticated"
  using ((id = auth.uid()));

create policy "Members can insert sales" on "public"."sales"
  for insert
  to "authenticated"
  with check (((created_by = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.business_members
  WHERE ((business_members.business_id = sales.business_id) AND (business_members.user_id = auth.uid()))))));

create policy "Members can update sales" on "public"."sales"
  for update
  to "authenticated"
  using ((exists ( select 1
   from public.business_members
  where ((business_members.business_id = sales.business_id) AND (business_members.user_id = auth.uid())))))
  with check ((EXISTS ( SELECT 1
   FROM public.business_members
  WHERE ((business_members.business_id = sales.business_id) AND (business_members.user_id = auth.uid())))));

create policy "Members can view sales" on "public"."sales"
  for select
  to "authenticated"
  using ((exists ( select 1
   from public.business_members
  where ((business_members.business_id = sales.business_id) AND (business_members.user_id = auth.uid())))));

revoke all on function "public"."create_business_for_current_user"(text, public.business_type, text, text) from public;

grant execute on function "public"."create_business_for_current_user"(text, public.business_type, text, text) to "anon", "authenticated", "postgres", "service_role";

revoke all on function "public"."create_customer"(text, text, text, text) from public;

grant execute on function "public"."create_customer"(text, text, text, text) to "authenticated", "postgres", "service_role";

revoke all on function "public"."create_feedback"(public.feedback_category, text) from public;

grant execute on function "public"."create_feedback"(public.feedback_category, text) to "authenticated", "postgres", "service_role";

revoke all on function "public"."create_pulse_sale"(uuid, text, public.sale_payment_status, numeric, text, numeric, numeric) from public;

grant execute on function "public"."create_pulse_sale"(uuid, text, public.sale_payment_status, numeric, text, numeric, numeric) to "authenticated", "postgres", "service_role";

revoke all on function "public"."deactivate_customer"(uuid) from public;

grant execute on function "public"."deactivate_customer"(uuid) to "authenticated", "postgres", "service_role";

revoke all on function "public"."handle_new_user"() from public;

grant execute on function "public"."handle_new_user"() to "anon", "authenticated", "postgres", "service_role";

revoke all on function "public"."is_admin"() from public;

grant execute on function "public"."is_admin"() to "anon", "authenticated", "postgres", "service_role";

revoke all on function "public"."pay_debt"(uuid, numeric) from public;

grant execute on function "public"."pay_debt"(uuid, numeric) to "authenticated", "postgres", "service_role";

grant execute on function "public"."set_updated_at"() to public, "anon", "authenticated", "postgres", "service_role";

revoke all on function "public"."update_current_user_settings"(text, text, text, text) from public;

grant execute on function "public"."update_current_user_settings"(text, text, text, text) to "authenticated", "postgres", "service_role";

revoke all on function "public"."update_customer"(uuid, text, text, text, text) from public;

grant execute on function "public"."update_customer"(uuid, text, text, text, text) to "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."audit_logs" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."business_members" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."businesses" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."cash_transactions" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."customers" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."debt_payments" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."debt_records" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."feedback" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."profiles" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."sales" to "anon", "authenticated", "postgres", "service_role";

grant usage on type "public"."app_role" to "postgres";

grant usage on type "public"."business_type" to "postgres";

grant usage on type "public"."cash_transaction_type" to "postgres";

grant usage on type "public"."debt_status" to "postgres";

grant usage on type "public"."feedback_category" to "postgres";

grant usage on type "public"."feedback_status" to "postgres";

grant usage on type "public"."sale_payment_status" to "postgres";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "anon";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "authenticated";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "service_role";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "anon";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "authenticated";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "service_role";

alter default privileges for role "postgres" in schema "public" grant delete, insert, maintain, references, select, trigger, truncate, update on tables to "anon";

alter default privileges for role "postgres" in schema "public" grant delete, insert, maintain, references, select, trigger, truncate, update on tables to "authenticated";

alter default privileges for role "postgres" in schema "public" grant delete, insert, maintain, references, select, trigger, truncate, update on tables to "service_role";

