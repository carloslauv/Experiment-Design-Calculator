import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata = { title: "Sign in — Clearcut" };

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
      <div
        style={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Clearcut
        </p>

        <div
          className="card"
          style={{
            padding: "2.5rem",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.6rem",
              fontWeight: "normal",
              fontStyle: "italic",
              marginBottom: "0.5rem",
            }}
          >
            Sign in
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.9rem",
              color: "var(--muted)",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            Continue to your experiment calculator.
          </p>

          {/* Google OAuth */}
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              margin: "1.5rem 0",
            }}
          >
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--dim)" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              or
            </span>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--dim)" }} />
          </div>

          {/* Email magic link */}
          <form
            action={async (formData: FormData) => {
              "use server";
              const email = formData.get("email") as string;
              await signIn("resend", { email, redirectTo: "/app" });
            }}
          >
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.66rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.875rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.88rem",
                  background: "transparent",
                  border: "1px solid var(--dim)",
                  color: "var(--ink)",
                  outline: "none",
                }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-ghost"
              style={{ width: "100%", textAlign: "center" }}
            >
              Send magic link
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
