import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('Fetching transactions...');
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Database URL:', process.env.DATABASE_URL);

    // First, let's check if we can connect to the database
    const allTransactions = await prisma.transaction.findMany();
    console.log('Total transactions in database:', allTransactions.length);
    console.log('Sample transaction:', allTransactions[0]);

    let whereClause: any = {};
    
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate);
      }
    }

    console.log('Query where clause:', JSON.stringify(whereClause, null, 2));

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

    console.log('Found transactions:', JSON.stringify(transactions, null, 2));
    return NextResponse.json(transactions);
  } catch (error: unknown) {
    console.error('Failed to fetch transactions:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
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