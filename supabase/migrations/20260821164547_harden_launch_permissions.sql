-- SECURITY DEFINER functions must not resolve objects from writable schemas.
revoke create on schema public from PUBLIC, anon, authenticated;
grant usage on schema public to anon, authenticated;

alter function public.create_business_for_current_user(
  text,
  public.business_type,
  text,
  text
)
  security definer;

alter function public.create_customer(text, text, text, text)
  security definer;

alter function public.create_feedback(public.feedback_category, text)
  security definer;

alter function public.create_pulse_sale(
  uuid,
  text,
  public.sale_payment_status,
  numeric,
  text,
  numeric,
  numeric
)
  security definer;

alter function public.deactivate_customer(uuid)
  security definer;

alter function public.handle_new_user()
  security definer;

alter function public.is_admin()
  security definer;

alter function public.pay_debt(uuid, numeric)
  security definer;

alter function public.update_current_user_settings(text, text, text, text)
  security definer;

alter function public.update_customer(uuid, text, text, text, text)
  security definer;

alter function public.create_business_for_current_user(
  text,
  public.business_type,
  text,
  text
)
  set search_path to pg_catalog, public;

alter function public.create_customer(text, text, text, text)
  set search_path to pg_catalog, public;

alter function public.create_feedback(public.feedback_category, text)
  set search_path to pg_catalog, public;

alter function public.create_pulse_sale(
  uuid,
  text,
  public.sale_payment_status,
  numeric,
  text,
  numeric,
  numeric
)
  set search_path to pg_catalog, public;

alter function public.deactivate_customer(uuid)
  set search_path to pg_catalog, public;

alter function public.handle_new_user()
  set search_path to pg_catalog, public;

alter function public.is_admin()
  set search_path to pg_catalog, public;

alter function public.pay_debt(uuid, numeric)
  set search_path to pg_catalog, public;

alter function public.set_updated_at()
  set search_path to pg_catalog;

alter function public.update_current_user_settings(text, text, text, text)
  set search_path to pg_catalog, public;

alter function public.update_customer(uuid, text, text, text, text)
  set search_path to pg_catalog, public;

-- Remove direct table mutations from public API roles.
revoke all privileges on all tables in schema public
  from PUBLIC, anon, authenticated;

revoke all privileges on all sequences in schema public
  from PUBLIC, anon, authenticated;

revoke execute on all functions in schema public
  from PUBLIC, anon, authenticated;

-- Authenticated users only need direct reads; RLS still filters rows.
grant select on table
  public.profiles,
  public.business_members,
  public.businesses,
  public.customers,
  public.sales,
  public.debt_records,
  public.debt_payments,
  public.cash_transactions
to authenticated;

-- Expose only the application RPC surface.
grant execute on function public.create_business_for_current_user(
  text,
  public.business_type,
  text,
  text
)
to authenticated;

grant execute on function public.create_customer(text, text, text, text)
  to authenticated;

grant execute on function public.create_feedback(
  public.feedback_category,
  text
)
to authenticated;

grant execute on function public.create_pulse_sale(
  uuid,
  text,
  public.sale_payment_status,
  numeric,
  text,
  numeric,
  numeric
)
to authenticated;

grant execute on function public.deactivate_customer(uuid)
  to authenticated;

grant execute on function public.pay_debt(uuid, numeric)
  to authenticated;

grant execute on function public.update_current_user_settings(
  text,
  text,
  text,
  text
)
to authenticated;

grant execute on function public.update_customer(
  uuid,
  text,
  text,
  text,
  text
)
to authenticated;

-- Existing admin RLS policies call this function.
grant execute on function public.is_admin()
  to authenticated;

-- Future objects must not automatically receive broad API privileges.
alter default privileges for role postgres in schema public
  revoke all privileges on tables from PUBLIC, anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all privileges on sequences from PUBLIC, anon, authenticated;

alter default privileges for role postgres in schema public
  revoke execute on functions from PUBLIC, anon, authenticated;