export class PokeAPI {
  private static readonly baseURL: string = "https://pokeapi.co/api/v2";

  constructor() {}

  async fetchLocations(
    pageURL?: string,
  ): Promise<[ShallowLocations, NavURLs] | ErrorResponse> {
    const url = pageURL ? pageURL : `${PokeAPI.baseURL}/location-area`;

    // console.debug(`url is ${url}`);

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
      next: data["next"] !== null ? data["next"] : "",
    };
    return [data["results"], navUrls];
  }

  // async fetchLocation(locationName: string): Promise<Location> {}
}

export type ErrorResponse = {
  isError: boolean;
  statusCode: number;
  statusText: string;
};

// dont use optional suffix (previous?) for properties because
// even though they can be undefined, we expect the http response to contain these properties.
export type NavURLs = {
  previous: string;
  next: string;
};

export type ShallowLocations = { name: string; url: string }[];

export type Location = {};
