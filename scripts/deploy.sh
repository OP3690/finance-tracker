#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🏗️ Building the application..."
npm run build

# Import transactions if MONGODB_URI is set
if [ -n "$MONGODB_URI" ]; then
  echo "📥 Importing transactions..."
  npm run import
else
  echo "⚠️ MONGODB_URI not set. Skipping transaction import."
fi

echo "✅ Deployment process completed!" 