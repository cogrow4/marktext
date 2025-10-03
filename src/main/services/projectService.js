const { ipcMain } = require('electron')
const path = require('path')
const fs = require('fs-extra')

class ProjectService {
  constructor() {
    this.setupIpcHandlers()
  }

  setupIpcHandlers() {
    // Initialize new project
    ipcMain.handle('project-init', async (event, projectPath, projectData) => {
      try {
        await fs.ensureDir(projectPath)
        await fs.ensureDir(path.join(projectPath, '.novelcraft'))
        
        // Create project structure
        const projectStructure = {
          'chapters/': {},
          'research/': {},
          'notes/': {},
          'exports/': {},
          '.novelcraft/': {
            'database.db': null,
            'config.json': null,
            'project.json': null
          }
        }
        
        await this.createProjectStructure(projectPath, projectStructure)
        
        // Initialize database
        const dbResult = await ipcRenderer.invoke('db-init', projectPath)
        if (!dbResult.success) {
          throw new Error('Failed to initialize database: ' + dbResult.error)
        }
        
        // Initialize git repository
        const gitResult = await ipcRenderer.invoke('git-init', projectPath)
        if (!gitResult.success) {
          throw new Error('Failed to initialize git repository: ' + gitResult.error)
        }
        
        // Save project configuration
        const projectConfig = {
          name: projectData.name || path.basename(projectPath),
          description: projectData.description || '',
          wordGoal: projectData.wordGoal || 80000,
          dailyGoal: projectData.dailyGoal || 1000,
          deadline: projectData.deadline || null,
          created: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
        
        await fs.writeJSON(path.join(projectPath, '.novelcraft', 'project.json'), projectConfig, { spaces: 2 })
        
        return { success: true, message: 'Project initialized successfully' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Load project
    ipcMain.handle('project-load', async (event, projectPath) => {
      try {
        const projectConfigPath = path.join(projectPath, '.novelcraft', 'project.json')
        
        if (!await fs.pathExists(projectConfigPath)) {
          return { success: false, error: 'Not a NovelCraft project' }
        }
        
        const projectConfig = await fs.readJSON(projectConfigPath)
        
        // Initialize services for this project
        await ipcRenderer.invoke('db-init', projectPath)
        
        return { success: true, project: projectConfig }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Save project
    ipcMain.handle('project-save', async (event, projectData) => {
      try {
        const projectPath = projectData.path
        const projectConfigPath = path.join(projectPath, '.novelcraft', 'project.json')
        
        projectData.lastModified = new Date().toISOString()
        
        await fs.writeJSON(projectConfigPath, projectData, { spaces: 2 })
        
        return { success: true, message: 'Project saved successfully' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Get project statistics
    ipcMain.handle('project-stats', async (event, projectPath) => {
      try {
        const [charResult, placeResult, notesResult] = await Promise.all([
          ipcRenderer.invoke('db-get-characters', projectPath),
          ipcRenderer.invoke('db-get-places', projectPath),
          ipcRenderer.invoke('db-get-notes', projectPath)
        ])
        
        const stats = {
          characterCount: charResult.success ? charResult.characters.length : 0,
          placeCount: placeResult.success ? placeResult.places.length : 0,
          noteCount: notesResult.success ? notesResult.notes.length : 0,
          wordCount: 0, // This would be calculated from all markdown files
          chapterCount: 0 // This would be calculated from chapters directory
        }
        
        // Calculate word count from all markdown files
        const chaptersPath = path.join(projectPath, 'chapters')
        if (await fs.pathExists(chaptersPath)) {
          const files = await fs.readdir(chaptersPath)
          const markdownFiles = files.filter(file => file.endsWith('.md'))
          stats.chapterCount = markdownFiles.length
          
          let totalWords = 0
          for (const file of markdownFiles) {
            const content = await fs.readFile(path.join(chaptersPath, file), 'utf8')
            const words = content.match(/\b\w+\b/g) || []
            totalWords += words.length
          }
          stats.wordCount = totalWords
        }
        
        return { success: true, stats }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Create new chapter
    ipcMain.handle('project-create-chapter', async (event, projectPath, chapterData) => {
      try {
        const chaptersPath = path.join(projectPath, 'chapters')
        await fs.ensureDir(chaptersPath)
        
        const chapterNumber = chapterData.number || 1
        const chapterTitle = chapterData.title || `Chapter ${chapterNumber}`
        const fileName = `chapter-${chapterNumber.toString().padStart(2, '0')}-${chapterTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`
        
        const chapterContent = `# ${chapterTitle}

## Summary
${chapterData.summary || 'Chapter summary goes here...'}

## Notes
${chapterData.notes || 'Chapter notes go here...'}

---

## Chapter Content

Start writing your chapter here...

`
        
        const filePath = path.join(chaptersPath, fileName)
        await fs.writeFile(filePath, chapterContent, 'utf8')
        
        return { success: true, filePath, fileName }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Get project structure
    ipcMain.handle('project-structure', async (event, projectPath) => {
      try {
        const structure = {
          chapters: [],
          research: [],
          notes: [],
          exports: []
        }
        
        // Get chapters
        const chaptersPath = path.join(projectPath, 'chapters')
        if (await fs.pathExists(chaptersPath)) {
          const files = await fs.readdir(chaptersPath)
          structure.chapters = files.filter(file => file.endsWith('.md'))
        }
        
        // Get research files
        const researchPath = path.join(projectPath, 'research')
        if (await fs.pathExists(researchPath)) {
          const files = await fs.readdir(researchPath)
          structure.research = files
        }
        
        // Get notes files
        const notesPath = path.join(projectPath, 'notes')
        if (await fs.pathExists(notesPath)) {
          const files = await fs.readdir(notesPath)
          structure.notes = files
        }
        
        // Get export files
        const exportsPath = path.join(projectPath, 'exports')
        if (await fs.pathExists(exportsPath)) {
          const files = await fs.readdir(exportsPath)
          structure.exports = files
        }
        
        return { success: true, structure }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Backup project
    ipcMain.handle('project-backup', async (event, projectPath, backupPath) => {
      try {
        await fs.copy(projectPath, backupPath, {
          filter: (src, dest) => {
            // Skip node_modules and other unnecessary directories
            return !src.includes('node_modules') && 
                   !src.includes('.git/objects') &&
                   !src.includes('.git/logs')
          }
        })
        
        return { success: true, message: 'Project backed up successfully' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Restore project
    ipcMain.handle('project-restore', async (event, backupPath, restorePath) => {
      try {
        await fs.copy(backupPath, restorePath)
        
        return { success: true, message: 'Project restored successfully' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })
  }

  async createProjectStructure(basePath, structure) {
    for (const [itemPath, children] of Object.entries(structure)) {
      const fullPath = path.join(basePath, itemPath)
      
      if (children === null) {
        // This is a file
        await fs.ensureFile(fullPath)
      } else {
        // This is a directory
        await fs.ensureDir(fullPath)
        if (typeof children === 'object') {
          await this.createProjectStructure(fullPath, children)
        }
      }
    }
  }
}

module.exports = ProjectService