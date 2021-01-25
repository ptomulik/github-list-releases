import {
  DataType,
  EnsureData,
  MapDataFunction,
  MapFunction,
} from "../src/types";
//
import {
  expectAssignable,
  expectNotAssignable,
  expectType,
  //  expectNotType
} from "tsd";

//////////////////////////////////////////////////////////////////////////////
// DataType
//////////////////////////////////////////////////////////////////////////////
expectType<DataType<{ data: string }>>("" as string);
expectType<DataType<{ data: number }>>(0 as number);
expectType<DataType<{ data: { n: number }[] }>>([{ n: 0 }, { n: 1 }]);
expectType<unknown>(null as DataType<{ foo: "" }>);
expectType<unknown>(null as DataType<string>);

//////////////////////////////////////////////////////////////////////////////
// EnsureData
//////////////////////////////////////////////////////////////////////////////

expectType<EnsureData<{ data: string[] }>>({ data: [""] });
expectAssignable<EnsureData<{ foo: string }>>({ foo: "", data: [""] });
expectNotAssignable<EnsureData<{ foo: string }>>({ foo: "" });

//////////////////////////////////////////////////////////////////////////////
// MapDataFunction
//////////////////////////////////////////////////////////////////////////////

function mapData1<T, S extends { data: T[] }>(
  response: S,
  done: () => void
): T[] {
  done();
  return response.data;
}

function mapData2<T, S extends { data: T[] }>(response: S): T[] {
  return response.data;
}

function nonMapData1<T, S extends { data: T[] }>(response: S): T {
  return response.data[0];
}

function nonMapData2<T, S extends { data: T }>(response: S): T[] {
  return [response.data];
}

function nonMapData3({ data }: { data: number[] }): number[] {
  return data;
}

expectType<MapDataFunction>(mapData1);
expectAssignable<MapDataFunction>(mapData2);
expectNotAssignable<MapDataFunction>(() => null);
expectNotAssignable<MapDataFunction>(nonMapData1);
expectNotAssignable<MapDataFunction>(nonMapData2);
expectNotAssignable<MapDataFunction>(nonMapData3);

//////////////////////////////////////////////////////////////////////////////
// MapFunction
//////////////////////////////////////////////////////////////////////////////
expectType<MapFunction<number, string>>((t: number, done: () => void) => {
  done();
  return t.toString();
});
expectType<MapFunction<{ data: number }, number>>(
  (t: { data: number }, done: () => void) => {
    done();
    return t.data;
  }
);
expectType<MapFunction<{ data: number }>>(
  (t: { data: number }, done: () => void) => {
    done();
    return t.data;
  }
);

expectAssignable<MapFunction<number, string>>((t: number) => t.toString());

// vim: set ts=2 sw=2 sts=2:
