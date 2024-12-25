import type { Expect, Equal } from "type-testing";

type Mapper<Keys extends Record<string, string>> = keyof {
  [K in keyof Keys as K extends "karaoke" | "margarita"
    ? never
    : `${K & string}: ${Keys[K]}`]: "";
};

interface Helper<T extends Record<string, string>> {
  new (obj: T): Mapper<T>;
}

type Excuse<T extends Record<string, string>> = Helper<T>;

// ------------------- Test section ---------------------

const existingExcuses = {
  karaoke: ["Kendrick Lamar, Opeth"],
  margarita: "Peppermint-Jalapeño Mojito",
};

const helpingTheReindeer = {
  helping: "the reindeer",
} as const;
declare const Excuse0: Excuse<typeof helpingTheReindeer>;
const excuse0 = new Excuse0({
  ...existingExcuses,
  ...helpingTheReindeer,
});
type t0_actual = typeof excuse0; // =>
type t0_expected = "helping: the reindeer"; // =>
type t0 = Expect<Equal<t0_actual, t0_expected>>;

const eatingFudge = {
  eating: "fudge",
} as const;
declare const Excuse1: Excuse<typeof eatingFudge>;
const excuse1 = new Excuse1({
  ...existingExcuses,
  ...eatingFudge,
});
type t1_actual = typeof excuse1; // =>
type t1_expected = "eating: fudge"; // =>
type t1 = Expect<Equal<t1_actual, t1_expected>>;
