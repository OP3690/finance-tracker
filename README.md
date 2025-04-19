# Finance Tracker

A modern web application for tracking personal finances built with Next.js, TypeScript, and MongoDB.

## Features

- Transaction management (add, edit, delete)
- Monthly financial summaries
- Category-wise expense distribution
- Daily spending and investment tracking
- Responsive design with modern UI

## Tech Stack

- Next.js 14
- TypeScript
- MongoDB with Prisma
- React Query for data fetching
- Recharts for data visualization
- Tailwind CSS for styling
- Headless UI for accessible components

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:
```
DATABASE_URL="mongodb://localhost:27017/finance_tracker"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Usage

1. **Transactions**
   - Add new transactions with date, category, description, and amount
   - Edit existing transactions
   - Delete transactions
   - Filter transactions by month

2. **Summary**
   - View monthly income and expenses
   - Track balance over time
   - Analyze category-wise spending

3. **Charts**
   - View expense distribution by category
   - Track daily spending and investments
   - Compare monthly trends

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 