import { Pool } from "pg";
import { Question } from "@/types/question";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export async function initDatabase(): Promise<void> {
  try {
    // console.log(
    //   "Testing connection to:",
    //   process.env.POSTGRES_URL?.replace(/:[^:]*@/, ":****@")
    // );

    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        prenom VARCHAR(100) NOT NULL,
        question TEXT NOT NULL,
        ip VARCHAR(45),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'current', 'read')),
        viewed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    client.release();
    console.log("✅ VPS PostgreSQL database ready");
  } catch (error) {
    console.error("Database init error:", error);
    throw error;
  }
}

export async function addQuestion(
  prenom: string,
  question: string,
  ip: string
): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO questions (prenom, question, ip, status) VALUES ($1, $2, $3, 'pending') RETURNING id",
      [prenom, question, ip]
    );
    return result.rows[0].id;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function countQuestionsByIP(ip: string): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT COUNT(*) as count FROM questions 
       WHERE ip = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
      [ip]
    );
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error("Error counting questions:", error);
    return 0;
  } finally {
    client.release();
  }
}

export async function getAllQuestions(): Promise<Question[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM questions ORDER BY created_at DESC"
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting questions:", error);
    return [];
  } finally {
    client.release();
  }
}

// Ajoute cette fonction dans lib/database-postgres.ts
export async function getHistoryQuestions(): Promise<Question[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM questions WHERE status = 'read' ORDER BY viewed_at DESC "
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting history questions:", error);
    return [];
  } finally {
    client.release();
  }
}

export async function getPendingQuestions(): Promise<Question[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM questions WHERE status = 'pending' ORDER BY created_at ASC"
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting pending questions:", error);
    return [];
  } finally {
    client.release();
  }
}

export async function getCurrentQuestion(): Promise<Question | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM questions WHERE status = 'current' ORDER BY viewed_at DESC LIMIT 1"
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting current question:", error);
    return null;
  } finally {
    client.release();
  }
}

export async function setQuestionAsCurrent(id: number): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Reset any current question
    await client.query(
      "UPDATE questions SET status = 'read' WHERE status = 'current'"
    );

    // Set new current question
    await client.query(
      "UPDATE questions SET status = 'current', viewed_at = NOW() WHERE id = $1",
      [id]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error setting question as current:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function setQuestionAsRead(id: number): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      "UPDATE questions SET status = 'read', viewed_at = NOW() WHERE id = $1",
      [id]
    );
  } catch (error) {
    console.error("Error setting question as read:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getPreviousQuestion(): Promise<Question | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM questions WHERE status = 'read' ORDER BY viewed_at DESC LIMIT 1"
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting previous question:", error);
    return null;
  } finally {
    client.release();
  }
}

export async function deleteQuestion(id: number): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM questions WHERE id = $1", [id]);
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  } finally {
    client.release();
  }
}
