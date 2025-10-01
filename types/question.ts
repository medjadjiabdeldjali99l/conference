// types/question.ts
export interface Question {
  id: number;
  prenom: string;
  question: string;
  ip: string;
  status: "pending" | "current" | "read";
  viewed_at?: string;
  created_at: string;
}

export interface QuestionForm {
  prenom: string;
  question: string;
}

export interface QuestionCount {
  count: number;
}
