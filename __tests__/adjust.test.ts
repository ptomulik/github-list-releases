import { adjust } from "../src/adjust";
import { repr } from "./util";

describe("adjust", () => {
  describe.each([
    [1, {}, { per_page: 1 }],
    [1, { per_page: 101 }, { per_page: 1 }],
    [102, {}, {}],
    [102, { per_page: 101 }, { per_page: 101 }],
    [101, { per_page: 102 }, { per_page: 102 }],
    [2, { per_page: 1 }, { per_page: 1 }],
    [1, { per_page: 2 }, { per_page: 1 }],

    [1, { foo: "" }, { foo: "", per_page: 1 }],
    [1, { foo: "", per_page: 101 }, { foo: "", per_page: 1 }],
    [102, { foo: "" }, { foo: "" }],
    [102, { foo: "", per_page: 101 }, { foo: "", per_page: 101 }],
    [101, { foo: "", per_page: 102 }, { foo: "", per_page: 102 }],
    [2, { foo: "", per_page: 1 }, { foo: "", per_page: 1 }],
    [1, { foo: "", per_page: 2 }, { foo: "", per_page: 1 }],
  ])("adjust(%j, %j)", (max, parameters, result) => {
    it(`returns ${repr(result)}`, () => {
      expect.assertions(1);
      expect(adjust(max, parameters)).toStrictEqual(result);
    });
  });
});

// vim: set ts=2 sw=2 sts=2:
