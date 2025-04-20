import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('Cleaning database...');
    
    // Delete all transactions
    await prisma.transaction.deleteMany();
    console.log('Deleted all transactions');
    
    // Delete all categories
    await prisma.category.deleteMany();
    console.log('Deleted all categories');
    
    console.log('Database cleaned successfully!');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase(); 