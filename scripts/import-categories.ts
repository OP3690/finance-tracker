import { prisma } from '../lib/prisma';

const categories = [
  {
    name: 'Food & Dining',
    descriptions: ['Restaurants', 'Groceries', 'Fast Food', 'Coffee Shops'],
  },
  {
    name: 'Transportation',
    descriptions: ['Gas', 'Public Transit', 'Car Maintenance', 'Parking'],
  },
  {
    name: 'Shopping',
    descriptions: ['Clothing', 'Electronics', 'Home Goods', 'Books'],
  },
  {
    name: 'Entertainment',
    descriptions: ['Movies', 'Games', 'Music', 'Hobbies'],
  },
  {
    name: 'Health',
    descriptions: ['Doctor', 'Pharmacy', 'Gym', 'Health Insurance'],
  },
  {
    name: 'Housing',
    descriptions: ['Rent', 'Utilities', 'Home Insurance', 'Maintenance'],
  },
  {
    name: 'Personal Care',
    descriptions: ['Hair Care', 'Cosmetics', 'Spa & Massage'],
  },
  {
    name: 'Education',
    descriptions: ['Tuition', 'Books', 'Courses', 'School Supplies'],
  },
  {
    name: 'Gifts & Donations',
    descriptions: ['Charity', 'Presents', 'Donations'],
  },
  {
    name: 'Travel',
    descriptions: ['Flights', 'Hotels', 'Vacation', 'Travel Insurance'],
  },
  {
    name: 'Business',
    descriptions: ['Office Supplies', 'Software', 'Professional Services'],
  },
  {
    name: 'Insurance',
    descriptions: ['Life Insurance', 'Car Insurance', 'Property Insurance'],
  },
  {
    name: 'Taxes',
    descriptions: ['Income Tax', 'Property Tax', 'Sales Tax'],
  },
  {
    name: 'Investments',
    descriptions: ['Stocks', 'Bonds', 'Mutual Funds', 'Retirement'],
  },
  {
    name: 'Debt',
    descriptions: ['Credit Card', 'Student Loans', 'Personal Loans'],
  },
];

async function importCategories() {
  try {
    console.log('Importing categories...');
    
    for (const category of categories) {
      await prisma.category.create({
        data: category,
      });
      console.log(`Created category: ${category.name}`);
    }
    
    console.log('Categories imported successfully!');
  } catch (error) {
    console.error('Error importing categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importCategories(); 