// app/page.tsx (page publique corrigée)
"use client";
import { useState } from "react";

export default function PublicForm() {
  const [prenom, setPrenom] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submitQuestion = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">🎤 Posez Votre Question</h1>
          <p className="text-blue-100 mt-2">
            Votre question sera traitée par notre équipe
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={submitQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Votre prénom *
              </label>
              <input
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Votre question *
              </label>
              <textarea
                placeholder="Tapez votre question ici..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
