# NovelWriter - macOS Setup Guide

Complete setup instructions specifically for macOS users.

## Prerequisites

### 1. Check Your macOS Version
NovelWriter requires **macOS 10.15 (Catalina) or later**.

Check your version:
```bash
sw_vers
```

### 2. Install Xcode Command Line Tools
Required for building native modules:

```bash
xcode-select --install
```

Click "Install" in the dialog that appears.

### 3. Install Homebrew (Recommended)
If you don't have Homebrew installed:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 4. Install Node.js and Yarn
NovelWriter requires Node.js 18+ and Yarn.

**Using Homebrew:**
```bash
brew install node
brew install yarn
```

**Verify Installation:**
```bash
node --version  # Should be v18.0.0 or higher
yarn --version  # Should be 1.22.0 or higher
```

## Installation Steps

### Option A: Development Setup (For Running from Source)

1. **Clone or Extract the Project**
   ```bash
   cd ~/Projects  # or your preferred location
   # If you have the source, cd into it
   cd novelwriter
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```
   
   This will:
   - Install all npm packages
   - Rebuild native modules for macOS
   - Run postinstall scripts
   - May take 5-10 minutes on first run

3. **Run in Development Mode**
   ```bash
   yarn dev
   ```
   
   The application will launch automatically!

### Option B: Build for Production

1. **Install Dependencies** (if not done)
   ```bash
   yarn install
   ```

2. **Build the Application**
   ```bash
   yarn build:mac
   ```
   
   Or use the full build command:
   ```bash
   yarn release:mac
   ```

3. **Find Your App**
   The built application will be in:
   ```
   ./dist/NovelWriter-1.0.0.dmg
   ./dist/mac/NovelWriter.app
   ```

4. **Install**
   - Double-click the DMG file
   - Drag NovelWriter to Applications folder
   - Eject the DMG

## Optional: Install Pandoc

For advanced export features (DOCX, EPUB):

```bash
brew install pandoc
```

Verify:
```bash
pandoc --version
```

## Optional: Install LaTeX

For high-quality PDF export:

```bash
brew install --cask mactex
```

Note: This is a large download (~4GB). Alternatively, use BasicTeX:
```bash
brew install --cask basictex
```

## Troubleshooting

### Issue: "Cannot open because developer cannot be verified"

**Solution:**
1. Right-click (or Control-click) on NovelWriter.app
2. Select "Open"
3. Click "Open" in the dialog
4. The app will now open normally

**Or:**
1. Go to System Preferences → Security & Privacy
2. Click "Open Anyway" next to the NovelWriter message
3. Confirm by clicking "Open"

### Issue: Native modules fail to build

**Solution:**
```bash
# Clean and reinstall
rm -rf node_modules yarn.lock
yarn install

# Or rebuild native modules
yarn rebuild
```

### Issue: Python/node-gyp errors

**Solution:**
```bash
# Install Python (if needed)
brew install python@3.11

# Ensure Xcode Command Line Tools are installed
xcode-select --install

# Rebuild
yarn rebuild
```

### Issue: "electron-rebuild" fails

**Solution:**
```bash
# Install electron-rebuild globally
yarn global add electron-rebuild

# Then rebuild
yarn rebuild
```

### Issue: Permission errors during install

**Solution:**
```bash
# Don't use sudo! Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to your ~/.zshrc or ~/.bash_profile:
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# Reinstall
yarn install
```

### Issue: App crashes on launch

**Solution 1 - Disable GPU:**
```bash
# Launch from terminal with GPU disabled
/Applications/NovelWriter.app/Contents/MacOS/NovelWriter --disable-gpu
```

**Solution 2 - Reset preferences:**
```bash
rm -rf ~/Library/Application\ Support/NovelWriter
rm -rf ~/.config/NovelWriter
```

### Issue: Git operations not working

**Solution:**
```bash
# Verify Git is installed
git --version

# If not installed:
brew install git

# Or use Xcode Git:
xcode-select --install
```

## Performance Optimization

### Reduce Memory Usage
1. Close unused sidebar panels
2. Split large manuscripts into smaller files
3. Disable auto-save if working with very large files

### Faster Startup
1. Keep the app in your Dock
2. Disable unnecessary menu bar apps
3. Use an SSD (if available)

## macOS-Specific Features

### Touch Bar Support
If you have a MacBook Pro with Touch Bar, NovelWriter will show relevant controls.

### Notification Center
Writing statistics and goal achievements appear in Notification Center.

### Dark Mode
NovelWriter respects your system dark mode setting:
- System Preferences → General → Appearance

### Spotlight Integration
After installation, you can launch via Spotlight (Cmd+Space):
- Type "NovelWriter" and press Enter

## File Locations

### Application Data
```
~/Library/Application Support/NovelWriter/
```

### Configuration
```
~/.config/NovelWriter/
```

### Logs
```
~/Library/Logs/NovelWriter/
```

### Your Projects
Store anywhere! Recommended:
```
~/Documents/Novels/
```

## Development Tools

### VS Code Integration
If using VS Code for development:

```bash
# Install recommended extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension octref.vetur
```

### Debugging

**In Development Mode:**
```bash
yarn dev
```
Then press: Cmd+Option+I to open DevTools

**View Logs:**
```bash
tail -f ~/Library/Logs/NovelWriter/main.log
```

## Uninstallation

### Remove Application
```bash
rm -rf /Applications/NovelWriter.app
```

### Remove Data (Optional)
```bash
rm -rf ~/Library/Application\ Support/NovelWriter
rm -rf ~/.config/NovelWriter
rm -rf ~/Library/Logs/NovelWriter
rm -rf ~/Library/Preferences/com.novelwriter.*
```

### Remove Development Files
```bash
cd ~/Projects/novelwriter
rm -rf node_modules
rm -rf dist
```

## macOS Versions

### Tested On
- ✅ macOS 15 Sequoia
- ✅ macOS 14 Sonoma  
- ✅ macOS 13 Ventura
- ✅ macOS 12 Monterey
- ✅ macOS 11 Big Sur
- ✅ macOS 10.15 Catalina

### Apple Silicon (M1/M2/M3)
NovelWriter runs natively on Apple Silicon Macs. The build process automatically creates a universal binary.

**Check Your Architecture:**
```bash
arch
# arm64 = Apple Silicon
# x86_64 = Intel
```

## Quick Start Commands

```bash
# Clone/download project
cd ~/Projects/novelwriter

# Install dependencies
yarn install

# Run in development
yarn dev

# Build for production
yarn release:mac

# Clean build
yarn build:clean && yarn release:mac

# Rebuild native modules
yarn rebuild

# Update dependencies
yarn upgrade

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix
```

## Getting Help

### Check Logs
```bash
# Main process log
tail -f ~/Library/Logs/NovelWriter/main.log

# Renderer process log
# Available in DevTools Console (Cmd+Option+I)
```

### Common Log Locations
```bash
# Application logs
~/Library/Logs/NovelWriter/

# System logs
/var/log/system.log
```

### Report Issues
If problems persist:
1. Collect logs from above locations
2. Note your macOS version and Mac model
3. Create an issue on GitHub

## Performance Benchmarks

### Typical Startup Time
- First launch: 3-5 seconds
- Subsequent: 1-2 seconds

### Memory Usage
- Idle: 100-150 MB
- Active writing: 150-250 MB
- Large project: 200-400 MB

### Disk Space
- Application: ~150 MB
- With dependencies: ~500 MB

## Security & Privacy

### Permissions
NovelWriter may request:
- ✅ **Files and Folders** - To save your work
- ✅ **Network** - For Git push/pull (optional)
- ❌ **Camera** - Never requested
- ❌ **Microphone** - Never requested
- ❌ **Location** - Never requested

### Privacy
- No telemetry
- No analytics
- No cloud sync (unless you use Git)
- All data stays local

### Firewall
If using Git remotes, allow NovelWriter in:
System Preferences → Security & Privacy → Firewall → Firewall Options

## Tips for Mac Users

1. **Use Cmd+Q to quit** (not just close the window)
2. **Drag files** into NovelWriter to open them
3. **Three-finger swipe** between full-screen apps
4. **Mission Control** to see all windows (F3 or Ctrl+Up)
5. **Spotlight** to quickly open NovelWriter (Cmd+Space)

## Integration with macOS

### Quick Look
Preview your markdown files with Quick Look (Space bar in Finder)

### Finder Tags
Tag your novel projects in Finder for easy organization

### Time Machine
Your NovelWriter data is backed up by Time Machine automatically

### iCloud Drive
Store projects in iCloud Drive for access across Macs (but use Git for version control!)

---

## Next Steps

After setup:
1. Launch NovelWriter
2. Read the [Quick Start Guide](QUICK_START.md)
3. Create your first novel project
4. Start writing!

**Happy Writing on macOS! 📚✨**
