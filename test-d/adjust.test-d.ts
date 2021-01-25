import { expectAssignable, expectError, expectType } from "tsd";
import { adjust } from "../src/adjust";

interface Foo {
  foo: string;
}

interface FooBar extends Foo {
  bar: number;
}

interface Gez {
  gez: boolean;
  [key: string]: unknown;
}

interface GezQux extends Gez {
  qux: number;
}

function adjustUnknown<P>(arg: P) {
  return adjust(1, arg);
}

function adjustFoo(arg: Foo) {
  return adjust(1, arg);
}

function adjustFooEx<FooEx extends Foo>(arg: FooEx) {
  return adjust(1, arg);
}

function adjustGez(arg: Gez) {
  return adjust(1, arg);
}

function adjustGezEx<GezEx extends Gez>(arg: GezEx) {
  return adjust(1, arg);
}

function acceptFoo(arg: Foo) {
  return arg;
}

function acceptFooEx<FooEx extends Foo>(arg: FooEx) {
  return arg;
}

function acceptGez(arg: Gez) {
  return arg;
}

function acceptGezEx<GezEx extends Gez>(arg: GezEx) {
  return arg;
}

expectType<{ per_page?: number }>(adjust(1, {}));
expectType<{ per_page?: number } & { foo: string[] }>(adjust(1, { foo: [""] }));
expectType<{ per_page?: number } & FooBar>(adjust(1, { foo: "", bar: 0 }));
expectType<"" & { per_page?: number }>(adjust(1, ""));

expectType<"" & { per_page?: number }>(adjustUnknown(""));
expectType<Foo & { per_page?: number }>(adjustFoo({ foo: "" }));
expectType<FooBar & { per_page?: number }>(adjustFooEx({ foo: "", bar: 0 }));
expectType<Gez & { per_page?: number }>(adjustGez({ gez: true }));
expectType<Gez & { per_page?: number }>(adjustGez({ gez: true, other: null }));
expectType<{ gez: true; qux: 0 } & { per_page?: number }>(
  adjustGezEx({ gez: true, qux: 0 })
);
expectAssignable<GezQux & { per_page?: number }>(
  adjustGezEx({ gez: true, qux: 0 })
);
expectType<{ gez: true; qux: 0; other: string } & { per_page?: number }>(
  adjustGezEx({ gez: true, qux: 0, other: "" })
);

expectType<Foo>(acceptFoo(adjust(0, { foo: "" })));
expectType<FooBar & { per_page?: number }>(
  acceptFooEx(adjust(0, { foo: "", bar: 0 }))
);
expectType<Gez>(acceptGez(adjust(0, { gez: true })));
expectType<Gez>(acceptGez(adjust(0, { gez: true, other: null })));
expectType<{ gez: true } & { per_page?: number }>(
  acceptGezEx(adjust(0, { gez: true }))
);
expectType<{ gez: true; other: string } & { per_page?: number }>(
  acceptGezEx(adjust(0, { gez: true, other: "" }))
);

expectError(adjust({}));
expectError(adjust(null, {}));
expectError(adjust("", {}));

// vim: set ts=2 sw=2 sts=2:
