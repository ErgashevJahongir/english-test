import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const [totalUsers, totalTests, totalTestResults, averageScore, recentResults] =
      await Promise.all([
        prisma.user.count(),
        prisma.test.count(),
        prisma.testResult.count(),
        prisma.testResult.aggregate({
          _avg: {
            score: true,
          },
        }),
        prisma.testResult.findMany({
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            test: {
              select: {
                title: true,
              },
            },
          },
        }),
      ]);

    return NextResponse.json({
      totalUsers,
      totalTests,
      totalTestResults,
      averageScore: averageScore._avg.score || 0,
      recentResults,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 