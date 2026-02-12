import { cleanInput } from "../repl.js";
import { describe, expect, test } from "vitest";

const testCases = [
  {
    input: "",
    expected: [],
  },
  {
    input: "   ",
    expected: [],
  },
  {
    input: "hi",
    expected: ["hi"],
  },
  {
    input: "  hello  world  ",
    expected: ["hello", "world"],
  },
  {
    input: "the quick  BROWN fox  Jumped  over  ",
    expected: ["the", "quick", "brown", "fox", "jumped", "over"],
  },
];

describe.each(testCases)("cleanInput($input)", ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    const actual = cleanInput(input);
    expect(actual).toHaveLength(expected.length);
    for (const i in expected) {
      expect(actual[i]).toBe(expected[i]);
    }
  });
});
