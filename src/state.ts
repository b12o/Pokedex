import { createInterface } from "node:readline";
import {
  commandExit,
  commandHelp,
  commandMapNext,
  commandMapPrevious,
  commandExplore,
  commandCatch,
  commandInspect,
} from "./commands.js";
import { PokeAPI } from "./pokeapi.js";

import type { State, CLICommand } from "./types.js";

function GetCommands(): Record<string, CLICommand> {
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
    explore: {
      name: "explore <location-area>",
      description: "Shows list of pokemons in this area",
      callback: commandExplore,
    },
    catch: {
      name: "catch <pokemon>",
      description: "Attempt to catch a pokemon",
      callback: commandCatch,
    },
    inspect: {
      name: "inspect <pokemon>",
      description: "Inspect a pokemon from your pokedex",
      callback: commandInspect,
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
    prevLocationAreasURL: "",
    currentLocationAreasURL: "",
    nextLocationAreasURL: "",
    currentLocationAreaName: "",
    pokedex: {},
  };
  return state;
}
