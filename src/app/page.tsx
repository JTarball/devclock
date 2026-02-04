"use client";

import { useEffect, useState } from "react";

const DEV_START = new Date("2026-02-04T00:00:00");

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function getElapsed(now: Date) {
  const ms = Math.max(0, now.getTime() - DEV_START.getTime());
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const remainder = totalSeconds % (24 * 60 * 60);
  const hours = Math.floor(remainder / 3600);
  const minutes = Math.floor((remainder % 3600) / 60);
  const seconds = remainder % 60;
  return { days, hours, minutes, seconds };
}

export default function Home() {
  const [elapsed, setElapsed] = useState(() => getElapsed(new Date()));

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(getElapsed(new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 font-sans">
      <main
        className="flex flex-col items-center justify-center gap-12 px-6"
        role="main"
      >
        <h1 className="text-center text-xl font-medium tracking-wide text-zinc-400 sm:text-2xl">
          Days since we started development
        </h1>

        <div
          className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className="font-mono text-6xl tabular-nums text-white sm:text-7xl md:text-8xl"
              aria-label={`${elapsed.days} days`}
            >
              {elapsed.days}
            </span>
            <span className="text-sm font-medium uppercase tracking-widest text-zinc-500">
              days
            </span>
          </div>

          <div
            className="flex items-center gap-2 font-mono text-4xl tabular-nums text-white sm:text-5xl md:text-6xl"
            aria-label={`${elapsed.hours} hours, ${elapsed.minutes} minutes, ${elapsed.seconds} seconds`}
          >
            <span aria-hidden="true">{pad(elapsed.hours)}</span>
            <span className="text-zinc-600" aria-hidden="true">
              :
            </span>
            <span aria-hidden="true">{pad(elapsed.minutes)}</span>
            <span className="text-zinc-600" aria-hidden="true">
              :
            </span>
            <span aria-hidden="true">{pad(elapsed.seconds)}</span>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-500">
          Started 4 February 2026
        </p>
      </main>
    </div>
  );
}
