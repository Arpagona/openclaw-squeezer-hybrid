import { getRules } from "./rules.js";
import type { SqueezeMode, SqueezeResult } from "./types.js";

const baseStopWords = new Set([
  "the", "a", "an", "and", "to", "of", "is", "in", "it", "with", "for", "on", "at",
  "i", "my", "am", "are", "be", "was", "were", "been", "being", "that", "this", "if",
]);

const aggressiveStopWords = new Set([
  "very", "extremely", "completely", "successfully", "immediately", "perfectly",
  "quickly", "just", "really", "quite",
]);

const ultraStopWords = new Set([
  "slow", "efficient", "active", "broken", "connected", "working", "running",
  "failed", "refused", "complete", "perfect",
]);

export function squeeze(rawText: string, mode: SqueezeMode = "standard"): SqueezeResult {
  const source = String(rawText || "").trim();
  const rules = getRules();

  const stopWords = new Set(baseStopWords);
  if (mode === "aggressive" || mode === "ultra") {
    for (const word of aggressiveStopWords) stopWords.add(word);
  }
  if (mode === "ultra") {
    for (const word of ultraStopWords) stopWords.add(word);
  }

  const entities = rules.entities.filter((entity) =>
    new RegExp(`\\b${escapeRegex(entity)}\\b`, "i").test(source),
  );

  const actions = Object.entries(rules.actionPatterns)
    .filter(([, pattern]) => pattern.test(source))
    .map(([name]) => name);

  const states = Object.entries(rules.statePatterns)
    .filter(([, pattern]) => pattern.test(source))
    .map(([name]) => name);

  const compressedText =
    source
      .split(/\s+/)
      .filter((token) => {
        const cleaned = token.replace(/[.,!?;:"'()\[\]{}]/g, "").toLowerCase();
        return !(cleaned && stopWords.has(cleaned));
      })
      .join(" ")
      .trim() || source;

  const meta: string[] = [];
  if (actions.length) meta.push(`action: ${actions.join(", ")}`);
  if (entities.length) meta.push(`entity: ${entities.join(", ")}`);
  if (states.length) meta.push(`state: ${states.join(", ")}`);

  const output = meta.length ? `[${meta.join(" | ")}] -> ${compressedText}` : compressedText;

  return {
    compressedText,
    actions,
    entities,
    states,
    output,
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type { SqueezeMode, SqueezeResult } from "./types.js";
