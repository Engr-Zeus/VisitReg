export function formatCount(n: number): string {
  return new Intl.NumberFormat(undefined).format(n);
}
