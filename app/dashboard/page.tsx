'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TestResult {
  id: string;
  score: number;
  completed: boolean;
  createdAt: string;
  test: {
    title: string;
    difficulty: string;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await fetch('/api/test-results');
        if (response.ok) {
          const data = await response.json();
          setTestResults(data);
        }
      } catch (error) {
        console.error('Test results fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchTestResults();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Xush kelibsiz, {session?.user?.name}!
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Ingliz tili bilimlaringizni tekshirish uchun testlarni boshlashingiz mumkin.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Test Categories */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Boshlang&apos;ich daraja</h3>
              <p className="mt-1 text-sm text-gray-500">
                7-9 yoshdagi bolalar uchun testlar
              </p>
              <div className="mt-4">
                <Link
                  href="/tests?difficulty=BEGINNER&ageGroup=KIDS_7_9"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Testlarni boshlash
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">O&apos;rta daraja</h3>
              <p className="mt-1 text-sm text-gray-500">
                10-12 yoshdagi bolalar uchun testlar
              </p>
              <div className="mt-4">
                <Link
                  href="/tests?difficulty=INTERMEDIATE&ageGroup=KIDS_10_12"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Testlarni boshlash
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Yuqori daraja</h3>
              <p className="mt-1 text-sm text-gray-500">
                13-15 yoshdagi o&apos;quvchilar uchun testlar
              </p>
              <div className="mt-4">
                <Link
                  href="/tests?difficulty=ADVANCED&ageGroup=TEENS_13_15"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Testlarni boshlash
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Test History */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Test tarixi</h2>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {testResults.length > 0 ? (
                testResults.map((result) => (
                  <li key={result.id} className="px-6 py-4">
                    <Link href={`/test-results/${result.id}`}>
                      <div className="flex items-center justify-between hover:bg-gray-50">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {result.test.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          Natija: {result.score}%
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-6 py-4 text-center text-gray-500">
                  Hali test yechilmagan
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 