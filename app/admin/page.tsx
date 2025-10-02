// app/admin/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Question } from "@/types/question";

export default function AdminPage() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const [historyQuestions, setHistoryQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pendingQuestions.length === 1 && currentQuestion === null) {
      showNextQuestion();
    }
  }, [pendingQuestions.length, currentQuestion]);

  // useEffect(() => {
  //   loadQuestions();
  //   // Polling toutes les 2 secondes pour les nouvelles questions
  //   const interval = setInterval(loadQuestions, 2000);
  //   return () => clearInterval(interval);
  // }, []);

  // const loadQuestions = async (): Promise<void> => {
  //   try {
  //     const [currentRes, pendingRes] = await Promise.all([
  //       fetch("/api/admin/current"),
  //       fetch("/api/admin/pending"),
  //     ]);

  //     if (currentRes.ok) {
  //       const current = await currentRes.json();
  //       setCurrentQuestion(current);
  //     }

  //     if (pendingRes.ok) {
  //       const pending = await pendingRes.json();
  //       setPendingQuestions(pending);
  //     }
  //   } catch (error) {
  //     console.error("Erreur:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    loadQuestions();
    // Polling toutes les 2 secondes pour les nouvelles questions
    const interval = setInterval(loadQuestions, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadQuestions = async (): Promise<void> => {
    try {
      const [currentRes, pendingRes, historyRes] = await Promise.all([
        fetch("/api/admin/current"),
        fetch("/api/admin/pending"),
        fetch("/api/admin/history"),
      ]);

      if (currentRes.ok) {
        const current = await currentRes.json();
        setCurrentQuestion(current);
      }

      if (pendingRes.ok) {
        const pending = await pendingRes.json();
        setPendingQuestions(pending);
      }

      if (historyRes.ok) {
        const history = await historyRes.json();
        setHistoryQuestions(history);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showNextQuestion = async (): Promise<void> => {
    if (pendingQuestions.length === 0) return;

    try {
      const nextQuestion = pendingQuestions[0];
      const response = await fetch("/api/admin/next", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: nextQuestion.id }),
      });

      if (response.ok) {
        await loadQuestions();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const markAsRead = async (): Promise<void> => {
    if (!currentQuestion) return;

    try {
      const response = await fetch("/api/admin/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: currentQuestion.id }),
      });

      if (response.ok) {
        await loadQuestions();
      }
      showNextQuestion();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const showPreviousQuestion = async (): Promise<void> => {
    try {
      const response = await fetch("/api/admin/previous", {
        method: "POST",
      });

      if (response.ok) {
        await loadQuestions();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const deleteQuestion = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/delete?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadQuestions();
      }
      showNextQuestion();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            🎯 Tableau de Bord Admin - Questions
          </h1>
          <div className="mt-4 grid grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {pendingQuestions.length}
              </div>
              <div className="text-sm text-blue-800">En attente</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {currentQuestion ? 1 : 0}
              </div>
              <div className="text-sm text-green-800">Actuelle</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {historyQuestions.length}
              </div>
              <div className="text-sm text-purple-800">Historique</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {pendingQuestions.length +
                  (currentQuestion ? 1 : 0) +
                  historyQuestions.length}
              </div>
              <div className="text-sm text-gray-800">Total</div>
            </div>
          </div>
        </div> */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            🎯 Tableau de Bord Admin - Questions
          </h1>
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {pendingQuestions.length}
              </div>
              <div className="text-sm text-blue-800">En attente</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {currentQuestion ? 1 : 0}
              </div>
              <div className="text-sm text-green-800">Actuelle</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {historyQuestions.length}
              </div>
              <div className="text-sm text-purple-800">Historique</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {pendingQuestions.length +
                  (currentQuestion ? 1 : 0) +
                  historyQuestions.length}
              </div>
              <div className="text-sm text-gray-800">Total</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Actuelle */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📊 Question Actuelle
              </h2>

              {currentQuestion ? (
                <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50 w-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 break-words max-w-[70%]">
                      {currentQuestion.prenom}
                    </h3>
                    <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                      {new Date(
                        currentQuestion.created_at
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-lg break-words overflow-wrap-anywhere whitespace-pre-wrap max-w-full mb-6">
                    {currentQuestion.question}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={markAsRead}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      ✅ Marquer comme lu
                    </button>
                    {/* <button
                      onClick={showPreviousQuestion}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      ⬅️ Précédent
                    </button> */}
                    <button
                      onClick={() => deleteQuestion(currentQuestion.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-600 text-lg">
                    Aucune question en cours
                  </p>
                  {pendingQuestions.length > 0 && (
                    <button
                      onClick={showNextQuestion}
                      className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Afficher la première question
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* NOUVEAU BLOC HISTORIQUE - Positionné en dessous */}
            {/* <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📜 Historique des Questions ({historyQuestions.length})
              </h2>

              {historyQuestions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📋</div>
                  Aucune question dans l'historique
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {historyQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors w-full"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-800 break-words max-w-[70%]">
                          {question.prenom}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                            Lu
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(question.viewed_at!).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 break-words overflow-wrap-anywhere whitespace-pre-wrap max-w-full">
                        {question.question}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Posée:{" "}
                          {new Date(question.created_at).toLocaleTimeString()}
                        </span>
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
          </div>

          {/* File d'attente (reste à droite) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ⏳ File d&apos;attente ({pendingQuestions.length})
            </h2>

            {pendingQuestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎉</div>
                Aucune question en attente
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {pendingQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`border rounded-lg p-4 ${
                      index === 0
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2 ">
                      <span className="font-semibold text-gray-800">
                        {question.prenom}
                      </span>
                      {index === 0 && (
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Suivante
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2 break-words overflow-wrap-anywhere whitespace-pre-wrap max-w-full">
                      {question.question}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(question.created_at).toLocaleTimeString()}
                      </span>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📜 Historique des Questions ({historyQuestions.length})
          </h2>

          {historyQuestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              Aucune question dans l&apos;historique
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {historyQuestions.map((question) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors w-full"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800 break-words max-w-[70%]">
                      {question.prenom}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        Lu
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(question.viewed_at!).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 break-words overflow-wrap-anywhere whitespace-pre-wrap max-w-full">
                    {question.question}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Posée:{" "}
                      {new Date(question.created_at).toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
