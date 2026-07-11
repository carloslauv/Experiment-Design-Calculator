"use client";

import { useState } from "react";
import Calculator from "./Calculator";
import ScenariosSidebar from "./ScenariosSidebar";
import type { ScenarioInputs, SavedScenario } from "@/lib/actions/scenarios";

interface Props {
  initialScenarios: SavedScenario[];
}

export default function AppShell({ initialScenarios }: Props) {
  const [pendingSave, setPendingSave] = useState<ScenarioInputs | null>(null);
  const [loadInputs, setLoadInputs] = useState<ScenarioInputs | null>(null);

  return (
    <div style={{ display: "flex", gap: "2.5rem", alignItems: "start" }}>
      <ScenariosSidebar
        initial={initialScenarios}
        onLoad={(inputs) => {
          setLoadInputs(inputs);
          setPendingSave(null);
        }}
        pendingSave={pendingSave}
        onSaveComplete={() => setPendingSave(null)}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Calculator
          key={loadInputs ? JSON.stringify(loadInputs) : "default"}
          loadInputs={loadInputs}
          onSave={(inputs) => setPendingSave(inputs)}
        />
      </div>
    </div>
  );
}
