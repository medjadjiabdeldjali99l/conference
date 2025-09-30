import { sql } from "@vercel/postgres";
import { Question } from "@/types/question";

// Table setup optimisée
export async function initDatabase(): Promise<void> {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        prenom VARCHAR(100) NOT NULL,
        question TEXT NOT NULL,
        ip VARCHAR(45),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log("✅ Database table ready");
  } catch (error) {
    console.error("❌ Database init error:", error);
    throw error;
  }
}

export async function addQuestion(
  prenom: string,
  question: string,
  ip: string
): Promise<number> {
  const result = await sql`
    INSERT INTO questions (prenom, question, ip) 
    VALUES (${prenom}, ${question}, ${ip})
    RETURNING id
  `;
  return result.rows[0].id;
}

export async function countQuestionsByIP(ip: string): Promise<number> {
  const result = await sql`
    SELECT COUNT(*) as count FROM questions 
    WHERE ip = ${ip} AND created_at > NOW() - INTERVAL '1 hour'
  `;
  return parseInt(result.rows[0].count);
}

export async function getAllQuestions(): Promise<Question[]> {
  const result = await sql`
    SELECT id, prenom, question, ip, created_at
    FROM questions 
    ORDER BY created_at DESC
  `;
  return result.rows as Question[];
}

export async function deleteQuestion(id: number): Promise<void> {
  await sql`DELETE FROM questions WHERE id = ${id}`;
}
