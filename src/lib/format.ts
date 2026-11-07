const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** "₹25,000" — fixed locale so server and client agree. */
export function formatInr(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) {
    return "₹0";
  }
  return inrFormatter.format(amount);
}

/** "₹1.5 L" / "₹2 Cr" for compact stats. */
export function formatInrCompact(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    return "₹0";
  }
  if (amount >= 10_000_000) {
    const crore = amount / 10_000_000;
    return `₹${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(1)} Cr`;
  }
  if (amount >= 100_000) {
    const lakh = amount / 100_000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} L`;
  }
  return formatInr(amount);
}

export function pluralise(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
