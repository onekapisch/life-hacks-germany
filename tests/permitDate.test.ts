import assert from "node:assert/strict";
import test from "node:test";
import { subtractMonthsClamped } from "../lib/permitDate";

test("subtractMonthsClamped keeps month-end in non-leap year", () => {
  const input = new Date("2026-03-31T12:00:00Z");
  const output = subtractMonthsClamped(input, 1);
  assert.equal(output.toISOString(), "2026-02-28T12:00:00.000Z");
});

test("subtractMonthsClamped keeps month-end in leap year", () => {
  const input = new Date("2024-03-31T12:00:00Z");
  const output = subtractMonthsClamped(input, 1);
  assert.equal(output.toISOString(), "2024-02-29T12:00:00.000Z");
});

test("subtractMonthsClamped subtracts multiple months across years", () => {
  const input = new Date("2026-01-30T12:00:00Z");
  const output = subtractMonthsClamped(input, 4);
  assert.equal(output.toISOString(), "2025-09-30T12:00:00.000Z");
});

test("subtractMonthsClamped preserves day when target month supports it", () => {
  const input = new Date("2026-08-15T12:00:00Z");
  const output = subtractMonthsClamped(input, 3);
  assert.equal(output.toISOString(), "2026-05-15T12:00:00.000Z");
});
