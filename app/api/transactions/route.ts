import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request: Request) {
  try {
    console.log('Fetching transactions...');
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

    console.log('Database URL:', process.env.DATABASE_URL);
    console.log('Query where clause:', where);

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' }
      ],
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

    console.log(`Found ${transactions.length} transactions`);
    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Creating new transaction...', { data });

    // Validate required fields
    if (!data.date || !data.category || !data.description || data.amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(data.date),
        category: data.category,
        description: data.description,
        amount: Number(data.amount),
        comment: data.comment || undefined,
        createdAt: new Date(),
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
  } catch (error: any) {
    console.error('Failed to create transaction:', error);
    
    // Handle specific database errors
    if (error.code === 'P1001' || error.code === 'P1017') {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }

    // Handle authentication errors
    if (error.code === 'P1012') {
      return NextResponse.json(
        { error: 'Database authentication failed. Please check your credentials.' },
        { status: 401 }
      );
    }

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