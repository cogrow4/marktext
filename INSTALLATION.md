# NovelWriter Installation Guide

Complete installation instructions for all platforms.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Install](#quick-install)
3. [Detailed Installation](#detailed-installation)
4. [Post-Installation Setup](#post-installation-setup)
5. [Optional Dependencies](#optional-dependencies)
6. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.12+, or Linux (64-bit)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB for application, additional space for projects
- **Display**: 1280x720 minimum resolution

### Recommended Requirements
- **OS**: Windows 11, macOS 12+, or Ubuntu 20.04+
- **RAM**: 8GB or more
- **Storage**: 2GB available space
- **Display**: 1920x1080 or higher

## Quick Install

### macOS

**Using Homebrew (Recommended)**:
```bash
brew install --cask mark-text
```

**Manual Installation**:
1. Download `marktext-x64.dmg` from [Releases](https://github.com/marktext/marktext/releases/latest)
2. Open the DMG file
3. Drag NovelWriter to Applications folder
4. Launch from Applications

### Windows

**Using Chocolatey**:
```bash
choco install marktext
```

**Using Winget**:
```bash
winget install marktext
```

**Manual Installation**:
1. Download `marktext-setup.exe` from [Releases](https://github.com/marktext/marktext/releases/latest)
2. Run the installer
3. Follow the installation wizard
4. Launch NovelWriter from Start Menu

### Linux

**Ubuntu/Debian**:
```bash
# Download the .deb package
wget https://github.com/marktext/marktext/releases/latest/download/marktext-x86_64.deb

# Install
sudo dpkg -i marktext-x86_64.deb

# Fix dependencies if needed
sudo apt-get install -f
```

**AppImage (All Distributions)**:
```bash
# Download AppImage
wget https://github.com/marktext/marktext/releases/latest/download/marktext-x86_64.AppImage

# Make executable
chmod +x marktext-x86_64.AppImage

# Run
./marktext-x86_64.AppImage
```

**Arch Linux**:
```bash
yay -S marktext
```

## Detailed Installation

### macOS Detailed Steps

1. **Download**
   - Visit the [Releases page](https://github.com/marktext/marktext/releases/latest)
   - Download `marktext-x64.dmg`
   - File size: ~100-150MB

2. **Install**
   - Open the downloaded DMG file
   - A window will appear with the NovelWriter app
   - Drag the app to the Applications folder
   - Eject the DMG

3. **First Launch**
   - Open Applications folder
   - Double-click NovelWriter
   - If you see "Cannot open because it's from an unidentified developer":
     - Right-click the app
     - Select "Open"
     - Click "Open" in the dialog
   - The app will now open normally

4. **Security Settings** (if needed)
   - Go to System Preferences → Security & Privacy
   - Click "Open Anyway" if prompted
   - Future launches won't require this

### Windows Detailed Steps

1. **Download**
   - Visit the [Releases page](https://github.com/marktext/marktext/releases/latest)
   - Download `marktext-setup.exe`
   - File size: ~100-150MB

2. **Install**
   - Double-click the downloaded installer
   - If Windows SmartScreen appears:
     - Click "More info"
     - Click "Run anyway"
   - Choose installation type:
     - **User Install**: Installs for current user only (no admin needed)
     - **System Install**: Installs for all users (requires admin)
   - Select installation folder (or use default)
   - Choose whether to create desktop shortcut
   - Click "Install"

3. **First Launch**
   - Launch from Start Menu or desktop shortcut
   - Windows Firewall may ask for permissions
   - Allow access on private networks

### Linux Detailed Steps

#### Ubuntu/Debian-based Systems

1. **Install via DEB Package**
   ```bash
   # Download
   cd ~/Downloads
   wget https://github.com/marktext/marktext/releases/latest/download/marktext-x86_64.deb
   
   # Install
   sudo dpkg -i marktext-x86_64.deb
   
   # Fix any dependency issues
   sudo apt-get install -f
   
   # Launch
   marktext
   ```

2. **Add to Applications Menu**
   - The .deb package automatically creates a menu entry
   - Find "NovelWriter" in your applications menu

#### Fedora/RHEL-based Systems

```bash
# Download RPM
wget https://github.com/marktext/marktext/releases/latest/download/marktext-x86_64.rpm

# Install
sudo rpm -i marktext-x86_64.rpm

# Or use dnf
sudo dnf install marktext-x86_64.rpm
```

#### AppImage (Universal)

```bash
# Download
wget https://github.com/marktext/marktext/releases/latest/download/marktext-x86_64.AppImage

# Make executable
chmod +x marktext-x86_64.AppImage

# Optional: Move to local bin
mkdir -p ~/Applications
mv marktext-x86_64.AppImage ~/Applications/

# Create desktop entry
cat > ~/.local/share/applications/novelwriter.desktop << EOF
[Desktop Entry]
Name=NovelWriter
Exec=$HOME/Applications/marktext-x86_64.AppImage
Type=Application
Categories=Office;TextEditor;
Icon=marktext
EOF

# Run
~/Applications/marktext-x86_64.AppImage
```

## Post-Installation Setup

### First-Time Configuration

1. **Launch NovelWriter**
   - Open the application
   - The welcome screen will appear

2. **Choose a Theme**
   - Go to Menu → Theme
   - Select your preferred theme
   - Options include Light and Dark modes

3. **Set Preferences**
   - Go to Menu → Preferences (or Ctrl/Cmd + ,)
   - Configure:
     - Default font and size
     - Auto-save interval
     - Spell check language
     - Line ending preference

4. **Create or Open a Project**
   - Click File → Open Folder
   - Select an existing folder or create a new one
   - This becomes your novel project folder

### Recommended Initial Setup

1. **Enable Git Version Control**
   - Click the Git icon in the sidebar
   - Click "Initialize Git"
   - Your project now has version control

2. **Set Writing Goals**
   - Click the Stats icon in the sidebar
   - Scroll to "Writing Goals" section
   - Set your daily/weekly/monthly targets

3. **Configure Spell Check**
   - Go to Preferences → Spell Checker
   - Select your language(s)
   - Enable/disable as needed

4. **Create Project Structure**
   - Create folders: `chapters/`, `notes/`, `research/`
   - Create your first chapter file
   - Save it

## Optional Dependencies

### Pandoc (For Advanced Export)

Pandoc enables export to DOCX, EPUB, and enhanced PDF formats.

#### macOS
```bash
brew install pandoc
```

#### Windows
1. Download installer from [pandoc.org](https://pandoc.org/installing.html)
2. Run the MSI installer
3. Restart NovelWriter

Or via Chocolatey:
```bash
choco install pandoc
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install pandoc

# Fedora
sudo dnf install pandoc

# Arch
sudo pacman -S pandoc
```

#### Verify Installation
```bash
pandoc --version
```

### LaTeX (For PDF Export)

For high-quality PDF export via Pandoc:

#### macOS
```bash
brew install --cask mactex
```

#### Windows
Download and install [MiKTeX](https://miktex.org/download)

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install texlive-xetex texlive-fonts-recommended

# Fedora
sudo dnf install texlive-xetex texlive-collection-fontsrecommended
```

### Git (Usually Pre-installed)

Git is typically pre-installed on macOS and Linux. For Windows:

```bash
# Via Chocolatey
choco install git

# Or download from
# https://git-scm.com/download/win
```

Verify:
```bash
git --version
```

## Troubleshooting

### Common Issues

#### "Application Can't Be Opened" (macOS)

**Problem**: Security warning prevents opening

**Solution**:
1. Right-click the app → Open
2. Or: System Preferences → Security & Privacy → "Open Anyway"

#### "Windows Protected Your PC" (Windows)

**Problem**: SmartScreen blocks installation

**Solution**:
1. Click "More info"
2. Click "Run anyway"

#### Application Won't Start (Linux)

**Problem**: Missing dependencies

**Solution**:
```bash
# Check dependencies
ldd /path/to/marktext

# Install common dependencies
sudo apt-get install libgtk-3-0 libnotify4 libnss3 libxss1 \
  libxtst6 xdg-utils libatspi2.0-0 libsecret-1-0
```

#### Blank Window on Launch

**Problem**: GPU rendering issues

**Solution**:
1. Launch with GPU disabled:
   ```bash
   # Linux/macOS
   marktext --disable-gpu
   
   # Windows
   marktext.exe --disable-gpu
   ```

2. To make permanent, edit the launch shortcut/desktop file

#### Export Features Not Working

**Problem**: Pandoc not found

**Solution**:
1. Install Pandoc (see Optional Dependencies)
2. Restart NovelWriter
3. Verify in Menu → Help → About → System Info

### Performance Issues

#### Slow Startup

**Solution**:
- Clear cache: Delete `~/.config/MarkText/` (Linux/macOS) or `%APPDATA%\MarkText\` (Windows)
- Reduce auto-save frequency in Preferences
- Disable unnecessary extensions

#### High Memory Usage

**Solution**:
- Close unused sidebar panels
- Split large files into smaller chapters
- Restart the application periodically

### Data Issues

#### Can't Find Saved Characters/Scenes

**Problem**: Data not persisting

**Solution**:
1. Check that you've opened a folder (not just a file)
2. Verify project path hasn't changed
3. Check data files in:
   - Linux/macOS: `~/.config/NovelWriter/`
   - Windows: `%APPDATA%\NovelWriter\`

#### Git Not Working

**Problem**: Git operations fail

**Solution**:
1. Verify Git is installed: `git --version`
2. Initialize repository: Click "Initialize Git" in Git panel
3. Check repository status: Look for `.git` folder in project
4. Restart NovelWriter

### Getting Help

If issues persist:

1. **Check Documentation**
   - [Quick Start Guide](QUICK_START.md)
   - [Feature Documentation](docs/NOVEL_WRITING_FEATURES.md)

2. **Search Issues**
   - Check [GitHub Issues](https://github.com/marktext/marktext/issues)

3. **Report a Bug**
   - Create a new issue with:
     - OS version
     - NovelWriter version
     - Steps to reproduce
     - Expected vs actual behavior
     - Screenshots if applicable

4. **Community Support**
   - Join discussions on GitHub
   - Check the community forums

## Uninstallation

### macOS
1. Quit NovelWriter
2. Drag app from Applications to Trash
3. Optional: Remove settings:
   ```bash
   rm -rf ~/Library/Application Support/MarkText
   rm -rf ~/.config/MarkText
   ```

### Windows
1. Go to Settings → Apps → Apps & Features
2. Find "NovelWriter" or "MarkText"
3. Click Uninstall
4. Optional: Remove settings from `%APPDATA%\MarkText`

### Linux
```bash
# DEB package
sudo apt-get remove marktext

# RPM package
sudo rpm -e marktext

# AppImage
rm ~/Applications/marktext-x86_64.AppImage

# Remove settings
rm -rf ~/.config/MarkText
```

## Next Steps

After installation:

1. Read the [Quick Start Guide](QUICK_START.md)
2. Explore the [Feature Documentation](docs/NOVEL_WRITING_FEATURES.md)
3. Set up your first project
4. Start writing!

---

**Happy Writing! 📚✨**
