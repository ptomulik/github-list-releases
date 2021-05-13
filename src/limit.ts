import { EnsureData, MapDataFunction, MapFunction } from "./types";

/**
 * Returns a function which limits the maximum number of entries returned by
 * .paginate(). The returned function may be used as an argument to .paginate().
 *
 * Example usage:
 *
 * ```
 * octokit.paginate(..., limit(1))
 * octokit.paginate(..., limit(1, ({ data }) => data))
 * ```
 *
 * Do NOT reuse the function returned by limit(n). This is WRONG:
 *
 * ```
 * const first = limit(1);
 *
 * octokit.paginate(..., first);
 * octokit.paginate(..., first); // !!this will not work as one would expect!!
 * ```
 */
export function limit<T, M>(
  max: number,
  mapFn: MapFunction<T, M>
): MapFunction<EnsureData<T>, M>;
export function limit(max: number): MapDataFunction;
export function limit<T, M>(
  max: number,
  mapFn?: MapFunction<T, M>
): MapDataFunction | MapFunction<EnsureData<T>, M> {
  let remain = max > 0 ? max : Number.MAX_SAFE_INTEGER;

  function apply<D>(data: D[], done: () => void): D[] {
    remain -= data.length;
    if (remain <= 0) {
      if (remain < 0) {
        data = data.slice(0, remain);
      }
      done();
    }
    return data;
  }

  if (mapFn) {
    return (response: EnsureData<T>, done: () => void): M => {
      const { data, ...rest } = response;
      return mapFn({ data: apply(data, done), ...rest } as EnsureData<T>, done);
    };
  } else {
    return <D, S extends { data: D[] }>(response: S, done: () => void): D[] =>
      apply(response.data, done);
  }
}

// vim: set ts=2 sw=2 sts=2:
