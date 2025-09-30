export interface Question {
  id: number;
  prenom: string;
  question: string;
  ip?: string;
  created_at: string;
}

export interface QuestionForm {
  prenom: string;
  question: string;
}

export interface QuestionCount {
  count: number;
  canSubmit: boolean;
}
