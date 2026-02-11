import { type State } from "./state.js";

export function cleanInput(input: string): string[] {
  if (!input.trim().length) return [];
  const trimmed = input.trim();
  return trimmed
    .split(" ")
    .filter((item) => item.trim().length !== 0)
    .map((item) => item.toLowerCase());
}

export function startREPL(state: State) {
  state.rl.on("line", async (input: string) => {
    const [firstArg, _] = cleanInput(input);
    if (firstArg in state.commands) {
      await state.commands[firstArg].callback(state);
    } else {
      console.log(`Unknown command: ${input}`);
    }
    state.rl.prompt();
  });
  state.rl.prompt();
}
