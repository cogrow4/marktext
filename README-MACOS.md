# NovelCraft - macOS Setup Guide

## Prerequisites

Before setting up NovelCraft on your MacBook, ensure you have the following installed:

### 1. Node.js (Required)
- **Version**: Node.js 18.0.0 or higher
- **Download**: [https://nodejs.org/](https://nodejs.org/)
- **Check version**: `node -v`

### 2. Git (Required)
- **Installation**: Git is usually pre-installed on macOS
- **Check**: `git --version`
- **If not installed**: Install via [https://git-scm.com/](https://git-scm.com/) or `brew install git`

### 3. Xcode Command Line Tools (Required)
- **Installation**: `xcode-select --install`
- **Purpose**: Required for building native dependencies

### 4. Homebrew (Optional but Recommended)
- **Installation**: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- **Purpose**: Easy package management

## Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
# Clone or download the NovelCraft project
cd /path/to/novelcraft

# Run the automated setup script
./setup-macos.sh
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install

# Build native dependencies for macOS
npm run rebuild

# Build the application
npm run build:dev
```

## Running NovelCraft

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Create macOS App Bundle
```bash
npm run release:mac
```

## System Requirements

- **macOS**: 10.15 (Catalina) or later
- **Architecture**: Intel (x64) or Apple Silicon (arm64)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space

## Troubleshooting

### Common Issues

#### 1. "Command not found: node"
- Install Node.js from [https://nodejs.org/](https://nodejs.org/)
- Restart your terminal after installation

#### 2. "Xcode Command Line Tools not found"
```bash
xcode-select --install
```
- Follow the installation prompts
- Restart your terminal after installation

#### 3. "Permission denied" errors
```bash
# Make setup script executable
chmod +x setup-macos.sh

# Run with proper permissions
./setup-macos.sh
```

#### 4. Native module build failures
```bash
# Clean and rebuild
npm run clean
npm install
npm run rebuild
```

#### 5. Electron build issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization

#### For Apple Silicon Macs (M1/M2/M3)
- The app will automatically build for arm64 architecture
- Native performance on Apple Silicon
- No additional configuration needed

#### For Intel Macs
- The app will build for x64 architecture
- Full compatibility with Intel processors

### Security Considerations

#### Gatekeeper Warnings
If you see security warnings when running the app:

1. **For Development**: 
   ```bash
   # Allow the app to run
   sudo xattr -rd com.apple.quarantine /path/to/NovelCraft.app
   ```

2. **For Distribution**: Sign the app with a valid Apple Developer certificate

#### File Permissions
- NovelCraft needs read/write access to your Documents folder
- Grant permissions when prompted by macOS

## Features Available on macOS

### Native macOS Integration
- ✅ **Menu Bar**: Native macOS menu bar integration
- ✅ **Dock**: Proper dock icon and behavior
- ✅ **File Associations**: Open .md files with NovelCraft
- ✅ **Dark Mode**: Automatic dark mode support
- ✅ **Notifications**: Native macOS notifications
- ✅ **Keyboard Shortcuts**: macOS-standard keyboard shortcuts

### Novel Writing Features
- ✅ **Character Management**: Full character database
- ✅ **Place Management**: World-building tools
- ✅ **Notes System**: Organized research and notes
- ✅ **Writing Statistics**: Real-time analytics
- ✅ **Git Integration**: Version control for your novels
- ✅ **Export Options**: PDF, EPUB, HTML, LaTeX export
- ✅ **Advanced Find & Replace**: Regex and fuzzy search

### Performance Features
- ✅ **Native Performance**: Optimized for macOS
- ✅ **Memory Efficient**: Low memory footprint
- ✅ **Fast Startup**: Quick application launch
- ✅ **Smooth Scrolling**: Native scrolling behavior

## Keyboard Shortcuts

### Novel Writing Mode
- `Cmd+Option+N`: Toggle Novel Writing Mode
- `Cmd+Shift+P`: Command Palette
- `Cmd+J`: Toggle Sidebar
- `Cmd+K`: Toggle Table of Contents

### Writing Modes
- `Cmd+Option+S`: Source Code Mode
- `Cmd+Option+T`: Typewriter Mode
- `Cmd+Shift+J`: Focus Mode

### File Operations
- `Cmd+N`: New Project
- `Cmd+O`: Open Project
- `Cmd+S`: Save
- `Cmd+Shift+S`: Save As

## Support

### Getting Help
- Check the main README.md for general information
- Review NOVELCRAFT_FEATURES.md for feature details
- Open an issue on GitHub for bugs or feature requests

### System Information
When reporting issues, include:
```bash
# System information
sw_vers
node -v
npm -v
git --version
```

## Updates

### Updating NovelCraft
```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm update

# Rebuild if needed
npm run rebuild
```

### Updating Dependencies
```bash
# Check for outdated packages
npm outdated

# Update to latest versions
npm update
```

## Development

### Building from Source
```bash
# Clone the repository
git clone https://github.com/novelcraft/novelcraft.git
cd novelcraft

# Install dependencies
npm install

# Build for development
npm run build:dev

# Run in development mode
npm run dev
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on macOS
5. Submit a pull request

---

**NovelCraft** - Professional novel writing software for macOS
Built with ❤️ for writers, by writers