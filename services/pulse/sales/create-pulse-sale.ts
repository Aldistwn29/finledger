import { insertPulseSale } from "@/db/rpc/pulse/sales";
import type { CreatePulseSaleInput } from "@/services/pulse/sales/types";

export async function createPulseSale(
  input: CreatePulseSaleInput,
): Promise<string> {
  return insertPulseSale(input);
}
