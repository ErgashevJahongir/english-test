'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface TestResult {
  id: string;
  score: number;
  timeTaken: number;
  createdAt: string;
  test: {
    id: string;
    title: string;
    description: string;
    questions: {
      id: string;
      text: string;
      options: string[];
      correctAnswer: string;
    }[];
  };
  answers: Record<string, string>;
}

export default function ResultsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/test-results');
        if (!response.ok) {
          throw new Error('Natijalarni olishda xatolik yuz berdi');
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Natijalarni olishda xatolik:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (status === 'loading' || loading) {
    return <div>Yuklanmoqda...</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} daqiqa ${remainingSeconds} soniya`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test natijalari</h1>

      <div className="space-y-6">
        {results.map((result) => (
          <div key={result.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{result.test.title}</h2>
                <p className="text-gray-600">{result.test.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {result.score.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(result.createdAt)}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600">
                Sarflangan vaqt: {formatTime(result.timeTaken)}
              </div>
            </div>

            <div className="space-y-4">
              {result.test.questions.map((question, index) => {
                const userAnswer = result.answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'
                      }`}
                  >
                    <div className="font-medium mb-2">
                      {index + 1}. {question.text}
                    </div>
                    <div className="space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`flex items-center space-x-2 ${option === question.correctAnswer
                            ? 'text-green-600'
                            : option === userAnswer
                              ? 'text-red-600'
                              : 'text-gray-600'
                            }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border ${option === question.correctAnswer
                              ? 'bg-green-500 border-green-500'
                              : option === userAnswer
                                ? 'bg-red-500 border-red-500'
                                : 'border-gray-300'
                              }`}
                          />
                          <span>{option}</span>
                          {option === question.correctAnswer && (
                            <span className="text-green-600">✓</span>
                          )}
                          {option === userAnswer && !isCorrect && (
                            <span className="text-red-600">✗</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Hali test natijalari yo&apos;q</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Testlarni ko&apos;rish
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 