'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Question {
  text: string;
  options: string[];
  correctAnswer: string | undefined;
}

interface QuestionChange {
  text?: string;
  options?: string[];
  correctAnswer?: string;
}

export default function NewTestPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    { text: '', options: ['', '', '', ''], correctAnswer: undefined },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    difficulty: 'BEGINNER',
    ageGroup: 'KIDS_7_9',
  });

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const handleQuestionChange = (index: number, field: keyof Question, value: QuestionChange[keyof QuestionChange]) => {
    const newQuestions = [...questions];
    if (field === 'options') {
      newQuestions[index].options = value as string[];
    } else {
      console.log(value, field);
      newQuestions[index][field] = value as string;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', options: ['', '', '', ''], correctAnswer: undefined },
    ]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log(questions.map((question) => ({
      ...question,
      correctAnswer: question.correctAnswer || question.options[0],
    })));

    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          questions: questions.map((question) => ({
            ...question,
            correctAnswer: question.correctAnswer || question.options[0],
          })),
        }),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        console.error('Test yaratishda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Test yaratishda xatolik yuz berdi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Yangi test qo&apos;shish
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Test nomi
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tavsif
                </label>
                <textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Davomiyligi (daqiqa)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    required
                    min="1"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="difficulty"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Daraja
                  </label>
                  <select
                    id="difficulty"
                    required
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="BEGINNER">Boshlang&apos;ich</option>
                    <option value="INTERMEDIATE">O&apos;rta</option>
                    <option value="ADVANCED">Yuqori</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ageGroup"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Yosh guruhi
                  </label>
                  <select
                    id="ageGroup"
                    required
                    value={formData.ageGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, ageGroup: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="KIDS_7_9">7-9 yosh</option>
                    <option value="KIDS_10_12">10-12 yosh</option>
                    <option value="TEENS_13_15">13-15 yosh</option>
                    <option value="TEENS_16_18">16-18 yosh</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Savollar</h2>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Savol qo&apos;shish
                  </button>
                </div>

                {questions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">
                        Savol {index + 1}
                      </h3>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          O&apos;chirish
                        </button>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`question-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Savol matni
                      </label>
                      <input
                        type="text"
                        id={`question-${index}`}
                        required
                        value={question.text}
                        onChange={(e) =>
                          handleQuestionChange(index, 'text', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Javob variantlari
                      </label>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center">
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            checked={question.correctAnswer ? question.correctAnswer === option : optionIndex === 0}
                            onChange={() =>
                              handleQuestionChange(
                                index,
                                'correctAnswer',
                                option
                              )
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <input
                            type="text"
                            required
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[optionIndex] = e.target.value;
                              handleQuestionChange(index, 'options', newOptions);
                            }}
                            className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder={`Variant ${optionIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}