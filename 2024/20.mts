import type { Expect, Equal } from "type-testing";

type AnalyzeScope<
  T extends string,
  Declated extends string[] = [],
  Used extends string[] = [],
> = T extends `${" " | "\n" | "\t" | "\r"}${infer Rest}`
  ? AnalyzeScope<Rest, Declated, Used>
  : T extends `${string} ${infer VariableName} = "${string}";${infer Tail}`
    ? AnalyzeScope<Tail, [...Declated, VariableName], Used>
    : T extends `${string}(${infer UsedVariable});${infer Tail}`
      ? AnalyzeScope<Tail, Declated, [...Used, UsedVariable]>
      : {
          declared: Declated;
          used: Used;
        };

// ------------------- Test section ---------------------

type t0_actual = AnalyzeScope<`
let teddyBear = "standard_model";
`>;
type t0_expected = {
  declared: ["teddyBear"];
  used: [];
};
type t0 = Expect<Equal<t0_actual, t0_expected>>;

type t1_actual = AnalyzeScope<`
buildToy(teddyBear);
`>;
type t1_expected = {
  declared: [];
  used: ["teddyBear"];
};
type t1 = Expect<Equal<t1_actual, t1_expected>>;

type t2_actual = AnalyzeScope<`
let robotDog = "deluxe_model";
assembleToy(robotDog);
`>;
type t2_expected = {
  declared: ["robotDog"];
  used: ["robotDog"];
};
type t2 = Expect<Equal<t2_actual, t2_expected>>;

type t3_actual = AnalyzeScope<`
  let robotDog = "standard_model";
  const giftBox = "premium_wrap";
    var ribbon123 = "silk";
  
  \t
  wrapGift(giftBox);
  \r\n
      addRibbon(ribbon123);
`>;
type t3_expected = {
  declared: ["robotDog", "giftBox", "ribbon123"];
  used: ["giftBox", "ribbon123"];
};
type t3 = Expect<Equal<t3_actual, t3_expected>>;

type t4_input = "\n\t\r \t\r ";
type t4_actual = AnalyzeScope<t4_input>;
type t4_expected = {
  declared: [];
  used: [];
};
type t4 = Expect<Equal<t4_actual, t4_expected>>;
