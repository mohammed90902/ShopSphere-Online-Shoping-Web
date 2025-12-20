// ✅ scripts/utils/money.js  (COPY–PASTE THIS FILE)

export function formatCurrency(cents) {
  return (Math.round(cents) / 100).toFixed(2);
}
