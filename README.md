<p align="center"><img src="static/logo-small.png" alt="NovelWriter" width="100" height="100"></p>

<h1 align="center">NovelWriter</h1>

<div align="center">
  <strong>:book: Professional Novel Writing Software :pencil2:</strong><br>
  A powerful, feature-rich writing application designed specifically for novelists and creative writers.<br>
  Built on the foundation of MarkText, enhanced with professional writing tools.<br>
  <sub>Available for Linux, macOS and Windows.</sub>
</div>

<br>

<div align="center">
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/marktext/marktext.svg" alt="LICENSE">
  </a>
</div>

## Features

NovelWriter is a comprehensive writing environment tailored specifically for novel writers, combining the best of markdown editing with powerful organizational and version control tools.

### Core Writing Features
- **Distraction-Free Writing**: Clean, focused interface optimized for long-form writing
- **Real-time Preview (WYSIWYG)**: See your formatting as you write
- **Multiple Themes**: Choose from various themes including dark mode for comfortable writing sessions
- **Focus Mode & Typewriter Mode**: Minimize distractions and keep your focus where it matters
- **Spell Checking**: Built-in spell checker with multiple language support
- **Advanced Find & Replace**: Search across your entire project with regex support
- **Enhanced Export**: Export to professional formats including PDF, DOCX, EPUB, and HTML

### Novel Writing Tools

#### Character Management
- **Enhanced Character Profiles**: Create detailed character profiles with:
  - Physical descriptions and appearance
  - Personality traits and quirks
  - Background and history
  - Goals and motivations
  - Relationships with other characters
  - Custom tags and notes
- **Smart Organization**: Organize characters by role (Protagonist, Antagonist, Supporting, etc.)
- **Advanced Search**: Tag and search characters with instant filtering
- **Multiple Views**: Switch between grouped and list views for better organization
- **Visual Design**: Modern card-based interface with avatars and color coding
- **Quick Access**: Instant access from sidebar with one-click editing

#### Place & Location Database
- **Comprehensive Location Management**:
  - Geography and landscape descriptions
  - Climate and weather patterns
  - Culture and customs
  - Historical background
  - Inhabitants and demographics
  - Significance to your story
- **Smart Categorization**: Organize by type (City, Town, Building, Natural, Region, etc.)
- **Visual Organization**: Modern interface with icons and color-coded types
- **Advanced Search**: Tag and search locations with instant filtering
- **Multiple Views**: Switch between grouped and list views for better organization

#### Scene & Timeline Management
- **Comprehensive Scene Organization**: Detailed scene cards with rich metadata
- **Multiple View Modes**: 
  - **List View**: Traditional list with drag-and-drop reordering
  - **Timeline View**: Visual timeline showing scene progression
  - **Status View**: Organize by completion status
  - **Kanban View**: Drag-and-drop board for workflow management
- **Rich Scene Data**: Track POV, setting, time of day, mood, goals, conflict, and outcomes
- **Smart Filtering**: Filter by status, chapter, or custom criteria
- **Visual Indicators**: Color-coded status and progress indicators

#### Git Version Control Integration
- **Full Git Integration**: Track every change to your manuscript
- **Branch Management**: Work on different plot lines or versions simultaneously
- **Commit History**: See your writing journey and revert to any previous version
- **Push/Pull Support**: Back up your work to GitHub, GitLab, or any Git remote
- **Visual Status**: See what's changed at a glance
- Never lose your work again with automatic version history

#### Writing Statistics & Goals
- **Enhanced Session Tracking**: Monitor your writing sessions with detailed analytics
- **Smart Goal Management**: Set and track daily, weekly, and monthly word count goals
- **Advanced Writing Analytics**: 
  - Total words written across all projects
  - Average words per day and session
  - Writing streaks and consistency tracking
  - Session duration and productivity metrics
  - Goal progress with visual indicators
- **Beautiful Visualizations**: Modern charts, progress bars, and graphs
- **Motivational Dashboard**: Stay motivated with clear goal tracking and achievements
- **Writing Goals Dialog**: Easy-to-use interface for setting and adjusting goals

### Enhanced Export Options
- **Professional Export Formats**: Export to PDF, DOCX, EPUB, and HTML
- **Pandoc Integration**: High-quality document conversion with metadata support
- **Customizable Export**: Adjust fonts, margins, and formatting for each format
- **Batch Export**: Export multiple files with automatic page breaks
- **Metadata Support**: Include title, author, and other metadata in exports
- **Table of Contents**: Automatic TOC generation for EPUB and PDF formats
- **Export Menu**: Easy access to all export options from the main menu

### Advanced Features
- **File Organization**: Organize your manuscript into chapters and scenes
- **Table of Contents**: Auto-generated TOC for easy navigation
- **Math Expressions**: KaTeX support for any technical writing
- **Code Blocks**: Syntax highlighting with Prism.js
- **Diagrams**: Support for Mermaid, Flowchart.js, and Vega charts
- **Images**: Paste images directly from clipboard
- **Custom Fonts**: Choose your preferred writing font

## Why NovelWriter?

As a novelist, you need more than just a text editor. You need:
- **Organization**: Keep track of complex characters, locations, and plot threads
- **Version Control**: Safely experiment with different versions of scenes
- **Statistics**: Monitor your progress and maintain writing momentum
- **Focus**: A distraction-free environment optimized for creative writing
- **Flexibility**: Work with plain text (Markdown) that will never become obsolete

NovelWriter provides all of these in a beautiful, intuitive interface.

## Download and Installation

![platform](https://img.shields.io/static/v1.svg?label=Platform&message=Linux-64%20|%20macOS-64%20|%20Win-32%20|%20Win-64&style=for-the-badge)

### macOS

Download the latest `.dmg` file from the [release page](https://github.com/marktext/marktext/releases/latest) or install using Homebrew:

```bash
brew install --cask mark-text
```

### Windows

Download and install via the setup wizard (`.exe`) from the [release page](https://github.com/marktext/marktext/releases/latest).

Alternatively, use a package manager:

**Chocolatey:**
```bash
choco install marktext
```

**Winget:**
```bash
winget install marktext
```

### Linux

Please follow the [Linux installation instructions](docs/LINUX.md).

## Quick Start Guide

1. **Create a Project**: Open a folder containing your manuscript files
2. **Set Up Git**: Click the Git icon in the sidebar to initialize version control
3. **Create Characters**: Use the Characters panel to create detailed character profiles
4. **Add Locations**: Document your story's settings in the Places panel
5. **Set Writing Goals**: Configure your daily/weekly word count targets in the Stats panel
6. **Start Writing**: Focus on your craft while NovelWriter handles the organization

## Development

If you wish to build NovelWriter yourself, please check out the [build instructions](docs/dev/BUILD.md).

- [User documentation](docs/README.md)
- [Developer documentation](docs/dev/README.md)

## Key Features Comparison

| Feature | NovelWriter | Standard Markdown Editor |
|---------|-------------|-------------------------|
| Markdown Editing | ✅ | ✅ |
| Git Version Control | ✅ | ❌ |
| Character Database | ✅ | ❌ |
| Location Database | ✅ | ❌ |
| Writing Statistics | ✅ | ❌ |
| Goal Tracking | ✅ | ❌ |
| Session Tracking | ✅ | ❌ |
| Novel-Focused UI | ✅ | ❌ |

## Credits

NovelWriter is built on the excellent foundation of [MarkText](https://github.com/marktext/marktext), created by [@Jocs](https://github.com/Jocs) and maintained by the MarkText community.

Enhanced with novel writing features to create the ultimate writing environment for authors.

## License

[**MIT**](LICENSE)

## Contributing

We welcome contributions! Whether you're a writer with feature suggestions or a developer who wants to help build the future of novel writing software, please check out our [Contributing Guide](CONTRIBUTING.md).

## Support

If you find NovelWriter useful, consider:
- ⭐ Starring this repository
- 🐛 Reporting bugs and requesting features
- 📝 Contributing to the documentation
- 💻 Contributing code improvements

---

<p align="center">
  <strong>Happy Writing! 📚✨</strong>
</p>
