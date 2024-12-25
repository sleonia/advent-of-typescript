import type { Expect, Equal } from "type-testing";

type CleanArray<
  T extends string[],
  Value extends string,
  Acc extends string[] = [],
> = T extends [infer Head, ...infer Rest]
  ? Head extends string
    ? Rest extends string[]
      ? Head extends Value
        ? CleanArray<Rest, Value, Acc>
        : CleanArray<Rest, Value, [...Acc, Head]>
      : Acc
    : Acc
  : Acc;

type FindUnusedValues<
  Declared extends string[],
  Used extends string[],
  Acc extends string[] = Declared,
> = Used extends [infer Head, ...infer Rest]
  ? Head extends string
    ? Rest extends string[]
      ? CleanArray<Acc, Head>["length"] extends Declared["length"]
        ? FindUnusedValues<Declared, Rest, Declared>
        : FindUnusedValues<Declared, Rest, CleanArray<Acc, Head>>
      : Acc
    : Acc
  : Acc;

type AnalyzeScope<
  T extends string,
  Declared extends string[] = [],
  Used extends string[] = [],
> = T extends `${" " | "\n" | "\t" | "\r"}${infer Rest}`
  ? AnalyzeScope<Rest, Declared, Used>
  : T extends `${string} ${infer VariableName} = "${string}";${infer Tail}`
    ? AnalyzeScope<Tail, [...Declared, VariableName], Used>
    : T extends `${string}(${infer UsedVariable});${infer Tail}`
      ? AnalyzeScope<Tail, Declared, [...Used, UsedVariable]>
      : {
          scope: {
            declared: Declared;
            used: Used;
          };
          unused: FindUnusedValues<Declared, Used>;
        };

type Lint<T extends string> = AnalyzeScope<T>;

// ------------------- Test section ---------------------

type t0_actual = Lint<`
let teddyBear = "standard_model";
`>;
type t0_expected = {
  scope: { declared: ["teddyBear"]; used: [] };
  unused: ["teddyBear"];
};
type t0 = Expect<Equal<t0_actual, t0_expected>>;

type t1_actual = Lint<`
buildToy(teddyBear);
`>;
type t1_expected = {
  scope: { declared: []; used: ["teddyBear"] };
  unused: [];
};
type t1 = Expect<Equal<t1_actual, t1_expected>>;

type t2_actual = Lint<`
let robotDog = "deluxe_model";
assembleToy(robotDog);
`>;
type t2_expected = {
  scope: { declared: ["robotDog"]; used: ["robotDog"] };
  unused: [];
};
type t2 = Expect<Equal<t2_actual, t2_expected>>;

type t3_actual = Lint<`
let robotDog = "standard_model";
  const giftBox = "premium_wrap";
    var ribbon123 = "silk";
  
  \t
  wrapGift(giftBox);
  \r\n
      addRibbon(ribbon123);
`>;
type t3_expected = {
  scope: {
    declared: ["robotDog", "giftBox", "ribbon123"];
    used: ["giftBox", "ribbon123"];
  };
  unused: ["robotDog"];
};
type t3 = Expect<Equal<t3_actual, t3_expected>>;

type t4_actual = Lint<"\n\t\r \t\r ">;
type t4_expected = {
  scope: { declared: []; used: [] };
  unused: [];
};
type t4 = Expect<Equal<t4_actual, t4_expected>>;
