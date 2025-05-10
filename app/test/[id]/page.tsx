'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Question {
  id: string;
  text: string;
  options: string[];
  type: string;
  points: number;
}

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { status } = useSession();
  const [test, setTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const id = unwrappedParams.id;
    const fetchTest = async () => {
      try {
        const response = await fetch(`/api/tests/${id}`);
        if (!response.ok) {
          throw new Error('Testni olishda xatolik yuz berdi');
        }
        const data = await response.json();
        setTest(data);
        setTimeLeft(data.duration * 60);
      } catch (error) {
        console.error('Testni olishda xatolik:', error);
      }
    };

    fetchTest();
  }, [unwrappedParams.id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting || !test) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId: test.id,
          answers,
          timeTaken: test.duration * 60 - timeLeft,
        }),
      });

      if (!response.ok) {
        throw new Error('Test natijasini saqlashda xatolik yuz berdi');
      }

      router.push('/results');
    } catch (error) {
      console.error('Test natijasini saqlashda xatolik:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || !test) {
    return <div>Yuklanmoqda...</div>;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{test.title}</h1>
        <div className="text-xl font-semibold">
          Qolgan vaqt: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-gray-600">{test.description}</p>
      </div>

      <div className="space-y-8">
        {test.questions.map((question, index) => (
          <div key={question.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              {index + 1}. {question.text}
            </h3>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Yuborilmoqda...' : 'Testni yakunlash'}
        </button>
      </div>
    </div>
  );
} 