<p align="center"><img src="static/logo-small.png" alt="NovelCraft" width="100" height="100"></p>

<h1 align="center">NovelCraft</h1>

<div align="center">
  <a href="https://github.com/novelcraft/novelcraft">
    <img src="https://img.shields.io/github/stars/novelcraft/novelcraft.svg?style=for-the-badge" alt="stars">
  </a>
  <a href="https://github.com/novelcraft/novelcraft/releases">
    <img src="https://img.shields.io/github/downloads/novelcraft/novelcraft/total.svg?style=for-the-badge" alt="downloads">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/novelcraft/novelcraft.svg?style=for-the-badge" alt="LICENSE">
  </a>
</div>

<div align="center">
  <strong>:book: Professional novel writing software :writing_hand:</strong><br>
  A comprehensive writing environment with git integration, character management, and advanced writing tools.<br>
  <sub>Available for Linux, macOS and Windows.</sub>
</div>

<br>

<div align="center">
  <h3>
    <a href="https://github.com/novelcraft/novelcraft#features">
      Features
    </a>
    <span> | </span>
    <a href="https://github.com/novelcraft/novelcraft#download-and-installation">
      Downloads
    </a>
    <span> | </span>
    <a href="https://github.com/novelcraft/novelcraft#development">
      Development
    </a>
    <span> | </span>
    <a href="https://github.com/novelcraft/novelcraft#contribution">
      Contribution
    </a>
  </h3>
</div>

<div align="center">
  <sub>Professional novel writing software for serious authors. Built with ❤︎ by the
    <a href="https://github.com/novelcraft/novelcraft/graphs/contributors">
      NovelCraft Team
    </a>
    .
  </sub>
</div>

<br />

## Screenshot

![](docs/novelcraft-screenshot.png?raw=true)

## Features

### Core Writing Features
- **Distraction-free writing environment** with realtime preview and clean interface
- **Live preview** with synchronized scrolling between editor and preview
- **Typewriter mode** for focused writing
- **Focus mode** to highlight current paragraph
- **Source code mode** for advanced users
- **Multiple themes** optimized for writing
- **Spell checker** with writing-specific dictionaries
- **Advanced find and replace** with regex support

### Novel Writing Tools
- **Character Management**: Create detailed character profiles with traits, relationships, and development arcs
- **Place Management**: Organize locations, settings, and world-building elements
- **Notes System**: Research organization with tagging and categorization
- **Writing Statistics**: Real-time analytics including word count, reading time, and style analysis
- **Progress Tracking**: Set goals and track writing milestones
- **Timeline Management**: Organize chapters and plot points chronologically

### Version Control & Collaboration
- **Git Integration**: Built-in version control for your novels
- **Branch Management**: Create branches for different storylines or versions
- **Commit History**: Track changes and revert to previous versions
- **Auto-save**: Automatic saving with version control
- **Collaboration**: Share projects with co-authors (coming soon)

### Export & Publishing
- **Multiple Formats**: Export to PDF, EPUB, HTML, LaTeX, and plain text
- **Professional Layouts**: Publishing-ready formatting and typography
- **Batch Export**: Export multiple chapters or entire novel at once
- **Custom Templates**: Create and use custom export templates
- **Print-ready PDFs**: High-quality PDFs suitable for printing

### Advanced Features
- **Writing Analytics**: Detailed statistics on writing patterns and style
- **Readability Analysis**: Flesch-Kincaid and other readability scores
- **Word Frequency Analysis**: Identify overused words and phrases
- **Research Integration**: Link external research and references
- **Backup & Sync**: Automatic backup to cloud storage (coming soon)
- **Plugin System**: Extensible architecture for custom features

## Why NovelCraft?

1. **Professional Writing Tools**: NovelCraft provides everything a serious novelist needs - character management, world-building, version control, and advanced writing analytics - all in one integrated environment.

2. **Never Lose Your Work**: Built-in Git integration ensures your novel is always versioned and backed up. Every change is tracked, and you can always revert to previous versions.

3. **Organize Your Story**: Keep characters, places, and research organized with powerful database-driven tools. Find information instantly with advanced search and filtering.

4. **Write Better**: Advanced writing statistics help you understand your writing patterns, improve readability, and maintain consistency throughout your novel.

5. **Publish Professionally**: Export your novel in multiple formats (PDF, EPUB, HTML, LaTeX) with professional layouts and typography.

6. **Open Source**: NovelCraft is completely free and open source, built by writers for writers. Contribute to make it even better.

## Download and Installation

![platform](https://img.shields.io/static/v1.svg?label=Platform&message=Linux-64%20|%20macOS-64%20|%20Win-32%20|%20Win-64&style=for-the-badge)

### Quick Start

#### macOS
```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/novelcraft/novelcraft/main/setup-macos.sh | bash

# Or install via Homebrew (coming soon)
brew install --cask novelcraft
```

#### Windows
```bash
# Download the installer from releases
# Or install via Chocolatey (coming soon)
choco install novelcraft
```

#### Linux
```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/novelcraft/novelcraft/main/setup-linux.sh | bash
```

### Manual Installation

1. **Download**: Get the latest release from [GitHub Releases](https://github.com/novelcraft/novelcraft/releases)
2. **Install**: Run the installer for your platform
3. **Launch**: Start NovelCraft and begin writing!

### System Requirements

- **macOS**: 10.15 (Catalina) or later
- **Windows**: Windows 10 or later
- **Linux**: Ubuntu 18.04+ or equivalent
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space

## Development

If you wish to build NovelCraft yourself, please check out our [build instructions](docs/dev/BUILD.md).

- [User documentation](docs/README.md)
- [Developer documentation](docs/dev/README.md)
- [Changelog](.github/CHANGELOG.md)

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### Build Instructions

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

# Build for production
npm run build

# Create platform-specific packages
npm run release:mac    # macOS
npm run release:win    # Windows
npm run release:linux  # Linux
```

### Project Structure

```
novelcraft/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # Vue.js frontend
│   └── common/         # Shared utilities
├── docs/               # Documentation
├── resources/          # App resources and icons
└── static/             # Static assets
```

## Contribution

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on the foundation of [MarkText](https://github.com/novelcraft/novelcraft)
- Uses [Electron](https://electronjs.org/) for cross-platform desktop support
- Powered by [Vue.js](https://vuejs.org/) for the user interface
- Git integration via [simple-git](https://github.com/steveukx/git-js)
- Database powered by [SQLite](https://sqlite.org/)

## Support

- 📖 [Documentation](docs/README.md)
- 🐛 [Report Issues](https://github.com/novelcraft/novelcraft/issues)
- 💬 [Discussions](https://github.com/novelcraft/novelcraft/discussions)
- 📧 [Contact](mailto:team@novelcraft.app)

---

**NovelCraft** - Professional novel writing software for serious authors. Built with ❤️ for writers, by writers.