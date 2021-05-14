import { limit, adjust, VERSION } from "../src";

describe("smoke test", () => {
  describe("limit(0)({data: [0]}, () => undefined)", () => {
    it("returns [0]", () => {
      expect.assertions(1);
      expect(limit(0)({ data: [0] }, () => undefined)).toStrictEqual([0]);
    });
  });

  describe("limit(0, ({data}) => data)({data: [0]}, () => undefiend)", () => {
    it("returns [0]", () => {
      expect.assertions(1);
      expect(
        limit(0, ({ data }) => data)({ data: [0] }, () => undefined)
      ).toStrictEqual([0]);
    });
  });

  describe("adjust(0, {})", () => {
    it("returns { per_page: 0 }", () => {
      expect.assertions(1);
      expect(adjust(0, {})).toStrictEqual({ per_page: 0 });
    });
  });

  describe("adjust(101, {})", () => {
    it("returns { }", () => {
      expect.assertions(1);
      expect(adjust(101, {})).toStrictEqual({});
    });
  });

  describe("version", () => {
    it("the VERSION is '0.0.0-development'", () => {
      expect.assertions(1);
      expect(VERSION).toStrictEqual("0.0.0-development");
    });
  });
});

// vim: set ts=2 sw=2 sts=2:
