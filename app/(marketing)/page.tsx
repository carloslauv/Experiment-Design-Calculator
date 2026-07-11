import Link from "next/link";
import NumberLineGauge from "@/components/NumberLineGauge";

export default function LandingPage() {
  return (
    <>
      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <header style={{ borderBottom: "1px solid var(--dim)" }}>
        <nav
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 58,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.82rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            Clearcut
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
            <Link
              href="#how"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
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
          padding: "5.5rem 0 5rem",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 2.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "1.5rem",
              }}
            >
              Experiment design · Sample sizing · Readout
            </p>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.8rem, 5.5vw, 4.6rem)",
                fontWeight: "normal",
                fontStyle: "italic",
                lineHeight: 1.05,
                marginBottom: "0.75rem",
              }}
            >
              Signal
              <br />
              through noise.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.88rem",
                color: "var(--muted)",
                marginBottom: "1.75rem",
                letterSpacing: "0.02em",
              }}
            >
              n &nbsp;≈&nbsp; 2σ²(z
              <sub>α/2</sub> + z<sub>β</sub>)² / Δ²
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.05rem",
                lineHeight: 1.75,
                maxWidth: "44ch",
                opacity: 0.82,
                marginBottom: "2.5rem",
              }}
            >
              Size your A/B test correctly before you start. Know when it
              finishes. Read the confidence interval right — not just whether
              p&nbsp;&lt;&nbsp;0.05.
            </p>
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <Link href="/login" className="btn btn-fill">
                Get started
              </Link>
              <Link href="#how" className="btn btn-ghost">
                See how it works
              </Link>
            </div>
          </div>
          <div>
            <div
              className="card"
              style={{
                padding: "2rem 1.75rem 1.75rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "1.25rem",
                }}
              >
                Confidence interval vs. zero
              </p>
              <NumberLineGauge ciLow={0.008} ciHigh={0.032} significant={true} />
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
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.66rem",
                    letterSpacing: "0.05em",
                    color: "var(--muted)",
                  }}
                >
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      background: "#2F7D55",
                      flexShrink: 0,
                    }}
                  />
                  CI clears zero → signal
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.66rem",
                    letterSpacing: "0.05em",
                    color: "var(--muted)",
                  }}
                >
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      background: "#BC4A2C",
                      flexShrink: 0,
                    }}
                  />
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
        style={{
          borderBottom: "1px solid var(--dim)",
          padding: "4.5rem 0",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.66rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "2.75rem",
            }}
          >
            The questions every PM can&rsquo;t answer before they start
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
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
                style={{
                  borderTop: "2.5px solid var(--accent)",
                  padding: "1.75rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.1rem",
                    fontStyle: "italic",
                    lineHeight: 1.35,
                    marginBottom: "0.875rem",
                    fontWeight: "normal",
                  }}
                >
                  {q}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    lineHeight: 1.7,
                    color: "var(--muted)",
                  }}
                >
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
        style={{
          borderBottom: "1px solid var(--dim)",
          padding: "4.5rem 0",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.66rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "2.75rem",
            }}
          >
            How it works
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2.5rem",
            }}
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
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.66rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {tag}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.05rem",
                    fontWeight: "normal",
                    marginBottom: "0.625rem",
                    lineHeight: 1.3,
                  }}
                >
                  {h}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.88rem",
                    lineHeight: 1.7,
                    color: "var(--muted)",
                  }}
                >
                  {p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid var(--dim)",
          padding: "4.5rem 0",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.66rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "2.75rem",
            }}
          >
            Who it&rsquo;s for
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
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
                p: "At 1,000–50,000 accounts, many experiments are underpowered. Clearcut tells you when that's the case — and what to run instead.",
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
                style={{
                  border: "1px solid var(--dim)",
                  padding: "1.75rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.66rem",
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
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.05rem",
                    fontWeight: "normal",
                    marginBottom: "0.6rem",
                    lineHeight: 1.3,
                  }}
                >
                  {h}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.86rem",
                    lineHeight: 1.65,
                    color: "var(--muted)",
                    marginBottom: "1rem",
                  }}
                >
                  {p}
                </p>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.06em",
                    padding: "0.25rem 0.6rem",
                    border: "1px solid var(--dim)",
                    color: "var(--muted)",
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
            padding: "0 2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.06em",
              color: "var(--muted)",
            }}
          >
            © 2025 Clearcut
          </p>
          <nav style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Contact"].map((label) => (
              <Link
                key={label}
                href="#"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  color: "var(--muted)",
                  textDecoration: "none",
                }}
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
