import { auth } from "@/lib/auth";
import { listScenarios } from "@/lib/actions/scenarios";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Calculator — Clearcut" };

export default async function AppPage() {
  const session = await auth();
  const scenarios = session?.user?.id ? await listScenarios() : [];

  return (
    <main
      style={{
        minHeight: "calc(100dvh - 58px)",
        padding: "2.5rem 2.5rem 4rem",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.35rem",
            }}
          >
            Experiment calculator
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.6rem",
              fontWeight: "normal",
              fontStyle: "italic",
              color: "var(--ink)",
            }}
          >
            {session?.user?.name
              ? `Welcome back, ${session.user.name.split(" ")[0]}.`
              : "Plan your experiment."}
          </h1>
        </div>
        <AppShell initialScenarios={scenarios} />
      </div>
    </main>
  );
}
