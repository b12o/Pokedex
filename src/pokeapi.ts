import type {
  Pokemon,
  ResourceList,
  LocationArea,
  ErrorResponse,
} from "./types.js";
import { Cache } from "./pokecache.js";
import { sleep } from "./utils.js";
import { logger } from "./logger.js";

export class PokeAPI {
  private static readonly BASE_URL: string = "https://pokeapi.co/api/v2";
  private static readonly CACHE_INTERVAL_MS = 100_000; // cleanup cache after 100s
  private cache: Cache;

  constructor() {
    this.cache = new Cache(PokeAPI.CACHE_INTERVAL_MS);
  }

  /**
   * Returns list of 20 locations at a time
   */
  async fetchLocations(
    pageURL?: string,
  ): Promise<ResourceList | ErrorResponse> {
    const endpoint = pageURL ? pageURL : `${PokeAPI.BASE_URL}/location-area`;

    const cached = this.cache.get<ResourceList>(endpoint);
    if (cached) {
      logger.info(
        `pokeapi.ts->fetchLocations: found cached object: ${endpoint}`,
      );
      return cached;
    }

    logger.info(
      "pokeapi.ts->fetchLocations: no cached object found. Attempt fetch request ...",
    );

    // simulate network request
    await sleep(1000);

    const res = await fetch(endpoint);
    if (!res.ok) {
      return {
        isError: true,
        statusCode: res.status,
        statusText: res.statusText,
      };
    }

    const data: ResourceList = await res.json();
    data.current = endpoint;
    logger.info(
      `pokeapi.ts->fetchLocations: adding map item ${endpoint} to cache ...`,
    );
    this.cache.add(endpoint, data);
    return data;
  }

  /**
   * Explores a location area and returns a list of pokemons in that location
   * @param locationArea name of location area to search for
   * @returns string array of found pokemon or error response
   */
  async exploreLocation(
    locationArea: string,
  ): Promise<string[] | ErrorResponse> {
    const endpoint = `${PokeAPI.BASE_URL}/location-area/${locationArea}`;

    const cached = this.cache.get<LocationArea>(locationArea);
    if (cached) {
      logger.info(
        `pokeapi.ts->exploreLocation: found cached object: ${endpoint}`,
      );
      return cached.pokemon_encounters.map(
        (encounter) => encounter.pokemon.name,
      );
    }
    logger.info(
      "pokeapi.ts->exploreLocation: no cached object found. Attempt fetch request ...",
    );

    // simulate network request
    await sleep(1000);

    const res = await fetch(endpoint);
    if (!res.ok) {
      logger.error(
        `pokeapi.ts->exploreLocation: API request to ${endpoint} failed: ${res.status} - ${res.statusText}`,
      );
      return {
        isError: true,
        statusCode: res.status,
        statusText: res.statusText,
      };
    }
    const data: LocationArea = await res.json();

    this.cache.add(locationArea, data);
    return data.pokemon_encounters.map((encounter) => encounter.pokemon.name);
  }

  async getPokemon(pokemon: string): Promise<Pokemon | ErrorResponse> {
    const endpoint = `${PokeAPI.BASE_URL}/pokemon/${pokemon}`;
    const res = await fetch(endpoint);
    if (!res.ok) {
      logger.error(
        `pokeapi.ts->getPokemon: API request to ${endpoint} failed: ${res.status} - ${res.statusText}`,
      );
      return {
        isError: true,
        statusCode: res.status,
        statusText: res.statusText,
      };
    }
    const pokemonData: Pokemon = await res.json();
    logger.debug(
      `pokeapi.ts->getPokemon: pokemon name: ${pokemonData.name}, base_exp: ${pokemonData.base_experience}`,
    );

    const pokemonObject: Pokemon = {
      name: pokemonData.name,
      base_experience: pokemonData.base_experience,
      height: pokemonData.height,
      weight: pokemonData.weight,
      stats: pokemonData.stats,
      types: pokemonData.types,
    };

    logger.debug("");
    logger.debug(`pokeapi.ts->getPokemon: pokemon details:`);
    logger.debug(
      `pokeapi.ts->getPokemon: base exp: ${pokemonObject.base_experience}`,
    );
    logger.debug(`pokeapi.ts->getPokemon: height: ${pokemonObject.height}`);
    logger.debug(`pokeapi.ts->getPokemon: weight: ${pokemonObject.weight}`);
    logger.debug(`pokeapi.ts->getPokemon: stats: ${pokemonObject.stats}`);
    logger.debug(`pokeapi.ts->getPokemon: types: ${pokemonObject.types}`);
    logger.debug("");
    return pokemonObject;
  }
}
