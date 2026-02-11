const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

type Level = keyof typeof levels;

const currentLevel: Level = (process.env.LOG_LEVEL as Level) || "info";

export const logger = {
  debug: (msg: string) =>
    levels[currentLevel] <= levels.debug && console.log(`[DEBUG] ${msg}`),
  info: (msg: string) =>
    levels[currentLevel] <= levels.info && console.log(`[INFO] ${msg}`),
  warn: (msg: string) =>
    levels[currentLevel] <= levels.warn && console.log(`[WARN] ${msg}`),
  error: (msg: string) =>
    levels[currentLevel] <= levels.error && console.log(`[ERROR] ${msg}`),
};
