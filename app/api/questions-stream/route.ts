import { NextResponse } from "next/server";
import { getAllQuestions } from "@/lib/database-postgres"; // ou ta database

export async function GET(): Promise<Response> {
  let intervalId: NodeJS.Timeout;

  const stream = new ReadableStream({
    start(controller) {
      // Stocke l'ID de l'intervalle pour le cleanup
      intervalId = setInterval(async () => {
        try {
          const questions = await getAllQuestions();
          const data = `data: ${JSON.stringify(questions)}\n\n`;
          controller.enqueue(new TextEncoder().encode(data));
        } catch (error) {
          console.error("Erreur stream:", error);
        }
      }, 2000);
    },
    cancel() {
      // Cleanup quand le stream est annulé
      if (intervalId) {
        clearInterval(intervalId);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
