-- Record a pulse sale, optional debt, and sale cash in one transaction.

drop function if exists public.create_pulse_sale(
  uuid,
  text,
  public.sale_payment_status,
  numeric,
  text,
  text,
  numeric,
  numeric,
  date,
  timestamptz,
  text
);

drop function if exists public.create_pulse_sale(
  uuid,
  text,
  public.sale_payment_status,
  numeric,
  text,
  numeric,
  numeric
);

create or replace function public.create_pulse_sale(
  p_customer_id uuid,
  p_description text,
  p_payment_status public.sale_payment_status,
  p_paid_amount numeric,
  p_service_type text,
  p_cost_amount numeric,
  p_selling_amount numeric
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
  v_sale_id uuid;
  v_total_amount numeric(14, 2);
  v_paid_amount numeric(14, 2);
  v_outstanding_amount numeric(14, 2);
  v_margin_amount numeric(14, 2);
  v_debt_id uuid;
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

  if nullif(trim(p_description), '') is null then
    raise exception 'Description is required';
  end if;

  if nullif(trim(p_service_type), '') is null then
    raise exception 'Service type is required';
  end if;

  if p_cost_amount is null or p_cost_amount < 0 then
    raise exception 'Cost amount is invalid';
  end if;

  if p_selling_amount is null or p_selling_amount <= 0 then
    raise exception 'Selling amount is invalid';
  end if;

  if p_cost_amount <> round(p_cost_amount, 2)
    or p_selling_amount <> round(p_selling_amount, 2)
    or coalesce(p_paid_amount, 0) <> round(coalesce(p_paid_amount, 0), 2) then
    raise exception 'Amounts must use at most two decimal places';
  end if;

  if p_customer_id is not null
    and not exists (
      select 1
      from public.customers
      where id = p_customer_id
        and business_id = v_business_id
        and is_active = true
    ) then
    raise exception 'Customer does not belong to this business';
  end if;

  if p_payment_status <> 'PAID' and p_customer_id is null then
    raise exception 'A customer is required for an unpaid sale';
  end if;

  v_total_amount := p_selling_amount;

  case p_payment_status
    when 'PAID' then
      v_paid_amount := v_total_amount;
    when 'CREDIT' then
      v_paid_amount := 0;
    when 'PARTIAL' then
      v_paid_amount := coalesce(p_paid_amount, 0);

      if v_paid_amount <= 0 or v_paid_amount >= v_total_amount then
        raise exception 'Partial payment must be between zero and total amount';
      end if;
  end case;

  v_outstanding_amount := v_total_amount - v_paid_amount;
  v_margin_amount := p_selling_amount - p_cost_amount;

  insert into public.sales (
    business_id,
    customer_id,
    description,
    payment_status,
    total_amount,
    paid_amount,
    outstanding_amount,
    service_type,
    destination_phone,
    cost_amount,
    selling_amount,
    margin_amount,
    created_by
  )
  values (
    v_business_id,
    p_customer_id,
    trim(p_description),
    p_payment_status,
    v_total_amount,
    v_paid_amount,
    v_outstanding_amount,
    trim(p_service_type),
    null,
    p_cost_amount,
    p_selling_amount,
    v_margin_amount,
    v_user_id
  )
  returning id into v_sale_id;

  if v_outstanding_amount > 0 then
    insert into public.debt_records (
      business_id,
      customer_id,
      sale_id,
      total_amount,
      paid_amount,
      outstanding_amount,
      status,
      created_by
    )
    values (
      v_business_id,
      p_customer_id,
      v_sale_id,
      v_total_amount,
      v_paid_amount,
      v_outstanding_amount,
      'NOT_DUE',
      v_user_id
    )
    returning id into v_debt_id;
  end if;

  if v_paid_amount > 0 then
    insert into public.cash_transactions (
      business_id,
      type,
      amount,
      sale_id,
      description,
      created_by
    )
    values (
      v_business_id,
      'SALE_PAYMENT',
      v_paid_amount,
      v_sale_id,
      trim(p_description),
      v_user_id
    );
  end if;

  return v_sale_id;
end;
$$;

revoke execute on function public.create_pulse_sale(
  uuid,
  text,
  public.sale_payment_status,
  numeric,
  text,
  numeric,
  numeric
) from public;

revoke execute on function public.create_pulse_sale(
  uuid,
  text,
  public.sale_payment_status,
  numeric,
  text,
  numeric,
  numeric
) from anon;

grant execute on function public.create_pulse_sale(
  uuid,
  text,
  public.sale_payment_status,
  numeric,
  text,
  numeric,
  numeric
) to authenticated;

drop policy if exists "Members can insert business sales" on public.sales;
create policy "Members can insert business sales"
on public.sales for insert to authenticated
with check (
  created_by = (select auth.uid())
  and exists (
    select 1
    from public.business_members
    where business_members.business_id = sales.business_id
      and business_members.user_id = (select auth.uid())
  )
);

drop policy if exists "Members can insert business debts" on public.debt_records;
create policy "Members can insert business debts"
on public.debt_records for insert to authenticated
with check (
  created_by = (select auth.uid())
  and exists (
    select 1
    from public.business_members
    where business_members.business_id = debt_records.business_id
      and business_members.user_id = (select auth.uid())
  )
);

drop policy if exists "Members can insert business cash transactions" on public.cash_transactions;
create policy "Members can insert business cash transactions"
on public.cash_transactions for insert to authenticated
with check (
  created_by = (select auth.uid())
  and exists (
    select 1
    from public.business_members
    where business_members.business_id = cash_transactions.business_id
      and business_members.user_id = (select auth.uid())
  )
);

create or replace function public.pay_debt(
  p_debt_id uuid,
  p_amount numeric
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
  v_outstanding_amount numeric(14, 2);
  v_new_paid_amount numeric(14, 2);
  v_new_outstanding_amount numeric(14, 2);
  v_due_date date;
  v_debt_status public.debt_status;
  v_payment_id uuid;
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

  if p_amount is null or p_amount <= 0 or p_amount <> round(p_amount, 2) then
    raise exception 'Payment amount is invalid';
  end if;

  select
    customer_id,
    outstanding_amount,
    paid_amount,
    due_date
  into
    v_customer_id,
    v_outstanding_amount,
    v_new_paid_amount,
    v_due_date
  from public.debt_records
  where id = p_debt_id
    and business_id = v_business_id
    and status <> 'PAID'
  for update;

  if not found then
    raise exception 'Debt not found';
  end if;

  if p_amount > v_outstanding_amount then
    raise exception 'Payment exceeds outstanding debt';
  end if;

  v_new_paid_amount := v_new_paid_amount + p_amount;
  v_new_outstanding_amount := v_outstanding_amount - p_amount;

  v_debt_status := case
    when v_new_outstanding_amount = 0 then 'PAID'::public.debt_status
    when v_due_date is null then 'NOT_DUE'::public.debt_status
    when v_due_date < current_date then 'OVERDUE'::public.debt_status
    else 'DUE'::public.debt_status
  end;

  update public.debt_records
  set
    paid_amount = v_new_paid_amount,
    outstanding_amount = v_new_outstanding_amount,
    status = v_debt_status,
    updated_at = now()
  where id = p_debt_id;

  insert into public.debt_payments (
    business_id,
    debt_id,
    amount,
    created_by
  )
  values (
    v_business_id,
    p_debt_id,
    p_amount,
    v_user_id
  )
  returning id into v_payment_id;

  insert into public.cash_transactions (
    business_id,
    type,
    amount,
    debt_payment_id,
    description,
    created_by
  )
  values (
    v_business_id,
    'DEBT_PAYMENT',
    p_amount,
    v_payment_id,
    'Pembayaran piutang',
    v_user_id
  );

  return v_payment_id;
end;
$$;

revoke execute on function public.pay_debt(uuid, numeric) from public;
revoke execute on function public.pay_debt(uuid, numeric) from anon;
grant execute on function public.pay_debt(uuid, numeric) to authenticated;

drop policy if exists "Members can update business debts" on public.debt_records;
create policy "Members can update business debts"
on public.debt_records for update to authenticated
using (
  exists (
    select 1
    from public.business_members
    where business_members.business_id = debt_records.business_id
      and business_members.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.business_members
    where business_members.business_id = debt_records.business_id
      and business_members.user_id = (select auth.uid())
  )
);

drop policy if exists "Members can insert business debt payments" on public.debt_payments;
create policy "Members can insert business debt payments"
on public.debt_payments for insert to authenticated
with check (
  created_by = (select auth.uid())
  and exists (
    select 1
    from public.business_members
    where business_members.business_id = debt_payments.business_id
      and business_members.user_id = (select auth.uid())
  )
);
