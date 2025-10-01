// app/api/admin/previous/route.ts
import { NextResponse } from "next/server";
import {
  getPreviousQuestion,
  setQuestionAsCurrent,
} from "@/lib/database-postgres";

export async function POST(): Promise<NextResponse> {
  try {
    const previousQuestion = await getPreviousQuestion();

    if (!previousQuestion) {
      return NextResponse.json(
        { error: "Aucune question précédente" },
        { status: 404 }
      );
    }

    await setQuestionAsCurrent(previousQuestion.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
