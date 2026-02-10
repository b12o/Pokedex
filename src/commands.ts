import type { State } from "./state.js";

export function commandExit(state: State): void {
  console.log("Closing the Pokedex... Goodbye!");
  state.rl.close();
  process.exit(0);
}

export function commandHelp(state: State): void {
  let helpString = `Welcome to the Pokedex!`;
  helpString += `\nUsage:\n`;

  for (const command in state.commands) {
    helpString += `\n${command}: ${state.commands[command].description}`;
  }
  console.log(helpString);
}
