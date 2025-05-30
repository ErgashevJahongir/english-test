import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Ruxsat berilmagan' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        school: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Foydalanuvchi topilmadi' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Foydalanuvchi ma\'lumotlarini olishda xatolik:', error);
    return NextResponse.json(
      { error: 'Foydalanuvchi ma\'lumotlarini olishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Ruxsat berilmagan' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { name, email, age, school } = data;

    // Email boshqa foydalanuvchi tomonidan ishlatilganligini tekshirish
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email allaqachon ro\'yxatdan o\'tgan' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        age,
        school,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        school: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Foydalanuvchi ma\'lumotlarini yangilashda xatolik:', error);
    return NextResponse.json(
      { error: 'Foydalanuvchi ma\'lumotlarini yangilashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
} 