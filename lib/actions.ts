import { prisma } from '@/lib/prisma';

export async function getTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
} 