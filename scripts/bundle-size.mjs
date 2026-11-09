// Usage: node scripts/bundle-size.mjs [label]  (run after `next build`)
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const dir = ".next/static/chunks";
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p) : p.endsWith(".js") && files.push(p);
  }
})(dir);

const rows = files
  .map((p) => {
    const buf = readFileSync(p);
    const src = buf.toString("utf8");
    return {
      file: p.replace(`${dir}/`, ""),
      raw: buf.length,
      gzip: gzipSync(buf).length,
      recharts: /recharts|CartesianGrid|ResponsiveContainer/.test(src),
      virtual: /tanstack.*virtual|scrollToIndex|getVirtualItems/.test(src),
    };
  })
  .sort((a, b) => b.raw - a.raw);

const sum = (k, f = () => true) => rows.filter(f).reduce((s, r) => s + r[k], 0);
const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
const out = {
  label: process.argv[2] ?? "run",
  chunkCount: rows.length,
  totalRaw: kb(sum("raw")),
  totalGzip: kb(sum("gzip")),
  rechartsChunksRaw: kb(sum("raw", (r) => r.recharts)),
  top5: rows
    .slice(0, 5)
    .map(
      (r) =>
        `${r.file}  ${kb(r.raw)} (gz ${kb(r.gzip)})${r.recharts ? "  [recharts]" : ""}`,
    ),
};
console.log(JSON.stringify(out, null, 2));
writeFileSync(`perf/bundle-${out.label}.json`, JSON.stringify(out, null, 2));
