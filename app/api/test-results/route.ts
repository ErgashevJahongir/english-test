import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

interface Answer {
  questionId: string;
  selectedOption: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const results = await prisma.testResult.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        test: {
          select: {
            title: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching test results:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { testId, answers, timeTaken } = body;

    if (!testId || !answers || !timeTaken) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const test = await prisma.test.findUnique({
      where: {
        id: testId,
      },
      include: {
        questions: true,
      },
    });

    if (!test) {
      return new NextResponse('Test not found', { status: 404 });
    }

    let correctAnswers = 0;
    const totalQuestions = test.questions.length;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processedAnswers = test.questions.map((question: any) => {
      const answer = answers.find((a: Answer) => a.questionId === question.id);
      const isCorrect = answer?.selectedOption === question.correctAnswer;

      if (isCorrect) {
        correctAnswers++;
      }

      return {
        questionId: question.id,
        selectedOption: answer?.selectedOption || null,
        isCorrect,
      };
    });

    const score = (correctAnswers / totalQuestions) * 100;

    const result = await prisma.testResult.create({
      data: {
        userId: session.user.id,
        testId,
        score,
        correctAnswers,
        totalQuestions,
        answers: processedAnswers,
        timeTaken,
        completed: true,
      },
      include: {
        test: {
          select: {
            title: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating test result:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}