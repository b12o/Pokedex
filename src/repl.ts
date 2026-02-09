export function cleanInput(input: string): string[] {
  if (!input.trim().length) return [];
  const trimmed = input.trim();
  return trimmed
    .split(" ")
    .filter((item) => item.trim().length !== 0)
    .map((item) => item.toLowerCase());
}
