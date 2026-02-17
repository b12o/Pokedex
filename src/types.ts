import { type Interface } from "node:readline";
import { PokeAPI } from "./pokeapi.js";

// https://pokeapi.co/api/v2/location-area
// from the pokeapi:
// calling any API endopint without a resource ID will return a paginated list of
// available resources for that API.
//
// e.g. https://pokeapi.co/api/v2/location-area
export type ResourceList = {
  previous: string | null;
  current: string;
  next: string;
  results: {
    name: string;
    url: string;
  }[];
};

// https://pokeapi.co/api/v2/location-area/<location-area-name>
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

type PokemonStat = {};

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
