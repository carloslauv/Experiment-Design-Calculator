"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { scenarios } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface ScenarioInputs {
  mode: "plan" | "readout";
  baselineRate: string;
  mde: string;
  power: string;
  alpha: string;
  variants: string;
  dailyVisitors: string;
  ctrlUsers: string;
  ctrlConv: string;
  varUsers: string;
  varConv: string;
}

export interface SavedScenario {
  id: string;
  name: string;
  inputs: ScenarioInputs;
  createdAt: Date;
}

export async function saveScenario(name: string, inputs: ScenarioInputs): Promise<{ id: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const [row] = await db
    .insert(scenarios)
    .values({ userId: session.user.id, name, inputs })
    .returning({ id: scenarios.id });

  revalidatePath("/app");
  return { id: row.id };
}

export async function listScenarios(): Promise<SavedScenario[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await db
    .select({
      id: scenarios.id,
      name: scenarios.name,
      inputs: scenarios.inputs,
      createdAt: scenarios.createdAt,
    })
    .from(scenarios)
    .where(eq(scenarios.userId, session.user.id))
    .orderBy(scenarios.createdAt);

  return rows.map(r => ({
    id: r.id,
    name: r.name,
    inputs: r.inputs as ScenarioInputs,
    createdAt: r.createdAt,
  }));
}

export async function deleteScenario(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await db
    .delete(scenarios)
    .where(and(eq(scenarios.id, id), eq(scenarios.userId, session.user.id)));

  revalidatePath("/app");
}
