import Link from "next/link";
import NumberLineGauge from "@/components/NumberLineGauge";

const LABEL: React.CSSProperties = {
  fontSize: "0.68rem",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--faint, #94a3c0)",
  marginBottom: "0.75rem",
};

export default function LandingPage() {
  return (
    <>
      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <header style={{ borderBottom: "1px solid var(--dim)", background: "var(--paper)" }}>
        <nav
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
          }}
        >
          <span
            style={{
              fontSize: "0.95rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--accent)",
            }}
          >
            Experiment Builder
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
            <Link
              href="#how"
              style={{
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "var(--muted)",
                textDecoration: "none",
              }}
            >
              How it works
            </Link>
            <Link href="/login" className="btn btn-fill">
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid var(--dim)",
          padding: "5rem 0",
          background: "var(--surface, #f4f7ff)",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 2rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          <div>
            <p style={LABEL}>Experiment design · Sample sizing · Readout</p>
            <h1
              style={{
                fontSize: "clamp(2.6rem, 5vw, 4.2rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                marginBottom: "0.6rem",
                color: "var(--ink)",
                textWrap: "balance",
              } as React.CSSProperties}
            >
              Signal<br />through noise.
            </h1>
            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.85rem",
                color: "var(--muted)",
                marginBottom: "1.5rem",
                letterSpacing: "0.02em",
              }}
            >
              n &nbsp;≈&nbsp; 2σ²(z<sub>α/2</sub> + z<sub>β</sub>)² / Δ²
            </p>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                maxWidth: "44ch",
                color: "var(--muted)",
                marginBottom: "2.25rem",
              }}
            >
              Size your A/B test correctly before you start. Know when it
              finishes. Read the confidence interval right — not just whether
              p&nbsp;&lt;&nbsp;0.05.
            </p>
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/login" className="btn btn-fill">
                Get started
              </Link>
              <Link href="#how" className="btn btn-ghost">
                See how it works
              </Link>
            </div>
            <p style={{ marginTop: "1.75rem", fontSize: "0.72rem", color: "var(--faint, #94a3c0)" }}>
              Built by{" "}
              <Link
                href="https://www.linkedin.com/in/carloslauv/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
              >
                Carlos Lau
              </Link>
            </p>
          </div>
          <div>
            <div
              className="card"
              style={{ padding: "1.75rem" }}
            >
              <p style={{ ...LABEL, marginBottom: "1.25rem" }}>
                Confidence interval vs. zero
              </p>
              <NumberLineGauge ciLow={0.008} ciHigh={0.032} significant={true} positive={true} />
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  marginTop: "1.25rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.68rem",
                    color: "var(--muted)",
                  }}
                >
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--mint, #75fbc5)", flexShrink: 0 }} />
                  CI clears zero → signal
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.68rem",
                    color: "var(--muted)",
                  }}
                >
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--noise)", flexShrink: 0 }} />
                  CI straddles zero → mirage
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem ──────────────────────────────────────────────────── */}
      <section
        id="problem"
        style={{ borderBottom: "1px solid var(--dim)", padding: "4.5rem 0" }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <p style={LABEL}>The questions every PM can&rsquo;t answer before they start</p>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}
            className="responsive-grid-3"
          >
            {[
              {
                q: "How many users do I actually need?",
                a: "Most guesses are off by 2–5×. Too few users means you can't detect real effects. Too many means you ran for months for no reason.",
              },
              {
                q: "How long until I have enough data to decide?",
                a: "Sample size ÷ daily traffic — floored at two full weekly cycles to avoid day-of-week bias. If the answer is six months, know before you start.",
              },
              {
                q: "Did the treatment work, or did I get lucky?",
                a: "If the confidence interval clears zero entirely, you have signal. If it straddles zero, you're reading noise. A p-value alone won't tell you.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="card"
                style={{ borderTop: "2.5px solid var(--accent)", padding: "1.5rem" }}
              >
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    lineHeight: 1.35,
                    marginBottom: "0.75rem",
                    color: "var(--ink)",
                  }}
                >
                  {q}
                </p>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--muted)" }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section
        id="how"
        style={{ borderBottom: "1px solid var(--dim)", padding: "4.5rem 0", background: "var(--surface, #f4f7ff)" }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <p style={LABEL}>How it works</p>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2.5rem" }}
            className="responsive-grid-3"
          >
            {[
              {
                tag: "First",
                h: "Pick your business model",
                p: "B2C, SaaS, enterprise, marketplace — each loads statistically-informed defaults for your traffic tier, typical variability, and randomization unit. Every default shows its rationale.",
              },
              {
                tag: "Then",
                h: "Set the lift you care about",
                p: "Enter the minimum effect worth shipping. σ, baseline, and randomization unit are pre-filled and overridable. The formula is shown, not hidden behind the result.",
              },
              {
                tag: "Result",
                h: "A verdict, not just a number",
                p: "Sample size, runtime, and a feasibility verdict. Green if you can run a clean A/B. Amber if it's tight. Red if your population is too small — with honest alternatives.",
              },
            ].map(({ tag, h, p }) => (
              <div key={h}>
                <p
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {tag}
                </p>
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    marginBottom: "0.625rem",
                    lineHeight: 1.3,
                    color: "var(--ink)",
                  }}
                >
                  {h}
                </h3>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "var(--muted)" }}>
                  {p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid var(--dim)", padding: "4.5rem 0" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <p style={LABEL}>Who it&rsquo;s for</p>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}
            className="responsive-grid-3"
          >
            {[
              {
                tag: "B2C growth teams",
                h: "Large traffic. Clean A/B.",
                p: "Size the test fast, check feasibility in under a minute, and focus on reading the confidence interval correctly — not just whether p < 0.05.",
                animal: "Flies · Mice",
              },
              {
                tag: "SaaS & B2B teams",
                h: "Moderate traffic. Account-level.",
                p: "At 1,000–50,000 accounts, many experiments are underpowered. The tool tells you when that's the case — and what to run instead.",
                animal: "Rabbits · Deer",
              },
              {
                tag: "Enterprise & founders",
                h: "Small N. Honest about it.",
                p: "If you have 200 enterprise accounts, a powered A/B usually isn't feasible. You need to hear that plainly, with the right alternative laid out.",
                animal: "Elephants",
              },
            ].map(({ tag, h, p, animal }) => (
              <div
                key={h}
                className="card"
                style={{ padding: "1.5rem" }}
              >
                <p
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {tag}
                </p>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    marginBottom: "0.6rem",
                    lineHeight: 1.3,
                    color: "var(--ink)",
                  }}
                >
                  {h}
                </h3>
                <p style={{ fontSize: "0.86rem", lineHeight: 1.65, color: "var(--muted)", marginBottom: "1rem" }}>
                  {p}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.68rem",
                    fontWeight: 500,
                    padding: "0.25rem 0.65rem",
                    borderRadius: "5px",
                    background: "var(--aqua, #e7edff)",
                    color: "var(--accent)",
                  }}
                >
                  {animal}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{ padding: "2rem 0" }}>
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent)" }}>
            Experiment Builder
          </p>
          <p style={{ fontSize: "0.72rem", color: "var(--faint, #94a3c0)" }}>
            Built by{" "}
            <Link
              href="https://www.linkedin.com/in/carloslauv/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
            >
              Carlos Lau
            </Link>
          </p>
          <nav style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Contact"].map((label) => (
              <Link
                key={label}
                href="#"
                style={{ fontSize: "0.72rem", color: "var(--muted)", textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .responsive-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
