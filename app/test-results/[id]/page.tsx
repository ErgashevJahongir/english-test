'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TestResult {
  id: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: {
    [key: string]: string;
  };
  test: {
    title: string;
    description: string;
    questions: {
      id: string;
      text: string;
      correctAnswer: string;
    }[];
  };
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function TestResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);

  const { status } = useSession();
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchResult();
    }
  }, [status, router]);

  const fetchResult = async () => {
    try {
      const response = await fetch(`/api/test-results/${unwrappedParams.id}`);
      if (!response.ok) {
        throw new Error('Test natijasini olishda xatolik yuz berdi');
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Test natijasini olishda xatolik', error);
      setError('Test natijasini olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  console.log(result?.test.questions, result?.answers);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Yuklanmoqda...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Xatolik</h2>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Test natijasi</h2>
          <Link
            href="/tests"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Testlarga qaytish
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Test ma&apos;lumotlari</h3>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Test nomi</dt>
                    <dd className="mt-1 text-sm text-gray-900">{result.test.title}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Test tavsifi</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {result.test.description}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Sana</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Natija</h3>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ball</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {result.score.toFixed(2)}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      To&apos;g&apos;ri javoblar
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {result.correctAnswers} / {result.totalQuestions}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Javoblar</h3>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 space-y-6">
              {result.test.questions.map((question, index) => {
                const answer = result.answers[question.id];
                const isCorrect = answer === question.correctAnswer;

                return (
                  <div key={question.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            {index + 1}
                          </span>
                        </span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900">
                          {question.text}
                        </h4>
                        <div className="mt-4 space-y-2">
                          <div
                            className={`flex items-center p-3 rounded-md ${isCorrect
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-red-50 border border-red-200'
                              }`}
                          >
                            <div className="flex-shrink-0">
                              <div
                                className={`h-4 w-4 rounded-full border ${isCorrect
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-red-500 bg-red-500'
                                  }`}
                              />
                            </div>
                            <div className="ml-3">
                              <p
                                className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'
                                  }`}
                              >
                                Sizning javobingiz: {answer || 'Javob berilmagan'}
                              </p>
                              {!isCorrect && (
                                <p className="text-sm text-green-700 mt-1">
                                  To&apos;g&apos;ri javob: {question.correctAnswer}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}