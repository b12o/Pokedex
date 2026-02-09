import readline from "node:readline";

export function cleanInput(input: string): string[] {
  if (!input.trim().length) return [];
  const trimmed = input.trim();
  return trimmed
    .split(" ")
    .filter((item) => item.trim().length !== 0)
    .map((item) => item.toLowerCase());
}

export function startREPL() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Pokedex > ",
  });

  rl.on("line", (input: string) => {
    const cleaned = cleanInput(input);
    if (!cleaned.length) {
      rl.prompt();
      return;
    }
    console.log(`Your command was: ${cleaned[0]}`);
    rl.prompt();
  });

  rl.prompt();
}
