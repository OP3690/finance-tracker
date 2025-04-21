import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    console.log('Fetching transactions...');
    console.log('Database URL:', process.env.DATABASE_URL);

    let whereClause = {};
    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0);

      whereClause = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    console.log('Query where clause:', whereClause);

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        date: true,
        category: true,
        description: true,
        amount: true,
        comment: true,
        createdAt: true,
      },
    });

    return NextResponse.json(transactions);
  } catch (error: unknown) {
    console.error('Failed to fetch transactions:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Creating new transaction...');
    console.log('Request data:', data);
    console.log('Database URL:', process.env.DATABASE_URL);

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(data.date),
        category: data.category,
        description: data.description,
        amount: data.amount,
        comment: data.comment,
      },
      select: {
        id: true,
        date: true,
        category: true,
        description: true,
        amount: true,
        comment: true,
        createdAt: true,
      },
    });

    return NextResponse.json(transaction);
  } catch (error: unknown) {
    console.error('Failed to create transaction. Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
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