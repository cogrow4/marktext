#!/bin/bash

# NovelWriter Setup Verification Script
# Checks that everything is correctly configured and ready to run

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

echo "🔍 NovelWriter Setup Verification"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    echo "   Please run this script from the NovelWriter root directory"
    exit 1
fi

# Check package.json content
echo "📦 Checking package.json..."
PKG_NAME=$(node -p "require('./package.json').name")
if [ "$PKG_NAME" = "novelwriter" ]; then
    echo -e "${GREEN}✓ Package name correct: $PKG_NAME${NC}"
else
    echo -e "${RED}✗ Package name incorrect: $PKG_NAME (expected: novelwriter)${NC}"
    ((ERRORS++))
fi

PKG_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}✓ Version: $PKG_VERSION${NC}"
echo ""

# Check Node.js version
echo "🔧 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')
    echo "   Version: $NODE_VERSION"
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "${GREEN}✓ Node.js version compatible${NC}"
    else
        echo -e "${RED}✗ Node.js 18+ required (found v$NODE_MAJOR)${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗ Node.js not found${NC}"
    ((ERRORS++))
fi
echo ""

# Check Yarn
echo "📦 Checking Yarn..."
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    echo "   Version: $YARN_VERSION"
    echo -e "${GREEN}✓ Yarn installed${NC}"
else
    echo -e "${RED}✗ Yarn not found${NC}"
    ((ERRORS++))
fi
echo ""

# Check node_modules
echo "📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    MODULE_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
    echo "   Found $MODULE_COUNT top-level modules"
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    
    # Check for key dependencies
    KEY_DEPS=("vue" "electron" "isomorphic-git" "vuedraggable" "electron-store")
    for dep in "${KEY_DEPS[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            echo -e "   ${GREEN}✓${NC} $dep"
        else
            echo -e "   ${RED}✗${NC} $dep (missing)"
            ((ERRORS++))
        fi
    done
else
    echo -e "${RED}✗ node_modules not found${NC}"
    echo "   Run: yarn install"
    ((ERRORS++))
fi
echo ""

# Check source files
echo "📝 Checking source files..."
REQUIRED_DIRS=(
    "src/main/git"
    "src/main/novel"
    "src/renderer/store"
    "src/renderer/components/sideBar"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "   ${GREEN}✓${NC} $dir"
    else
        echo -e "   ${RED}✗${NC} $dir (missing)"
        ((ERRORS++))
    fi
done
echo ""

# Check key novel writing files
echo "✨ Checking novel writing features..."
NOVEL_FILES=(
    "src/main/git/index.js"
    "src/main/novel/characterDatabase.js"
    "src/main/novel/placeDatabase.js"
    "src/main/novel/sceneManager.js"
    "src/main/novel/writingStats.js"
    "src/renderer/store/git.js"
    "src/renderer/store/characters.js"
    "src/renderer/store/places.js"
    "src/renderer/store/scenes.js"
    "src/renderer/store/writingStats.js"
)

for file in "${NOVEL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file"
    else
        echo -e "   ${RED}✗${NC} $file (missing)"
        ((ERRORS++))
    fi
done
echo ""

# Check documentation
echo "📖 Checking documentation..."
DOCS=(
    "README.md"
    "QUICK_START.md"
    "MACOS_SETUP.md"
    "INSTALLATION.md"
    "docs/NOVEL_WRITING_FEATURES.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "   ${GREEN}✓${NC} $doc"
    else
        echo -e "   ${YELLOW}⚠${NC} $doc (missing)"
        ((WARNINGS++))
    fi
done
echo ""

# Check optional tools
echo "🔧 Checking optional tools..."

if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓ Git installed${NC} - $GIT_VERSION"
else
    echo -e "${YELLOW}⚠ Git not found${NC}"
    echo "   Git version control features will not work"
    ((WARNINGS++))
fi

if command -v pandoc &> /dev/null; then
    PANDOC_VERSION=$(pandoc --version | head -n 1)
    echo -e "${GREEN}✓ Pandoc installed${NC} - $PANDOC_VERSION"
    echo "   DOCX and EPUB export available"
else
    echo -e "${YELLOW}⚠ Pandoc not found (optional)${NC}"
    echo "   Install with: brew install pandoc"
    ((WARNINGS++))
fi

if command -v pdflatex &> /dev/null; then
    echo -e "${GREEN}✓ LaTeX installed${NC}"
    echo "   Enhanced PDF export available"
else
    echo -e "${YELLOW}⚠ LaTeX not found (optional)${NC}"
    echo "   Install with: brew install --cask basictex"
    ((WARNINGS++))
fi
echo ""

# Summary
echo "================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "NovelWriter is ready to run!"
    echo ""
    echo "Next steps:"
    echo "  • Start development: ${BLUE}yarn dev${NC}"
    echo "  • Build for Mac: ${BLUE}yarn release:mac${NC}"
    echo "  • Read docs: ${BLUE}cat QUICK_START.md${NC}"
    
    if [ $WARNINGS -gt 0 ]; then
        echo ""
        echo -e "${YELLOW}Note: $WARNINGS optional feature(s) not available${NC}"
        echo "The app will work, but some features may be limited."
    fi
else
    echo -e "${RED}❌ $ERRORS error(s) found${NC}"
    echo ""
    echo "Please fix the errors above before running NovelWriter."
    echo ""
    echo "Common fixes:"
    echo "  • Install dependencies: ${BLUE}yarn install${NC}"
    echo "  • Update Node.js: ${BLUE}brew upgrade node${NC}"
    echo "  • Run setup script: ${BLUE}./setup-mac.sh${NC}"
    exit 1
fi
echo "================================"
echo ""
