#!/bin/sh
set -e

echo "🚀 Starting Autism Network Application..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until nc -z postgres 5432; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is up!"

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Push database schema (creates tables if they don't exist)
echo "🗄️  Syncing database schema..."
npx prisma db push --accept-data-loss

echo "✅ Database schema synced!"

# Seed the database (Create Admin User)
echo "🌱 Seeding database..."
npx prisma db seed

# Start the application
echo "🌐 Starting Next.js server..."
exec node server.js
