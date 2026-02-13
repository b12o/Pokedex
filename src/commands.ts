import type { State } from "./state.js";
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
    if (isEmpty(state.nextLocationsURL)) {
      response = await state.pokeApi.fetchLocations();
    } else {
      response = await state.pokeApi.fetchLocations(state.nextLocationsURL);
    }
  } else {
    if (isEmpty(state.prevLocationsURL)) {
      console.log("You're on the first page.");
      return;
    }
    response = await state.pokeApi.fetchLocations(state.prevLocationsURL);
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

  const [locations, navUrls] = response;

  state.prevLocationsURL = navUrls.previous;
  state.currentLocationsURL = navUrls.current;
  state.nextLocationsURL = navUrls.next;

  for (const location of locations) {
    console.log(location.name);
  }
  console.log();
  logger.debug(`previous url: ${state.prevLocationsURL}`);
  logger.debug(`current url: ${state.currentLocationsURL}`);
  logger.debug(`next url: ${state.nextLocationsURL}`);
  console.log();
}

export async function commandMapNext(state: State): Promise<void> {
  await commandMap(state, "next");
}

export async function commandMapPrevious(state: State): Promise<void> {
  await commandMap(state, "previous");
}

export async function commandExplore(state: State): Promise<void> {
  console.log("TODO");
}
