import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
}

interface TestWhereInput {
  difficulty?: string;
  ageGroup?: string;
}

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Ruxsat berilmagan' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const ageGroup = searchParams.get('ageGroup');

    const where: TestWhereInput = {};
    if (difficulty) where.difficulty = difficulty;
    if (ageGroup) where.ageGroup = ageGroup;

    const tests = await prisma.test.findMany({
      where,
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
            type: true,
            points: true,
          },
        },
      },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error('Testlarni olishda xatolik:', error);
    return NextResponse.json(
      { error: 'Testlarni olishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Ruxsat berilmagan' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { title, description, duration, difficulty, ageGroup, questions } = data;

    const test = await prisma.test.create({
      data: {
        title,
        description,
        duration,
        difficulty,
        ageGroup,
        questions: {
          create: questions.map((q: Question) => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer.toString(),
            type: 'MULTIPLE_CHOICE',
            points: 1
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error('Test yaratishda xatolik:', error);
    return NextResponse.json(
      { error: 'Test yaratishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
} 