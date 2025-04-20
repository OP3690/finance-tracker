import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching categories from database...');
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    console.log(`Found ${categories.length} categories`);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, descriptions } = await request.json();
    console.log('Creating new category:', { name, descriptions });
    
    const category = await prisma.category.create({
      data: {
        name,
        descriptions,
      },
    });
    
    console.log('Created category:', category);
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, descriptions } = await request.json();
    console.log('Updating category:', { id, name, descriptions });
    
    const category = await prisma.category.update({
      where: { id },
      data: { 
        name,
        descriptions,
      },
    });
    
    console.log('Updated category:', category);
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    console.log('Deleting category:', id);
    
    await prisma.category.delete({
      where: { id },
    });
    
    console.log('Deleted category:', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
} 