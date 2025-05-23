import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialCategories = [
  {
    name: 'Groceries',
    descriptions: ['Eggs', 'Chicken', 'Meat', 'Dry Fruits', 'Khari', 'Cold Drinks', 'Wheat (Gehu)', 'Fish', 'Vegetables', 'Fruits', 'Oil', 'Rice', 'Aata (Flour)', 'Dal (Lentils)', 'Masala (Spices)', 'Milk', 'Soap', 'Snacks', 'Sugar', 'Salt', 'Tea', 'Coffee', 'Other']
  },
  {
    name: 'Transportation',
    descriptions: ['Taxi', 'Train Fare', 'Fuel (Petrol/Diesel)', 'Car Maintenance', 'Bike Maintenance', 'Airfare', 'Car Rental', 'Other']
  },
  {
    name: 'Recharge/Bill/EMI Payment',
    descriptions: ['Electricity', 'Wifi-Internet', 'Mobile Recharge', 'Gas Bill', 'Loan Payment', 'Subscription - Netflix', 'Subscription - YouTube', 'Subscription - LinkedIn', 'Subscription - Hotstar', 'Subscription - AppleTV', 'Subscription - Other']
  },
  {
    name: 'Healthcare',
    descriptions: ['Medicine', 'Doctor Visit', 'Hospital Bill', 'Therapy', 'Vitamins/Supplements', 'Medical Equipment', 'Lab Tests', 'Prescription Drugs', 'Vision Care (e.g., Glasses)', 'Other']
  },
  {
    name: 'Insurance',
    descriptions: ['Health Insurance', 'Car Insurance', 'Home Insurance', 'Life Insurance', 'Other']
  },
  {
    name: 'Cloths',
    descriptions: ['Shirts', 'Pants', 'Dresses', 'Other']
  },
  {
    name: 'Education - Books',
    descriptions: ['Books', 'E-Books', 'Journals', 'Magazines', 'Study Guides', 'Stationery', 'Other']
  },
  {
    name: 'Investment',
    descriptions: ['Mutual Fund', 'Stocks', 'Bond Purchase', 'Real Estate', 'Cryptocurrency', 'PPF', 'NPS', 'Fixed Deposit', 'Gold/Silver', 'Business', 'Other']
  },
  {
    name: 'Income',
    descriptions: ['Saving A/c.', 'Salary', 'Bonus', 'Commission', 'Dividend', 'Interest', 'Gift', 'Refund', 'Other']
  },
  {
    name: 'Other Expenses',
    descriptions: ['Repair - Electronics', 'Plumber', 'Hobbies', 'Travel', 'Taxes', 'Miscellaneous', 'Other']
  }
];

export async function GET() {
  // Skip database operations during build time
  if (process.env.SKIP_DB_INIT === 'true') {
    return NextResponse.json({ message: 'Database initialization skipped during build' });
  }

  try {
    console.log('Initializing categories...');
    
    for (const category of initialCategories) {
      const existingCategory = await prisma.category.findUnique({
        where: { name: category.name }
      });

      if (!existingCategory) {
        await prisma.category.create({
          data: category
        });
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category ${category.name} already exists`);
      }
    }

    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    console.log('Categories initialization complete');
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to initialize categories:', error);
    return NextResponse.json({ error: 'Failed to initialize categories' }, { status: 500 });
  }
} 