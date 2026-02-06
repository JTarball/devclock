#!/usr/bin/env node
/**
 * Fetches closed issue counts from GitHub API and writes ticket-stats.json.
 * Run in CI before next build so the app can read stats without calling the API at build time.
 * Requires: GITHUB_REPO (e.g. owner/repo), optional GITHUB_TOKEN.
 */

const DEV_START_DATE = "2026-02-04";
const TICKET_USERS = ["jtarball", "nbettencourt"];

async function fetchCount(ownerRepo, username, token) {
  const q = `repo:${ownerRepo} author:${username} is:closed type:issue closed:>=${DEV_START_DATE}`;
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=1`;
  const headers = { Accept: "application/vnd.github.v3+json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  const data = await res.json();
  if (!res.ok) {
    console.warn(`GitHub API ${res.status} for ${username}:`, data.message || res.statusText);
    return 0;
  }
  return typeof data.total_count === "number" ? data.total_count : 0;
}

async function main() {
  const ownerRepo = process.env.GITHUB_REPO?.trim() || "yld0/frontend";
  if (!ownerRepo) {
    console.warn("GITHUB_REPO not set; writing zeros.");
  }
  const token = process.env.GITHUB_TOKEN;
  const result = {};
  for (const username of TICKET_USERS) {
    try {
      result[username] = ownerRepo
        ? await fetchCount(ownerRepo, username, token)
        : 0;
    } catch (err) {
      console.warn(`${username}: fetch failed`, err);
      result[username] = 0;
    }
  }
  const path = require("path");
  const fs = require("fs");
  const outPath = path.join(process.cwd(), "ticket-stats.json");
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
  console.log("Wrote", outPath, result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
