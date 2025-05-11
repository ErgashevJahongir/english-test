'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const [user, setUser] = useState<User | null>(null);
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
      fetchUserData();
    }
  }, [status]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (!response.ok) {
        throw new Error('Foydalanuvchi ma&apos;lumotlarini olishda xatolik yuz berdi');
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Foydalanuvchi ma&apos;lumotlarini olishda xatolik', error);
    } finally {
      setLoading(false);
    }
  };

  function getAgeGroup(age: number) {
    if (age < 10) return 'KIDS_7_9';
    if (age >= 10 && age < 13) return 'KIDS_10_12';
    if (age >= 13 && age < 16) return 'TEENS_13_15';
    return 'KIDS_7_9';
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className='shadow-none border-none bg-transparent'>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardContent className="text-center py-6">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Xush kelibsiz, {session?.user?.name}!
            </CardTitle>
            <p className="mt-4 text-lg text-gray-600">
              Ingliz tili bilimlaringizni tekshirish uchun testlarni boshlashingiz mumkin.
            </p>
          </CardContent>
        </Card>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent>
              <h3 className="text-lg font-medium text-gray-900">Boshlang&apos;ich daraja</h3>
              <div className="mt-4">
                <Button asChild>
                  <Link href={`/tests?difficulty=BEGINNER&ageGroup=${getAgeGroup(user?.age || 0)}`}>
                    Testlarni boshlash
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="text-lg font-medium text-gray-900">O&apos;rta daraja</h3>
              <div className="mt-4">
                <Button asChild>
                  <Link href={`/tests?difficulty=INTERMEDIATE&ageGroup=${getAgeGroup(user?.age || 0)}`}>
                    Testlarni boshlash
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="text-lg font-medium text-gray-900">Yuqori daraja</h3>
              <div className="mt-4">
                <Button asChild>
                  <Link href={`/tests?difficulty=ADVANCED&ageGroup=${getAgeGroup(user?.age || 0)}`}>
                    Testlarni boshlash
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Test tarixi</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}