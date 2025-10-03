# NovelWriter - Quick Setup for Mac

## TL;DR - Get Started in 3 Steps

```bash
# 1. Run the setup script
./setup-mac.sh

# 2. Start the app
yarn dev

# 3. Start writing!
```

## What You Need

- **macOS 10.15 or later** (Catalina, Big Sur, Monterey, Ventura, Sonoma, Sequoia)
- **5-10 minutes** for setup
- **Internet connection** for downloading dependencies

## Automatic Setup (Recommended)

The easiest way to get started:

```bash
./setup-mac.sh
```

This script will:
- ✅ Check your macOS version
- ✅ Verify Xcode Command Line Tools
- ✅ Check Node.js version (installs if needed via Homebrew)
- ✅ Install Yarn if needed
- ✅ Install all NovelWriter dependencies
- ✅ Offer to install Pandoc (for DOCX/EPUB export)

## Manual Setup

If you prefer manual installation:

### 1. Install Prerequisites

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and Yarn
brew install node yarn

# Verify versions
node --version  # Should be v18+
yarn --version  # Should be 1.22+
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Run the App

```bash
yarn dev
```

## What Gets Installed

### Required
- **Node.js 18+** - JavaScript runtime
- **Yarn** - Package manager
- **Project dependencies** - About 500MB of npm packages

### Optional
- **Pandoc** - For DOCX and EPUB export
- **LaTeX (BasicTeX)** - For high-quality PDF export

Install optional tools:
```bash
brew install pandoc           # For DOCX/EPUB export
brew install --cask basictex  # For PDF export
```

## Running NovelWriter

### Development Mode
```bash
yarn dev
```
- Hot reload enabled
- DevTools available (Cmd+Option+I)
- Console logs visible
- Best for testing

### Production Build
```bash
yarn release:mac
```
- Creates optimized build
- Generates DMG installer
- Located in `./dist/` folder
- Ready for distribution

## Troubleshooting

### "Cannot install dependencies"

**Solution:**
```bash
# Clean and reinstall
rm -rf node_modules yarn.lock
yarn install
```

### "Native modules failed to build"

**Solution:**
```bash
# Ensure Xcode tools are installed
xcode-select --install

# Rebuild native modules
yarn rebuild
```

### "Permission denied" errors

**Solution:**
```bash
# Never use sudo with npm/yarn!
# Instead, fix permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### "electron-builder" fails on Mac

**Solution:**
```bash
# Clear cache
rm -rf ~/Library/Caches/electron
rm -rf ~/Library/Caches/electron-builder

# Rebuild
yarn release:mac
```

### App won't start

**Solution 1:**
```bash
# Try with GPU disabled
yarn dev --disable-gpu
```

**Solution 2:**
```bash
# Clear application data
rm -rf ~/Library/Application\ Support/NovelWriter
rm -rf ~/.config/NovelWriter
```

## Performance Tips

### Faster Builds
```bash
# Use the dev build (faster, no optimization)
yarn build:dev

# Or run directly without building
yarn dev
```

### Reduce Memory Usage
1. Close unused sidebar panels
2. Split large files into chapters
3. Restart the app periodically

## Development Tips

### Watch Mode
```bash
yarn dev
```
Auto-rebuilds when you edit source files.

### Linting
```bash
yarn lint        # Check for issues
yarn lint:fix    # Auto-fix issues
```

### View Logs
```bash
# Main process logs
tail -f ~/Library/Logs/NovelWriter/main.log

# Or open in Console.app
open ~/Library/Logs/NovelWriter/
```

## File Locations

```
📁 Application
/Applications/NovelWriter.app

📁 User Data
~/Library/Application Support/NovelWriter/

📁 Configuration
~/.config/NovelWriter/

📁 Logs
~/Library/Logs/NovelWriter/

📁 Build Output
./dist/
```

## System Requirements

### Minimum
- macOS 10.15 Catalina
- 4GB RAM
- 1GB free disk space
- 1280x720 display

### Recommended
- macOS 12 Monterey or later
- 8GB+ RAM
- 2GB+ free disk space
- 1920x1080+ display

## Apple Silicon (M1/M2/M3)

NovelWriter runs **natively** on Apple Silicon Macs. The build process automatically creates universal binaries that work on both Intel and Apple Silicon.

Check your chip:
```bash
arch
# arm64 = Apple Silicon
# x86_64 = Intel
```

## Updating Dependencies

Keep dependencies up to date:

```bash
# Update all packages
yarn upgrade

# Or update specific package
yarn upgrade <package-name>

# Check for outdated packages
yarn outdated
```

## Building for Distribution

### Create DMG installer
```bash
yarn release:mac
```

Output:
- `dist/NovelWriter-1.0.0.dmg` - Installer
- `dist/mac/NovelWriter.app` - Application

### Code Signing (Optional)

For distribution outside the App Store:

1. Get an Apple Developer account
2. Create certificates in Xcode
3. Update `electron-builder.yml` with your signing identity
4. Build with:
   ```bash
   yarn release:mac
   ```

## Next Steps

1. ✅ Setup complete? Run: `yarn dev`
2. 📖 Read the [Quick Start Guide](QUICK_START.md)
3. 📚 Check out [Novel Writing Features](docs/NOVEL_WRITING_FEATURES.md)
4. 🎯 Create your first project
5. ✍️ Start writing!

## Getting Help

### Documentation
- [Quick Start Guide](QUICK_START.md)
- [macOS Setup Guide](MACOS_SETUP.md)
- [Installation Guide](INSTALLATION.md)
- [Feature Documentation](docs/NOVEL_WRITING_FEATURES.md)

### Support
- Check existing GitHub issues
- Create a new issue with:
  - macOS version
  - Node.js version
  - Error messages
  - Steps to reproduce

## Useful Commands

```bash
# Development
yarn dev                 # Run in dev mode
yarn build:dev          # Build dev version

# Production
yarn release:mac        # Build for macOS
yarn build             # Build for current platform

# Maintenance
yarn lint              # Check code
yarn lint:fix          # Fix linting issues
yarn rebuild           # Rebuild native modules

# Testing
yarn test              # Run tests
yarn e2e               # Run E2E tests

# Cleanup
yarn build:clean       # Clean build artifacts
rm -rf node_modules    # Remove dependencies
```

## Keyboard Shortcuts (macOS)

- `Cmd+N` - New file
- `Cmd+O` - Open file
- `Cmd+S` - Save
- `Cmd+Q` - Quit
- `Cmd+,` - Preferences
- `Cmd+F` - Find
- `Cmd+Shift+F` - Find in folder
- `Cmd+Option+I` - DevTools (dev mode)

---

**Ready to write your novel?** 📚✨

Run `./setup-mac.sh` to get started!
