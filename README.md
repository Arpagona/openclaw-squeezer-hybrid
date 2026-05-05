# OpenClaw Squeezer Hybrid

Squeezer Hybrid is an OpenClaw plugin that compresses raw text and extracts structured metadata such as actions, entities, and states.

## Features

- text compression
- metadata extraction
- modes: `standard`, `aggressive`, `ultra`
- tool exposed to OpenClaw: `squeeze_context`
- compaction provider id: `squeezer-hybrid`

## Install

```bash
openclaw plugins install ./openclaw-squeezer-hybrid
openclaw gateway restart
```

## Example

Input:

`The user performed a restart on nginx which resulted in success.`

Output:

```json
{
  "compressedText": "user performed restart nginx which resulted success.",
  "actions": ["restart"],
  "entities": ["nginx"],
  "states": ["ok"],
  "output": "[action: restart | entity: nginx | state: ok] -> user performed restart nginx which resulted success."
}
```

## Config

```json5
{
  plugins: {
    entries: {
      "squeezer-hybrid": {
        enabled: true,
        config: {
          defaultMode: "standard",
          maxInputChars: 20000
        }
      }
    }
  }
}
```

## Status

V1 exposes both:
- a callable tool
- a basic compaction provider for OpenClaw safeguard compaction

The provider is intentionally simple and should be treated as an experimental first production path, not a final high-fidelity summarizer.

## Shadow test protocol

Recommended rollout:

### 1. Manual compaction in a test session

Keep the provider enabled:

```json5
{
  agents: {
    defaults: {
      compaction: {
        provider: "squeezer-hybrid",
        mode: "safeguard"
      }
    }
  }
}
```

Then in a disposable session:

```text
/compact Focus on decisions, constraints, active tasks, file paths, commands, errors, and next steps.
```

Check that the resulting summary preserves:
- decisions already taken
- exact identifiers, paths, repo names, and commands
- current active task and next action
- important blockers or errors

### 2. Controlled live validation

After the manual `/compact` looks good, leave the provider active only for your own sessions and watch real compactions on longer threads.

Suggested checks after each compaction:
- can the agent still name the current objective correctly?
- can it recover exact repo/path/command references?
- did it drop critical constraints?
- did it become too lossy or too verbose?

### 3. Full production activation

Only keep it as the default provider if the previous step is stable across several real sessions.

## Rollback

If summary quality is not good enough, remove the `provider` key from `agents.defaults.compaction` and restart OpenClaw.

This returns compaction to the built-in OpenClaw summarizer.

## Go / no-go criteria

Go if:
- summaries preserve decisions, identifiers, and next steps
- agent continuity remains good after compaction
- no important context disappears in real sessions

No-go if:
- paths, ids, commands, or repo names are altered
- summaries become too keyword-ish to be useful
- the agent loses the thread after compaction
