import { getClosedIssueCounts } from "./lib/github";
import DevClockClient from "./DevClockClient";

export default async function Home() {
  const ticketCounts = await getClosedIssueCounts();
  return <DevClockClient ticketCounts={ticketCounts} />;
}
