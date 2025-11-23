


echo "NODE_ENV: $NODE_ENV"
echo "Running DB migrations..."

# Run database migrations (fails the container if migration fails)
NODE_ENV=production ./node_modules/.bin/db-migrate up

echo "Migrations completed. Starting server..."
node build/index.js
