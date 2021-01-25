import { MapDataFunction, MapFunction } from "../src/types";
import { expectError, expectType } from "tsd";
import { limit } from "../src/limit";

/////////////////////////////////////////////////////////////////////////////
// Helpers
/////////////////////////////////////////////////////////////////////////////
const getUnk1 = ({ data }: { data: unknown[] }) => data;
const getNum1 = ({ data }: { data: number[] }) => data;
const getNum2 = ({ data }: { data: number[]; foo: string }) => data;
const getNum3 = <S extends { data: number[] }>({ data }: S) => data;
const getNum4 = <S extends { data: number[] }>(
  { data }: S,
  done: () => void
) => {
  done();
  return data;
};
const getStr1 = ({ data }: { data: number[] }) => data.map((n) => n.toString());
const getLen1 = ({ data }: { data: unknown[] }) => data.length;
const done = () => {
  /* empty */
};

/////////////////////////////////////////////////////////////////////////////
// Tests: limit()
/////////////////////////////////////////////////////////////////////////////

// Function returned by limit()
expectType<MapDataFunction>(limit(1));
expectType<MapFunction<{ data: unknown[] }, number>>(limit(1, () => 0));
expectType<MapFunction<{ data: unknown[] } & { foo: string }, string>>(
  limit(1, ({ foo }: { foo: string }) => foo)
);
expectType<MapFunction<{ data: unknown[] }, unknown[]>>(limit(1, getUnk1));
expectType<MapFunction<{ data: number[] }, number[]>>(limit(1, getNum1));
expectType<MapFunction<{ data: number[]; foo: string }, number[]>>(
  limit(1, getNum2)
);
expectType<MapFunction<{ data: number[] }, number[]>>(limit(1, getNum3));
expectType<MapFunction<{ data: number[] }, number[]>>(limit(1, getNum4));
expectType<MapFunction<{ data: number[] }, string[]>>(limit(1, getStr1));
expectType<MapFunction<{ data: unknown[] }, number>>(limit(1, getLen1));

// Invoking function returned by limit()
expectType<number[]>(limit(1)({ data: [0] }, done));
expectType<number[]>(limit(1)({ data: [0], foo: "" }, done));
expectType<number>(limit(1, () => 0)({ data: [0] }, done));
expectType<string>(
  limit(1, ({ foo }: { foo: string }) => foo)({ data: [0], foo: "" }, done)
);
expectType<number[]>(limit(1, getNum1)({ data: [0] }, done));
expectType<number[]>(limit(1, getNum2)({ data: [0], foo: "" }, done));
expectType<number[]>(limit(1, getNum3)({ data: [0], bar: "" }, done));
expectType<number[]>(limit(1, getNum4)({ data: [0], bar: "" }, done));
expectType<string[]>(limit(1, getStr1)({ data: [0] }, done));
expectType<number>(limit(1, getLen1)({ data: [0] }, done));

// Errors
expectError(limit()); // Missing argument.
expectError(limit("")); // Wrong argument type.

// Wrong invocations of function returned by limit(max).
expectError(limit(1)()); // Missing both arguments.
expectError(limit(1)(null)); // Wrong first & missing second argument.
expectError(limit(1)(null, null)); // Wrong types of both arguments.
expectError(limit(1)({ data: [0] })); // Missing second argument.
expectError(limit(1)({ data: [0] }, null)); // Wrong second argument.
expectError(limit(1)({ foo: "" }, done)); // Missing `data` in `{ foo: "" }`.
expectError(limit(1)({ data: null }, done)); // Wrong type of `data`.

// Wrong invocations of function returned by limit(max, mapFn)
expectError(limit(1, () => 0)({}, done)); // Missing `data` property
expectError(limit(1, ({ foo }: { foo: string }) => foo)({ foo: "" }, done)); // Missing `data` property.
expectError(limit(1, ({ foo }: { foo: string }) => foo)({ data: [0] }, done)); // Missing `foo` property.
expectError(limit(1, getNum1)()); // Missing both arguments.
expectError(limit(1, getNum1)({ data: [0] })); // Missing second argument.
expectError(limit(1, getNum1)({ data: [""] }, done)); // String instead number.
expectError(limit(1, getNum1)({ data: [0] }, (s: string) => s)); // Incompatible function `done`.
expectError(limit(1, getNum1)({ data: [0], foo: "" }, done)); // Unknown property "foo".

// vim: set ts=2 sw=2 sts=2:
