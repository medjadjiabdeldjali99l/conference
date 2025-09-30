"use client";
import { useState, useEffect } from "react";
import { QuestionCount } from "@/types/question";

export default function PublicForm() {
  const [prenom, setPrenom] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    checkQuestionCount();
  }, []);

  const checkQuestionCount = async (): Promise<void> => {
    try {
      const res = await fetch("/api/check-limit");
      const data: QuestionCount = await res.json();
      setCount(data.count);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const submitQuestion = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    if (count >= 3) {
      alert("Maximum 3 questions par personne!");
      setIsSubmitting(false);
      return;
    }

    if (!prenom.trim() || !question.trim()) {
      alert("Veuillez remplir tous les champs");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prenom, question }),
      });

      if (response.ok) {
        setPrenom("");
        setQuestion("");
        setCount((prev) => prev + 1);
        alert("✅ Question envoyée avec succès!");
      } else {
        const error = await response.json();
        alert(`❌ Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur lors de l'envoi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const questionsLeft = 3 - count;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">🎤 Votre Question</h1>
          <p className="text-blue-100 text-center mt-2">
            Posez votre question pour la conférence
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={submitQuestion} className="space-y-4">
            <div>
              <label
                htmlFor="prenom"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Votre prénom *
              </label>
              <input
                id="prenom"
                type="text"
                placeholder="Ex: Jean, Marie..."
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Votre question *
              </label>
              <textarea
                id="question"
                placeholder="Tapez votre question ici..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Counter */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-700 font-medium">
                  Questions restantes:
                </span>
                <span
                  className={`font-bold ${
                    questionsLeft === 0 ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  {questionsLeft}/3
                </span>
              </div>
              {questionsLeft === 0 && (
                <p className="text-red-600 text-xs mt-1">
                  Vous avez atteint la limite de questions
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || questionsLeft === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Envoi en cours...
                </span>
              ) : (
                "📨 Envoyer la question"
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              ⓘ Votre question sera affichée en direct aux organisateurs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
