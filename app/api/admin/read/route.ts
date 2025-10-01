// app/api/admin/read/route.ts
import { NextResponse } from "next/server";
import { setQuestionAsRead } from "@/lib/database-postgres";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    await setQuestionAsRead(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
