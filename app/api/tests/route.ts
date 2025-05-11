import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
}

type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
type AgeGroup = 'KIDS_7_9' | 'KIDS_10_12' | 'TEENS_13_15' | 'TEENS_16_18';

interface TestWhereInput {
  difficulty?: Difficulty;
  ageGroup?: AgeGroup;
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
    const difficulty = searchParams.get('difficulty') as Difficulty | null;
    const ageGroup = searchParams.get('ageGroup') as AgeGroup | null;

    const where: TestWhereInput = {};

    // Enum qiymatlarini tekshirish
    if (difficulty) {
      where.difficulty = difficulty;
    }
    if (ageGroup) {
      where.ageGroup = ageGroup;
    }

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

    // Enum qiymatlarini tekshirish
    const validDifficulties: Difficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    const validAgeGroups: AgeGroup[] = ['KIDS_7_9', 'KIDS_10_12', 'TEENS_13_15', 'TEENS_16_18'];

    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: 'Noto\'g\'ri difficulty qiymati' },
        { status: 400 }
      );
    }

    if (!validAgeGroups.includes(ageGroup)) {
      return NextResponse.json(
        { error: 'Noto\'g\'ri ageGroup qiymati' },
        { status: 400 }
      );
    }

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