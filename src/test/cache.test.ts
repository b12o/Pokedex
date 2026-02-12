import { Cache } from "../pokecache.js";
import { sleep } from "../utils.js";
import { test, expect } from "vitest";

const testCases = [
  {
    key: "https://example.com",
    val: "testdata",
    interval: 500, // 500ms
  },
  {
    key: "https://example.com/anotherpath",
    val: 1234,
    interval: 1000,
  },
];

test.concurrent.each(testCases)(
  "Test caching $interval ms",
  async ({ key, val, interval }) => {
    const cache = new Cache(interval);
    cache.add(key, val);
    const cached = cache.get(key);
    expect(cached).toBe(val);

    await sleep(interval + 50);

    const reaped = cache.get(key);
    expect(reaped).toBe(undefined);

    cache.stopReapLoop();
  },
);
