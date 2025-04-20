import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all budget categories
export async function GET() {
  try {
    const budgets = await prisma.budget.findMany({
      include: {
        category: true
      }
    });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Failed to fetch budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

// Create a new budget category
export async function POST(request: Request) {
  try {
    const { categoryId, limit } = await request.json();
    const budget = await prisma.budget.create({
      data: {
        categoryId,
        limit,
      },
      include: {
        category: true
      }
    });
    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}

// Update a budget category
export async function PUT(request: Request) {
  try {
    const { id, limit } = await request.json();
    const budget = await prisma.budget.update({
      where: { id },
      data: { limit },
      include: {
        category: true
      }
    });
    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

// Delete a budget category
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.budget.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
} 