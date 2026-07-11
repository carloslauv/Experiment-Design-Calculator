import Link from "next/link";
import Calculator from "@/components/Calculator";
import { paramsToInputs } from "@/components/Calculator";
import type { ScenarioInputs } from "@/lib/actions/scenarios";

export const metadata = { title: "Shared experiment — Clearcut" };

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = paramsToInputs(new URLSearchParams(params as Record<string, string>));

  const inputs: ScenarioInputs = {
    mode: raw.mode ?? "plan",
    baselineRate: raw.baselineRate ?? "5",
    mde: raw.mde ?? "10",
    power: raw.power ?? "80",
    alpha: raw.alpha ?? "95",
    variants: raw.variants ?? "1",
    dailyVisitors: raw.dailyVisitors ?? "1000",
    ctrlUsers: raw.ctrlUsers ?? "5000",
    ctrlConv: raw.ctrlConv ?? "250",
    varUsers: raw.varUsers ?? "5000",
    varConv: raw.varConv ?? "310",
  };

  return (
    <main style={{ minHeight: "100dvh", padding: "2.5rem 2.5rem 4rem", background: "var(--paper)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.35rem",
            }}>
              Clearcut
            </p>
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.6rem",
              fontWeight: "normal",
              fontStyle: "italic",
              color: "var(--ink)",
            }}>
              Shared experiment
            </h1>
          </div>
          <Link
            href="/login"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              border: "1px solid var(--accent)",
              padding: "0.5rem 0.9rem",
              textDecoration: "none",
            }}
          >
            Sign in to save →
          </Link>
        </div>

        {/* Read-only banner */}
        <div style={{
          marginBottom: "1.5rem",
          padding: "0.6rem 0.9rem",
          border: "1px solid var(--dim)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--muted)",
          letterSpacing: "0.04em",
        }}>
          This is a shared view. You can adjust inputs — sign in to save your own scenarios.
        </div>

        <Calculator loadInputs={inputs} />
      </div>
    </main>
  );
}
