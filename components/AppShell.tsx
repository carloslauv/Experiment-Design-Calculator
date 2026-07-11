"use client";

import { useState } from "react";
import Calculator from "./Calculator";
import ScenariosSidebar from "./ScenariosSidebar";
import type { ScenarioInputs, SavedScenario } from "@/lib/actions/scenarios";

interface Props {
  initialScenarios: SavedScenario[];
  greeting?: string;
}

export default function AppShell({ initialScenarios, greeting }: Props) {
  const [pendingSave, setPendingSave] = useState<ScenarioInputs | null>(null);
  const [loadInputs, setLoadInputs] = useState<ScenarioInputs | null>(null);

  return (
    <div className="app-shell">
      {greeting && (
        <div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.35rem" }}>
            Experiment calculator
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: "normal", fontStyle: "italic", color: "var(--ink)" }}>
            {greeting}
          </h1>
        </div>
      )}
      <div className="app-shell-row">
        <div className="app-shell-sidebar">
          <ScenariosSidebar
            initial={initialScenarios}
            onLoad={(inputs) => {
              setLoadInputs(inputs);
              setPendingSave(null);
            }}
            pendingSave={pendingSave}
            onSaveComplete={() => setPendingSave(null)}
          />
        </div>
        <div className="app-shell-main">
          <Calculator
            key={loadInputs ? JSON.stringify(loadInputs) : "default"}
            loadInputs={loadInputs}
            onSave={(inputs) => setPendingSave(inputs)}
          />
        </div>
      </div>
    </div>
  );
}
