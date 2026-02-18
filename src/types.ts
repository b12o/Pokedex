import { type Interface } from "node:readline";
import { PokeAPI } from "./pokeapi.js";

export type ResourceList = {
  previous: string | null;
  current: string;
  next: string;
  results: {
    name: string;
    url: string;
  }[];
};

export type LocationArea = {
  id: number;
  name: string;
  game_index: number;
  location: {
    name: string;
    url: string;
  };
  pokemon_encounters: {
    pokemon: {
      name: string;
      url: string;
    };
  }[];
};

export type ErrorResponse = {
  isError: boolean;
  statusCode: number;
  statusText: string;
};

export type Pokemon = {
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
};

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
  rl: Interface;
  pokeApi: PokeAPI;
  commands: Record<string, CLICommand>;
  prevLocationAreasURL: string;
  currentLocationAreasURL: string;
  nextLocationAreasURL: string;
  currentLocationAreaName: string;
  pokedex: Record<string, Pokemon>;
};
