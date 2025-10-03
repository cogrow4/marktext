#!/bin/bash

# NovelCraft macOS Setup Script
echo "🚀 Setting up NovelCraft for macOS..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check Node.js version (should be 18+)
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    echo "Please update Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git from https://git-scm.com/"
    exit 1
fi

echo "✅ Git version: $(git --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install native dependencies for macOS
echo "🔧 Building native dependencies for macOS..."
npm run rebuild

# Check if Xcode Command Line Tools are installed
if ! xcode-select -p &> /dev/null; then
    echo "⚠️  Xcode Command Line Tools not found. Installing..."
    xcode-select --install
    echo "Please complete the Xcode Command Line Tools installation and run this script again."
    exit 1
fi

echo "✅ Xcode Command Line Tools are installed"

# Build the application
echo "🏗️  Building NovelCraft..."
npm run build:dev

echo "🎉 Setup complete! You can now run NovelCraft with:"
echo "   npm run dev"
echo ""
echo "To build for production:"
echo "   npm run build"
echo ""
echo "To create a macOS app bundle:"
echo "   npm run release:mac"