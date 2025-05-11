import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export async function GET(
  request: Request,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop(); // URL'dan id ni ajratamiz

    const test = await prisma.test.findUnique({
      where: { id: id },
      include: { questions: true },
    });

    if (!test) {
      return new NextResponse('Test topilmadi', { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error('Testni olishda xatolik:', error);
    return new NextResponse('Server xatosi', { status: 500 });
  }
}

export async function PUT(
  request: Request,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { title, description, duration, questions } = body;

    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop(); // URL'dan id ni ajratamiz

    // Testni yangilash
    const updatedTest = await prisma.test.update({
      where: { id: id },
      data: {
        title,
        description,
        duration,
        questions: {
          deleteMany: {},
          create: questions.map((question: Question) => ({
            text: question.text,
            options: question.options,
            correctAnswer: question.correctAnswer,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(updatedTest);
  } catch (error) {
    console.error('Testni yangilashda xatolik:', error);
    return new NextResponse('Server xatosi', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop(); // URL'dan id ni ajratamiz

    // Avval test natijalarini o'chirish
    await prisma.testResult.deleteMany({
      where: { testId: id },
    });

    // Keyin testni o'chirish
    await prisma.test.delete({
      where: { id: id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Testni o\'chirishda xatolik:', error);
    return new NextResponse('Server xatosi', { status: 500 });
  }
} 