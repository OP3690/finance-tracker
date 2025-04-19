const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

// Function to parse date from DD/MM/YYYY format
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

// Sample transaction data
const transactions = [
  {
    date: parseDate("01/04/2025"),
    category: "Income",
    description: "Salary",
    amount: 180000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Income",
    description: "Saving A/c.",
    amount: 130000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Income",
    description: "Refund",
    amount: 59000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("03/04/2025"),
    category: "Recharge/Bill/EMI Payment",
    description: "Loan Payment",
    amount: 28006,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("05/04/2025"),
    category: "Recharge/Bill/EMI Payment",
    description: "Loan Payment",
    amount: 22000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("06/04/2025"),
    category: "Recharge/Bill/EMI Payment",
    description: "Mobile Recharge",
    amount: 580,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("05/04/2025"),
    category: "Insurance",
    description: "Life Insurance",
    amount: 3500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("02/04/2025"),
    category: "Investment",
    description: "Mutual Fund",
    amount: 25000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("06/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 66,
    comment: "1L",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("06/04/2025"),
    category: "Groceries",
    description: "Vegetables",
    amount: 370,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("07/04/2025"),
    category: "Investment",
    description: "Mutual Fund",
    amount: 3690,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Recharge/Bill/EMI Payment",
    description: "Subscription - Netflix",
    amount: 650,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Groceries",
    description: "Vegetables",
    amount: 380,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("02/04/2025"),
    category: "Groceries",
    description: "Vegetables",
    amount: 250,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("04/04/2025"),
    category: "Groceries",
    description: "Vegetables",
    amount: 400,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("06/04/2025"),
    category: "Groceries",
    description: "Vegetables",
    amount: 445,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 231,
    comment: "3l+500g",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("02/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 66,
    comment: "1L",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("03/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 66,
    comment: "1L",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("04/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 66,
    comment: "1L",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("04/04/2025"),
    category: "Groceries",
    description: "Sugar",
    amount: 130,
    comment: "2kg",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("07/04/2025"),
    category: "Investment",
    description: "Stocks",
    amount: 103000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("07/04/2025"),
    category: "Investment",
    description: "Stocks",
    amount: 50000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("05/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 99,
    comment: "1L+500g",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("06/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 66,
    comment: "1L[10+100]",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("04/04/2025"),
    category: "Groceries",
    description: "Chicken",
    amount: 600,
    comment: "2,500kg",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Healthcare",
    description: "Medicine",
    amount: 2000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("02/04/2025"),
    category: "Healthcare",
    description: "Medicine",
    amount: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("02/04/2025"),
    category: "Groceries",
    description: "Other",
    amount: 70,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("04/04/2025"),
    category: "Groceries",
    description: "Khari",
    amount: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("05/04/2025"),
    category: "Groceries",
    description: "Khari",
    amount: 70,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("04/04/2025"),
    category: "Groceries",
    description: "Oil",
    amount: 215,
    comment: "1L",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("03/04/2025"),
    category: "Groceries",
    description: "Wheat (Gehu)",
    amount: 1100,
    comment: "30kg",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("02/04/2025"),
    category: "Groceries",
    description: "Eggs",
    amount: 108,
    comment: "12",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("04/04/2025"),
    category: "Groceries",
    description: "Eggs",
    amount: 108,
    comment: "12",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("06/04/2025"),
    category: "Groceries",
    description: "Eggs",
    amount: 180,
    comment: "20",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Groceries",
    description: "Fruits",
    amount: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("05/04/2025"),
    category: "Groceries",
    description: "Fruits",
    amount: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Groceries",
    description: "Dry Fruits",
    amount: 775,
    comment: "500g - Kaju",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Groceries",
    description: "Dry Fruits",
    amount: 829,
    comment: "500g - Badam",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Groceries",
    description: "Dry Fruits",
    amount: 550,
    comment: "200g - Pista",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Groceries",
    description: "Dry Fruits",
    amount: 475,
    comment: "500g - Akhrot",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Groceries",
    description: "Dry Fruits",
    amount: 250,
    comment: "200g - Pumpkin Seeds",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("01/04/2025"),
    category: "Groceries",
    description: "Soap",
    amount: 657,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("05/04/2025"),
    category: "Groceries",
    description: "Soap",
    amount: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("06/04/2025"),
    category: "Other Expenses",
    description: "Plumber",
    amount: 350,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("07/04/2025"),
    category: "Other Expenses",
    description: "Repair - Electronics",
    amount: 1260,
    comment: "Door Repairing",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("07/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 66,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("07/04/2025"),
    category: "Groceries",
    description: "Vegetables",
    amount: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("08/04/2025"),
    category: "Groceries",
    description: "Dal (Lentils)",
    amount: 400,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("08/04/2025"),
    category: "Healthcare",
    description: "Medicine",
    amount: 200,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("08/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 66,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("09/04/2025"),
    category: "Investment",
    description: "Mutual Fund",
    amount: 1500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("09/04/2025"),
    category: "Transportation",
    description: "Train Fare",
    amount: 2693,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("09/04/2025"),
    category: "Groceries",
    description: "Soap",
    amount: 300,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("09/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 132,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("09/04/2025"),
    category: "Groceries",
    description: "Khari",
    amount: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("10/04/2025"),
    category: "Groceries",
    description: "Fruits",
    amount: 600,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("10/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 66,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("10/04/2025"),
    category: "Groceries",
    description: "Vegetables",
    amount: 110,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("11/04/2025"),
    category: "Recharge/Bill/EMI Payment",
    description: "Mobile Recharge",
    amount: 929,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("11/04/2025"),
    category: "Groceries",
    description: "Oil",
    amount: 215,
    comment: "1L",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("11/04/2025"),
    category: "Groceries",
    description: "Tea",
    amount: 290,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("11/04/2025"),
    category: "Groceries",
    description: "Eggs",
    amount: 162,
    comment: "18",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("11/04/2025"),
    category: "Groceries",
    description: "Vegetables",
    amount: 600,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("11/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 66,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("12/04/2025"),
    category: "Other Expenses",
    description: "Repair - Electronics",
    amount: 1740,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("12/04/2025"),
    category: "Healthcare",
    description: "Medical Equipment",
    amount: 79,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("12/04/2025"),
    category: "Groceries",
    description: "Oil",
    amount: 215,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("12/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 166,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("12/04/2025"),
    category: "Groceries",
    description: "Cold Drinks",
    amount: 60,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("12/04/2025"),
    category: "Groceries",
    description: "Soap",
    amount: 67,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("13/04/2025"),
    category: "Groceries",
    description: "Chicken",
    amount: 1000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("13/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("13/04/2025"),
    category: "Groceries",
    description: "Fruits",
    amount: 520,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("14/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("14/04/2025"),
    category: "Healthcare",
    description: "Medicine",
    amount: 4000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("14/04/2025"),
    category: "Groceries",
    description: "Fruits",
    amount: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("14/04/2025"),
    category: "Groceries",
    description: "Khari",
    amount: 40,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("15/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("16/04/2025"),
    category: "Groceries",
    description: "Vegetables",
    amount: 740,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("16/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 125,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("16/04/2025"),
    category: "Groceries",
    description: "Chicken",
    amount: 400,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("16/04/2025"),
    category: "Groceries",
    description: "Fruits",
    amount: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("16/04/2025"),
    category: "Healthcare",
    description: "Therapy",
    amount: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("16/04/2025"),
    category: "Groceries",
    description: "Eggs",
    amount: 100,
    comment: "16",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("17/04/2025"),
    category: "Groceries",
    description: "Rice",
    amount: 1100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("17/04/2025"),
    category: "Healthcare",
    description: "Therapy",
    amount: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("17/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 199,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("18/04/2025"),
    category: "Transportation",
    description: "Car Rental",
    amount: 400,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("18/04/2025"),
    category: "Healthcare",
    description: "Medicine",
    amount: 522,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("18/04/2025"),
    category: "Healthcare",
    description: "Therapy",
    amount: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("18/04/2025"),
    category: "Groceries",
    description: "Milk",
    amount: 66,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: parseDate("18/04/2025"),
    category: "Groceries",
    description: "Eggs",
    amount: 150,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function importTransactions() {
  try {
    console.log('Start importing transactions...');

    // Delete all existing transactions
    await prisma.transaction.deleteMany();

    // Insert all transactions
    await prisma.transaction.createMany({
      data: transactions
    });

    console.log('Successfully imported transactions!');
  } catch (error) {
    console.error('Error importing transactions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importTransactions(); 