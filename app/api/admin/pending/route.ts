// app/api/admin/pending/route.ts
import { NextResponse } from "next/server";
import { getPendingQuestions } from "@/lib/database-postgres";

export async function GET(): Promise<NextResponse> {
  try {
    const pendingQuestions = await getPendingQuestions();
    return NextResponse.json(pendingQuestions);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
