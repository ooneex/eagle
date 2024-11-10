import { describe, expect, it } from "bun:test";
import { STATUS_CODE, type StatusCodeKeyType, getStatusCode } from "..";

describe("getStatusCode function tests", () => {
  it("should return the correct status code", () => {
    const keys = Object.keys(STATUS_CODE) as Array<StatusCodeKeyType>;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    const expectedValue = STATUS_CODE[randomKey];
    const actualValue = getStatusCode(randomKey);
    expect(actualValue).toEqual(expectedValue);
  });

  it("should return undefined for an unrecognized key", () => {
    const nonExistentKey = "non_existent_key" as StatusCodeKeyType;
    const actualValue = getStatusCode(nonExistentKey);
    expect(actualValue).toBeUndefined();
  });
});
