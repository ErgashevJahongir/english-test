import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password, age, school } = await request.json();

    // Validate input
    if (!name || !email || !password || !age) {
      return NextResponse.json(
        { message: 'Barcha majburiy maydonlarni to&apos;ldiring' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu email allaqachon ro&apos;yxatdan o&apos;tgan' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age,
        school,
      },
    });

    console.log(user);

    return NextResponse.json(
      { message: 'Foydalanuvchi muvaffaqiyatli yaratildi' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Xatolik yuz berdi' },
      { status: 500 }
    );
  }
}