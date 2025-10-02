// app/api/admin/history/route.ts
import { NextResponse } from "next/server";
import { getHistoryQuestions } from "@/lib/database-postgres";

export async function GET(): Promise<NextResponse> {
  try {
    const historyQuestions = await getHistoryQuestions();
    return NextResponse.json(historyQuestions);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
