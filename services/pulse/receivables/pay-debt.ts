import { payDebt as payDebtRpc } from "@/db/rpc/pulse/receivables";

export async function payDebt(
  debtId: string,
  amount: string,
): Promise<string> {
  return payDebtRpc(debtId, amount);
}
