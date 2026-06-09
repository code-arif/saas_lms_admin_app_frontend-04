export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  // Backend stores amounts in cents
  const dollars = amount / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(dollars);
}

export function formatCurrencyShort(amount: number): string {
  const dollars = amount / 100;
  if (dollars >= 1000000) {
    return `$${(dollars / 1000000).toFixed(1)}M`;
  }
  if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}K`;
  }
  return `$${dollars.toFixed(2)}`;
}
