import NextAuth from "next-auth";
import { GET, POST } from "./route";
import { authOptions } from "../authOptions";

jest.mock("next-auth", () => jest.fn(() => ({
  GET: jest.fn(),
  POST: jest.fn(),
})));

describe("Auth API route", () => {
  it("wires NextAuth with shared authOptions", () => {
    expect(NextAuth).toHaveBeenCalledWith(authOptions);
    expect(GET).toBeDefined();
    expect(POST).toBeDefined();
  });
});
