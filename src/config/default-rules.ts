import type { SqueezeRules } from "../engine/types.js";

export const defaultRules: SqueezeRules = {
  entities: [
    "nginx",
    "docker",
    "config.yaml",
    "service",
    "database",
    "api",
    "server",
    "auth",
    "credentials",
    "connection",
    "permission",
    "log",
  ],
  actionPatterns: {
    restart: /\b(restart|restarted|restarting)\b/i,
    check: /\b(check|checking|verify|verifying|inspect|inspecting|status)\b/i,
    edit: /\b(edit|editing|modify|modifying|change|changing|patch|patching)\b/i,
    update: /\b(update|updated|updating|upgrade|upgraded|upgrading)\b/i,
    fix: /\b(fix|fixing|fixed|repair|repairing|repaired)\b/i,
  },
  statePatterns: {
    ok: /\b(ok|success|successful|successfully|works|working|running|active|complete|completed|connected)\b/i,
    err: /\b(err|error|errors|failed|failure|broken|refused|denied|invalid)\b/i,
  },
};
