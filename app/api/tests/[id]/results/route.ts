import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Ruxsat berilmagan' },
        { status: 401 }
      );
    }

    const results = await prisma.testResult.findMany({
      where: { testId: params.id },
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