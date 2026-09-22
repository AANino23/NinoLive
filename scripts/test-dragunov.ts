/** Regression checks for the guide's previously incorrect punish recommendations. */
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL && specifier.startsWith(".") && !specifier.endsWith(".ts") && existsSync(fileURLToPath(new URL(`${specifier}.ts`, context.parentURL)))) {
      return next(`${specifier}.ts`, context);
    }
    return next(specifier, context);
  },
});

const { getMatchupPunishment } = await import("../app/tekken/punishment-data.ts");
const { getOpponentProfile } = await import("../app/tekken/opponent-profiles.ts");
const mirror = getMatchupPunishment("dragunov", "Dragunov (mirror)");
for (const [move, expectedPunish, launches] of [
  ["d+2", "ws1+2", false],
  ["df+2", "4,1", false],
  ["1,2,1", "b+4,3", false],
  ["WR.F+3", "ws2", true],
] as const) {
  const row = mirror.opponentPunishes.find((entry) => entry.move === move);
  assert.ok(row, `Missing ${move}`);
  assert.equal(row.punish, expectedPunish, `${move}: wrong stance/timing for punishment`);
  assert.equal(row.punishLaunches, launches, `${move}: wrong launch promise`);
}
assert.ok(!mirror.opponentPunishes.some((entry) => ["f+2", "df+1,4"].includes(entry.move)), "Safe moves must not be advertised as block-punishable");
assert.ok(!mirror.ladder.some((tier) => tier.move === "df+1,4"), "CH-only string must not be a guaranteed punish");
assert.deepEqual(getOpponentProfile("Dragunov (mirror)")?.threats.map((threat) => threat.search), ["f,f,F+2", "b+1+2", "d+2"]);
console.log("Dragunov punishment and mirror clip regressions passed.");
