'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import api from '@/lib/axios';

interface Quiz {
  id: string;
  title: string;
  instructions: string;
  timeLimitMinutes: number;
  topic: string;
  difficulty: string;
  createdAt: string;
  userId: string | null;
  completed: boolean;
  createdBy: string;
  questions: Question[];
  user: any;
  SubmitQuiz: any[];
}

interface Question {
  id: string;
  questionText: string;
  quizId: string;
  options: Option[];
}

interface Option {
  id: string;
  optionText: string;
  isCorrect: boolean;
  questionId: string;
}

export default function QuizDetailPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/institution-admin/quizzes/${quizId}`
      );

      if (response.data.success) {
        setQuiz(response.data.data.quiz);
      } else {
        setError('Failed to fetch quiz details');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('Failed to fetch quiz details');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/quizzes');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-[var(--primary-50)] text-[color:var(--primary-800)]';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[color:var(--primary-500)] mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading quiz details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">❌</span>
              <p className="text-red-700 font-medium">{error || 'Quiz not found'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleBack}
            className="mt-4 px-6 py-2 rounded-lg transition-colors bg-[color:var(--primary-500)] hover:bg-[color:var(--primary-600)] text-[color:var(--primary-foreground)]"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 text-xl"
              type="button"
            >
              ←
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Quiz Details</h1>
          </div>
        </div>

        {/* Quiz Overview Card */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[color:var(--primary-500)] to-[color:var(--primary-600)] p-6 text-[color:var(--primary-foreground)]">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
                <p className="text-[color:var(--primary-100)] mb-4">{quiz.instructions}</p>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quiz.difficulty)} bg-opacity-20`}>
                    {quiz.difficulty}
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                    {quiz.topic}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="text-3xl font-bold">{quiz.timeLimitMinutes}</div>
                  <div className="text-sm text-[color:var(--primary-100)]">minutes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{quiz.questions.length}</div>
                <div className="text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[color:var(--primary-600)] mb-1">{quiz.SubmitQuiz.length}</div>
                <div className="text-gray-600">Submissions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {quiz.completed ? 'Completed' : 'Active'}
                </div>
                <div className="text-gray-600">Status</div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Quiz Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">{formatDate(quiz.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created By:</span>
                      <span className="text-gray-900">{quiz.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quiz ID:</span>
                      <span className="text-gray-900 font-mono text-sm">{quiz.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-800">Questions ({quiz.questions.length})</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary-50)] rounded-full flex items-center justify-center">
                      <span className="text-[color:var(--primary-600)] font-medium text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">{question.questionText}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={option.id}
                            className={`p-3 rounded-lg border-2 transition-colors ${
                              option.isCorrect
                                ? 'border-[color:var(--primary-300)] bg-[var(--primary-50)]'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                                option.isCorrect
                                  ? 'bg-[color:var(--primary-500)] text-[color:var(--primary-foreground)]'
                                  : 'bg-gray-300 text-gray-600'
                              }`}>
                                {String.fromCharCode(65 + optionIndex)}
                              </div>
                              <span className={`${option.isCorrect ? 'text-[color:var(--primary-800)] font-medium' : 'text-gray-700'}`}>
                                {option.optionText}
                              </span>
                              {option.isCorrect && (
                                <svg className="w-5 h-5 text-[color:var(--primary-500)]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Quizzes
          </button>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Edit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
