// Usage: node scripts/route-js.mjs <route-dir> [label]   e.g. "(dashboard)/admin"
// Sums the client JS chunks the route's RSC manifest references (initial load, excludes lazy chunks).
import { readFileSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const route = process.argv[2];
const label = process.argv[3] ?? "run";
const file = `.next/server/app/${route}/page_client-reference-manifest.js`;
const src = readFileSync(file, "utf8");
const json = src.slice(src.indexOf("] = ") + 4).replace(/;?\s*$/, "");
const manifest = JSON.parse(json);
const chunks = new Set();
for (const mod of Object.values(manifest.clientModules ?? {}))
  for (const c of mod.chunks ?? []) chunks.add(String(c).replace(/^\/_next\//, ""));
for (const c of Object.values(manifest.entryJSFiles ?? {}).flat()) chunks.add(c);

let raw = 0, gz = 0, recharts = false;
for (const c of chunks) {
  try {
    const buf = readFileSync(`.next/${c}`);
    raw += buf.length; gz += gzipSync(buf).length;
    if (/CartesianGrid|ResponsiveContainer/.test(buf.toString("utf8"))) recharts = true;
  } catch {}
}
const out = { label, route, chunks: chunks.size, initialRaw: `${(raw/1024).toFixed(1)} kB`, initialGzip: `${(gz/1024).toFixed(1)} kB`, rechartsInInitialLoad: recharts };
console.log(JSON.stringify(out));
writeFileSync(`perf/route-${label}-${route.replace(/\W+/g, "_")}.json`, JSON.stringify(out, null, 2));
