#!/bin/bash

# NovelWriter macOS Setup Script
# This script helps set up the development environment on macOS

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📚 NovelWriter - macOS Setup Script"
echo "===================================="
echo ""

# Check macOS version
echo "🔍 Checking macOS version..."
MACOS_VERSION=$(sw_vers -productVersion)
echo "   Found: macOS $MACOS_VERSION"

MACOS_MAJOR=$(echo $MACOS_VERSION | cut -d. -f1)
if [ "$MACOS_MAJOR" -lt 10 ]; then
    echo -e "${RED}❌ Error: macOS 10.15 or later required${NC}"
    exit 1
fi
echo -e "${GREEN}✓ macOS version compatible${NC}"
echo ""

# Check for Xcode Command Line Tools
echo "🔍 Checking for Xcode Command Line Tools..."
if xcode-select -p &> /dev/null; then
    echo -e "${GREEN}✓ Xcode Command Line Tools installed${NC}"
else
    echo -e "${YELLOW}⚠ Xcode Command Line Tools not found${NC}"
    echo "   Installing..."
    xcode-select --install
    echo "   Please complete the installation in the dialog, then run this script again."
    exit 0
fi
echo ""

# Check for Homebrew
echo "🔍 Checking for Homebrew..."
if command -v brew &> /dev/null; then
    echo -e "${GREEN}✓ Homebrew installed${NC}"
    BREW_VERSION=$(brew --version | head -n 1)
    echo "   $BREW_VERSION"
else
    echo -e "${YELLOW}⚠ Homebrew not found${NC}"
    echo "   Homebrew is recommended but not required."
    echo "   Install from: https://brew.sh"
fi
echo ""

# Check Node.js
echo "🔍 Checking for Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')
    echo "   Found: $NODE_VERSION"
    
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo -e "${RED}❌ Node.js 18+ required (found v$NODE_MAJOR)${NC}"
        if command -v brew &> /dev/null; then
            echo "   Upgrade with: brew upgrade node"
        else
            echo "   Download from: https://nodejs.org"
        fi
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js version compatible${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    if command -v brew &> /dev/null; then
        echo "   Install with: brew install node"
    else
        echo "   Download from: https://nodejs.org"
    fi
    exit 1
fi
echo ""

# Check Yarn
echo "🔍 Checking for Yarn..."
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    echo "   Found: v$YARN_VERSION"
    echo -e "${GREEN}✓ Yarn installed${NC}"
else
    echo -e "${YELLOW}⚠ Yarn not found${NC}"
    if command -v brew &> /dev/null; then
        echo "   Installing via Homebrew..."
        brew install yarn
        echo -e "${GREEN}✓ Yarn installed${NC}"
    else
        echo "   Install with: npm install -g yarn"
        exit 1
    fi
fi
echo ""

# Check for Git
echo "🔍 Checking for Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "   Found: $GIT_VERSION"
    echo -e "${GREEN}✓ Git installed${NC}"
else
    echo -e "${RED}❌ Git not found${NC}"
    echo "   Git should be included with Xcode Command Line Tools"
    echo "   Try: xcode-select --install"
    exit 1
fi
echo ""

# Check for optional Pandoc
echo "🔍 Checking for Pandoc (optional)..."
if command -v pandoc &> /dev/null; then
    PANDOC_VERSION=$(pandoc --version | head -n 1)
    echo "   Found: $PANDOC_VERSION"
    echo -e "${GREEN}✓ Pandoc installed (DOCX/EPUB export available)${NC}"
else
    echo -e "${YELLOW}⚠ Pandoc not found (optional)${NC}"
    echo "   Pandoc enables export to DOCX and EPUB formats"
    if command -v brew &> /dev/null; then
        read -p "   Install Pandoc now? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            brew install pandoc
            echo -e "${GREEN}✓ Pandoc installed${NC}"
        fi
    else
        echo "   Install from: https://pandoc.org/installing.html"
    fi
fi
echo ""

# Install dependencies
echo "📦 Installing NovelWriter dependencies..."
if [ -f "package.json" ]; then
    echo "   This may take 5-10 minutes on first run..."
    
    # Clean install
    if [ -d "node_modules" ]; then
        echo "   Cleaning old modules..."
        rm -rf node_modules
    fi
    
    echo "   Running yarn install..."
    yarn install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        echo "   Try manually: yarn install"
        exit 1
    fi
else
    echo -e "${RED}❌ package.json not found${NC}"
    echo "   Make sure you're in the NovelWriter directory"
    exit 1
fi
echo ""

# Summary
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "  1. Start development server: yarn dev"
echo "  2. Build for production: yarn release:mac"
echo "  3. Read the Quick Start: cat QUICK_START.md"
echo ""
echo "Installed components:"
echo "  ✓ Node.js $NODE_VERSION"
echo "  ✓ Yarn $YARN_VERSION"
echo "  ✓ Git"
if command -v pandoc &> /dev/null; then
    echo "  ✓ Pandoc (optional)"
fi
echo ""
echo "Optional improvements:"
if ! command -v pandoc &> /dev/null; then
    echo "  • Install Pandoc for DOCX/EPUB export: brew install pandoc"
fi
echo "  • Install LaTeX for PDF export: brew install --cask basictex"
echo ""
echo "📚 Happy writing!"
