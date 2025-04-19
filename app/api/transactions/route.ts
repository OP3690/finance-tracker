import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    
    let where = {};
    if (month) {
      const date = new Date(month);
      where = {
        date: {
          gte: startOfMonth(date),
          lte: endOfMonth(date),
        },
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(data.date),
        category: data.category,
        description: data.description,
        amount: parseFloat(data.amount),
        comment: data.comment || '',
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const transaction = await prisma.transaction.update({
      where: { id: data.id },
      data: {
        date: new Date(data.date),
        category: data.category,
        description: data.description,
        amount: parseFloat(data.amount),
        comment: data.comment || '',
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Failed to update transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
} 