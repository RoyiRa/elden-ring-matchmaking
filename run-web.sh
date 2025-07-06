#!/bin/bash

echo "🚀 Starting Elden Ring Matchmaking Web App..."

# Create web directory if it doesn't exist
mkdir -p web

# Copy package.json to web directory
cp web-package.json web/package.json

# Navigate to web directory
cd web

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start the development server
echo "🌐 Starting development server..."
echo "The app will be available at: http://localhost:3000"
npm start 