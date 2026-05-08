#!/bin/sh
set -e

cd .medusa/server

echo "Running database migrations..."
npx medusa db:migrate

if [ "$BOOTSTRAP_ADMIN" = "true" ]; then
  echo "Creating admin user..."
  npx medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD"
  echo "Admin user created!"
fi

echo "Starting Medusa server..."
npx medusa start
