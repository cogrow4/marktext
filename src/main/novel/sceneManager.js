import { ipcMain } from 'electron'
import Store from 'electron-store'
import log from 'electron-log'

class SceneManager {
  constructor () {
    this.store = new Store({
      name: 'novel-scenes',
      defaults: {
        scenes: {}
      }
    })
    this.setupIpcHandlers()
  }

  setupIpcHandlers () {
    // Get all scenes
    ipcMain.handle('scene::getAll', async (event, { projectPath }) => {
      try {
        const scenes = this.store.get(`scenes.${this.getProjectKey(projectPath)}`, [])
        return { success: true, data: scenes }
      } catch (error) {
        log.error('Get scenes error:', error)
        return { success: false, error: error.message }
      }
    })

    // Get single scene
    ipcMain.handle('scene::get', async (event, { projectPath, id }) => {
      try {
        const scenes = this.store.get(`scenes.${this.getProjectKey(projectPath)}`, [])
        const scene = scenes.find(s => s.id === id)
        return { success: true, data: scene }
      } catch (error) {
        log.error('Get scene error:', error)
        return { success: false, error: error.message }
      }
    })

    // Create scene
    ipcMain.handle('scene::create', async (event, { projectPath, scene }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const scenes = this.store.get(`scenes.${projectKey}`, [])
        
        const newScene = {
          id: Date.now().toString(),
          title: scene.title || 'Untitled Scene',
          chapter: scene.chapter || '',
          summary: scene.summary || '',
          setting: scene.setting || '',
          characters: scene.characters || [],
          timeOfDay: scene.timeOfDay || '',
          weather: scene.weather || '',
          mood: scene.mood || '',
          pov: scene.pov || '',
          goals: scene.goals || '',
          conflict: scene.conflict || '',
          outcome: scene.outcome || '',
          notes: scene.notes || '',
          status: scene.status || 'draft',
          wordCount: scene.wordCount || 0,
          filePath: scene.filePath || '',
          order: scene.order || scenes.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        scenes.push(newScene)
        scenes.sort((a, b) => a.order - b.order)
        this.store.set(`scenes.${projectKey}`, scenes)
        
        return { success: true, data: newScene }
      } catch (error) {
        log.error('Create scene error:', error)
        return { success: false, error: error.message }
      }
    })

    // Update scene
    ipcMain.handle('scene::update', async (event, { projectPath, id, updates }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const scenes = this.store.get(`scenes.${projectKey}`, [])
        
        const index = scenes.findIndex(s => s.id === id)
        if (index === -1) {
          return { success: false, error: 'Scene not found' }
        }
        
        scenes[index] = {
          ...scenes[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        
        this.store.set(`scenes.${projectKey}`, scenes)
        
        return { success: true, data: scenes[index] }
      } catch (error) {
        log.error('Update scene error:', error)
        return { success: false, error: error.message }
      }
    })

    // Delete scene
    ipcMain.handle('scene::delete', async (event, { projectPath, id }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const scenes = this.store.get(`scenes.${projectKey}`, [])
        
        const filtered = scenes.filter(s => s.id !== id)
        this.store.set(`scenes.${projectKey}`, filtered)
        
        return { success: true }
      } catch (error) {
        log.error('Delete scene error:', error)
        return { success: false, error: error.message }
      }
    })

    // Reorder scenes
    ipcMain.handle('scene::reorder', async (event, { projectPath, sceneIds }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const scenes = this.store.get(`scenes.${projectKey}`, [])
        
        sceneIds.forEach((id, index) => {
          const scene = scenes.find(s => s.id === id)
          if (scene) {
            scene.order = index
          }
        })
        
        scenes.sort((a, b) => a.order - b.order)
        this.store.set(`scenes.${projectKey}`, scenes)
        
        return { success: true, data: scenes }
      } catch (error) {
        log.error('Reorder scenes error:', error)
        return { success: false, error: error.message }
      }
    })

    // Get scenes by chapter
    ipcMain.handle('scene::getByChapter', async (event, { projectPath, chapter }) => {
      try {
        const scenes = this.store.get(`scenes.${this.getProjectKey(projectPath)}`, [])
        const filtered = scenes.filter(s => s.chapter === chapter)
        return { success: true, data: filtered }
      } catch (error) {
        log.error('Get scenes by chapter error:', error)
        return { success: false, error: error.message }
      }
    })

    // Get timeline view
    ipcMain.handle('scene::getTimeline', async (event, { projectPath }) => {
      try {
        const scenes = this.store.get(`scenes.${this.getProjectKey(projectPath)}`, [])
        
        // Group by chapter
        const timeline = {}
        scenes.forEach(scene => {
          const chapter = scene.chapter || 'Unassigned'
          if (!timeline[chapter]) {
            timeline[chapter] = []
          }
          timeline[chapter].push(scene)
        })
        
        return { success: true, data: timeline }
      } catch (error) {
        log.error('Get timeline error:', error)
        return { success: false, error: error.message }
      }
    })
  }

  getProjectKey (projectPath) {
    return projectPath.replace(/[/\\:]/g, '_')
  }
}

export default new SceneManager()
