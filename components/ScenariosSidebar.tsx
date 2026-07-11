"use client";

import { useState, useTransition } from "react";
import { saveScenario, deleteScenario } from "@/lib/actions/scenarios";
import type { SavedScenario, ScenarioInputs } from "@/lib/actions/scenarios";

interface Props {
  initial: SavedScenario[];
  onLoad: (inputs: ScenarioInputs) => void;
  pendingSave: ScenarioInputs | null;
  onSaveComplete: () => void;
}

const MONO: React.CSSProperties = { fontFamily: "var(--font-mono)" };

export default function ScenariosSidebar({ initial, onLoad, pendingSave, onSaveComplete }: Props) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>(initial);
  const [saveName, setSaveName] = useState("");
  const [saving, startSave] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [showInput, setShowInput] = useState(false);

  function handleSave() {
    if (!saveName.trim() || !pendingSave) return;
    startSave(async () => {
      const { id } = await saveScenario(saveName.trim(), pendingSave);
      const newScenario: SavedScenario = {
        id,
        name: saveName.trim(),
        inputs: pendingSave,
        createdAt: new Date(),
      };
      setScenarios(prev => [...prev, newScenario]);
      setSaveName("");
      setShowInput(false);
      onSaveComplete();
    });
  }

  function handleDelete(id: string) {
    startDelete(async () => {
      await deleteScenario(id);
      setScenarios(prev => prev.filter(s => s.id !== id));
    });
  }

  const modeLabel = (s: SavedScenario) =>
    s.inputs.mode === "plan" ? "Plan" : "Readout";

  const subLabel = (s: SavedScenario) => {
    if (s.inputs.mode === "plan") {
      return `${s.inputs.baselineRate}% base · ${s.inputs.mde}% MDE`;
    }
    const ctrl = parseInt(s.inputs.ctrlUsers) || 0;
    const ctrlC = parseInt(s.inputs.ctrlConv) || 0;
    const varU = parseInt(s.inputs.varUsers) || 0;
    const varC = parseInt(s.inputs.varConv) || 0;
    const ctrlR = ctrl > 0 ? ((ctrlC / ctrl) * 100).toFixed(1) : "—";
    const varR = varU > 0 ? ((varC / varU) * 100).toFixed(1) : "—";
    return `${ctrlR}% → ${varR}%`;
  };

  return (
    <div
      style={{
        width: 220,
        flexShrink: 0,
        borderRight: "1px solid var(--dim)",
        paddingRight: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          ...MONO,
          fontSize: "0.58rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "0.5rem",
        }}
      >
        Saved scenarios
      </div>

      {scenarios.length === 0 && (
        <p style={{ ...MONO, fontSize: "0.68rem", color: "var(--muted)", lineHeight: 1.5 }}>
          No saved scenarios yet. Fill in the calculator and click &ldquo;Save scenario.&rdquo;
        </p>
      )}

      {scenarios.map(s => (
        <div
          key={s.id}
          style={{
            border: "1px solid var(--dim)",
            padding: "0.6rem 0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
            position: "relative",
          }}
        >
          <button
            onClick={() => onLoad(s.inputs)}
            style={{
              all: "unset",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
              width: "100%",
            }}
          >
            <span style={{ ...MONO, fontSize: "0.72rem", color: "var(--ink)", fontWeight: 500 }}>
              {s.name}
            </span>
            <span style={{ ...MONO, fontSize: "0.58rem", color: "var(--accent)", letterSpacing: "0.06em" }}>
              {modeLabel(s)}
            </span>
            <span style={{ ...MONO, fontSize: "0.62rem", color: "var(--muted)" }}>
              {subLabel(s)}
            </span>
          </button>
          <button
            onClick={() => handleDelete(s.id)}
            disabled={deleting}
            style={{
              all: "unset",
              cursor: "pointer",
              position: "absolute",
              top: "0.5rem",
              right: "0.6rem",
              ...MONO,
              fontSize: "0.65rem",
              color: "var(--muted)",
              opacity: 0.6,
            }}
            title="Delete"
          >
            ×
          </button>
        </div>
      ))}

      {/* Save name input — appears after clicking Save scenario in Calculator */}
      {pendingSave && !showInput && (
        <button
          onClick={() => setShowInput(true)}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 0.75rem",
            ...MONO,
            fontSize: "0.62rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Name &amp; save
        </button>
      )}

      {pendingSave && showInput && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.5rem" }}>
          <input
            autoFocus
            placeholder="Scenario name…"
            value={saveName}
            onChange={e => setSaveName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") { setShowInput(false); onSaveComplete(); } }}
            style={{
              padding: "0.5rem 0.6rem",
              ...MONO,
              fontSize: "0.72rem",
              background: "transparent",
              border: "1px solid var(--dim)",
              color: "var(--ink)",
              outline: "none",
            }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
            <button
              onClick={handleSave}
              disabled={saving || !saveName.trim()}
              style={{
                padding: "0.4rem",
                ...MONO,
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                opacity: saving || !saveName.trim() ? 0.5 : 1,
              }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => { setShowInput(false); onSaveComplete(); }}
              style={{
                padding: "0.4rem",
                ...MONO,
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "transparent",
                color: "var(--muted)",
                border: "1px solid var(--dim)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
