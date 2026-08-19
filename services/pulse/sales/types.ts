export type PulseSalePaymentStatus = "PAID" | "CREDIT" | "PARTIAL";

export type SaleFieldName =
  | "serviceType"
  | "description"
  | "costAmount"
  | "sellingAmount"
  | "paymentStatus"
  | "customerId"
  | "paidAmount";

export type SaleActionState = {
  error?: string;
  fieldErrors?: Partial<Record<SaleFieldName, string>>;
};

export type { ActiveCustomer } from "@/services/customers/types";

export type CreatePulseSaleInput = {
  customerId: string | null;
  description: string;
  paymentStatus: PulseSalePaymentStatus;
  paidAmount: string;
  serviceType: string;
  costAmount: string;
  sellingAmount: string;
};

export type CreatePulseSaleAction = (
  previousState: SaleActionState,
  formData: FormData,
) => Promise<SaleActionState>;
