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
  encounter_method_rates: {
    encounter_method: {
      name: string;
      url: string;
    };
    version_details: {
      rate: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }[];
  location: {
    name: string;
    url: string;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    }[];
  };
  pokemon_encounters: {
    pokemon: {
      name: string;
      url: string;
    };
  }[];
  test: boolean;
};
