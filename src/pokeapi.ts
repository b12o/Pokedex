import type { ResourceList, LocationArea, ErrorResponse } from "./types.js";
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
    const url = pageURL ? pageURL : `${PokeAPI.BASE_URL}/location-area`;

    const cached = this.cache.get<ResourceList>(url);
    if (cached) {
      logger.info(`found cached object: ${url}`);
      return cached;
    }

    logger.info("No cached object found. Attempt fetch request ...");

    // simulate network request
    await sleep(1000);

    const res = await fetch(url);
    if (!res.ok) {
      return {
        isError: true,
        statusCode: res.status,
        statusText: res.statusText,
      };
    }

    const data: ResourceList = await res.json();
    data.current = url;
    logger.info(`Adding map item ${url} to cache ...`);
    this.cache.add(url, data);
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
    const url = `${PokeAPI.BASE_URL}/location-area/${locationArea}`;

    const cached = this.cache.get<LocationArea>(locationArea);
    if (cached) {
      logger.info(`found cached object: ${url}`);
      return cached.pokemon_encounters.map(
        (encounter) => encounter.pokemon.name,
      );
    }
    logger.info("No cached object found. Attempt fetch request ...");

    // simulate network request
    await sleep(1000);

    const res = await fetch(url);
    if (!res.ok) {
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
}
