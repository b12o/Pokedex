import { Cache } from "./pokecache.js";
import { sleep } from "./utils.js";
import { logger } from "./logger.js";

export class PokeAPI {
  private static readonly BASE_URL: string = "https://pokeapi.co/api/v2";
  private static readonly CACHE_INTERVAL_MS = 100_000;
  private cache: Cache;

  constructor() {
    this.cache = new Cache(PokeAPI.CACHE_INTERVAL_MS);
  }

  async fetchLocations(
    pageURL?: string,
  ): Promise<[ShallowLocations, NavURLs] | ErrorResponse> {
    const url = pageURL ? pageURL : `${PokeAPI.BASE_URL}/location-area`;

    const cacheItem = this.cache.get<MapItem>(url);
    if (cacheItem) {
      logger.info(`found cached object: ${url}`);
      const cacheLocations = cacheItem.shallowLocations;
      const cacheNavUrls = cacheItem.navUrls;
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
