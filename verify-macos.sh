#!/bin/bash

# NovelCraft macOS Verification Script
echo "🔍 Verifying NovelCraft setup for macOS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 is installed${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 is not installed${NC}"
        return 1
    fi
}

# Function to check version
check_version() {
    local cmd=$1
    local min_version=$2
    local current_version=$3
    
    if [ "$(printf '%s\n' "$min_version" "$current_version" | sort -V | head -n1)" = "$min_version" ]; then
        echo -e "${GREEN}✅ $cmd version $current_version is compatible${NC}"
        return 0
    else
        echo -e "${RED}❌ $cmd version $current_version is too old (minimum: $min_version)${NC}"
        return 1
    fi
}

echo "📋 System Requirements Check:"
echo "================================"

# Check macOS version
MACOS_VERSION=$(sw_vers -productVersion)
echo -e "${GREEN}✅ macOS version: $MACOS_VERSION${NC}"

# Check Node.js
if check_command "node"; then
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    check_version "Node.js" "18.0.0" "$NODE_VERSION"
    NODE_OK=$?
else
    NODE_OK=1
fi

# Check npm
if check_command "npm"; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ npm version: $NPM_VERSION${NC}"
    NPM_OK=0
else
    NPM_OK=1
fi

# Check Git
if check_command "git"; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    echo -e "${GREEN}✅ Git version: $GIT_VERSION${NC}"
    GIT_OK=0
else
    GIT_OK=1
fi

# Check Xcode Command Line Tools
if xcode-select -p &> /dev/null; then
    echo -e "${GREEN}✅ Xcode Command Line Tools are installed${NC}"
    XCODE_OK=0
else
    echo -e "${RED}❌ Xcode Command Line Tools are not installed${NC}"
    XCODE_OK=1
fi

echo ""
echo "📦 Dependencies Check:"
echo "======================"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules directory exists${NC}"
    DEPS_OK=0
else
    echo -e "${YELLOW}⚠️  node_modules directory not found${NC}"
    DEPS_OK=1
fi

# Check if package.json exists
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json exists${NC}"
else
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

echo ""
echo "🏗️  Build System Check:"
echo "======================="

# Check if dist directory exists
if [ -d "dist" ]; then
    echo -e "${GREEN}✅ dist directory exists${NC}"
    BUILD_OK=0
else
    echo -e "${YELLOW}⚠️  dist directory not found (run 'npm run build:dev')${NC}"
    BUILD_OK=1
fi

echo ""
echo "📊 Summary:"
echo "==========="

TOTAL_ERRORS=$((NODE_OK + NPM_OK + GIT_OK + XCODE_OK + DEPS_OK + BUILD_OK))

if [ $TOTAL_ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! NovelCraft is ready to run.${NC}"
    echo ""
    echo "To start NovelCraft:"
    echo "  npm run dev"
    echo ""
    echo "To build for production:"
    echo "  npm run build"
    echo ""
    echo "To create macOS app bundle:"
    echo "  npm run release:mac"
elif [ $TOTAL_ERRORS -le 2 ]; then
    echo -e "${YELLOW}⚠️  Some issues found. NovelCraft may work with limitations.${NC}"
    echo ""
    echo "Recommended actions:"
    if [ $NODE_OK -ne 0 ]; then
        echo "  - Install Node.js 18+ from https://nodejs.org/"
    fi
    if [ $XCODE_OK -ne 0 ]; then
        echo "  - Install Xcode Command Line Tools: xcode-select --install"
    fi
    if [ $DEPS_OK -ne 0 ]; then
        echo "  - Install dependencies: npm install"
    fi
    if [ $BUILD_OK -ne 0 ]; then
        echo "  - Build the application: npm run build:dev"
    fi
else
    echo -e "${RED}❌ Multiple issues found. Please fix the problems above.${NC}"
    echo ""
    echo "Run the setup script to fix most issues:"
    echo "  ./setup-macos.sh"
fi

echo ""
echo "For more help, see README-MACOS.md"