import fs from "fs";
import path from "path";

const ROOTS = [
  path.join(process.cwd(), "content", "guides"),
  path.join(process.cwd(), "content", "blog"),
];

const BLOCKED_PATTERNS = [
  { re: /\bSEO-friendly\b/i, reason: "Internal SEO phrasing" },
  { re: /\bsearch intent\b/i, reason: "Internal SEO phrasing" },
  { re: /\bSuchintention(?:en)?\b/i, reason: "Internal SEO phrasing" },
  { re: /\bkeyword(?:s)?\b/i, reason: "Internal SEO phrasing" },
  { re: /\bviral\b/i, reason: "Marketing/creator phrasing" },
  { re: /\bfor ranking\b/i, reason: "Internal SEO phrasing" },
  { re: /\bcopy this\b/i, reason: "Template/creator phrasing" },
];

function listMdxFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMdxFiles(full));
      continue;
    }
    if (entry.isFile() && full.endsWith(".mdx")) {
      files.push(full);
    }
  }
  return files;
}

const offenders = [];

for (const root of ROOTS) {
  for (const file of listMdxFiles(root)) {
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      for (const pattern of BLOCKED_PATTERNS) {
        if (pattern.re.test(line)) {
          offenders.push({
            file,
            line: idx + 1,
            reason: pattern.reason,
            text: line.trim(),
          });
        }
      }
    });
  }
}

if (offenders.length > 0) {
  console.error("Editorial tone check failed. Remove internal/creator phrasing:");
  for (const item of offenders) {
    console.error(`- ${item.file}:${item.line} [${item.reason}] ${item.text}`);
  }
  process.exit(1);
}

console.log("Editorial tone check passed.");
