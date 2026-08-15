import test from "node:test";
import assert from "node:assert/strict";
import { customerSchema } from "../services/customers/validation.ts";

test("customer validation accepts a valid customer", () => {
  const result = customerSchema.safeParse({
    name: "Sari",
    phone: "081234567890",
    address: "Jl. Melati",
    notes: "Pelanggan tetap",
  });

  assert.equal(result.success, true);
});

test("customer validation rejects a short name", () => {
  const result = customerSchema.safeParse({
    name: "A",
    phone: "",
    address: "",
    notes: "",
  });

  assert.equal(result.success, false);
});
