export const BASE_PRICE = 19.99;
export const MIN_PRICE = 4.99;

export function calculatePrice(dateString: string): number {
  if (!dateString) return BASE_PRICE;
  const year = new Date(dateString).getFullYear();
  if (isNaN(year)) return BASE_PRICE;
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const price = BASE_PRICE - age;
  return Math.max(price, MIN_PRICE);
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
