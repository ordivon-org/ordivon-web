# M7 interaction trajectory evidence

This directory records the Web-owned encounter boundary used by Studio's foundational-media M7 program.

The question is narrower than general usability:

> Can action → state → feedback trajectory expose a semantic/operational defect that initial and final static views erase?

The executable fixture is `scripts/run-m7-interaction.mjs`.

## Registered variants

All variants present the same source-bounded proposition and preserve the same operation identity:

```text
The response was lost.
The operation outcome is unknown.
Recover the same operation identity before concluding success or failure.
```

Variants:

```text
lawful
  check → checking → unknown → recover → unknown

premature-success
  check → succeeded (unsupported transient) → unknown → recover → unknown

silent-delay
  check → no feedback → unknown → recover → unknown
```

Every encounter is reset to the same final static state.

## Result

Real Chromium trajectory capture showed:

- `premature-success` contains `feedback-claims-success-before-evidence`;
- `silent-delay` contains `latency-without-feedback`;
- both defective variants have initial and final static states equivalent to the lawful encounter;
- freezing the artifact to initial + final screenshots therefore removes every registered defect.

This supports a generic Interactive observer relation: screenshots/source state are insufficient when action consequence and transient feedback are the object of judgment.

It does **not** establish a second active Studio Interactive authority. Web already owns mature browser interaction craft; Studio should graduate a generic profile only after the same trajectory knowledge transfers to a materially different non-Web consumer.

## Equipment boundary

The runner deliberately reuses the same browser-discovery and short-temporary-directory constraints learned by the existing R6 harness. Two failed pre-runs exposed why those invariants matter:

1. hard-coding one Playwright cache version failed to find the currently provisioned browser;
2. inheriting Runtime's long Workspace temp path exceeded Chromium's Unix singleton-socket path limit.

The accepted runner discovers provisioned Chromium dynamically and moves browser temp state to `/tmp` only when the ambient path would exceed the known safe budget. These are browser-equipment facts, not Interactive aesthetic theory.

## Reproduction

```text
pnpm bootstrap
pnpm research:m7:interaction
```

Ephemeral evidence is written to `out/m7-interaction/evidence.json` and screenshots under `out/m7-interaction/screens/`.
