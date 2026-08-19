export type CustomerStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export type CustomerFieldName = "name" | "phone" | "address" | "notes";

export type CustomerActionState = {
  error?: string;
  fieldErrors?: Partial<Record<CustomerFieldName, string>>;
};

export type ActiveCustomer = {
  id: string;
  name: string;
};

export type CustomerListItem = {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  outstandingDebt: number;
};

export type CustomerDebtHistory = {
  id: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  dueDate: string | null;
  status: "NOT_DUE" | "DUE" | "OVERDUE" | "PAID";
  createdAt: string;
  payments: Array<{
    id: string;
    amount: number;
    paidAt: string;
  }>;
};

export type CustomerSaleHistory = {
  id: string;
  description: string;
  serviceType: string | null;
  paymentStatus: "PAID" | "CREDIT" | "PARTIAL";
  totalAmount: number;
  soldAt: string;
};

export type CustomerDetail = {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  debts: CustomerDebtHistory[];
  sales: CustomerSaleHistory[];
};

export type CustomerAction = (
  previousState: CustomerActionState,
  formData: FormData,
) => Promise<CustomerActionState>;
