import { squeeze } from "./engine/squeezer.js";

type SqueezerCompactionParams = {
  messages: unknown[];
  signal?: AbortSignal;
  compressionRatio?: number;
  customInstructions?: string;
  summarizationInstructions?: {
    identifierPolicy?: "strict" | "off" | "custom";
    identifierInstructions?: string;
  };
  previousSummary?: string;
};

export const squeezerCompactionProvider = {
  id: "squeezer-hybrid",
  label: "Squeezer Hybrid",
  async summarize(params: SqueezerCompactionParams): Promise<string> {
    params.signal?.throwIfAborted?.();

    const lines = params.messages
      .map(formatMessage)
      .filter(Boolean);

    const joined = lines.join("\n").trim();
    if (!joined) return "";

    const mode = pickMode(params.compressionRatio);
    const compressedLines = lines.map((line) => squeeze(line, mode));

    const actions = collectUnique(compressedLines.flatMap((item) => item.actions));
    const entities = collectUnique(compressedLines.flatMap((item) => item.entities));
    const states = collectUnique(compressedLines.flatMap((item) => item.states));

    const header: string[] = [];
    if (params.previousSummary?.trim()) {
      header.push("Previous summary:", params.previousSummary.trim(), "");
    }
    if (params.customInstructions?.trim()) {
      header.push("Custom instructions:", params.customInstructions.trim(), "");
    }
    if (params.summarizationInstructions?.identifierPolicy === "custom" && params.summarizationInstructions.identifierInstructions?.trim()) {
      header.push("Identifier preservation:", params.summarizationInstructions.identifierInstructions.trim(), "");
    }

    const facts: string[] = [];
    if (actions.length) facts.push(`Actions: ${actions.join(", ")}`);
    if (entities.length) facts.push(`Entities: ${entities.join(", ")}`);
    if (states.length) facts.push(`States: ${states.join(", ")}`);

    const compactedBody = compressedLines
      .map((item, index) => `- ${index + 1}. ${item.output}`)
      .join("\n");

    return [
      ...header,
      facts.length ? "Structured facts:\n" + facts.join("\n") : "",
      compactedBody ? "Compacted history:\n" + compactedBody : "",
    ]
      .filter(Boolean)
      .join("\n\n")
      .trim();
  },
};

function pickMode(compressionRatio?: number): "standard" | "aggressive" | "ultra" {
  if (typeof compressionRatio === "number") {
    if (compressionRatio >= 0.75) return "ultra";
    if (compressionRatio >= 0.5) return "aggressive";
  }
  return "standard";
}

function collectUnique(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function formatMessage(message: unknown): string {
  if (!message || typeof message !== "object") return "";
  const role = typeof (message as { role?: unknown }).role === "string"
    ? String((message as { role?: string }).role)
    : "message";
  const content = extractContent((message as { content?: unknown }).content);
  return content ? `${role}: ${content}` : "";
}

function extractContent(content: unknown): string {
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (!part || typeof part !== "object") return "";
        const text = (part as { text?: unknown }).text;
        return typeof text === "string" ? text : "";
      })
      .filter(Boolean)
      .join(" ")
      .trim();
  }
  return "";
}
