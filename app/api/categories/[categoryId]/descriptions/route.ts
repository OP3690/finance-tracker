import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { categoryId: string } }) {
  try {
    const { description } = await request.json();
    const category = await prisma.category.findUnique({
      where: { id: params.categoryId }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: params.categoryId },
      data: {
        descriptions: {
          push: description
        }
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error adding description:', error);
    return NextResponse.json({ error: 'Failed to add description' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { categoryId: string } }) {
  try {
    const { description, newDescription } = await request.json();
    const category = await prisma.category.findUnique({
      where: { id: params.categoryId }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const descriptionIndex = category.descriptions.indexOf(description);
    if (descriptionIndex === -1) {
      return NextResponse.json({ error: 'Description not found' }, { status: 404 });
    }

    const updatedDescriptions = [...category.descriptions];
    updatedDescriptions[descriptionIndex] = newDescription;

    const updatedCategory = await prisma.category.update({
      where: { id: params.categoryId },
      data: {
        descriptions: updatedDescriptions
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating description:', error);
    return NextResponse.json({ error: 'Failed to update description' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { categoryId: string } }) {
  try {
    const { description } = await request.json();
    const category = await prisma.category.findUnique({
      where: { id: params.categoryId }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updatedDescriptions = category.descriptions.filter(desc => desc !== description);

    const updatedCategory = await prisma.category.update({
      where: { id: params.categoryId },
      data: {
        descriptions: updatedDescriptions
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error deleting description:', error);
    return NextResponse.json({ error: 'Failed to delete description' }, { status: 500 });
  }
} 