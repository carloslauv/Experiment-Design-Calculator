import { auth } from "@/lib/auth";

export const metadata = { title: "Calculator — Clearcut" };

export default async function AppPage() {
  const session = await auth();

  return (
    <main
      style={{
        minHeight: "calc(100dvh - 58px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2.5rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.66rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "1.5rem",
          }}
        >
          Phase 2 — coming soon
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: "normal",
            fontStyle: "italic",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          The calculator is being built.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "var(--muted)",
            marginBottom: "2rem",
          }}
        >
          Welcome{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}. You&rsquo;re signed in. The
          experiment design calculator — context selector, sample-size engine,
          and readout simulator — lands in Phase 2.
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            color: "var(--muted)",
            letterSpacing: "0.04em",
          }}
        >
          n &nbsp;≈&nbsp; 2σ²(z<sub>α/2</sub> + z<sub>β</sub>)² / Δ²
        </p>
      </div>
    </main>
  );
}
