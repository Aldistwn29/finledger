"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/get-current-context";
import type { CustomerActionState } from "@/services/customers/types";
import { createCustomer } from "@/services/customers/create-customer";
import { deactivateCustomer } from "@/services/customers/deactivate-customer";
import { updateCustomer } from "@/services/customers/update-customer";
import { customerSchema } from "@/services/customers/validation";

const customerIdSchema = z.string().uuid("Customer tidak valid.");

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function fieldErrors(error: z.ZodError): CustomerActionState {
  const errors: CustomerActionState["fieldErrors"] = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      typeof field === "string" &&
      ["name", "phone", "address", "notes"].includes(field) &&
      !errors[field as keyof NonNullable<CustomerActionState["fieldErrors"]>]
    ) {
      errors[field as keyof NonNullable<CustomerActionState["fieldErrors"]>] =
        issue.message;
    }
  }

  return {
    error: "Periksa kembali data customer.",
    fieldErrors: errors,
  };
}

function parsedCustomer(formData: FormData) {
  return customerSchema.safeParse({
    name: getString(formData.get("name")),
    phone: getString(formData.get("phone")),
    address: getString(formData.get("address")),
    notes: getString(formData.get("notes")),
  });
}

export async function createCustomerAction(
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const context = await requireUser();

  if (!context.business) {
    return { error: "Bisnis belum tersedia." };
  }

  const parsed = parsedCustomer(formData);
  if (!parsed.success) return fieldErrors(parsed.error);

  try {
    await createCustomer({
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      address: parsed.data.address || null,
      notes: parsed.data.notes || null,
    });
  } catch {
    return { error: "Customer gagal dibuat. Silakan coba lagi." };
  }

  revalidatePath("/app/customers");
  redirect("/app/customers");
}

export async function updateCustomerAction(
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const context = await requireUser();

  if (!context.business) {
    return { error: "Bisnis belum tersedia." };
  }

  const customerId = customerIdSchema.safeParse(getString(formData.get("customerId")));
  const parsed = parsedCustomer(formData);

  if (!customerId.success) return { error: customerId.error.issues[0]?.message };
  if (!parsed.success) return fieldErrors(parsed.error);

  try {
    await updateCustomer(customerId.data, {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      address: parsed.data.address || null,
      notes: parsed.data.notes || null,
    });
  } catch {
    return { error: "Customer gagal diperbarui. Silakan coba lagi." };
  }

  revalidatePath("/app/customers");
  revalidatePath(`/app/customers/${customerId.data}`);
  redirect(`/app/customers/${customerId.data}`);
}

export async function deactivateCustomerAction(
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const context = await requireUser();

  if (!context.business) {
    return { error: "Bisnis belum tersedia." };
  }

  const customerId = customerIdSchema.safeParse(getString(formData.get("customerId")));
  if (!customerId.success) return { error: customerId.error.issues[0]?.message };

  try {
    await deactivateCustomer(customerId.data);
  } catch {
    return { error: "Customer gagal dinonaktifkan. Silakan coba lagi." };
  }

  revalidatePath("/app/customers");
  revalidatePath(`/app/customers/${customerId.data}`);
  redirect(`/app/customers/${customerId.data}`);
}
