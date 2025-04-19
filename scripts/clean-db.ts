import { prisma } from '../lib/prisma';

async function cleanDb() {
  try {
    await prisma.transaction.deleteMany();
    console.log('Database cleaned successfully');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDb(); 