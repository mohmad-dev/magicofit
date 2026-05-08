#!/bin/sh
set -e

cd .medusa/server

echo "=== Medusa Startup ==="
echo "ADMIN_EMAIL=$ADMIN_EMAIL"
echo "Running database migrations..."
npx medusa db:migrate

echo "Creating admin user..."
npx medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD" || echo "Admin user creation skipped (may already exist)"

echo "Starting Medusa server..."
npx medusa start
