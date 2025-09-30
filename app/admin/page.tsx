"use client";
import { useState, useEffect } from "react";
import { Question } from "@/types/question";

export default function Admin() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Polling simple toutes les 3 secondes
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        const data: Question[] = await res.json();
        setQuestions(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        setIsLoading(false);
      }
    };

    fetchQuestions(); // Premier chargement
    const interval = setInterval(fetchQuestions, 3000); // Refresh auto

    return () => clearInterval(interval);
  }, []);

  const deleteQuestion = async (id: number): Promise<void> => {
    try {
      await fetch(`/api/questions?id=${id}`, { method: "DELETE" });
      setQuestions((prev) => prev.filter((q) => q.id !== id));

      // Ajuster l'index si nécessaire
      if (currentIndex >= questions.length - 1) {
        setCurrentIndex(Math.max(0, questions.length - 2));
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const currentQuestion: Question | undefined = questions[currentIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎤 Tableau de Bord Questions
          </h1>
          <p className="text-gray-600">Questions reçues en temps réel</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-blue-100">
            <div className="text-3xl font-bold text-blue-600">
              {questions.length}
            </div>
            <div className="text-gray-600 text-sm mt-1">Total questions</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-green-100">
            <div className="text-3xl font-bold text-green-600">
              {currentIndex + 1}
            </div>
            <div className="text-gray-600 text-sm mt-1">Question actuelle</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-purple-100">
            <div className="text-3xl font-bold text-purple-600">
              {questions.length > 0 ? "🟢" : "🔴"}
            </div>
            <div className="text-gray-600 text-sm mt-1">Statut</div>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Question Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">
                    {currentQuestion.prenom}
                  </h2>
                  <p className="text-blue-100 opacity-90 mt-1">
                    {new Date(currentQuestion.created_at).toLocaleString(
                      "fr-FR"
                    )}
                  </p>
                </div>
                <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  #{currentQuestion.id}
                </span>
              </div>
            </div>

            {/* Question Content */}
            <div className="p-8">
              <div className="prose max-w-none">
                <p className="text-xl text-gray-800 leading-relaxed bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => deleteQuestion(currentQuestion.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md flex items-center gap-2"
                >
                  <span>🗑️ Supprimer</span>
                </button>

                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      Math.min(prev + 1, questions.length - 1)
                    )
                  }
                  disabled={currentIndex >= questions.length - 1}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>⏭️ Suivante</span>
                </button>

                <button
                  onClick={() =>
                    setCurrentIndex((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentIndex === 0}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>⏮️ Précédente</span>
                </button>

                <button
                  onClick={() => setCurrentIndex(0)}
                  disabled={currentIndex === 0}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>⏪ Première</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Aucune question pour le moment
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Les questions apparaîtront ici dès que les participants en
              enverront.
            </p>
          </div>
        )}

        {/* Navigation Info */}
        {questions.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600">
                  Navigation: {currentIndex + 1} / {questions.length}
                </span>
              </div>
              <div className="flex gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-blue-600 scale-125"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
