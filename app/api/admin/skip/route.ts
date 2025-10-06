// app/api/admin/skip/route.ts
import { NextResponse } from "next/server";
import { skipQuestion } from "@/lib/database-postgres";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    await skipQuestion(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
