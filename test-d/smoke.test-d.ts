import { MapFunction, limit, adjust } from "../src";
import { expectAssignable, expectType } from "tsd";

expectAssignable<MapFunction<{ data: unknown[] }>>(limit(0));
expectType<MapFunction<{ data: number[] }>>(
  limit(0, ({ data }: { data: number[] }) => data)
);

expectType<{ per_page?: number } & { foo: string }>(adjust(1, { foo: "" }));

// vim: set ts=2 sw=2 sts=2:
