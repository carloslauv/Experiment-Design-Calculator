import { signIn, auth } from "@/lib/auth";
import { redirect } from "next/navigation";

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

        </div>
      </div>
    </main>
  );
}
