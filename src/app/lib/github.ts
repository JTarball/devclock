/**
 * Build-time GitHub data for ticket stats.
 * Prefers ticket-stats.json (from scripts/fetch-ticket-stats.js). Otherwise uses GITHUB_REPO + GITHUB_TOKEN.
 * Only counts issues closed on or after the dev start date (4 Feb 2026).
 */

import fs from "fs";
import path from "path";

const TICKET_USERS = ["jtarball", "nbettencourt"] as const;
const DEV_START_DATE = "2026-02-04"; // closed:>= this date

export type TicketCounts = Record<string, number>;

async function fetchClosedIssueCount(
  ownerRepo: string,
  username: string,
  token?: string
): Promise<number> {
  const q = `repo:${ownerRepo} author:${username} is:closed type:issue closed:>=${DEV_START_DATE}`;
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=1`;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { headers, next: { revalidate: 0 } });
  const data = (await res.json()) as { total_count?: number; message?: string };
  if (!res.ok) {
    if (process.env.VERBOSE) {
      console.warn(
        `[devclock] GitHub API ${res.status} for ${username}:`,
        data.message ?? res.statusText
      );
    }
    return 0;
  }
  return typeof data.total_count === "number" ? data.total_count : 0;
}

/**
 * Returns closed issue counts per username.
 * Prefers ticket-stats.json (written by scripts/fetch-ticket-stats.js in CI) so the build
 * does not call the GitHub API. If the file is missing, falls back to fetching (needs GITHUB_REPO).
 */
export async function getClosedIssueCounts(): Promise<TicketCounts> {
  // Prefer pre-generated stats file (used in CI and after running the fetch script locally)
  try {
    const p = path.join(process.cwd(), "ticket-stats.json");
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      const data = JSON.parse(raw) as unknown;
      if (
        data &&
        typeof data === "object" &&
        TICKET_USERS.every((u) => typeof (data as TicketCounts)[u] === "number")
      ) {
        return data as TicketCounts;
      }
    }
  } catch {
    // ignore: no file or invalid, fall back to API
  }

  const ownerRepo = process.env.GITHUB_REPO || "yld0/frontend";
  const token = process.env.GITHUB_TOKEN;

  if (!ownerRepo?.trim()) {
    return Object.fromEntries(TICKET_USERS.map((u) => [u, 0]));
  }

  const repo = ownerRepo.trim();
  const result: TicketCounts = {};

  if (process.env.VERBOSE) {
    console.log(
      `[devclock] Fetching ticket stats for repo: ${repo} (token: ${token ? "yes" : "no"})`
    );
  }

  for (const username of TICKET_USERS) {
    try {
      result[username] = await fetchClosedIssueCount(repo, username, token);
      if (process.env.VERBOSE) {
        console.log(`[devclock] ${username}: ${result[username]} closed issues`);
      }
    } catch (err) {
      result[username] = 0;
      if (process.env.VERBOSE) {
        console.warn(`[devclock] ${username}: fetch failed`, err);
      }
    }
  }

  return result;
}

export { TICKET_USERS };
