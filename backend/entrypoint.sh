#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
./wait-for-it.sh db:5432 --timeout=30 --strict -- echo "Database is ready!"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
exec npm start
