'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  ageGroup: string;
}

function TestsList() {
  const searchParams = useSearchParams();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const difficulty = searchParams.get('difficulty');
        const ageGroup = searchParams.get('ageGroup');
        const response = await fetch(
          `/api/tests?difficulty=${difficulty}&ageGroup=${ageGroup}`
        );
        if (response.ok) {
          const data = await response.json();
          setTests(data);
        }
      } catch (error) {
        console.error('Tests fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const difficulty = searchParams.get('difficulty');

  let title = '';

  if (difficulty === 'BEGINNER') {
    title = 'Boshlang\'ich daraja testlari';
  } else if (difficulty === 'INTERMEDIATE') {
    title = 'O\'rta daraja testlari';
  } else if (difficulty === 'ADVANCED') {
    title = 'Yuqori daraja testlari';
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <div key={test.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{test.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{test.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Vaqt: {test.duration} daqiqa
                  </span>
                  <Link
                    href={`/test/${test.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Testni boshlash
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tests.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-500">Bu darajada testlar mavjud emas</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Dashboardga qaytish
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestsPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className='shadow-none border-none bg-transparent'>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Yuklanmoqda...</h2>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    }>
      <TestsList />
    </Suspense>
  );
}