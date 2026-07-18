#!/usr/bin/env node
// Lockfile age auditor: verifies every resolved package version in a lockfile
// was published at least MIN_HOURS ago. PM-agnostic two-witness check — trusts
// the registry's publish timestamps, not the resolver that wrote the lockfile.
//
// Usage: node audit-lockfile-age.mjs <lockfile> [minHours=168]
// Exit 0: all entries pass. Exit 1: violations (printed). Exit 2: parse/fetch error.

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const [, , lockPath, minHoursArg] = process.argv;
const MIN_HOURS = Number(minHoursArg ?? 168);
if (!lockPath) { console.error('usage: audit-lockfile-age.mjs <lockfile> [minHours]'); process.exit(2); }

const text = readFileSync(lockPath, 'utf8');
const file = basename(lockPath);
const entries = new Map(); // name -> Set(version)

function add(name, version) {
  if (!/^\d/.test(version)) return; // skip link:/file:/workspace: etc.
  if (!entries.has(name)) entries.set(name, new Set());
  entries.get(name).add(version);
}

if (file === 'pnpm-lock.yaml') {
  // v9 format: under "packages:" keys like "  '@scope/name@1.2.3':" or "  name@1.2.3:"
  const section = text.split(/^packages:$/m)[1]?.split(/^\S/m)[0] ?? '';
  for (const m of section.matchAll(/^ {2}'?((?:@[^@'\n]+\/)?[^@'\n]+)@([^'():\n]+)'?:/gm)) {
    add(m[1], m[2]);
  }
} else if (file === 'yarn.lock') {
  // v1 format: resolved tarball URLs carry name+version reliably
  for (const m of text.matchAll(/^ {2}resolved "https?:\/\/[^"]*?\/((?:@[^/]+\/)?[^/]+)\/-\/[^/]+-(\d[^"]*?)\.tgz[^"]*"/gm)) {
    add(m[1], m[2]);
  }
} else if (file === 'package-lock.json') {
  const lock = JSON.parse(text);
  for (const [p, info] of Object.entries(lock.packages ?? {})) {
    const name = p.split('node_modules/').pop();
    if (p && name && info.version && !info.link) add(name, info.version);
  }
} else {
  console.error(`unsupported lockfile: ${file}`); process.exit(2);
}

if (entries.size === 0) { console.error('no entries parsed — parser bug or empty lockfile'); process.exit(2); }

const now = Date.now();
const violations = [];
let checked = 0; let oldestYoung = null; let youngest = null;

const names = [...entries.keys()];
const CONCURRENCY = 16;
let idx = 0;
async function worker() {
  while (idx < names.length) {
    const name = names[idx++];
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name).replace('%40', '@')}`);
    if (!res.ok) { violations.push({ name, version: '*', hours: NaN, note: `registry ${res.status}` }); continue; }
    const doc = await res.json();
    for (const version of entries.get(name)) {
      checked++;
      const t = doc.time?.[version];
      if (!t) { violations.push({ name, version, hours: NaN, note: 'no publish time' }); continue; }
      const hours = (now - Date.parse(t)) / 3600e3;
      if (!youngest || hours < youngest.hours) youngest = { name, version, hours };
      if (hours < MIN_HOURS) violations.push({ name, version, hours });
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`checked ${checked} name@version entries from ${entries.size} packages (threshold ${MIN_HOURS}h)`);
if (youngest) console.log(`youngest entry: ${youngest.name}@${youngest.version} = ${youngest.hours.toFixed(1)}h`);
if (violations.length) {
  console.log(`\nVIOLATIONS (${violations.length}):`);
  for (const v of violations.sort((a, b) => a.hours - b.hours)) {
    console.log(`  ${v.name}@${v.version}: ${Number.isNaN(v.hours) ? v.note : v.hours.toFixed(1) + 'h old'}`);
  }
  process.exit(1);
}
console.log('PASS: all entries meet the age threshold');
