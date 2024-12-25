import type { Expect, Equal } from "type-testing";

type RemoveWhiteSpaces<
  T extends string,
  Acc extends string = "",
> = T extends `${infer First}${infer Rest}`
  ? First extends " " | "\n" | "\t" | "\r"
    ? RemoveWhiteSpaces<Rest, Acc>
    : RemoveWhiteSpaces<Rest, `${Acc}${First}`>
  : Acc;

type SplitStrings<
  T extends string,
  Acc extends string[] = [],
  Line extends string = "",
> = T extends `${infer First};${infer Rest}`
  ? SplitStrings<Rest, [...Acc, Trim<First>], Trim<Rest>>
  : [...Acc, Trim<Line>];

type Trim<T extends string> =
  T extends `${" " | "\n" | "\t" | "\r"}${infer Rest}`
    ? Trim<Rest>
    : T extends `${infer Rest}${" " | "\n" | "\t" | "\r"}`
      ? Trim<Rest>
      : T;

type IsVariable<T extends string> =
  T extends `${infer Var} ${infer VarName} = ${infer Value}`
    ? {
        id: RemoveWhiteSpaces<VarName>;
        type: "VariableDeclaration";
      }
    : never;

type IsFunction<T extends string> = T extends `${infer FnName}(${infer Arg})`
  ? {
      argument: RemoveWhiteSpaces<Arg>;
      type: "CallExpression";
    }
  : never;

type ProcessEach<T extends string[], Acc extends any[] = []> = T extends [
  infer First,
  ...infer Rest,
]
  ? First extends string
    ? Rest extends string[]
      ? ProcessEach<
          Rest,
          IsVariable<First> extends never
            ? IsFunction<First> extends never
              ? Acc
              : [...Acc, IsFunction<First>]
            : [...Acc, IsVariable<First>]
        >
      : never
    : never
  : Acc;

type Parse<T extends string> = ProcessEach<SplitStrings<T>>;

// ------------------- Test section ---------------------

type t0_actual = Parse<`
let teddyBear = "standard_model";
`>;
type t0_expected = [
  {
    id: "teddyBear";
    type: "VariableDeclaration";
  },
];
type t0 = Expect<Equal<t0_actual, t0_expected>>;

type t1_actual = Parse<`
buildToy(teddyBear);
`>;
type t1_expected = [
  {
    argument: "teddyBear";
    type: "CallExpression";
  },
];
type t1 = Expect<Equal<t1_actual, t1_expected>>;

type t2_actual = Parse<`
let robotDog = "deluxe_model";
assembleToy(robotDog);
`>;
type t2_expected = [
  {
    id: "robotDog";
    type: "VariableDeclaration";
  },
  {
    argument: "robotDog";
    type: "CallExpression";
  },
];
type t2 = Expect<Equal<t2_actual, t2_expected>>;

type t3_actual = Parse<`
  const giftBox = "premium_wrap";
    var ribbon123 = "silk";
  
  \t
  wrapGift(giftBox);
  \r\n
      addRibbon(ribbon123);
`>;
type t3_expected = [
  {
    id: "giftBox";
    type: "VariableDeclaration";
  },
  {
    id: "ribbon123";
    type: "VariableDeclaration";
  },
  {
    argument: "giftBox";
    type: "CallExpression";
  },
  {
    argument: "ribbon123";
    type: "CallExpression";
  },
];
type t3 = Expect<Equal<t3_actual, t3_expected>>;

type t4_input = "\n\t\r \t\r ";
type t4_actual = Parse<t4_input>;
type t4_expected = [];
type t4 = Expect<Equal<t4_actual, t4_expected>>;
