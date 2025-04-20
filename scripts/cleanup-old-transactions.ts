const { MongoClient } = require('mongodb');
const { subDays, format } = require('date-fns');
const nodemailer = require('nodemailer');
const { Parser } = require('json2csv');
const fs = require('fs');

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  comment?: string;
}

const RETENTION_DAYS = 150;
const EMAIL = 'omprakashutaha@gmail.com';

async function generateCSV(transactions: Transaction[]): Promise<string> {
  const fields = ['id', 'date', 'category', 'description', 'amount', 'comment'];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(transactions);
  const fileName = `deleted_transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  fs.writeFileSync(fileName, csv);
  return fileName;
}

async function sendEmail(fileName: string): Promise<void> {
  // Create a test account if you don't have SMTP credentials
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email", // Replace with your SMTP server
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Finance Tracker" <cleanup@finance-tracker.com>',
    to: EMAIL,
    subject: `Deleted Transactions Report - ${format(new Date(), 'yyyy-MM-dd')}`,
    text: `Please find attached the list of transactions older than ${RETENTION_DAYS} days that have been deleted.`,
    attachments: [
      {
        filename: fileName,
        path: fileName,
      },
    ],
  });

  console.log("Email sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
  // Clean up the CSV file
  fs.unlinkSync(fileName);
}

async function cleanupOldTransactions() {
  const mongoUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/finance-tracker';
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('transactions');

    const cutoffDate = subDays(new Date(), RETENTION_DAYS);
    
    // First, fetch the transactions that will be deleted
    const transactionsToDelete = await collection.find({
      date: {
        $lt: cutoffDate.toISOString()
      }
    }).toArray();

    if (transactionsToDelete.length > 0) {
      // Generate CSV and send email
      const fileName = await generateCSV(transactionsToDelete);
      await sendEmail(fileName);

      // Then delete the transactions
      const result = await collection.deleteMany({
        date: {
          $lt: cutoffDate.toISOString()
        }
      });

      console.log(`Deleted ${result.deletedCount} transactions older than ${RETENTION_DAYS} days`);
      console.log('A CSV file has been sent to your email with the details of deleted transactions');
    } else {
      console.log(`No transactions found older than ${RETENTION_DAYS} days`);
    }
  } catch (error) {
    console.error('Error cleaning up old transactions:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

cleanupOldTransactions().catch(console.error); 