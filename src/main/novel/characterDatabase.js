import { ipcMain } from 'electron'
import Store from 'electron-store'
import log from 'electron-log'

class CharacterDatabase {
  constructor () {
    this.store = new Store({
      name: 'novel-characters',
      defaults: {
        characters: {}
      }
    })
    this.setupIpcHandlers()
  }

  setupIpcHandlers () {
    // Get all characters
    ipcMain.handle('character::getAll', async (event, { projectPath }) => {
      try {
        const characters = this.store.get(`characters.${this.getProjectKey(projectPath)}`, [])
        return { success: true, data: characters }
      } catch (error) {
        log.error('Get characters error:', error)
        return { success: false, error: error.message }
      }
    })

    // Get single character
    ipcMain.handle('character::get', async (event, { projectPath, id }) => {
      try {
        const characters = this.store.get(`characters.${this.getProjectKey(projectPath)}`, [])
        const character = characters.find(c => c.id === id)
        return { success: true, data: character }
      } catch (error) {
        log.error('Get character error:', error)
        return { success: false, error: error.message }
      }
    })

    // Create character
    ipcMain.handle('character::create', async (event, { projectPath, character }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const characters = this.store.get(`characters.${projectKey}`, [])
        
        const newCharacter = {
          id: Date.now().toString(),
          name: character.name || 'Unnamed Character',
          role: character.role || 'Supporting',
          description: character.description || '',
          appearance: character.appearance || '',
          personality: character.personality || '',
          background: character.background || '',
          goals: character.goals || '',
          relationships: character.relationships || [],
          notes: character.notes || '',
          tags: character.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        characters.push(newCharacter)
        this.store.set(`characters.${projectKey}`, characters)
        
        return { success: true, data: newCharacter }
      } catch (error) {
        log.error('Create character error:', error)
        return { success: false, error: error.message }
      }
    })

    // Update character
    ipcMain.handle('character::update', async (event, { projectPath, id, updates }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const characters = this.store.get(`characters.${projectKey}`, [])
        
        const index = characters.findIndex(c => c.id === id)
        if (index === -1) {
          return { success: false, error: 'Character not found' }
        }
        
        characters[index] = {
          ...characters[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        
        this.store.set(`characters.${projectKey}`, characters)
        
        return { success: true, data: characters[index] }
      } catch (error) {
        log.error('Update character error:', error)
        return { success: false, error: error.message }
      }
    })

    // Delete character
    ipcMain.handle('character::delete', async (event, { projectPath, id }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const characters = this.store.get(`characters.${projectKey}`, [])
        
        const filtered = characters.filter(c => c.id !== id)
        this.store.set(`characters.${projectKey}`, filtered)
        
        return { success: true }
      } catch (error) {
        log.error('Delete character error:', error)
        return { success: false, error: error.message }
      }
    })

    // Search characters
    ipcMain.handle('character::search', async (event, { projectPath, query }) => {
      try {
        const characters = this.store.get(`characters.${this.getProjectKey(projectPath)}`, [])
        const lowerQuery = query.toLowerCase()
        
        const results = characters.filter(c => 
          c.name.toLowerCase().includes(lowerQuery) ||
          c.description.toLowerCase().includes(lowerQuery) ||
          c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
        
        return { success: true, data: results }
      } catch (error) {
        log.error('Search characters error:', error)
        return { success: false, error: error.message }
      }
    })
  }

  getProjectKey (projectPath) {
    // Convert path to safe key
    return projectPath.replace(/[/\\:]/g, '_')
  }
}

export default new CharacterDatabase()
