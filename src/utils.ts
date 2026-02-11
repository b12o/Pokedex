export function isEmpty(s: string): boolean {
  return s.trim().length === 0;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
