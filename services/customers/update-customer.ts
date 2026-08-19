import {
  updateCustomer as updateCustomerRpc,
  type CustomerMutationInput,
} from "@/db/rpc/customers";

export async function updateCustomer(
  customerId: string,
  input: CustomerMutationInput,
): Promise<void> {
  await updateCustomerRpc(customerId, input);
}
