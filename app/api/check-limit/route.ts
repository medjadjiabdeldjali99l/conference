// import { NextRequest, NextResponse } from "next/server";
// import { initDatabase, countQuestionsByIP } from "@/lib/database-postgres";

// function getClientIP(request: NextRequest): string {
//   const ip =
//     request.headers.get("x-forwarded-for") ||
//     request.headers.get("x-real-ip") ||
//     request.headers.get("x-vercel-forwarded-for") ||
//     "unknown";
//   return ip.split(",")[0].trim();
// }

// export async function GET(request: NextRequest): Promise<NextResponse> {
//   try {
//     await initDatabase();

//     const ip = getClientIP(request);
//     const count = await countQuestionsByIP(ip);

//     return NextResponse.json({
//       count,
//       canSubmit: count < 10,
//     });
//   } catch (error) {
//     console.error("Erreur check-limit:", error);
//     return NextResponse.json({ count: 0, canSubmit: true }, { status: 500 });
//   }
// }
