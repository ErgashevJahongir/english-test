import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Ruxsat berilmagan' },
        { status: 401 }
      );
    }

    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop(); // URL'dan id ni ajratamiz

    const results = await prisma.testResult.findMany({
      where: { testId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            school: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(results);
  } catch {
    console.error('Test natijalarini olishda xatolik');
    return NextResponse.json(
      { error: 'Test natijalarini olishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
} 