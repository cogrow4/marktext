# Novel Writing Features

This document provides detailed information about all the novel writing features in NovelWriter.

## Table of Contents

1. [Character Database](#character-database)
2. [Place & Location Database](#place--location-database)
3. [Scene & Timeline Management](#scene--timeline-management)
4. [Writing Statistics](#writing-statistics)
5. [Git Version Control](#git-version-control)
6. [Export Features](#export-features)

---

## Character Database

### Overview
The Character Database helps you maintain detailed profiles for every character in your novel, from protagonists to minor characters.

### Accessing
Click the **Characters icon** (person icon) in the left sidebar.

### Features

#### Character Profiles
Each character can have:
- **Name**: Character's full name
- **Role**: Protagonist, Antagonist, Supporting, or Minor
- **Description**: Brief overview
- **Appearance**: Physical characteristics
- **Personality**: Traits, quirks, behaviors
- **Background**: History and origin story
- **Goals**: What they want to achieve
- **Relationships**: Connections to other characters
- **Notes**: Additional information
- **Tags**: Keywords for searching

#### Organization
- Characters are grouped by role
- Search by name, description, or tags
- Click any character to view full details

#### Best Practices
1. **Start with main characters**: Create detailed profiles for your protagonist(s) and antagonist(s) first
2. **Update as you write**: Add details as they emerge in your story
3. **Use tags effectively**: Tag characters by location, group affiliation, or story arc
4. **Track relationships**: Note how characters are connected to each other
5. **Reference while writing**: Keep the Characters panel open for quick reference

#### Advanced Tips
- Create characters before you need them in the story
- Include sensory details (how they sound, smell, move)
- Note character arc progression
- Track what each character knows (useful for mysteries)

---

## Place & Location Database

### Overview
Document every location in your story world, from major cities to individual rooms.

### Accessing
Click the **Places icon** (map marker) in the left sidebar.

### Features

#### Location Profiles
Each location can have:
- **Name**: Location identifier
- **Type**: City, Town, Building, Natural, Region, or Other
- **Description**: Overview of the location
- **Geography**: Physical features and landscape
- **Climate**: Weather patterns and seasons
- **Culture**: Customs, traditions, social norms
- **History**: Past events and significance
- **Inhabitants**: Who lives or works there
- **Significance**: Role in your story
- **Notes**: Additional details
- **Tags**: Keywords for searching

#### Organization
- Locations grouped by type
- Search by name, description, or tags
- Quick access to all locations

#### Best Practices
1. **World-building first**: Create major locations before writing
2. **Sensory details**: Include sounds, smells, colors
3. **Consistency**: Reference your location notes to maintain consistency
4. **Scale**: Create locations at multiple scales (continent → country → city → building)
5. **Story relevance**: Focus on locations that matter to your plot

#### Advanced Tips
- Create location hierarchies (e.g., "Tavern" under "City District" under "City")
- Note what scenes take place in each location
- Track time periods if your story spans multiple eras
- Include maps or sketches as reference

---

## Scene & Timeline Management

### Overview
Plan, organize, and track every scene in your novel with detailed scene cards.

### Accessing
Click the **Scenes icon** (timeline icon) in the left sidebar.

### Features

#### Scene Cards
Each scene includes:
- **Title**: Scene identifier
- **Chapter**: Which chapter it belongs to
- **Status**: Draft, In Progress, Complete, or Revision
- **Summary**: Brief description
- **POV**: Point-of-view character
- **Setting**: Where the scene takes place
- **Time of Day**: Morning, Afternoon, Evening, Night
- **Characters**: Who appears in the scene
- **Goals**: What characters are trying to achieve
- **Conflict**: Obstacles and challenges
- **Outcome**: How the scene resolves
- **Word Count**: Approximate length
- **Order**: Position in the story
- **Notes**: Additional information

#### View Modes

**List View**
- All scenes in sequential order
- Drag and drop to reorder
- Color-coded by status
- Quick status and metadata overview

**Timeline View**
- Scenes grouped by chapter
- Visual progression through story
- Numbered sequence
- Setting and time information

**Status View**
- Scenes grouped by status
- Track what needs work
- Manage revision workflow

#### Reordering
Simply drag scenes up or down in List View to change their order. Changes save automatically.

#### Best Practices

1. **Scene Planning**
   - Create scene cards before writing
   - Include key plot points
   - Note emotional beats

2. **During Writing**
   - Update word count as you write
   - Change status as you progress
   - Add notes about changes needed

3. **Revision**
   - Mark scenes for revision
   - Track which scenes are complete
   - Reorder scenes as needed

4. **Scene Structure**
   - Every scene should have a clear goal
   - Include conflict or tension
   - End with a hook or resolution

#### Advanced Tips
- Color-code chapters with tags
- Create alternate scene orders with Git branches
- Track subplots with character tags
- Note pacing in scene notes
- Link scenes to specific character arcs

---

## Writing Statistics

### Overview
Track your progress, maintain motivation, and build consistent writing habits with comprehensive statistics.

### Accessing
Click the **Stats icon** (chart icon) in the left sidebar.

### Features

#### Session Tracking
1. Click **Start Session** when you begin writing
2. Write your content
3. Click **End Session** when finished
4. Statistics automatically update

**Tracked Metrics:**
- Words written during session
- Time spent writing
- Number of sessions per day

#### Daily Statistics
- Words written today
- Time spent writing
- Number of sessions
- Progress toward daily goal
- Visual progress bar

#### Weekly View
- 7-day chart showing daily word counts
- Total words for the week
- Progress toward weekly goal
- Visual bar chart

#### Monthly Progress
- 30-day overview
- Total monthly words
- Progress toward monthly goal
- Circular progress indicator

#### All-Time Summary
- Total words written
- Total days written
- Average words per day
- Total number of sessions
- Average session duration

#### Goal Setting
Set custom goals for:
- **Daily**: Default 1,000 words
- **Weekly**: Default 7,000 words
- **Monthly**: Default 30,000 words

Adjust goals based on your schedule and writing speed.

#### Best Practices

1. **Consistency Over Quantity**
   - Write daily, even if below your goal
   - Build the habit first
   - Adjust goals if they're too high

2. **Session Management**
   - Always start/end sessions for accurate tracking
   - Take breaks between long sessions
   - Review stats at end of each session

3. **Goal Setting**
   - Start with achievable goals
   - Increase gradually
   - Account for editing/revision days

4. **Using Data**
   - Identify your most productive times
   - Celebrate milestones
   - Adjust goals based on actual performance

#### Advanced Tips
- Track different metrics for drafting vs. revision
- Use statistics to plan completion dates
- Compare weekly averages to identify trends
- Set sprint goals for intensive writing periods

---

## Git Version Control

### Overview
Never lose your work. Track every change, experiment freely, and maintain a complete history of your novel's development.

### Accessing
Click the **Git icon** (source control icon) in the left sidebar.

### Features

#### Repository Management

**Initialize Repository**
1. Click **Initialize Git** button
2. Repository is created in your project folder
3. Start tracking changes immediately

**Status Display**
- **Modified**: Files you've changed
- **Untracked**: New files not yet tracked
- **Added**: Files staged for commit
- **Deleted**: Files removed

#### Making Commits

**Basic Workflow:**
1. Make changes to your files
2. View changed files in Git panel
3. Click **Stage** next to files you want to commit
4. Enter a commit message
5. Click **Commit**

**Commit Message Tips:**
- Be descriptive: "Completed Chapter 3" not "updates"
- Mention significant changes: "Added character backstory for Alice"
- Use present tense: "Add" not "Added"

#### Branch Management

**What are Branches?**
Branches let you work on different versions simultaneously. Perfect for:
- Trying different plot directions
- Major revisions without losing original
- Experimental chapters
- Alternative endings

**Creating Branches:**
1. Click **Branches** button
2. Enter branch name (e.g., "alternate-ending")
3. Check "Create and switch to branch"
4. Click **Create**

**Switching Branches:**
1. Click **Branches** button
2. Click **Checkout** next to desired branch
3. Your files update to that branch's version

#### Commit History
- View recent commits
- See who made changes and when
- Review commit messages
- Track project evolution

#### Remote Repositories

**Why Use Remotes?**
- Backup your work to cloud
- Access from multiple computers
- Collaborate with co-authors
- Share with beta readers

**Setting Up Remote:**
1. Create repository on GitHub/GitLab
2. Copy repository URL
3. In Git panel, click **Push/Pull**
4. Enter remote name (usually "origin")
5. Enter branch name (usually "main")
6. Click **Push**

#### Best Practices

1. **Commit Frequency**
   - Commit after each writing session
   - Commit after completing a scene/chapter
   - Commit before major changes

2. **Commit Messages**
   - Be specific and descriptive
   - Explain why, not just what
   - Use consistent format

3. **Branch Usage**
   - Keep main branch stable
   - Create branches for experiments
   - Merge successful changes back

4. **Remote Backups**
   - Push daily to remote
   - Verify pushes succeed
   - Keep remote credentials secure

#### Advanced Tips
- Use `.gitignore` to exclude temporary files
- Create release tags for major milestones
- Review diff before committing
- Use branches for different draft versions

---

## Export Features

### Overview
Export your novel to professional formats for publishing, sharing, and editing.

### Supported Formats
- **DOCX**: Microsoft Word format
- **EPUB**: E-book format
- **PDF**: Portable document format
- **HTML**: Web format

### Prerequisites

For DOCX, EPUB exports, install Pandoc:
- **Windows**: Download from [pandoc.org](https://pandoc.org/installing.html)
- **macOS**: `brew install pandoc`
- **Linux**: `sudo apt-get install pandoc` or equivalent

### Exporting

#### Single File Export

**Via Menu:**
1. Open the file you want to export
2. Go to **Novel → Export Novel**
3. Choose format (DOCX/EPUB/PDF)
4. Select destination
5. Click **Save**

#### Multi-File Export

**Combining Chapters:**
1. Organize files in order
2. Use export dialog
3. Select multiple files
4. Files are combined in order
5. Page breaks added between files

### Export Options

#### DOCX Export
**Metadata Options:**
- Title
- Author name
- Date

**Best for:**
- Sending to editors
- Manuscript formatting
- Traditional publishing submissions

#### EPUB Export
**Metadata Options:**
- Title
- Author
- Language
- Cover image

**Best for:**
- E-book readers
- Self-publishing platforms
- Beta reader distribution

#### PDF Export
**Formatting Options:**
- Font size
- Margins
- Page layout

**Best for:**
- Print previews
- PDF submissions
- Archival copies

### Best Practices

1. **Test Early**
   - Export test chapters early
   - Check formatting
   - Verify metadata

2. **Consistent Formatting**
   - Use standard Markdown
   - Avoid platform-specific extensions
   - Test on target platforms

3. **Metadata**
   - Fill in all metadata fields
   - Use professional author name
   - Include copyright information

4. **Version Management**
   - Export from Git tagged releases
   - Name exports with version/date
   - Keep export history

### Troubleshooting

**Pandoc Not Found**
- Verify Pandoc is installed
- Check system PATH
- Restart NovelWriter after installing

**Formatting Issues**
- Check Markdown syntax
- Remove non-standard extensions
- Test with simple document first

**Large Files**
- Split into multiple parts
- Export chapters individually
- Combine manually if needed

---

## Integration Tips

### Using Features Together

**Character → Scenes**
- Link characters to scenes they appear in
- Reference character goals in scene goals
- Track character development through scenes

**Places → Scenes**
- Set scene location from Places database
- Ensure location details are consistent
- Track which locations are used most

**Scenes → Statistics**
- Use scene word counts for planning
- Track completion in Statistics
- Monitor overall progress

**Git → Everything**
- Commit after updating databases
- Track feature usage in commit history
- Branch for major story changes

### Workflow Integration

**Daily Writing Routine:**
1. Start session (Statistics)
2. Review scene plan (Scenes)
3. Check character notes (Characters)
4. Write content
5. Update scene status (Scenes)
6. End session (Statistics)
7. Commit work (Git)

**Weekly Review:**
1. Check statistics summary
2. Update character profiles
3. Plan next week's scenes
4. Push to remote backup
5. Export progress copy

---

## Tips for Maximum Productivity

1. **Stay Organized**
   - Update databases immediately
   - Use consistent naming
   - Tag everything relevant

2. **Build Habits**
   - Write at the same time daily
   - Use session tracking
   - Review statistics regularly

3. **Protect Your Work**
   - Commit frequently
   - Push to remote daily
   - Export periodic backups

4. **Plan Ahead**
   - Create scene cards in advance
   - Outline character arcs
   - Document world details early

5. **Stay Focused**
   - Use distraction-free modes
   - Close unnecessary panels
   - Set realistic daily goals

---

For more information, see the [Quick Start Guide](../QUICK_START.md) or [README](../README.md).
