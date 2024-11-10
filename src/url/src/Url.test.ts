import { describe, expect, it } from "bun:test";
import { Url } from "..";

describe("Url", () => {
  describe("#constructor", () => {
    it("should correctly parse a URL", () => {
      const url = new Url(
        "http://sub.example.com:8080/path?param1=value1#fragment1",
      );
      expect(url.raw).toEqual(
        "http://sub.example.com:8080/path?param1=value1#fragment1",
      );
      expect(url.protocol).toEqual("http");
      expect(url.subdomain).toEqual("sub");
      expect(url.domain).toEqual("example.com");
      expect(url.port).toEqual(8080);
      expect(url.path).toEqual("/path");
      expect(url.queries.get("param1")).toEqual("value1");
      expect(url.fragment).toEqual("fragment1");
      expect(url.base).toEqual("http://sub.example.com:8080");
      expect(url.origin).toEqual("http://sub.example.com:8080");
    });
  });
});
