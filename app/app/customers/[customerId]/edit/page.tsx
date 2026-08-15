import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomerForm from "@/components/customers/customer-form";
import { getCustomerDetail } from "@/db/queries/customers";
import { requireUser } from "@/lib/auth/get-current-context";
import { updateCustomerAction } from "../../actions";

type EditCustomerPageProps = {
  params: Promise<{ customerId: string }>;
};

export const metadata: Metadata = {
  title: "Edit Customer | FinLedger",
  description: "Perbarui data customer.",
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const context = await requireUser();

  if (!context.business) {
    redirect("/setup/business");
  }

  const { customerId } = await params;
  const customer = await getCustomerDetail(context.business.id, customerId);

  if (!customer) {
    notFound();
  }

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Edit customer
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Perbarui informasi {customer.name}.
        </p>
      </header>

      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Informasi customer</CardTitle></CardHeader>
        <CardContent>
          <CustomerForm customer={customer} action={updateCustomerAction} />
        </CardContent>
      </Card>
    </main>
  );
}
