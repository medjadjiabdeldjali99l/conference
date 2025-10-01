// app/api/admin/current/route.ts
import { NextResponse } from "next/server";
import { getCurrentQuestion } from "@/lib/database-postgres";

export async function GET(): Promise<NextResponse> {
  try {
    const currentQuestion = await getCurrentQuestion();
    return NextResponse.json(currentQuestion);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
