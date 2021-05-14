import { VERSION } from "../src/version";

describe("version", () => {
  it("the VERSION is '0.0.0-development'", () => {
    expect.assertions(1);
    expect(VERSION).toStrictEqual("0.0.0-development");
  });
});

// vim: set ts=2 sw=2 sts=2:
