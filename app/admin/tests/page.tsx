'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: {
    id: string;
    text: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminTestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchTests();
    }
  }, [status, session, router]);

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/tests');
      if (!response.ok) {
        throw new Error('Testlarni olishda xatolik yuz berdi');
      }
      const data = await response.json();
      setTests(data);
    } catch (error) {
      console.error('Testlarni olishda xatolik', error);
      setError('Testlarni olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testId: string) => {
    if (!confirm('Bu testni o\'chirishni xohlaysizmi?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tests/${testId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Testni o\'chirishda xatolik yuz berdi');
      }

      setTests(tests.filter((test) => test.id !== testId));
    } catch (error) {
      console.error('Testni o\'chirishda xatolik', error);
      setError('Testni o\'chirishda xatolik yuz berdi');
    }
  };

  if (status === 'loading' || loading) {
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Testlar</h2>
          <Button asChild>
            <Link href="/admin/tests/new">
              Yangi test
            </Link>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="p-0">
            {tests.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Hozircha testlar mavjud emas</h3>
                <p className="text-gray-500 mb-4">Yangi test yaratish uchun &quot;Yangi test&quot; tugmasini bosing</p>
                <Button asChild>
                  <Link href="/admin/tests/new">
                    Yangi test yaratish
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sarlavha</TableHead>
                    <TableHead>Tavsif</TableHead>
                    <TableHead>Vaqt (daqiqa)</TableHead>
                    <TableHead>Savollar soni</TableHead>
                    <TableHead>Yaratilgan sana</TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.title}</TableCell>
                      <TableCell>{test.description}</TableCell>
                      <TableCell>{test.duration}</TableCell>
                      <TableCell>{test.questions.length}</TableCell>
                      <TableCell>{new Date(test.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" asChild className="mr-2">
                          <Link href={`/admin/tests/${test.id}`}>
                            Tahrirlash
                          </Link>
                        </Button>
                        <Button variant="link" asChild className="mr-2">
                          <Link href={`/admin/tests/${test.id}/results`}>
                            Natijalar
                          </Link>
                        </Button>
                        <Button
                          variant="link"
                          onClick={() => handleDelete(test.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          O&apos;chirish
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}