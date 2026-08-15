import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(120),
  phone: z.string().trim().max(40, "Nomor telepon terlalu panjang."),
  address: z.string().trim().max(240, "Alamat terlalu panjang."),
  notes: z.string().trim().max(500, "Catatan terlalu panjang."),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
