import assert from "node:assert/strict";
import fs from "node:fs/promises";

const pairs = [
  ["assets/london_eye.jpg", "assets/london_eye.webp"],
  ["assets/tower_bridge.jpg", "assets/tower_bridge.webp"],
  ["assets/camden_market.jpg", "assets/camden_market.webp"]
];

for (const [jpg, webp] of pairs) {
  const jpgStat = await fs.stat(jpg);
  const webpStat = await fs.stat(webp);
  assert.ok(webpStat.size > 0, `${webp} should not be empty`);
  assert.ok(webpStat.size < jpgStat.size, `${webp} should be smaller than ${jpg}`);
}

console.log("Image asset QA passed.");
