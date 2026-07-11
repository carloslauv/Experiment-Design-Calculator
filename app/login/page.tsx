import { signIn, auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Sign in — Experiment Builder" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/app");

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "var(--paper)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <p
          style={{
            fontSize: "0.95rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--accent)",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Experiment Builder
        </p>

        <div
          className="card"
          style={{ padding: "2.5rem" }}
        >
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            Sign in
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--muted)",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            Continue to your experiment calculator.
          </p>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/app" });
            }}
          >
            <button
              type="submit"
              className="btn btn-fill"
              style={{ width: "100%", textAlign: "center", marginBottom: "1rem" }}
            >
              Continue with Google
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.72rem", color: "var(--faint, #94a3c0)" }}>
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
    </main>
  );
}
