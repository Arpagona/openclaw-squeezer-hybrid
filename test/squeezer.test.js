import test from "node:test";
import assert from "node:assert/strict";
import { squeeze } from "../dist/engine/squeezer.js";
import { fixtures } from "./fixtures.js";

test("extracts full metadata", () => {
  const result = squeeze(fixtures.fullMatch, "standard");
  assert.equal(result.actions.includes("restart"), true);
  assert.equal(result.entities.includes("nginx"), true);
  assert.equal(result.states.includes("ok"), true);
});

test("extracts partial metadata", () => {
  const result = squeeze(fixtures.partialMatch, "standard");
  assert.equal(result.actions.includes("check"), true);
  assert.equal(result.entities.includes("docker"), true);
});

test("returns compressed text without metadata if nothing matches", () => {
  const result = squeeze(fixtures.noMatch, "standard");
  assert.equal(typeof result.output, "string");
});

test("ultra mode compresses harder than standard", () => {
  const standard = squeeze(fixtures.ultraCase, "standard");
  const ultra = squeeze(fixtures.ultraCase, "ultra");
  assert.equal(ultra.compressedText.length < standard.compressedText.length, true);
});
