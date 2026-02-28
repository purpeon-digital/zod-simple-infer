import type { z } from "zod";

export type Infer<T extends z.ZodType> = {
  [K in keyof z.infer<T>]: z.infer<T>[K];
} & {};
