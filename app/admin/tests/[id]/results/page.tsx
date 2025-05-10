'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TestResult {
  id: string;
  score: number;
  correctAnswers: number;
  timeTaken: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    school: string;
  };
}

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: {
    id: string;
    text: string;
  }[];
}

export default function TestResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchTestAndResults();
    }
  }, [status, session, router, unwrappedParams.id]);

  const fetchTestAndResults = async () => {
    try {
      const [testResponse, resultsResponse] = await Promise.all([
        fetch(`/api/tests/${unwrappedParams.id}`),
        fetch(`/api/tests/${unwrappedParams.id}/results`),
      ]);

      if (!testResponse.ok || !resultsResponse.ok) {
        throw new Error('Ma&apos;lumotlarni olishda xatolik yuz berdi');
      }

      const [testData, resultsData] = await Promise.all([
        testResponse.json(),
        resultsResponse.json(),
      ]);

      setTest(testData);
      setResults(resultsData);
    } catch (err) {
      console.error('Test va natijalarni olishda xatolik', err);
      setError('Ma&apos;lumotlarni olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resultId: string) => {
    if (!confirm('Bu natijani o&apos;chirishni xohlaysizmi?')) {
      return;
    }

    try {
      const response = await fetch(`/api/test-results/${resultId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Natijani o&apos;chirishda xatolik yuz berdi');
      }

      setResults(results.filter((result) => result.id !== resultId));
    } catch (err) {
      console.error('Natijani o&apos;chirishda xatolik', err);
      setError('Natijani o&apos;chirishda xatolik yuz berdi');
    }
  };

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

  if (!test) {
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
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{test.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{test.description}</p>
          </div>
          <Link
            href="/admin/tests"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Orqaga
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foydalanuvchi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maktab
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ball
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To&apos;g&apos;ri javoblar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sarflangan vaqt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{result.user.name}</div>
                    <div className="text-sm text-gray-500">{result.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.user.school}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.score.toFixed(2)}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {result.correctAnswers} / {test.questions.length}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.timeTaken} daqiqa</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/test-results/${result.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Batafsil
                    </Link>
                    <button
                      onClick={() => handleDelete(result.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      O&apos;chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 