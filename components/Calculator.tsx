"use client";

import { useState, useMemo, useCallback } from "react";
import NumberLineGauge from "./NumberLineGauge";
import {
  calculateSampleSize,
  calculateReadout,
  estimateDuration,
} from "@/lib/stats";
import type { ScenarioInputs } from "@/lib/actions/scenarios";

type Mode = "plan" | "readout";

export type { ScenarioInputs };

interface Context {
  id: string;
  label: string;
  description: string;
  baselineRate: string;
  mde: string;
  power: string;
}

const CONTEXTS: Context[] = [
  { id: "conversion",   label: "Conversion",   description: "Signup, purchase, checkout",      baselineRate: "3",  mde: "15", power: "80" },
  { id: "ctr",          label: "Click-through", description: "CTA, link, email click",          baselineRate: "8",  mde: "10", power: "80" },
  { id: "engagement",   label: "Engagement",    description: "Feature adoption, session depth", baselineRate: "20", mde: "8",  power: "80" },
  { id: "activation",   label: "Activation",    description: "Onboarding, setup completion",    baselineRate: "40", mde: "5",  power: "80" },
  { id: "retention",    label: "Retention",     description: "D7 / D30 return rate",            baselineRate: "25", mde: "8",  power: "80" },
];

const FIELD: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  fontFamily: "var(--font-mono)",
  fontSize: "0.88rem",
  background: "transparent",
  border: "1px solid var(--dim)",
  color: "var(--ink)",
  outline: "none",
  borderRadius: 0,
};

const LABEL: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: "0.6rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: "0.4rem",
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <label style={LABEL}>{label}</label>
      {children}
      {hint && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.58rem",
            color: "var(--muted)",
            marginTop: "0.3rem",
            opacity: 0.7,
          }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        border: `1px solid ${highlight ? "var(--accent)" : "var(--dim)"}`,
        boxShadow: highlight ? "3px 3px 0 var(--accent)" : "3px 3px 0 var(--dim)",
        background: "var(--paper)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.58rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "0.35rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "1.4rem",
          fontVariantNumeric: "tabular-nums",
          color: highlight ? "var(--accent)" : "var(--ink)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            color: "var(--muted)",
            marginTop: "0.3rem",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

interface CalcProps {
  onSave?: (inputs: ScenarioInputs) => void;
  loadInputs?: ScenarioInputs | null;
}

export default function Calculator({ onSave, loadInputs }: CalcProps = {}) {
  const [mode, setMode] = useState<Mode>(loadInputs?.mode ?? "plan");
  const [contextId, setContextId] = useState<string | null>(null);

  // Plan mode inputs
  const [baselineRate, setBaselineRate] = useState(loadInputs?.baselineRate ?? "5");
  const [mde, setMde] = useState(loadInputs?.mde ?? "10");
  const [power, setPower] = useState(loadInputs?.power ?? "80");
  const [alpha, setAlpha] = useState(loadInputs?.alpha ?? "95");
  const [variants, setVariants] = useState(loadInputs?.variants ?? "1");
  const [dailyVisitors, setDailyVisitors] = useState(loadInputs?.dailyVisitors ?? "1000");

  function applyContext(ctx: Context) {
    setContextId(ctx.id);
    setBaselineRate(ctx.baselineRate);
    setMde(ctx.mde);
    setPower(ctx.power);
  }

  // Readout mode inputs
  const [ctrlUsers, setCtrlUsers] = useState(loadInputs?.ctrlUsers ?? "5000");
  const [ctrlConv, setCtrlConv] = useState(loadInputs?.ctrlConv ?? "250");
  const [varUsers, setVarUsers] = useState(loadInputs?.varUsers ?? "5000");
  const [varConv, setVarConv] = useState(loadInputs?.varConv ?? "310");

  const currentInputs = useCallback((): ScenarioInputs => ({
    mode, baselineRate, mde, power, alpha, variants, dailyVisitors,
    ctrlUsers, ctrlConv, varUsers, varConv,
  }), [mode, baselineRate, mde, power, alpha, variants, dailyVisitors, ctrlUsers, ctrlConv, varUsers, varConv]);

  const planResult = useMemo(() => {
    const b = parseFloat(baselineRate) / 100;
    const m = parseFloat(mde) / 100;
    const pw = parseFloat(power) / 100;
    const al = 1 - parseFloat(alpha) / 100;
    const v = parseInt(variants) || 1;
    const dv = parseInt(dailyVisitors) || 0;
    if (isNaN(b) || isNaN(m) || b <= 0 || b >= 1 || m <= 0) return null;
    const r = calculateSampleSize({ baselineRate: b, mde: m, alpha: al, power: pw, variants: v });
    const days = estimateDuration(r.totalSample, dv, v);
    return { ...r, days, dailyVisitors: dv };
  }, [baselineRate, mde, power, alpha, variants, dailyVisitors]);

  const readoutResult = useMemo(() => {
    const cu = parseInt(ctrlUsers);
    const cc = parseInt(ctrlConv);
    const vu = parseInt(varUsers);
    const vc = parseInt(varConv);
    const al = 1 - parseFloat(alpha) / 100;
    if ([cu, cc, vu, vc].some(n => isNaN(n) || n <= 0)) return null;
    if (cc > cu || vc > vu) return null;
    return calculateReadout({ controlUsers: cu, controlConversions: cc, variantUsers: vu, variantConversions: vc, alpha: al });
  }, [ctrlUsers, ctrlConv, varUsers, varConv, alpha]);

  const fmt = (n: number) => n.toLocaleString();
  const pct = (n: number, d = 1) => (n * 100).toFixed(d) + "%";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px, 360px) 1fr",
        gap: "2rem",
        alignItems: "start",
      }}
    >
      {/* ── LEFT: inputs ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Mode toggle */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            border: "1px solid var(--dim)",
          }}
        >
          {(["plan", "readout"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: "0.55rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: mode === m ? "var(--accent)" : "transparent",
                color: mode === m ? "#fff" : "var(--muted)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {m === "plan" ? "Plan" : "Readout"}
            </button>
          ))}
        </div>

        {/* Shared: confidence + power */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Field label="Confidence" hint="1 − α">
              <select
                value={alpha}
                onChange={e => setAlpha(e.target.value)}
                style={{ ...FIELD }}
              >
                <option value="90">90%</option>
                <option value="95">95%</option>
                <option value="99">99%</option>
              </select>
            </Field>
            <Field label="Power" hint="1 − β">
              <select
                value={power}
                onChange={e => setPower(e.target.value)}
                style={{ ...FIELD }}
              >
                <option value="70">70%</option>
                <option value="80">80%</option>
                <option value="90">90%</option>
                <option value="95">95%</option>
              </select>
            </Field>
          </div>
        </div>

        {mode === "plan" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Context selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}>
                Experiment type
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {CONTEXTS.map(ctx => (
                  <button
                    key={ctx.id}
                    onClick={() => applyContext(ctx)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem 0.75rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      background: contextId === ctx.id ? "var(--accent)" : "transparent",
                      color: contextId === ctx.id ? "#fff" : "var(--ink)",
                      border: `1px solid ${contextId === ctx.id ? "var(--accent)" : "var(--dim)"}`,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontWeight: contextId === ctx.id ? 500 : 400 }}>{ctx.label}</span>
                    <span style={{
                      fontSize: "0.58rem",
                      color: contextId === ctx.id ? "rgba(255,255,255,0.7)" : "var(--muted)",
                      letterSpacing: "0.04em",
                    }}>
                      {ctx.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Field label="Baseline conversion rate" hint="Your current rate before the test">
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  min="0.01"
                  max="99.99"
                  step="0.1"
                  value={baselineRate}
                  onChange={e => { setBaselineRate(e.target.value); setContextId(null); }}
                  style={{ ...FIELD, paddingRight: "2rem" }}
                />
                <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>%</span>
              </div>
            </Field>

            <Field label="Minimum detectable effect" hint="Smallest relative lift worth detecting">
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  min="0.1"
                  max="500"
                  step="0.5"
                  value={mde}
                  onChange={e => { setMde(e.target.value); setContextId(null); }}
                  style={{ ...FIELD, paddingRight: "2rem" }}
                />
                <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>%</span>
              </div>
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Field label="Variants" hint="Excl. control">
                <select value={variants} onChange={e => setVariants(e.target.value)} style={{ ...FIELD }}>
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Daily visitors" hint="Across all arms">
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={dailyVisitors}
                  onChange={e => setDailyVisitors(e.target.value)}
                  style={{ ...FIELD }}
                />
              </Field>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Field label="Control visitors">
                <input type="number" min="1" value={ctrlUsers} onChange={e => setCtrlUsers(e.target.value)} style={{ ...FIELD }} />
              </Field>
              <Field label="Control conversions">
                <input type="number" min="0" value={ctrlConv} onChange={e => setCtrlConv(e.target.value)} style={{ ...FIELD }} />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Field label="Variant visitors">
                <input type="number" min="1" value={varUsers} onChange={e => setVarUsers(e.target.value)} style={{ ...FIELD }} />
              </Field>
              <Field label="Variant conversions">
                <input type="number" min="0" value={varConv} onChange={e => setVarConv(e.target.value)} style={{ ...FIELD }} />
              </Field>
            </div>
          </div>
        )}

        {/* Save button */}
        {onSave && (
          <button
            onClick={() => onSave(currentInputs())}
            style={{
              padding: "0.6rem 0.75rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Save scenario
          </button>
        )}
      </div>

      {/* ── RIGHT: results ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {mode === "plan" && planResult && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              <StatBox
                label="Per variant"
                value={fmt(planResult.samplePerVariant)}
                sub="users required"
                highlight
              />
              <StatBox
                label="Total sample"
                value={fmt(planResult.totalSample)}
                sub={`${parseInt(variants) + 1} arms`}
              />
              <StatBox
                label="Est. duration"
                value={planResult.dailyVisitors > 0 && isFinite(planResult.days) ? `${planResult.days}d` : "—"}
                sub={planResult.dailyVisitors > 0 ? `at ${fmt(planResult.dailyVisitors)}/day` : "enter traffic"}
              />
            </div>

            <div
              style={{
                border: "1px solid var(--dim)",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.25rem",
                }}
              >
                Test parameters
              </div>
              {[
                ["Baseline rate", pct(parseFloat(baselineRate) / 100)],
                ["Treatment rate", pct(planResult.treatmentRate)],
                ["Absolute MDE", "+" + pct(planResult.absoluteMde, 2)],
                ["z α/2", planResult.zAlpha.toFixed(3)],
                ["z β", planResult.zBeta.toFixed(3)],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    borderBottom: "1px solid var(--dim)",
                    paddingBottom: "0.35rem",
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>{k}</span>
                  <span style={{ color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {mode === "readout" && readoutResult && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              <StatBox
                label="Relative lift"
                value={(readoutResult.relativeLift >= 0 ? "+" : "") + pct(readoutResult.relativeLift)}
                sub={`${pct(readoutResult.controlRate)} → ${pct(readoutResult.variantRate)}`}
                highlight={readoutResult.significant}
              />
              <StatBox
                label="p-value"
                value={readoutResult.pValue < 0.001 ? "<0.001" : readoutResult.pValue.toFixed(3)}
                sub={readoutResult.significant ? "significant ✓" : "not significant"}
              />
              <StatBox
                label="z-score"
                value={readoutResult.zScore.toFixed(2)}
                sub={`${alpha}% confidence`}
              />
            </div>

            <div style={{ border: "1px solid var(--dim)", padding: "1.25rem" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "1rem",
                }}
              >
                {alpha}% confidence interval — absolute lift
              </div>
              <NumberLineGauge
                ciLow={readoutResult.ciLow}
                ciHigh={readoutResult.ciHigh}
                significant={readoutResult.significant}
              />
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  background: readoutResult.significant ? "var(--signal)" + "14" : "var(--noise)" + "14",
                  border: `1px solid ${readoutResult.significant ? "var(--signal)" : "var(--noise)"}`,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: readoutResult.significant ? "var(--signal)" : "var(--noise)",
                  letterSpacing: "0.04em",
                }}
              >
                {readoutResult.significant
                  ? `✓ Statistically significant at α=${(1 - parseFloat(alpha) / 100).toFixed(2)}. The CI clears zero — the effect is real.`
                  : `✗ Not significant. The CI crosses zero — cannot rule out noise.`}
              </div>
            </div>
          </>
        )}

        {mode === "plan" && !planResult && (
          <div style={{ padding: "2rem", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
            Enter valid inputs to see results.
          </div>
        )}
        {mode === "readout" && !readoutResult && (
          <div style={{ padding: "2rem", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
            Enter observed counts to see the readout.
          </div>
        )}
      </div>
    </div>
  );
}
