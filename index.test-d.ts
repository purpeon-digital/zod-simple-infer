import { describe, expectTypeOf, test } from "vitest";
import { z } from "zod";
import type { Infer } from "./index";

describe("Infer", () => {
  test("infers a simple object schema", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    type Result = Infer<typeof schema>;

    expectTypeOf<Result>().toEqualTypeOf<{ name: string; age: number }>();
  });

  test("infers optional fields", () => {
    const schema = z.object({
      name: z.string(),
      nickname: z.string().optional(),
    });

    type Result = Infer<typeof schema>;

    expectTypeOf<Result>().toEqualTypeOf<{
      name: string;
      nickname?: string | undefined;
    }>();
  });

  test("infers nullable fields", () => {
    const schema = z.object({
      value: z.string().nullable(),
    });

    type Result = Infer<typeof schema>;

    expectTypeOf<Result>().toEqualTypeOf<{ value: string | null }>();
  });

  test("infers nested objects", () => {
    const schema = z.object({
      user: z.object({
        name: z.string(),
        address: z.object({
          city: z.string(),
        }),
      }),
    });

    type Result = Infer<typeof schema>;

    expectTypeOf<Result>().toEqualTypeOf<{
      user: { name: string; address: { city: string } };
    }>();
  });

  test("infers arrays", () => {
    const schema = z.object({
      tags: z.array(z.string()),
      scores: z.array(z.number()),
    });

    type Result = Infer<typeof schema>;

    expectTypeOf<Result>().toEqualTypeOf<{
      tags: string[];
      scores: number[];
    }>();
  });

  test("infers enums", () => {
    const schema = z.object({
      role: z.enum(["admin", "user", "guest"]),
    });

    type Result = Infer<typeof schema>;

    expectTypeOf<Result>().toEqualTypeOf<{
      role: "admin" | "user" | "guest";
    }>();
  });

  test("infers unions", () => {
    const schema = z.object({
      id: z.union([z.string(), z.number()]),
    });

    type Result = Infer<typeof schema>;

    expectTypeOf<Result>().toEqualTypeOf<{ id: string | number }>();
  });

  test("infers literal types", () => {
    const schema = z.object({
      type: z.literal("success"),
      code: z.literal(200),
    });

    type Result = Infer<typeof schema>;

    expectTypeOf<Result>().toEqualTypeOf<{
      type: "success";
      code: 200;
    }>();
  });

  test("infers default values (type becomes non-optional)", () => {
    const schema = z.object({
      count: z.number().default(0),
    });

    type Result = Infer<typeof schema>;

    expectTypeOf<Result>().toEqualTypeOf<{ count: number }>();
  });

  test("infers tuple types", () => {
    const schema = z.object({
      pair: z.tuple([z.string(), z.number()]),
    });

    type Result = Infer<typeof schema>;

    expectTypeOf<Result>().toEqualTypeOf<{ pair: [string, number] }>();
  });

  test("infers record types", () => {
    const schema = z.record(z.string(), z.number());

    type Result = Infer<typeof schema>;

    expectTypeOf<Result>().toEqualTypeOf<Record<string, number>>();
  });

  test("result is assignable to z.infer", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    type Result = Infer<typeof schema>;
    type ZInferred = z.infer<typeof schema>;

    expectTypeOf<Result>().toMatchTypeOf<ZInferred>();
    expectTypeOf<ZInferred>().toMatchTypeOf<Result>();
  });

  test("works with empty object", () => {
    const schema = z.object({});

    type Result = Infer<typeof schema>;
    type Expected = Record<string, never>;

    expectTypeOf<Result>().toEqualTypeOf<Expected>();
  });

  test("infers individual union members with Infer", () => {
    const memberA = z.object({ type: z.literal("a"), value: z.string() });
    const memberB = z.object({ type: z.literal("b"), count: z.number() });

    type ResultA = Infer<typeof memberA>;
    type ResultB = Infer<typeof memberB>;

    expectTypeOf<ResultA>().toEqualTypeOf<{ type: "a"; value: string }>();
    expectTypeOf<ResultB>().toEqualTypeOf<{ type: "b"; count: number }>();
  });
});
