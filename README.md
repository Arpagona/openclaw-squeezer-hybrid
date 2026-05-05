# OpenClaw Squeezer Hybrid

Squeezer Hybrid is an OpenClaw plugin that compresses raw text and extracts structured metadata such as actions, entities, and states.

## Features

- text compression
- metadata extraction
- modes: `standard`, `aggressive`, `ultra`
- tool exposed to OpenClaw: `squeeze_context`

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

V1 focuses on a clean installable tool plugin.
It is not yet a full replacement for native OpenClaw compaction.
