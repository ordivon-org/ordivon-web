import assert from "node:assert/strict";
import test from "node:test";

import { buildPromotionReceipt } from "../scripts/prepare-web-promotion.mjs";

test("promotion receipt cannot be minted without accepted final currentness", async () => {
  await assert.rejects(
    () => buildPromotionReceipt({ currentnessReport: { admission: { accepted: false } }, verificationProfile: "pnpm-check+pages-prepare" }),
    /accepted final owner currentness/,
  );
});

test("promotion receipt refuses unsupported verification profiles", async () => {
  await assert.rejects(
    () => buildPromotionReceipt({ currentnessReport: { admission: { accepted: true } }, verificationProfile: "build-only" }),
    /supported verification profile/,
  );
});
