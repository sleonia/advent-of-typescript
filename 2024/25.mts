import { Expect, Equal } from "type-testing";

type ThankYouSoMuch = true;

// ------------------- Test section ---------------------

type t0 = Expect<Equal<ThankYouSoMuch, true>>;
