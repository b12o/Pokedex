import { createInterface, type Interface } from "node:readline";
import { commandExit, commandHelp } from "./commands.js";

export type State = {
  rl: Interface;
  commands: Record<string, CLICommand>;
};

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => void;
};

export function GetCommands(): Record<string, CLICommand> {
  return {
    exit: {
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    },
    help: {
      name: "help",
      description: "Displays a help message",
      callback: commandHelp,
    },
  };
}

export function initState(): State {
  const state: State = {
    rl: createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "Pokedex > ",
    }),
    commands: GetCommands(),
  };
  return state;
}
