export type DataType<T> = "data" extends keyof T ? T["data"] : unknown;

export type EnsureData<T> = T extends { data: unknown[] }
  ? T
  : T & { data: unknown[] };

export interface MapDataFunction {
  <D, S extends { data: D[] }>(response: S, done: () => void): D[];
}

export interface MapFunction<T, M = DataType<T>> {
  (response: T, done: () => void): M;
}

// vim: set ts=2 sw=2 sts=2:
