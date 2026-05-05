import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { squeezerCompactionProvider } from "./compaction-provider.js";
import { registerSqueezerTool } from "./tool.js";

export default definePluginEntry({
  id: "squeezer-hybrid",
  name: "Squeezer Hybrid",
  description: "Hybrid context squeezing and metadata extraction",
  register(api) {
    registerSqueezerTool(api);
    api.registerCompactionProvider(squeezerCompactionProvider);
  },
});
