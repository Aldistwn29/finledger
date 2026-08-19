export function parseMoneyToMinorUnits(value: string): bigint {
  const normalized = value.trim().replace(",", ".");

  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error("Invalid monetary value");
  }

  const [whole, fraction = ""] = normalized.split(".");

  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
}

export function minorUnitsToMoney(value: bigint): string {
  const whole = value / 100n;
  const fraction = (value % 100n).toString().padStart(2, "0");

  return `${whole}.${fraction}`;
}

export function minorUnitsToCurrency(value: bigint | null): string {
  if (value == null) {
    return "Rp0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(Number(value) / 100);
}
