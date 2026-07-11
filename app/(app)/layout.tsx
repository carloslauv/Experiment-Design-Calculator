import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <header style={{ borderBottom: "1px solid var(--dim)", background: "var(--paper)" }}>
        <div
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
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <Link
              href="/guide"
              style={{
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "var(--muted)",
                textDecoration: "none",
              }}
            >
              Guide
            </Link>
            <Link
              href="https://www.linkedin.com/in/carloslau"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.72rem",
                fontWeight: 500,
                color: "var(--faint, #94a3c0)",
                textDecoration: "none",
              }}
            >
              By Carlos Lau
            </Link>
            {session.user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? ""}
                width={28}
                height={28}
                style={{ borderRadius: "50%" }}
              />
            )}
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "var(--muted)",
              }}
            >
              {session.user.name ?? session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  background: "transparent",
                  border: "1.5px solid var(--dim)",
                  borderRadius: "6px",
                  padding: "0.35rem 0.85rem",
                  color: "var(--muted)",
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
