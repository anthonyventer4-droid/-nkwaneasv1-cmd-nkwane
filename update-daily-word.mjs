// ============================================================
// Daily Words — automation script
// HOW TO RUN: node scripts/update-daily-word.mjs
// (Runs automatically every day via GitHub Actions — see
//  .github/workflows/daily-words.yml)
//
// WHAT IT DOES:
// 1. Works out today's word from the UTC calendar date
// 2. Writes dailywords/today.json  (today's snapshot)
// 3. Writes dailywords/history.json (rolling last 30 days)
// It is idempotent: running it twice on the same day changes nothing.
// ============================================================

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// --- Locate files relative to this script, not the working directory ---
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const wordsPath = join(repoRoot, "dailywords", "words.json");
const todayPath = join(repoRoot, "dailywords", "today.json");
const historyPath = join(repoRoot, "dailywords", "history.json");

// --- Load the source-of-truth word list ---
const wordList = JSON.parse(readFileSync(wordsPath, "utf8")).words;

// --- Deterministic daily selection ---
// Days elapsed since 1 Jan 1970 (UTC). Same formula the web page uses,
// so the site and this script always agree on the word.
function dayNumber(date = new Date()) {
  return Math.floor(date.getTime() / 86400000);
}

function wordForDay(day) {
  // Modulo keeps us cycling through the list forever
  const index = ((day % wordList.length) + wordList.length) % wordList.length;
  return wordList[index];
}

function isoDate(day) {
  return new Date(day * 86400000).toISOString().slice(0, 10);
}

// --- Build today's snapshot ---
const today = dayNumber();
const snapshot = {
  date: isoDate(today),
  day: today,
  word: wordForDay(today),
};

// --- Idempotency check: only write if the day has actually rolled over ---
let previous = null;
if (existsSync(todayPath)) {
  try {
    previous = JSON.parse(readFileSync(todayPath, "utf8"));
  } catch {
    previous = null; // Corrupt file? We simply rewrite it.
  }
}

if (previous && previous.date === snapshot.date) {
  console.log(`No change — today.json already set for ${snapshot.date} (${snapshot.word.word}).`);
  process.exit(0);
}

// --- Write today.json ---
writeFileSync(todayPath, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Published today.json: ${snapshot.date} → ${snapshot.word.word}`);

// --- Update rolling 30-day history ---
let history = [];
if (existsSync(historyPath)) {
  try {
    history = JSON.parse(readFileSync(historyPath, "utf8")).entries ?? [];
  } catch {
    history = [];
  }
}

// Remove any existing entry for today, add the fresh one, keep last 30
history = history.filter((entry) => entry.date !== snapshot.date);
history.unshift({ date: snapshot.date, day: today, word: snapshot.word.word });
history = history.slice(0, 30);

writeFileSync(historyPath, JSON.stringify({ entries: history }, null, 2) + "\n");
console.log(`Updated history.json (${history.length} entries).`);
