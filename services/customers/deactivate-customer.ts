import { deactivateCustomer as deactivateCustomerRpc } from "@/db/rpc/customers";

export async function deactivateCustomer(customerId: string): Promise<void> {
  await deactivateCustomerRpc(customerId);
}
