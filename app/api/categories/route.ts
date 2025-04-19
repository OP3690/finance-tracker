import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES_WITH_DESCRIPTIONS = [
  {
    id: '1',
    name: 'Groceries',
    descriptions: ['Eggs', 'Chicken', 'Meat', 'Dry Fruits', 'Khari', 'Cold Drinks', 'Wheat (Gehu)', 'Fish', 'Vegetables', 'Fruits', 'Oil', 'Rice', 'Aata (Flour)', 'Dal (Lentils)', 'Masala (Spices)', 'Milk', 'Soap', 'Snacks', 'Sugar', 'Salt', 'Tea', 'Coffee', 'Other']
  },
  {
    id: '2',
    name: 'Transportation',
    descriptions: ['Taxi', 'Train Fare', 'Fuel (Petrol/Diesel)', 'Car Maintenance', 'Bike Maintenance', 'Airfare', 'Car Rental', 'Other']
  },
  {
    id: '3',
    name: 'Recharge/Bill/EMI Payment',
    descriptions: ['Electricity', 'Wifi-Internet', 'Mobile Recharge', 'Gas Bill', 'Loan Payment', 'Subscription - Netflix', 'Subscription - YouTube', 'Subscription - LinkedIn', 'Subscription - Hotstar', 'Subscription - AppleTV', 'Subscription - Other']
  },
  {
    id: '4',
    name: 'Healthcare',
    descriptions: ['Medicine', 'Doctor Visit', 'Hospital Bill', 'Therapy', 'Vitamins/Supplements', 'Medical Equipment', 'Lab Tests', 'Prescription Drugs', 'Vision Care (e.g., Glasses)', 'Other']
  },
  {
    id: '5',
    name: 'Insurance',
    descriptions: ['Health Insurance', 'Car Insurance', 'Home Insurance', 'Life Insurance', 'Other']
  },
  {
    id: '6',
    name: 'Cloths',
    descriptions: ['Shirts', 'Pants', 'Dresses', 'Other']
  },
  {
    id: '7',
    name: 'Education - Books',
    descriptions: ['Books', 'E-Books', 'Journals', 'Magazines', 'Study Guides', 'Stationery', 'Other']
  },
  {
    id: '8',
    name: 'Investment',
    descriptions: ['Mutual Fund', 'Stocks', 'Bond Purchase', 'Real Estate', 'Cryptocurrency', 'PPF', 'NPS', 'Fixed Deposit', 'Gold/Silver', 'Business', 'Other']
  },
  {
    id: '9',
    name: 'Income',
    descriptions: ['Saving A/c.', 'Salary', 'Bonus', 'Commission', 'Dividend', 'Interest', 'Gift', 'Refund', 'Other']
  },
  {
    id: '10',
    name: 'Other Expenses',
    descriptions: ['Repair - Electronics', 'Plumber', 'Hobbies', 'Travel', 'Taxes', 'Miscellaneous', 'Other']
  }
];

export async function GET() {
  try {
    return NextResponse.json(CATEGORIES_WITH_DESCRIPTIONS);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, descriptions } = await request.json();
    const id = (CATEGORIES_WITH_DESCRIPTIONS.length + 1).toString();
    const newCategory = { id, name, descriptions };
    CATEGORIES_WITH_DESCRIPTIONS.push(newCategory);
    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, descriptions } = await request.json();
    const category = await prisma.category.update({
      where: { id },
      data: { 
        name,
        descriptions,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
} 