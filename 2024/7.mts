import type { Expect, Equal } from "type-testing";

type RouteHelper<T> = { [P in keyof T]: T[P] };

const createRoute = <Route extends string[]>(
  author: string,
  route: RouteHelper<Route>,
) => ({
  author,
  route,
  createdAt: Date.now(),
});

// ------------------- Test section ---------------------

const oneMill = createRoute("💨Dasher", [
  "Atherton",
  "Scarsdale",
  "Cherry Hills Village",
]).route;
type t0_actual = typeof oneMill; // =>
type t0_expected = [
  // =>
  "Atherton",
  "Scarsdale",
  "Cherry Hills Village",
];
type t0 = Expect<Equal<t0_actual, t0_expected>>;

const two = createRoute("🌟Vixen", ["Detroit", "Cleveland", "Dayton"]).route;
type t1_actual = typeof two; // =>
type t1_expected = [
  // =>
  "Detroit",
  "Cleveland",
  "Dayton",
];
type t1 = Expect<Equal<t1_actual, t1_expected>>;
