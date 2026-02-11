import { createInterface, type Interface } from "node:readline";
import {
  commandExit,
  commandHelp,
  commandMapNext,
  commandMapPrevious,
} from "./commands.js";
import { PokeAPI } from "./pokeapi.js";

export type State = {
  rl: Interface;
  commands: Record<string, CLICommand>;
  pokeApi: PokeAPI;
  prevLocationsURL: string;
  currentLocationsURL: string;
  nextLocationsURL: string;
};

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => Promise<void>;
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
    map: {
      name: "map",
      description: "Display the next 20 locations",
      callback: commandMapNext,
    },
    mapb: {
      name: "mapb",
      description: "Display the previous 20 locations",
      callback: commandMapPrevious,
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
    pokeApi: new PokeAPI(),
    prevLocationsURL: "",
    currentLocationsURL: "",
    nextLocationsURL: "",
  };
  return state;
}
