// app/api/admin/next/route.ts
import { NextResponse } from "next/server";
import { setQuestionAsCurrent } from "@/lib/database-postgres";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    await setQuestionAsCurrent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
