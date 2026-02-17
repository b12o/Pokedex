import type { Pokemon, State } from "./types.js";
import { isEmpty, sleep } from "./utils.js";
import { logger } from "./logger.js";

export async function commandExit(state: State): Promise<void> {
  console.log("Closing the Pokedex... Goodbye!");
  state.rl.close();
  process.exit(0);
}

export async function commandHelp(state: State): Promise<void> {
  let helpString = "=====================";
  helpString += `\nWelcome to the Pokedex!`;
  helpString += `\nUsage:\n`;

  for (const command in state.commands) {
    helpString += `\n${command}: ${state.commands[command].description}`;
  }
  helpString += "\n=====================";
  console.log(`${helpString}\n`);
}

export async function commandMap(
  state: State,
  type: "next" | "previous",
): Promise<void> {
  let response;

  if (type === "next") {
    if (isEmpty(state.nextLocationAreasURL)) {
      response = await state.pokeApi.fetchLocations();
    } else {
      response = await state.pokeApi.fetchLocations(state.nextLocationAreasURL);
    }
  } else {
    if (isEmpty(state.prevLocationAreasURL)) {
      console.log("You're on the first page.");
      return;
    }
    response = await state.pokeApi.fetchLocations(state.prevLocationAreasURL);
  }

  if (!response) {
    console.log(
      "Ooops! Could not search for locations.\nPlease try again later.",
    );
    commandExit(state);
    return;
  }

  if ("isError" in response) {
    console.log(
      "Ooops! The Pokedex encountered and error while searching for maps.\nPlease try again later.",
    );
    state.rl.close();
    process.exit(0);
  }

  const data = response;

  state.prevLocationAreasURL = data.previous === null ? "" : data.previous;
  state.currentLocationAreasURL = data.current;
  state.nextLocationAreasURL = data.next === null ? "" : data.next;

  for (const location of data.results) {
    console.log(location.name);
  }
  console.log();
  logger.debug(
    `commands.ts->commandMap: previous url: ${state.prevLocationAreasURL}`,
  );
  logger.debug(
    `commands.ts->commandMap: current url: ${state.currentLocationAreasURL}`,
  );
  logger.debug(
    `commands.ts->commandMap: next url: ${state.nextLocationAreasURL}`,
  );
  console.log();
}

export async function commandMapNext(state: State): Promise<void> {
  await commandMap(state, "next");
}

export async function commandMapPrevious(state: State): Promise<void> {
  await commandMap(state, "previous");
}

export async function commandExplore(
  state: State,
  locationArea: string,
): Promise<void> {
  logger.info(`commands.ts->commandExplore: exploring ${locationArea} ...`);
  const response = await state.pokeApi.exploreLocation(locationArea);
  if ("isError" in response) {
    switch (response.statusCode) {
      case 404:
        console.log(
          `Hmmm... I can't find ${locationArea}. Are you sure that's the correct name?`,
        );
        return;
      default:
        console.log(
          `Ooops! The Pokedex encountered and error while exploring ${locationArea}.\
\nPlease try again later.`,
        );
        state.rl.close();
        process.exit(0);
    }
  }
  state.currentLocationAreaName = locationArea;
  console.log("Found Pokemon:");
  response.forEach((pokemon) => console.log(`  - ${pokemon}`));
  console.log();
}

/**
 * attempt to catch a pokemon located in your area
 */
export async function commandCatch(state: State, pokemon: string) {
  const locationArea = state.currentLocationAreaName;
  if (!locationArea.trim().length) {
    console.log(
      "Ooops! It seems you haven't yet explored an area! \
Please explore an area first!\n(Need help? Type 'help' to view your commands.)",
    );
    return;
  }

  const response = await state.pokeApi.exploreLocation(locationArea);
  if ("isError" in response) {
    // this should never occur since state.locationArea HAS to be a valid location, but just in case
    logger.error(
      `commands.ts->commandCatch: locationArea should be valid! (was ${locationArea}`,
    );
    console.log(
      "Ooops! There was an error with the pokedex. Please try again later.",
    );
    return;
  }

  if (!response.includes(pokemon)) {
    console.log(`Hmmm... I can't find ${pokemon} in this location \
(${state.currentLocationAreaName}).\nAre you sure this pokemon can be found here?`);
    return;
  }

  const newPokemon = await state.pokeApi.getPokemon(pokemon);
  if ("isError" in newPokemon) {
    // since we already checked if the pokemon exists in this region, any error here has to be a 500 error
    console.log(
      `Ooops! Something went wrong trying to catch ${pokemon}. Please try again later.`,
    );
    return;
  }

  console.log(`Throwing a Pokeball at ${pokemon}...`);
  await sleep(2000); // the suspense! I can't handle it!

  const probability = Math.round(newPokemon.base_experience * 0.25);
  const difficulty = Math.min(probability, 80);
  const throwVal = Math.round(Math.random() * 100);

  if (throwVal >= difficulty) {
    console.log(`Caught ${pokemon}! ${pokemon} was added to your pokedex!`);
    state.pokedex[pokemon] = newPokemon;
    return;
  }
  console.log(`${pokemon} broke free!`);
  return;
}
