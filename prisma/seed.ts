const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Income',
    descriptions: ['Salary', 'Saving A/c.', 'Refund', 'Other Income'],
  },
  {
    name: 'Investment',
    descriptions: ['Stocks', 'Mutual Fund', 'Fixed Deposits', 'Other Investments'],
  },
  {
    name: 'Groceries',
    descriptions: [
      'Eggs', 'Chicken', 'Meat', 'Dry Fruits', 'Khari', 'Cold Drinks',
      'Wheat (Gehu)', 'Fish', 'Vegetables', 'Fruits', 'Oil', 'Rice',
      'Aata (Flour)', 'Dal (Lentils)', 'Masala (Spices)', 'Milk',
      'Soap', 'Snacks', 'Sugar', 'Salt', 'Tea', 'Coffee', 'Other'
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
    name: 'Other Expenses',
    descriptions: [
      'Repair - Electronics', 'Plumber', 'Hobbies',
      'Travel', 'Taxes', 'Miscellaneous', 'Other'
    ]
  }
];

async function main() {
  console.log('Start seeding categories...');
  
  // Clear existing categories
  await prisma.category.deleteMany();
  
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }
  
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 