import { NextRequest, NextResponse } from "next/server";
import {
  initDatabase,
  addQuestion,
  getAllQuestions,
  deleteQuestion,
  countQuestionsByIP,
} from "@/lib/database-postgres";
import { QuestionForm } from "@/types/question";

function getClientIP(request: NextRequest): string {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-vercel-forwarded-for") ||
    "unknown";
  return ip.split(",")[0].trim();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await initDatabase();

    const body: QuestionForm = await request.json();
    const { prenom, question } = body;

    if (!prenom?.trim() || !question?.trim()) {
      return NextResponse.json(
        { error: "Prénom et question requis" },
        { status: 400 }
      );
    }

    const ip = getClientIP(request);
    const questionCount = await countQuestionsByIP(ip);

    // if (questionCount >= 10) {
    //   return NextResponse.json(
    //     { error: "Limite de 10 questions atteinte" },
    //     { status: 429 }
    //   );
    // }

    const id = await addQuestion(prenom, question, ip);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Erreur POST:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    await initDatabase();
    const questions = await getAllQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Erreur GET:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    await deleteQuestion(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
