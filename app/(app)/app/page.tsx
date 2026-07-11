import { auth } from "@/lib/auth";
import { listScenarios } from "@/lib/actions/scenarios";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Calculator — Clearcut" };

export default async function AppPage() {
  const session = await auth();
  const scenarios = session?.user?.id ? await listScenarios() : [];

  return (
    <main style={{ minHeight: "calc(100dvh - 58px)" }}>
      <AppShell
        initialScenarios={scenarios}
        greeting={
          session?.user?.name
            ? `Welcome back, ${session.user.name.split(" ")[0]}.`
            : "Plan your experiment."
        }
      />
    </main>
  );
}
