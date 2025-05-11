'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  school: string;
  role: string;
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    school: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (!response.ok) {
        throw new Error('Foydalanuvchi ma&apos;lumotlarini olishda xatolik yuz berdi');
      }
      const data = await response.json();
      setUser(data);
      setFormData({
        name: data.name,
        email: data.email,
        age: data.age.toString(),
        school: data.school,
      });
    } catch (error) {
      console.error('Foydalanuvchi ma&apos;lumotlarini olishda xatolik', error);
      setError('Foydalanuvchi ma&apos;lumotlarini olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ma&apos;lumotlarni yangilashda xatolik yuz berdi');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ma&apos;lumotlarni yangilashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className='shadow-none border-none bg-transparent'>
            <CardContent className="pt-6">
              <div className="text-center">
                <CardTitle>Yuklanmoqda...</CardTitle>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CardTitle>Xatolik</CardTitle>
                <p className="mt-2 text-gray-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className='p-0'>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <CardTitle>Profil</CardTitle>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="default"
              >
                {isEditing ? 'Bekor qilish' : 'Tahrirlash'}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Ism</Label>
                  <Input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Yoshi</Label>
                  <Input
                    type="number"
                    id="age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">Maktab</Label>
                  <Input
                    type="text"
                    id="school"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label>Ism</Label>
                  <p className="mt-1 text-lg">{user.name}</p>
                </div>

                <div>
                  <Label>Email</Label>
                  <p className="mt-1 text-lg">{user.email}</p>
                </div>

                <div>
                  <Label>Yoshi</Label>
                  <p className="mt-1 text-lg">{user.age}</p>
                </div>

                <div>
                  <Label>Maktab</Label>
                  <p className="mt-1 text-lg">{user.school}</p>
                </div>

                <div>
                  <Label>Roli</Label>
                  <p className="mt-1 text-lg">{user.role}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}