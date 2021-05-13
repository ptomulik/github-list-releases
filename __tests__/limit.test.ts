import { limit } from "../src/limit";
import { repr } from "./util";
import { MapFunction } from "../src/types";

describe("limit", () => {
  function wrap<T>(data: T[]) {
    return { data };
  }

  function done() {
    // empty
  }

  function paginate<T, R = T>(
    responses: { data: T[] }[],
    mapFn: MapFunction<{ data: T[] }, R[]>
  ) {
    const collection = [];
    let finished = false;
    function done() {
      finished = true;
    }
    for (const response of responses) {
      if (finished) {
        break;
      }
      collection.push(mapFn(response, done));
    }
    return collection;
  }

  describe.each([
    [1, wrap([1]), [1], 1],
    [1, wrap([1, 2]), [1], 1],
    [2, wrap([1]), [1], 0],
    [2, wrap([1, 2]), [1, 2], 1],
    [2, wrap([1, 2, 3]), [1, 2], 1],
    [0, wrap([1]), [1], 0],
    [0, wrap([1, 2]), [1, 2], 0],
    [0, wrap([1, 2, 3]), [1, 2, 3], 0],
    [-1, wrap([1]), [1], 0],
    [-1, wrap([1, 2]), [1, 2], 0],
    [-1, wrap([1, 2, 3]), [1, 2, 3], 0],
  ])("limit(%j)(%j, done)", (max, arg, result, calls) => {
    it(`returns ${repr(result)}`, () => {
      expect.assertions(1);
      expect(limit(max)(arg, done)).toStrictEqual(result);
    });
    it(`calls done() ${calls} times`, () => {
      expect.assertions(1);
      const done = jest.fn();
      limit(max)(arg, done);
      expect(done).toHaveBeenCalledTimes(calls);
    });
  });

  describe.each([
    [1, wrap([1]), wrap([1]), [2]],
    [1, wrap([1, 2]), wrap([1]), [2]],
    [2, wrap([1]), wrap([1]), [2]],
    [2, wrap([1, 2]), wrap([1, 2]), [2, 3]],
    [2, wrap([1, 2, 3]), wrap([1, 2]), [2, 3]],
    [0, wrap([1]), wrap([1]), [2]],
    [0, wrap([1, 2]), wrap([1, 2]), [2, 3]],
    [0, wrap([1, 2, 3]), wrap([1, 2, 3]), [2, 3, 4]],
    [-1, wrap([1]), wrap([1]), [2]],
    [-1, wrap([1, 2]), wrap([1, 2]), [2, 3]],
    [-1, wrap([1, 2, 3]), wrap([1, 2, 3]), [2, 3, 4]],
  ])("limit(%j, inc)(%j, done)", (max, arg, mapArg, result) => {
    const inc = ({ data }: { data: number[] }) =>
      data.map((x: number) => x + 1);
    it(`returns ${repr(result)}`, () => {
      expect.assertions(1);
      expect(limit(max, inc)(arg, done)).toStrictEqual(result);
    });

    it(`calls inc(${repr(mapArg)}, done)`, () => {
      expect.assertions(1);
      const fn = jest.fn().mockImplementation(inc);
      limit(max, fn)(arg, done);
      expect(fn).toHaveBeenCalledWith(mapArg, done);
    });
  });

  describe.each([
    [[wrap([1])], 1, [[1]]],
    [[wrap([1, 2])], 1, [[1]]],
    [[wrap([1])], 2, [[1]]],
    [[wrap([1, 2])], 2, [[1, 2]]],
    [[wrap([1, 2, 3])], 2, [[1, 2]]],
    [[wrap([1, 2]), wrap([3])], 2, [[1, 2]]],
    [[wrap([1, 2]), wrap([3, 4])], 3, [[1, 2], [3]]],
    [
      [wrap([1, 2]), wrap([3, 4])],
      0,
      [
        [1, 2],
        [3, 4],
      ],
    ],
    [
      [wrap([1, 2]), wrap([3, 4])],
      -1,
      [
        [1, 2],
        [3, 4],
      ],
    ],
  ])("paginate(%j, limit(%j))", (responses, max, result) => {
    it(`returns ${repr(result)}`, () => {
      expect.assertions(1);
      expect(paginate(responses, limit(max))).toStrictEqual(result);
    });
  });
});

// vim: set ts=2 sw=2 sts=2:
