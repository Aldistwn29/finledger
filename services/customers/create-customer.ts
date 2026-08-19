import {
  createCustomer as createCustomerRpc,
  type CustomerMutationInput,
} from "@/db/rpc/customers";

export async function createCustomer(
  input: CustomerMutationInput,
): Promise<string> {
  return createCustomerRpc(input);
}
