# NovelWriter Quick Start Guide

Welcome to NovelWriter! This guide will help you get started with your novel writing journey.

## Table of Contents
1. [Installation](#installation)
2. [First Steps](#first-steps)
3. [Project Setup](#project-setup)
4. [Core Features](#core-features)
5. [Writing Workflow](#writing-workflow)
6. [Tips & Best Practices](#tips--best-practices)

## Installation

### Prerequisites
- **Pandoc** (optional, for DOCX/EPUB export): [Install Pandoc](https://pandoc.org/installing.html)

### Install NovelWriter
See the main [README.md](README.md) for installation instructions for your platform.

## First Steps

### 1. Create or Open a Project
- Click **File → Open Folder** to open an existing project
- Or create a new folder for your novel and open it

### 2. Initialize Git Version Control (Recommended)
- Click the **Git icon** in the left sidebar
- Click **Initialize Git** button
- Your work is now protected with version control!

### 3. Set Your Writing Goals
- Click the **Stats icon** in the sidebar
- Set your daily, weekly, and monthly word count goals
- Track your progress in real-time

## Project Setup

### Organizing Your Manuscript

#### File Structure
Create a logical structure for your novel:
```
my-novel/
├── chapters/
│   ├── chapter-01.md
│   ├── chapter-02.md
│   └── ...
├── notes/
│   └── plot-notes.md
└── research/
    └── research-notes.md
```

### Character Database

1. Click the **Characters icon** in the sidebar
2. Click **Add Character**
3. Fill in details:
   - Name, Role (Protagonist/Antagonist/Supporting)
   - Physical description
   - Personality traits
   - Background and history
   - Goals and motivations
   - Tags for quick searching

### Location Database

1. Click the **Places icon** in the sidebar
2. Click **Add Place**
3. Document your settings:
   - Name and type
   - Geography and climate
   - Culture and history
   - Significance to your story

### Scene Planning

1. Click the **Scenes icon** in the sidebar
2. Create scene cards for each scene in your novel
3. Track:
   - Scene goals and conflicts
   - Characters involved
   - Setting and time
   - Status (Draft/In Progress/Complete/Revision)
4. Drag and drop to reorder scenes

## Core Features

### Writing Statistics Dashboard

Access via the **Stats icon** in the sidebar:
- View today's word count
- Track writing sessions
- Monitor progress toward goals
- See writing streaks and trends

**Starting a Session:**
1. Click **Start Session** before you begin writing
2. Write your content
3. Click **End Session** when done
4. Your statistics are automatically updated

### Git Version Control

The **Git panel** helps you track every change:

**Basic Workflow:**
1. Write and save your changes
2. Open the Git panel
3. Stage modified files by clicking **Stage**
4. Enter a commit message (e.g., "Completed Chapter 3")
5. Click **Commit**

**Advanced Features:**
- Create branches for different plot versions
- View commit history
- Push/pull to remote repositories (GitHub, GitLab, etc.)

### Find and Replace

Use the built-in search (Ctrl/Cmd + F) to:
- Find text across your entire project
- Use regex patterns for advanced searching
- Replace text with multi-file support

## Writing Workflow

### Recommended Daily Workflow

1. **Start Your Session**
   - Open NovelWriter
   - Click **Start Session** in the Stats panel
   - Review your daily goal

2. **Review Your Plan**
   - Check your scene cards
   - Review character notes if needed
   - Refresh your memory on recent events

3. **Write**
   - Focus on your current scene/chapter
   - Use Focus Mode (View → Focus Mode) to minimize distractions
   - Use Typewriter Mode for centered writing

4. **Save and Version**
   - Save regularly (Ctrl/Cmd + S)
   - Commit significant changes to Git
   - Use descriptive commit messages

5. **End Your Session**
   - Click **End Session** in the Stats panel
   - Review your progress
   - Plan tomorrow's writing

### Weekly Workflow

1. **Review Progress**
   - Check weekly statistics
   - Review completed scenes
   - Update character/place information

2. **Plan Ahead**
   - Create scene cards for upcoming chapters
   - Outline plot points
   - Research as needed

3. **Backup**
   - Push your work to a remote Git repository
   - Export current draft (File → Export)

## Tips & Best Practices

### Version Control

✅ **DO:**
- Commit after completing each scene/chapter
- Write meaningful commit messages
- Create branches for experimental plot changes
- Push to remote regularly (daily or weekly)

❌ **DON'T:**
- Wait too long between commits
- Use vague commit messages like "updates"
- Forget to push to remote backup

### Organization

✅ **DO:**
- Keep character and place databases updated
- Use scene cards to track progress
- Tag characters/places for easy searching
- Break your manuscript into manageable files

❌ **DON'T:**
- Put everything in one huge file
- Forget to document important details
- Let your databases get outdated

### Writing Habits

✅ **DO:**
- Set realistic daily goals
- Track your sessions consistently
- Use distraction-free modes
- Take breaks between writing sessions

❌ **DON'T:**
- Set goals too high (leads to burnout)
- Forget to start/end sessions (loses tracking data)
- Write for hours without breaks

### Export and Backup

✅ **DO:**
- Export to multiple formats (DOCX, PDF, EPUB)
- Keep remote Git backups
- Export regularly as you progress
- Test exports early in your project

❌ **DON'T:**
- Wait until the end to test exports
- Rely on local storage only
- Ignore export errors

## Keyboard Shortcuts

### Essential Shortcuts

- **Ctrl/Cmd + N** - New file
- **Ctrl/Cmd + O** - Open file
- **Ctrl/Cmd + S** - Save
- **Ctrl/Cmd + F** - Find
- **Ctrl/Cmd + H** - Replace
- **Ctrl/Cmd + Shift + F** - Find in folder
- **Ctrl/Cmd + /** - Toggle sidebar
- **Ctrl/Cmd + Shift + T** - Toggle table of contents

### Writing Modes

- **Ctrl/Cmd + Shift + 1** - Source code mode
- **Ctrl/Cmd + Shift + 2** - Typewriter mode
- **Ctrl/Cmd + Shift + 3** - Focus mode

## Getting Help

- Check the [main documentation](docs/README.md)
- Review [developer docs](docs/dev/README.md) for advanced features
- Report issues on GitHub
- Join the community for support

## Next Steps

Now that you're familiar with the basics:

1. Set up your project structure
2. Create your main characters in the database
3. Document your key locations
4. Plan your first few scenes
5. Set your writing goals
6. Start writing!

**Happy writing! 📚✨**

---

Remember: The best novel is the one that gets written. Don't let perfectionism stop you from making progress. Use these tools to support your creativity, not constrain it.
