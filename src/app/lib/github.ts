/**
 * Build-time GitHub data for ticket stats.
 * Set GITHUB_REPO (e.g. "owner/repo") and optionally GITHUB_TOKEN for higher rate limits.
 * Only counts issues closed on or after the dev start date (4 Feb 2026).
 */

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
  if (!res.ok) {
    return 0;
  }
  const data = (await res.json()) as { total_count?: number };
  return typeof data.total_count === "number" ? data.total_count : 0;
}

/**
 * Returns closed issue counts per username for the configured repo.
 * If GITHUB_REPO is not set or the API fails, returns zeros so the build never fails.
 */
export async function getClosedIssueCounts(): Promise<TicketCounts> {
  const ownerRepo = process.env.GITHUB_REPO || "yld0/frontend";
  const token = process.env.GITHUB_TOKEN;

  if (!ownerRepo?.trim()) {
    return Object.fromEntries(TICKET_USERS.map((u) => [u, 0]));
  }

  const repo = ownerRepo.trim();
  const result: TicketCounts = {};

  for (const username of TICKET_USERS) {
    try {
      result[username] = await fetchClosedIssueCount(repo, username, token);
    } catch {
      result[username] = 0;
    }
  }

  return result;
}

export { TICKET_USERS };
