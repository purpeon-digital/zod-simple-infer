# zod-simple-infer

A zero-runtime utility type that simplifies [Zod](https://zod.dev)'s inferred types by expanding them inline — making tooltips, diffs, and type errors actually readable.

## The Problem

When you use `z.infer<typeof schema>`, TypeScript preserves Zod's internal type structure. Hovering over the type in your editor shows something like:

```ts
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().optional(),
});

type User = z.infer<typeof UserSchema>;
//   ^? { name: string; age: number; email?: string | undefined; }
//   ...but often shows as a deeply nested intersection of mapped types
```

This gets much worse with larger schemas — what you see in your editor is a wall of `Pick<...> & Omit<...>` or other internal Zod types, not the simple object you defined.

## The Solution

`Infer` flattens the type into a clean, readable shape:

```ts
import type { Infer } from "zod-simple-infer";

type User = Infer<typeof UserSchema>;
//   ^? { name: string; age: number; email?: string | undefined }
```

Same type. Same assignability. Just readable.

## Installation

```bash
npm install zod-simple-infer
```

```bash
yarn add zod-simple-infer
```

```bash
pnpm add zod-simple-infer
```

```bash
bun add zod-simple-infer
```

> **Peer dependency:** `zod >= 3`

## Usage

Replace `z.infer` with `Infer` anywhere you want cleaner type output:

```ts
import { z } from "zod";
import type { Infer } from "zod-simple-infer";

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  tags: z.array(z.string()),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string().optional(),
  }),
});

type Product = Infer<typeof ProductSchema>;
// {
//   id: string;
//   name: string;
//   price: number;
//   tags: string[];
//   metadata: {
//     createdAt: string;
//     updatedAt?: string | undefined;
//   };
// }
```

It works with all Zod types — objects, arrays, unions, enums, literals, tuples, records, optionals, nullables, defaults, and more.

### Works with any Zod schema

```ts
// Enums
const RoleSchema = z.enum(["admin", "user", "guest"]);
type Role = Infer<typeof RoleSchema>; // "admin" | "user" | "guest"

// Records
const ScoresSchema = z.record(z.string(), z.number());
type Scores = Infer<typeof ScoresSchema>; // Record<string, number>

// Tuples
const PairSchema = z.tuple([z.string(), z.number()]);
type Pair = Infer<typeof PairSchema>; // [string, number]

// Unions
const IdSchema = z.union([z.string(), z.number()]);
type Id = Infer<typeof IdSchema>; // string | number
```

### Full type compatibility

`Infer<T>` is fully assignable to and from `z.infer<T>` — it's the same type, just displayed differently:

```ts
type A = Infer<typeof MySchema>;
type B = z.infer<typeof MySchema>;

// A is assignable to B, and B is assignable to A
```

## How It Works

The entire implementation is a single mapped type:

```ts
import type { z } from "zod";

export type Infer<T extends z.ZodType> = {
  [K in keyof z.infer<T>]: z.infer<T>[K];
} & {};
```

The `{ [K in keyof T]: T[K] } & {}` pattern is a well-known TypeScript trick that forces the compiler to eagerly evaluate and flatten a type, expanding intersections and mapped types into a single object type. The trailing `& {}` ensures TypeScript doesn't collapse it back.

This package ships **only a type declaration** (`index.d.ts`) — zero runtime code, zero bundle impact.

## Development

### Prerequisites

- Node.js >= 18
- npm (or yarn/pnpm)

### Setup

```bash
git clone https://github.com/purpeon-digital/zod-simple-infer.git
cd zod-simple-infer
npm install
```

### Running Tests

The test suite uses [Vitest](https://vitest.dev) with `--typecheck` mode to validate type-level behavior:

```bash
npm test
```

This runs compile-time type assertions defined in `index.test-d.ts` — no runtime tests needed since the package is types-only.

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Clone** your fork and install dependencies:
   ```bash
   git clone https://github.com/<your-username>/zod-simple-infer.git
   cd zod-simple-infer
   npm install
   ```
3. **Create a branch** for your change:
   ```bash
   git checkout -b my-change
   ```
4. **Make your changes** — if adding new type support, add corresponding test cases in `index.test-d.ts`
5. **Run the tests** to make sure everything passes:
   ```bash
   npm test
   ```
6. **Commit** and **push** your branch, then open a **Pull Request**

### Project Structure

```
zod-simple-infer/
  index.d.ts          # The entire library — one exported type
  index.test-d.ts     # Type-level test suite (Vitest typecheck)
  tsconfig.json       # TypeScript configuration
  package.json        # Package manifest
```

### Guidelines

- Keep it simple — this package does one thing well
- All changes should include type tests
- Ensure `npm test` passes before submitting a PR

## License

[MIT](LICENSE) &copy; [Purpeon Digital AS](https://github.com/purpeon-digital)
