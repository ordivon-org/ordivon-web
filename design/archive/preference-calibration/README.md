# Archived preference-calibration apparatus

This directory preserves the A0/A2-era blinded pairwise preference tooling as **conditional research apparatus**. It is not part of ordinary Web production, `design:check`, or the active package command surface.

Use it only when a real decision explicitly makes a comparative human-preference claim that cannot be resolved by correctness, task obligations, mature craft priors, rendered browser inspection, and bounded Agent judgment. In that case, recover the apparatus deliberately, bind the candidate/review identities, and treat the result as calibration evidence rather than a permanent creative-control loop.

The scripts are retained because the earlier experiments established useful evidence-handling lessons: identity blinding, evaluator-level independence, direct surface slices, and separation of preference claims from diagnostic facets. Their historical success does not grant them permanent core status.

Example invocation from the repository root, when such a claim actually exists:

```bash
node design/archive/preference-calibration/prepare-design-comparisons.mjs \
  design/archive/preference-calibration/evaluation-spec.example.json \
  <rater-id> <rater-class> <seed>
```

The remaining scripts in this directory implement blinding, review rendering, response resolution, and ranking. They are intentionally not wrapped as `pnpm design:*` commands.
