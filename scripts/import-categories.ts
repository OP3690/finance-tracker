const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Groceries',
    descriptions: [
      'Eggs', 'Chicken', 'Meat', 'Dry Fruits', 'Khari', 'Cold Drinks', 'Wheat (Gehu)',
      'Fish', 'Vegetables', 'Fruits', 'Oil', 'Rice', 'Aata (Flour)', 'Dal (Lentils)',
      'Masala (Spices)', 'Milk', 'Soap', 'Snacks', 'Sugar', 'Salt', 'Tea', 'Coffee', 'Other'
    ]
  },
  {
    name: 'Transportation',
    descriptions: [
      'Taxi', 'Train Fare', 'Fuel (Petrol/Diesel)', 'Car Maintenance',
      'Bike Maintenance', 'Airfare', 'Car Rental', 'Other'
    ]
  },
  {
    name: 'Recharge/Bill/EMI Payment',
    descriptions: [
      'Electricity', 'Wifi-Internet', 'Mobile Recharge', 'Gas Bill',
      'Loan Payment', 'Subscription - Netflix', 'Subscription - YouTube',
      'Subscription - LinkedIn', 'Subscription - Hotstar',
      'Subscription - AppleTV', 'Subscription - Other'
    ]
  },
  {
    name: 'Healthcare',
    descriptions: [
      'Medicine', 'Doctor Visit', 'Hospital Bill', 'Therapy',
      'Vitamins/Supplements', 'Medical Equipment', 'Lab Tests',
      'Prescription Drugs', 'Vision Care (e.g., Glasses)', 'Other'
    ]
  },
  {
    name: 'Insurance',
    descriptions: [
      'Health Insurance', 'Car Insurance', 'Home Insurance',
      'Life Insurance', 'Other'
    ]
  },
  {
    name: 'Cloths',
    descriptions: ['Shirts', 'Pants', 'Dresses', 'Other']
  },
  {
    name: 'Education - Books',
    descriptions: [
      'Books', 'E-Books', 'Journals', 'Magazines', 'Study Guides',
      'Stationery', 'Other'
    ]
  },
  {
    name: 'Investment',
    descriptions: [
      'Mutual Fund', 'Stocks', 'Bond Purchase', 'Real Estate',
      'Cryptocurrency', 'PPF', 'NPS', 'Fixed Deposit', 'Gold/Silver',
      'Business', 'Other'
    ]
  },
  {
    name: 'Income',
    descriptions: [
      'Saving A/c.', 'Salary', 'Bonus', 'Commission', 'Dividend',
      'Interest', 'Gift', 'Refund', 'Other'
    ]
  },
  {
    name: 'Other Expenses',
    descriptions: [
      'Repair - Electronics', 'Plumber', 'Hobbies', 'Travel',
      'Taxes', 'Miscellaneous', 'Other'
    ]
  }
];

async function importCategories() {
  try {
    console.log('Start importing categories...');

    // Delete all existing categories
    await prisma.category.deleteMany();

    // Insert all categories
    for (const category of categories) {
      await prisma.category.create({
        data: category
      });
    }

    console.log('Successfully imported categories!');
  } catch (error) {
    console.error('Error importing categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importCategories(); 