import { Cache } from "./pokecache.js";
import { sleep } from "./utils.js";
import { logger } from "./logger.js";
import type { LocationAreaResponse } from "./types.js";

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
  ): Promise<[ShallowLocations, NavURLs] | ErrorResponse> {
    const url = pageURL ? pageURL : `${PokeAPI.BASE_URL}/location-area`;

    const cached = this.cache.get<MapItem>(url);
    if (cached) {
      logger.info(`found cached object: ${url}`);
      const cacheLocations = cached.shallowLocations;
      const cacheNavUrls = cached.navUrls;
      return [cacheLocations, cacheNavUrls];
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

    const data = await res.json();
    const navUrls: NavURLs = {
      previous: data["previous"] !== null ? data["previous"] : "",
      current: url,
      next: data["next"] !== null ? data["next"] : "",
    };

    logger.info(`Adding map item ${url} to cache ...`);

    const mapItem: MapItem = {
      shallowLocations: data["results"],
      navUrls,
    };
    this.cache.add(navUrls.current, mapItem);

    return [data["results"], navUrls];
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

    const cached = this.cache.get<LocationAreaResponse>(url);
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
    const data: LocationAreaResponse = await res.json();

    this.cache.add(url, data);
    return data.pokemon_encounters.map((encounter) => encounter.pokemon.name);
  }
}

export type ErrorResponse = {
  isError: boolean;
  statusCode: number;
  statusText: string;
};

export type NavURLs = {
  previous: string;
  current: string;
  next: string;
};

export type ShallowLocations = { name: string; url: string }[];

export type MapItem = {
  shallowLocations: ShallowLocations;
  navUrls: NavURLs;
};

export type Location = {}; // TODO:
