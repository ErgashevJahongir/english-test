import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/lib/auth';

export async function GET(
  request: Request,
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop(); // URL'dan id ni ajratamiz

    const result = await prisma.testResult.findUnique({
      where: {
        id: id,
      },
      include: {
        test: {
          include: {
            questions: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!result) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Faqat admin yoki test natijasining egasi ko'rishi mumkin
    if (
      session.user.role !== 'ADMIN' &&
      result.userId !== session.user.id
    ) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching test result:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop(); // URL'dan id ni ajratamiz

    await prisma.testResult.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting test result:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}