import fs from "node:fs";
import path from "node:path";

const ROOT_DIRS = ["app", "components", "content", "lib", "README.md"];
const FILE_EXTENSIONS = new Set([".ts", ".tsx", ".mdx", ".mjs", ".mts", ".md"]);
const URL_PATTERN = /https?:\/\/[^\s"'`)<>{}]+/g;
const USER_AGENT = "Mozilla/5.0 (compatible; LifeHacksGermanyLinkCheck/1.0)";
const TIMEOUT_MS = 15000;
const CONCURRENCY = 8;

function walkFiles(entryPath, collected) {
  if (!fs.existsSync(entryPath)) return;
  const stat = fs.statSync(entryPath);
  if (stat.isFile()) {
    if (FILE_EXTENSIONS.has(path.extname(entryPath))) {
      collected.push(entryPath);
    }
    return;
  }

  const entries = fs.readdirSync(entryPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".next") continue;
    walkFiles(path.join(entryPath, entry.name), collected);
  }
}

function extractUrls(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const matches = content.match(URL_PATTERN) ?? [];
  return matches
    .map((url) => url.trim().replace(/[),.;]+$/, ""))
    .filter((url) => !url.includes("{") && !url.includes("}") && !url.includes("$"));
}

function withTimeout(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { controller, timer };
}

async function checkUrl(url) {
  const headers = { "user-agent": USER_AGENT };
  const attempts = 2;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const { controller, timer } = withTimeout(TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers,
        signal: controller.signal,
      });
      clearTimeout(timer);
      return { url, status: response.status };
    } catch (error) {
      clearTimeout(timer);
      if (attempt === attempts) {
        return { url, status: "ERR", error: String(error) };
      }
    }
  }

  return { url, status: "ERR", error: "Unknown error" };
}

async function run() {
  const files = [];
  for (const root of ROOT_DIRS) walkFiles(root, files);

  const urlSet = new Set();
  for (const file of files) {
    for (const url of extractUrls(file)) urlSet.add(url);
  }

  const urls = [...urlSet].sort();
  console.log(`Checking ${urls.length} external URLs...`);

  const results = [];
  let cursor = 0;

  async function worker() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= urls.length) return;
      const result = await checkUrl(urls[index]);
      results.push(result);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const warnings = [];
  const failures = [];
  for (const result of results) {
    if (typeof result.status === "number" && result.status < 400) continue;
    if (result.status === 403 || result.status === 429) {
      warnings.push(result);
      continue;
    }
    failures.push(result);
  }

  if (warnings.length > 0) {
    console.log("\nWarnings (403/429 - likely anti-bot or rate-limit):");
    for (const warning of warnings) {
      console.log(`- [${warning.status}] ${warning.url}`);
    }
  }

  if (failures.length > 0) {
    console.error("\nBroken links:");
    for (const failure of failures) {
      const reason = failure.error ? ` (${failure.error})` : "";
      console.error(`- [${failure.status}] ${failure.url}${reason}`);
    }
    process.exit(1);
  }

  console.log("All checked links are reachable.");
}

run().catch((error) => {
  console.error("Link check failed:", error);
  process.exit(1);
});
