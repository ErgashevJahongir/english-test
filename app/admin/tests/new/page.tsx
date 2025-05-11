'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg border-t-4 border-blue-500">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-2xl text-blue-700">Yangi test qo&apos;shish</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-lg font-medium">Test nomi</Label>
                  <Input
                    type="text"
                    id="title"
                    required
                    className="mt-2"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-lg font-medium">Tavsif</Label>
                  <Textarea
                    id="description"
                    required
                    className="mt-2"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="duration" className="text-lg font-medium">Davomiyligi (daqiqa)</Label>
                    <Input
                      type="number"
                      id="duration"
                      required
                      min="1"
                      className="mt-2"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="difficulty" className="text-lg font-medium">Daraja</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Darajani tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Boshlang&apos;ich</SelectItem>
                        <SelectItem value="INTERMEDIATE">O&apos;rta</SelectItem>
                        <SelectItem value="ADVANCED">Yuqori</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ageGroup" className="text-lg font-medium">Yosh guruhi</Label>
                    <Select
                      value={formData.ageGroup}
                      onValueChange={(value) => setFormData({ ...formData, ageGroup: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Yosh guruhini tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KIDS_7_9">7-9 yosh</SelectItem>
                        <SelectItem value="KIDS_10_12">10-12 yosh</SelectItem>
                        <SelectItem value="TEENS_13_15">13-15 yosh</SelectItem>
                        <SelectItem value="TEENS_16_18">16-18 yosh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-xl font-semibold text-blue-700">Savollar</h2>
                  <Button type="button" onClick={addQuestion} className="bg-green-500 hover:bg-green-600">
                    Savol qo&apos;shish
                  </Button>
                </div>

                {questions.map((question, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-400">
                    <CardContent className="space-y-6 p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-gray-700">
                          Savol {index + 1}
                        </h3>
                        {questions.length > 1 && (
                          <Button
                            variant="destructive"
                            onClick={() => removeQuestion(index)}
                            size="sm"
                            className="hover:bg-red-600"
                          >
                            O&apos;chirish
                          </Button>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`question-${index}`} className="text-lg font-medium">Savol matni</Label>
                        <Input
                          type="text"
                          id={`question-${index}`}
                          required
                          className="mt-2"
                          value={question.text}
                          onChange={(e) =>
                            handleQuestionChange(index, 'text', e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-4">
                        <Label className="text-lg font-medium">Javob variantlari</Label>
                        <RadioGroup
                          value={question.correctAnswer || question.options[0]}
                          onValueChange={(value) => handleQuestionChange(index, 'correctAnswer', value)}
                          className="space-y-4"
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                              <RadioGroupItem
                                value={option}
                                id={`option-${index}-${optionIndex}`}
                                className="w-5 h-5"
                              />
                              <Input
                                type="text"
                                required
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options];
                                  newOptions[optionIndex] = e.target.value;
                                  handleQuestionChange(index, 'options', newOptions);
                                }}
                                placeholder={`Variant ${optionIndex + 1}`}
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin')}
                  className="hover:bg-gray-100"
                >
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}