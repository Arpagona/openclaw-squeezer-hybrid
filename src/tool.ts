import { Type } from "@sinclair/typebox";
import { squeeze, type SqueezeMode } from "./engine/squeezer.js";

export function registerSqueezerTool(api: any) {
  api.registerTool(
    {
      name: "squeeze_context",
      description: "Compress text and extract actions, entities, and states",
      parameters: Type.Object({
        text: Type.String(),
        mode: Type.Optional(
          Type.Union([
            Type.Literal("standard"),
            Type.Literal("aggressive"),
            Type.Literal("ultra"),
          ]),
        ),
      }),
      async execute(_toolCallId: string, params: { text: string; mode?: SqueezeMode }) {
        const result = squeeze(params.text, params.mode ?? "standard");
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },
    { optional: true },
  );
}
