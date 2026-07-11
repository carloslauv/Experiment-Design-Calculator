import Link from "next/link";

export const metadata = { title: "How experiments work — Experiment Builder" };

const STEP_NUM: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.6rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--accent)",
  marginBottom: "0.5rem",
};

const STEP_TITLE: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.35rem",
  fontWeight: "normal",
  fontStyle: "italic",
  color: "var(--ink)",
  marginBottom: "0.75rem",
  lineHeight: 1.2,
};

const BODY: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1rem",
  lineHeight: 1.75,
  color: "var(--ink)",
};

const MUTED: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "0.9rem",
  lineHeight: 1.7,
  color: "var(--muted)",
};

const CALLOUT: React.CSSProperties = {
  padding: "1rem 1.25rem",
  border: "1px solid var(--dim)",
  fontFamily: "var(--font-mono)",
  fontSize: "0.75rem",
  lineHeight: 1.7,
  color: "var(--ink)",
  background: "var(--paper)",
};

const RULE: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid var(--dim)",
  margin: "2.5rem 0",
};

function Term({ word, def }: { word: string; def: string }) {
  return (
    <div style={{ display: "flex", gap: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--dim)" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent)", minWidth: 120, paddingTop: "0.15rem" }}>{word}</span>
      <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.92rem", lineHeight: 1.6, color: "var(--ink)" }}>{def}</span>
    </div>
  );
}

export default function GuidePage() {
  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh", padding: "3rem 2rem 6rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <Link href="/" style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent)", textDecoration: "none" }}>
            ← Experiment Builder
          </Link>
          <Link href="/app" style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", border: "1px solid var(--dim)", padding: "0.4rem 0.7rem" }}>
            Open calculator →
          </Link>
        </div>

        {/* Hero */}
        <p style={{ ...STEP_NUM, marginBottom: "0.75rem" }}>Field guide</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: "normal", fontStyle: "italic", lineHeight: 1.1, marginBottom: "1.25rem" }}>
          How to run a real A/B experiment
        </h1>
        <p style={{ ...BODY, color: "var(--muted)", marginBottom: "0.5rem" }}>
          No jargon. No PhD required. If you can count visitors and conversions, you can run an experiment that actually means something.
        </p>

        <hr style={RULE} />

        {/* ── STEP 1 ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={STEP_NUM}>Step 1</p>
          <h2 style={STEP_TITLE}>Pick one thing to change, one thing to measure.</h2>
          <p style={BODY}>
            An experiment tests exactly one question: <em>"Does changing X increase Y?"</em>
          </p>
          <p style={{ ...BODY, marginTop: "0.75rem" }}>
            Good: "Does the new checkout button color increase purchases?"<br />
            Bad: "Does the new redesign improve the product?"
          </p>
          <p style={{ ...BODY, marginTop: "0.75rem" }}>
            The more things you change at once, the less you know. Keep it surgical.
          </p>
          <div style={{ ...CALLOUT, marginTop: "1.25rem" }}>
            <strong>Your metric</strong> is a rate — a percentage.<br />
            e.g. "5% of visitors who land on the pricing page buy something."<br />
            That 5% is your <em>baseline conversion rate</em>.
          </div>
        </div>

        <hr style={RULE} />

        {/* ── STEP 2 ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={STEP_NUM}>Step 2</p>
          <h2 style={STEP_TITLE}>Decide the smallest win that's worth caring about.</h2>
          <p style={BODY}>
            Not every improvement is worth shipping. A 0.01% lift on a low-traffic page might mean one extra sale per year. Who cares?
          </p>
          <p style={{ ...BODY, marginTop: "0.75rem" }}>
            Ask yourself: <em>"If the new version is only X% better, would we still ship it?"</em>
            That X is your <strong>Minimum Detectable Effect (MDE)</strong>.
          </p>
          <div style={{ ...CALLOUT, marginTop: "1.25rem" }}>
            <strong>Rule of thumb by experiment type:</strong><br /><br />
            Conversion (buy, sign up) → aim to detect a <strong>15–20% relative lift</strong><br />
            e.g. baseline 5% × 1.15 = 5.75% new rate<br /><br />
            Click-through (buttons, links) → <strong>10% relative lift</strong><br /><br />
            Retention (come back next week) → <strong>5–8% relative lift</strong><br /><br />
            <span style={{ color: "var(--muted)" }}>Relative means: how much bigger is the new rate vs. the old one, as a percentage of the old one.</span>
          </div>
          <p style={{ ...MUTED, marginTop: "1rem" }}>
            Counterintuitive truth: a smaller MDE (trying to detect a tiny improvement) requires a <em>much</em> larger sample. Chasing a 1% lift takes roughly 225× more users than chasing a 15% lift. Pick the smallest effect that actually moves a business needle, not the smallest effect that could theoretically exist.
          </p>
        </div>

        <hr style={RULE} />

        {/* ── STEP 3 ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={STEP_NUM}>Step 3</p>
          <h2 style={STEP_TITLE}>Calculate how many people you need — before you start.</h2>
          <p style={BODY}>
            This is the whole point of the <Link href="/app" style={{ color: "var(--accent)" }}>calculator</Link>. Plug in:
          </p>
          <ul style={{ ...BODY, paddingLeft: "1.5rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <li><strong>Baseline rate</strong> — what's your current conversion?</li>
            <li><strong>MDE</strong> — the minimum lift you'd ship (from Step 2)</li>
            <li><strong>Confidence (95%)</strong> — how sure you want to be it's not random noise</li>
            <li><strong>Power (80%)</strong> — how likely you are to catch a real effect if one exists</li>
          </ul>
          <p style={{ ...BODY, marginTop: "0.75rem" }}>
            The calculator tells you: <em>"You need 31,231 people in each arm."</em>
          </p>
          <p style={{ ...BODY, marginTop: "0.75rem" }}>
            Divide by your daily traffic to get how many days to run the test.
          </p>
          <div style={{ ...CALLOUT, marginTop: "1.25rem" }}>
            <strong>Don't have 31k users?</strong><br />
            Raise your MDE (accept only catching a bigger lift), or lower your confidence to 90%. Both reduce the required sample. Or wait — sometimes the honest answer is "we don't have enough traffic to run this test yet."
          </div>
        </div>

        <hr style={RULE} />

        {/* ── STEP 4 ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={STEP_NUM}>Step 4</p>
          <h2 style={STEP_TITLE}>Run it. Don't peek early.</h2>
          <p style={BODY}>
            Split your traffic randomly — 50% see the control (old version), 50% see the variant (new version). Run until you hit your required sample size. Then stop.
          </p>
          <p style={{ ...BODY, marginTop: "0.75rem" }}>
            The most common mistake in A/B testing is <strong>peeking</strong> — checking the result early and stopping when it looks good. If you do that, your 95% confidence is a lie. You're much more likely to be fooled by random noise.
          </p>
          <div style={{ ...CALLOUT, marginTop: "1.25rem" }}>
            <strong>The peeking problem:</strong> imagine flipping a fair coin. After 6 flips you get 4 heads — looks like it's biased! But flip 100 times and it evens out. The same thing happens with A/B tests. Early data looks decisive. It almost never is.
          </div>
          <p style={{ ...MUTED, marginTop: "1rem" }}>
            Practical tips: run for at least 1 full week (captures Mon–Sun behavior differences). Avoid running over holidays or major external events that could skew behavior.
          </p>
        </div>

        <hr style={RULE} />

        {/* ── STEP 5 ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={STEP_NUM}>Step 5</p>
          <h2 style={STEP_TITLE}>Read the result. Two outcomes only.</h2>
          <p style={BODY}>
            Once you hit your sample size, go to the <strong>Readout</strong> tab. Enter the counts. The calculator gives you:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.25rem" }}>
            <div style={{ ...CALLOUT, borderColor: "var(--signal)", color: "var(--signal)" }}>
              <strong>✓ Significant</strong> — the CI (confidence interval) doesn't cross zero.<br />
              <span style={{ color: "var(--ink)", fontFamily: "var(--font-serif)", fontSize: "0.85rem" }}>
                This means: if there were truly no effect, you'd see a result this extreme less than 5% of the time. That's good enough to act on. Ship the variant.
              </span>
            </div>
            <div style={{ ...CALLOUT, borderColor: "var(--noise)", color: "var(--noise)" }}>
              <strong>✗ Not significant</strong> — the CI crosses zero.<br />
              <span style={{ color: "var(--ink)", fontFamily: "var(--font-serif)", fontSize: "0.85rem" }}>
                This means: the data is consistent with there being no real effect. <em>Don't ship.</em> This is also a valid result — you just saved yourself from shipping something that doesn't work.
              </span>
            </div>
          </div>

          <p style={{ ...MUTED, marginTop: "1.25rem" }}>
            A p-value of 0.04 doesn't mean "the variant is 96% better." It means "if the true effect were zero, there's only a 4% chance we'd see data this extreme." Subtle but important. Don't over-interpret the number.
          </p>
        </div>

        <hr style={RULE} />

        {/* ── Glossary ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={STEP_NUM}>Glossary</p>
          <h2 style={STEP_TITLE}>Plain-English definitions.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Term word="Baseline rate" def="The conversion rate your control group gets today. e.g. 5% of visitors click Buy." />
            <Term word="MDE" def="Minimum Detectable Effect. The smallest relative improvement you care about detecting. If your baseline is 5% and MDE is 10%, you're trying to detect a lift to 5.5%." />
            <Term word="Confidence (α)" def="How willing you are to be wrong when you declare a winner. 95% confidence means you accept a 1-in-20 chance of a false positive." />
            <Term word="Power (β)" def="How likely you are to catch a real effect when it exists. 80% power means if the variant truly is better, you'll detect it 4 times out of 5. The other time you'll miss it." />
            <Term word="p-value" def="The probability of seeing your observed result (or something more extreme) if the null hypothesis were true — i.e., if there were actually no effect." />
            <Term word="Confidence interval" def="A range that, under repeated experiments, would contain the true effect 95% of the time. If it doesn't cross zero, the effect is statistically significant." />
            <Term word="Control" def="The unchanged version — what users experience today." />
            <Term word="Variant" def="The changed version you're testing against the control." />
            <Term word="Sample size" def="How many users each arm (control and each variant) needs before you can trust the result." />
            <Term word="Statistical significance" def="A threshold — not a measure of importance. Significant just means 'unlikely to be noise.' A tiny, unimportant effect can be significant with enough data." />
          </div>
        </div>

        <hr style={RULE} />

        {/* CTA */}
        <div style={{ textAlign: "center", paddingTop: "1rem" }}>
          <p style={{ ...MUTED, marginBottom: "1.5rem" }}>
            Ready to plan your experiment?
          </p>
          <Link
            href="/app"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              borderRadius: "7px",
              background: "var(--accent)",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Open the calculator →
          </Link>
          <p style={{ marginTop: "2rem", fontSize: "0.72rem", color: "var(--faint, #94a3c0)" }}>
            Built by{" "}
            <Link
              href="https://www.linkedin.com/in/carloslau"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
            >
              Carlos Lau
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
