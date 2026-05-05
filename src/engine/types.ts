export type SqueezeMode = "standard" | "aggressive" | "ultra";

export type SqueezeRules = {
  entities: string[];
  actionPatterns: Record<string, RegExp>;
  statePatterns: Record<string, RegExp>;
};

export type SqueezeResult = {
  compressedText: string;
  actions: string[];
  entities: string[];
  states: string[];
  output: string;
};
