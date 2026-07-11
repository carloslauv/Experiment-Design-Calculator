"use client";

import { useState, useMemo, useCallback } from "react";
import NumberLineGauge from "./NumberLineGauge";
import {
  calculateSampleSize,
  calculateReadout,
  estimateDuration,
  calculateMDE,
} from "@/lib/stats";
import type { ScenarioInputs } from "@/lib/actions/scenarios";
import { BUSINESS_MODELS, getModel } from "@/lib/businessModels";

export type { ScenarioInputs };

function JanzExplainer() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: "0.2rem" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          letterSpacing: "0.06em",
          color: "var(--accent)",
          textDecoration: "underline",
          textDecorationStyle: "dotted",
          textUnderlineOffset: "3px",
        }}
      >
        {open ? "▲ Hide" : "▼ What is this?"}
      </button>
      {open && (
        <div style={{
          marginTop: "0.75rem",
          padding: "1rem 1.1rem",
          borderLeft: "2px solid var(--dim)",
          fontFamily: "var(--font-serif)",
          fontSize: "0.82rem",
          color: "var(--ink)",
          lineHeight: 1.75,
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}>
          <p style={{ margin: 0 }}>
            <strong>The $100M business model framework</strong> by{" "}
            <a
              href="https://christophjanz.blogspot.com/2014/10/five-ways-to-build-100-million-business.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)" }}
            >
              Christoph Janz (2014)
            </a>{" "}
            shows that the path to $100M in annual revenue depends on the price you charge — which dictates how many customers you need.
          </p>
          <p style={{ margin: 0 }}>
            The math is simple:{" "}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", background: "var(--dim)", padding: "0.1rem 0.4rem" }}>
              Revenue = # customers × ARPA
            </span>{" "}
            where ARPA is average revenue per account per year. To reach $100M you can either sell to a few large customers or to many small ones — each path demands a completely different go-to-market and experimentation strategy.
          </p>
          <p style={{ margin: 0 }}>
            High-volume models (🪰 Flies, 🐭 Mice) have the traffic needed for rigorous A/B testing. Lower-volume models (🦌 Deer, 🐘 Elephants) serve too few accounts — the calculator will show you why, and suggest what to do instead.
          </p>
        </div>
      )}
    </div>
  );
}

export function inputsToParams(inputs: ScenarioInputs): URLSearchParams {
  const p = new URLSearchParams();
  p.set("m",   inputs.mode);
  p.set("bm",  inputs.businessModel);
  p.set("mid", inputs.metricId ?? "");
  p.set("b",   inputs.baselineRate);
  p.set("mde", inputs.mde);
  p.set("pw",  inputs.power);
  p.set("al",  inputs.alpha);
  p.set("v",   inputs.variants);
  p.set("dv",  inputs.dailyVisitors);
  p.set("cu",  inputs.ctrlUsers);
  p.set("cc",  inputs.ctrlConv);
  p.set("vu",  inputs.varUsers);
  p.set("vc",  inputs.varConv);
  return p;
}

export function paramsToInputs(p: URLSearchParams): Partial<ScenarioInputs> {
  return {
    mode:          (p.get("m") as "plan" | "readout") ?? undefined,
    businessModel: p.get("bm") ?? undefined,
    metricId:      p.get("mid") ?? null,
    baselineRate:  p.get("b")   ?? undefined,
    mde:           p.get("mde") ?? undefined,
    power:         p.get("pw")  ?? undefined,
    alpha:         p.get("al")  ?? undefined,
    variants:      p.get("v")   ?? undefined,
    dailyVisitors: p.get("dv")  ?? undefined,
    ctrlUsers:     p.get("cu")  ?? undefined,
    ctrlConv:      p.get("cc")  ?? undefined,
    varUsers:      p.get("vu")  ?? undefined,
    varConv:       p.get("vc")  ?? undefined,
  };
}

type Mode = "plan" | "readout";

// ── Shared styles ────────────────────────────────────────────────────────────

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
  fontSize: "0.68rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: "0.4rem",
};

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.62rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--muted)",
};

// ── Sub-components ───────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <label style={LABEL}>{label}</label>
      {children}
      {hint && (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--muted)", marginTop: "0.3rem", opacity: 0.7 }}>
          {hint}
        </span>
      )}
    </div>
  );
}

function StatBox({ label, value, sub, highlight, highlightColor }: {
  label: string; value: string; sub?: string; highlight?: boolean; highlightColor?: string;
}) {
  const color = highlight ? (highlightColor ?? "var(--accent)") : "var(--dim)";
  return (
    <div style={{ padding: "1rem 1.25rem", border: `1px solid ${highlight ? color : "var(--dim)"}`, boxShadow: `3px 3px 0 ${highlight ? color : "var(--dim)"}`, background: "var(--paper)" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.35rem" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.5rem", fontVariantNumeric: "tabular-nums", color: highlight ? color : "var(--ink)", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.3rem" }}>{sub}</div>}
    </div>
  );
}

function CopyLinkButton({ getInputs }: { getInputs: () => ScenarioInputs }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    const params = inputsToParams(getInputs());
    const url = `${window.location.origin}/share?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  return (
    <button onClick={handleCopy} style={{ padding: "0.6rem 0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", color: copied ? "var(--signal)" : "var(--muted)", border: "1px solid var(--dim)", cursor: "pointer", width: "100%", transition: "color 0.15s" }}>
      {copied ? "Link copied ✓" : "Copy shareable link"}
    </button>
  );
}

// ── Feasibility panel (Deer / Elephants) ────────────────────────────────────

function FeasibilityPanel({ baselineRate, alpha, power }: { baselineRate: string; alpha: string; power: string; }) {
  const [availableSample, setAvailableSample] = useState("100");

  const mdeResult = useMemo(() => {
    const n = parseInt(availableSample);
    const b = parseFloat(baselineRate) / 100;
    const al = 1 - parseFloat(alpha) / 100;
    const pw = parseFloat(power) / 100;
    if (isNaN(n) || n <= 0 || isNaN(b) || b <= 0) return null;
    const mde = calculateMDE(b, n, al, pw);
    return { mde, tooHigh: mde > 0.5 };
  }, [availableSample, baselineRate, alpha, power]);

  return (
    <div style={{ border: "1px solid var(--dim)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={SECTION_LABEL}>Feasibility check</div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.6 }}>
        How many users can you realistically reach per arm in this test?
      </p>
      <Field label="Available sample per arm">
        <input
          type="number" min="1" step="10"
          value={availableSample}
          onChange={e => setAvailableSample(e.target.value)}
          style={{ ...FIELD }}
        />
      </Field>
      {mdeResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{
            padding: "0.75rem 1rem",
            borderLeft: `3px solid ${mdeResult.tooHigh ? "var(--noise)" : "var(--signal)"}`,
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            lineHeight: 1.6,
            color: "var(--ink)",
          }}>
            <span style={{ color: mdeResult.tooHigh ? "var(--noise)" : "var(--signal)", fontWeight: 600 }}>
              {mdeResult.tooHigh ? "Not recommended." : "Feasible."}
            </span>
            {" "}With {availableSample} users per arm you can only detect a{" "}
            <strong>{(mdeResult.mde * 100).toFixed(0)}%+ relative lift</strong>.
            {mdeResult.tooHigh
              ? " At this effect size, you'd only catch massive changes — not practical for most experiments."
              : " That's a meaningful effect size worth detecting."}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Alternative methods panel ────────────────────────────────────────────────

function AlternativesPanel({ alternatives }: { alternatives: { title: string; description: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid var(--dim)" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", padding: "0.85rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}
      >
        <span>Alternative methods</span>
        <span style={{ fontSize: "0.8rem" }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {alternatives.map(a => (
            <div key={a.title} style={{ borderTop: "1px solid var(--dim)", paddingTop: "0.85rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)", marginBottom: "0.3rem" }}>{a.title}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", color: "var(--ink)", lineHeight: 1.65 }}>{a.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main calculator ──────────────────────────────────────────────────────────

interface CalcProps {
  onSave?: (inputs: ScenarioInputs) => void;
  loadInputs?: ScenarioInputs | null;
}

export default function Calculator({ onSave, loadInputs }: CalcProps = {}) {
  const [mode, setMode]               = useState<Mode>(loadInputs?.mode ?? "plan");
  const [businessModel, setBusinessModel] = useState(loadInputs?.businessModel ?? "flies");
  const [metricId, setMetricId]       = useState<string | null>(loadInputs?.metricId ?? null);

  const [baselineRate, setBaselineRate] = useState(loadInputs?.baselineRate ?? "5");
  const [mde, setMde]                 = useState(loadInputs?.mde ?? "10");
  const [power, setPower]             = useState(loadInputs?.power ?? "80");
  const [alpha, setAlpha]             = useState(loadInputs?.alpha ?? "95");
  const [variants, setVariants]       = useState(loadInputs?.variants ?? "1");
  const [dailyVisitors, setDailyVisitors] = useState(loadInputs?.dailyVisitors ?? "1000");

  const [ctrlUsers, setCtrlUsers]     = useState(loadInputs?.ctrlUsers ?? "5000");
  const [ctrlConv, setCtrlConv]       = useState(loadInputs?.ctrlConv ?? "250");
  const [varUsers, setVarUsers]       = useState(loadInputs?.varUsers ?? "5000");
  const [varConv, setVarConv]         = useState(loadInputs?.varConv ?? "310");

  const model = getModel(businessModel) ?? BUSINESS_MODELS[0];
  const isLowTraffic = model.trafficLevel === "low" || model.trafficLevel === "minimal";

  function applyMetric(mId: string) {
    const metric = model.metrics.find(m => m.id === mId);
    if (!metric) return;
    setMetricId(mId);
    setBaselineRate(metric.baselineRate);
    setMde(metric.mde);
    setPower(metric.power);
  }

  function applyModel(mId: string) {
    setBusinessModel(mId);
    setMetricId(null);
    const m = getModel(mId);
    if (m && m.metrics[0]) {
      const first = m.metrics[0];
      setBaselineRate(first.baselineRate);
      setMde(first.mde);
      setPower(first.power);
    }
  }

  const currentInputs = useCallback((): ScenarioInputs => ({
    mode, businessModel, metricId,
    baselineRate, mde, power, alpha, variants, dailyVisitors,
    ctrlUsers, ctrlConv, varUsers, varConv,
  }), [mode, businessModel, metricId, baselineRate, mde, power, alpha, variants, dailyVisitors, ctrlUsers, ctrlConv, varUsers, varConv]);

  const planResult = useMemo(() => {
    const b  = parseFloat(baselineRate) / 100;
    const m  = parseFloat(mde) / 100;
    const pw = parseFloat(power) / 100;
    const al = 1 - parseFloat(alpha) / 100;
    const v  = parseInt(variants) || 1;
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* ── Business model selector ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <span style={SECTION_LABEL}>Growth model <span style={{ opacity: 0.5, fontStyle: "italic", letterSpacing: 0, textTransform: "none" }}>— Janz (2014)</span></span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem" }}>
          {BUSINESS_MODELS.map(m => {
            const active = businessModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => applyModel(m.id)}
                style={{
                  padding: "0.75rem 0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.3rem",
                  border: `1px solid ${active ? "var(--accent)" : "var(--dim)"}`,
                  background: active ? "var(--accent)" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.1s",
                }}
              >
                <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{m.animal}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.06em", color: active ? "#fff" : "var(--ink)", fontWeight: active ? 600 : 400 }}>{m.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: active ? "rgba(255,255,255,0.7)" : "var(--muted)", letterSpacing: "0.04em" }}>{m.acv}</span>
              </button>
            );
          })}
        </div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5 }}>
          {model.tagline} · ~{model.customersNeeded} customers needed
        </div>
        <JanzExplainer />
      </div>

      {/* ── Traffic warning (Deer / Elephants) ── */}
      {model.feasibilityNote && (
        <div style={{
          padding: "0.75rem 1rem",
          borderLeft: `3px solid ${model.trafficLevel === "minimal" ? "var(--noise)" : "#B08000"}`,
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: "var(--ink)",
          lineHeight: 1.6,
          background: "transparent",
        }}>
          <span style={{ color: model.trafficLevel === "minimal" ? "var(--noise)" : "#B08000", fontWeight: 600 }}>
            {model.trafficLevel === "minimal" ? "⚠ Not recommended for A/B testing." : "⚠ Low traffic."}
          </span>{" "}
          {model.feasibilityNote}
        </div>
      )}

      {/* ── Two-column layout: inputs | results ── */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 360px) 1fr", gap: "2rem", alignItems: "start" }}>

        {/* LEFT: inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Mode toggle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid var(--dim)" }}>
            {(["plan", "readout"] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ padding: "0.55rem", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", background: mode === m ? "var(--accent)" : "transparent", color: mode === m ? "#fff" : "var(--muted)", border: "none", cursor: "pointer" }}>
                {m === "plan" ? "Plan" : "Readout"}
              </button>
            ))}
          </div>

          {/* Confidence + Power */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Field label="Confidence" hint="1 − α">
              <select value={alpha} onChange={e => setAlpha(e.target.value)} style={{ ...FIELD }}>
                <option value="90">90%</option>
                <option value="95">95%</option>
                <option value="99">99%</option>
              </select>
            </Field>
            <Field label="Power" hint="1 − β">
              <select value={power} onChange={e => setPower(e.target.value)} style={{ ...FIELD }}>
                <option value="70">70%</option>
                <option value="80">80%</option>
                <option value="90">90%</option>
                <option value="95">95%</option>
              </select>
            </Field>
          </div>

          {mode === "plan" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Metric selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <span style={SECTION_LABEL}>Metric to test</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {model.metrics.map(metric => {
                    const active = metricId === metric.id;
                    return (
                      <button
                        key={metric.id}
                        onClick={() => applyMetric(metric.id)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.68rem", background: active ? "var(--accent)" : "transparent", color: active ? "#fff" : "var(--ink)", border: `1px solid ${active ? "var(--accent)" : "var(--dim)"}`, cursor: "pointer", textAlign: "left" }}
                      >
                        <span style={{ fontWeight: active ? 500 : 400 }}>{metric.label}</span>
                        <span style={{ fontSize: "0.58rem", color: active ? "rgba(255,255,255,0.7)" : "var(--muted)", letterSpacing: "0.04em" }}>{metric.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Field label="Baseline rate" hint="Current rate for this metric">
                <div style={{ position: "relative" }}>
                  <input type="number" min="0.01" max="99.99" step="0.1" value={baselineRate}
                    onChange={e => { setBaselineRate(e.target.value); setMetricId(null); }}
                    style={{ ...FIELD, paddingRight: "2rem" }} />
                  <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>%</span>
                </div>
              </Field>

              <Field label="Minimum detectable effect" hint="Smallest relative lift worth shipping">
                <div style={{ position: "relative" }}>
                  <input type="number" min="0.1" max="500" step="0.5" value={mde}
                    onChange={e => { setMde(e.target.value); setMetricId(null); }}
                    style={{ ...FIELD, paddingRight: "2rem" }} />
                  <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>%</span>
                </div>
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <Field label="Variants" hint="Excl. control">
                  <select value={variants} onChange={e => setVariants(e.target.value)} style={{ ...FIELD }}>
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </Field>
                <Field label="Daily volume" hint={isLowTraffic ? "Emails, invites, etc." : "Visitors across all arms"}>
                  <input type="number" min="1" step="10" value={dailyVisitors}
                    onChange={e => setDailyVisitors(e.target.value)} style={{ ...FIELD }} />
                </Field>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <Field label="Control visitors"><input type="number" min="1" value={ctrlUsers} onChange={e => setCtrlUsers(e.target.value)} style={{ ...FIELD }} /></Field>
                <Field label="Control conversions"><input type="number" min="0" value={ctrlConv} onChange={e => setCtrlConv(e.target.value)} style={{ ...FIELD }} /></Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <Field label="Variant visitors"><input type="number" min="1" value={varUsers} onChange={e => setVarUsers(e.target.value)} style={{ ...FIELD }} /></Field>
                <Field label="Variant conversions"><input type="number" min="0" value={varConv} onChange={e => setVarConv(e.target.value)} style={{ ...FIELD }} /></Field>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {onSave && (
              <button onClick={() => onSave(currentInputs())} style={{ padding: "0.6rem 0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer", width: "100%" }}>
                Save scenario
              </button>
            )}
            <CopyLinkButton getInputs={currentInputs} />
          </div>
        </div>

        {/* RIGHT: results */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {mode === "plan" && planResult && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <StatBox label="Per variant" value={fmt(planResult.samplePerVariant)} sub="required" highlight />
                <StatBox label="Total sample" value={fmt(planResult.totalSample)} sub={`${parseInt(variants) + 1} arms`} />
                <StatBox
                  label="Est. duration"
                  value={planResult.dailyVisitors > 0 && isFinite(planResult.days) ? `${planResult.days}d` : "—"}
                  sub={planResult.dailyVisitors > 0 ? `at ${fmt(planResult.dailyVisitors)}/day` : "enter volume"}
                />
              </div>

              <div style={{ border: "1px solid var(--dim)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.25rem" }}>
                  Test parameters
                </div>
                {[
                  ["Baseline rate",    pct(parseFloat(baselineRate) / 100)],
                  ["Treatment rate",   pct(planResult.treatmentRate)],
                  ["Absolute MDE",     "+" + pct(planResult.absoluteMde, 2)],
                  ["z α/2",            planResult.zAlpha.toFixed(3)],
                  ["z β",              planResult.zBeta.toFixed(3)],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.78rem", borderBottom: "1px solid var(--dim)", paddingBottom: "0.35rem" }}>
                    <span style={{ color: "var(--muted)" }}>{k}</span>
                    <span style={{ color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Feasibility check for low-traffic models */}
              {isLowTraffic && (
                <FeasibilityPanel baselineRate={baselineRate} alpha={alpha} power={power} />
              )}

              {/* Alternative methods for Deer / Elephants */}
              {model.alternatives && (
                <AlternativesPanel alternatives={model.alternatives} />
              )}
            </>
          )}

          {mode === "readout" && readoutResult && (() => {
            const win  = readoutResult.significant && readoutResult.relativeLift > 0;
            const lose = readoutResult.significant && readoutResult.relativeLift <= 0;
            const verdictColor = win ? "var(--signal)" : "var(--noise)";
            return (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  <StatBox label="Relative lift" value={(readoutResult.relativeLift >= 0 ? "+" : "") + pct(readoutResult.relativeLift)} sub={`${pct(readoutResult.controlRate)} → ${pct(readoutResult.variantRate)}`} highlight={readoutResult.significant} highlightColor={win ? "var(--signal)" : lose ? "var(--noise)" : undefined} />
                  <StatBox label="p-value" value={readoutResult.pValue < 0.001 ? "<0.001" : readoutResult.pValue.toFixed(3)} sub={readoutResult.significant ? (win ? "significant ✓" : "significant ✗") : "not significant"} />
                  <StatBox label="z-score" value={readoutResult.zScore.toFixed(2)} sub={`${alpha}% confidence`} />
                </div>
                <div style={{ border: "1px solid var(--dim)", padding: "1.25rem" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
                    {alpha}% confidence interval — absolute lift
                  </div>
                  <NumberLineGauge ciLow={readoutResult.ciLow} ciHigh={readoutResult.ciHigh} significant={readoutResult.significant} positive={win} />
                  <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderLeft: `3px solid ${verdictColor}`, fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--ink)", letterSpacing: "0.03em", lineHeight: 1.6 }}>
                    <span style={{ color: verdictColor, fontWeight: 600 }}>
                      {win ? "✓ Significant — variant wins." : lose ? "✗ Significant — variant loses." : "✗ Not significant."}
                    </span>
                    {win  ? ` CI clears zero at α=${(1 - parseFloat(alpha) / 100).toFixed(2)}. The lift is real.`
                          : lose ? ` CI clears zero at α=${(1 - parseFloat(alpha) / 100).toFixed(2)}. The regression is real — do not ship.`
                          : " The CI crosses zero — cannot rule out noise."}
                  </div>
                </div>
              </>
            );
          })()}

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
    </div>
  );
}
