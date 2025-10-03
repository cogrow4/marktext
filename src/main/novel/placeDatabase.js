import { ipcMain } from 'electron'
import Store from 'electron-store'
import log from 'electron-log'

class PlaceDatabase {
  constructor () {
    this.store = new Store({
      name: 'novel-places',
      defaults: {
        places: {}
      }
    })
    this.setupIpcHandlers()
  }

  setupIpcHandlers () {
    // Get all places
    ipcMain.handle('place::getAll', async (event, { projectPath }) => {
      try {
        const places = this.store.get(`places.${this.getProjectKey(projectPath)}`, [])
        return { success: true, data: places }
      } catch (error) {
        log.error('Get places error:', error)
        return { success: false, error: error.message }
      }
    })

    // Get single place
    ipcMain.handle('place::get', async (event, { projectPath, id }) => {
      try {
        const places = this.store.get(`places.${this.getProjectKey(projectPath)}`, [])
        const place = places.find(p => p.id === id)
        return { success: true, data: place }
      } catch (error) {
        log.error('Get place error:', error)
        return { success: false, error: error.message }
      }
    })

    // Create place
    ipcMain.handle('place::create', async (event, { projectPath, place }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const places = this.store.get(`places.${projectKey}`, [])
        
        const newPlace = {
          id: Date.now().toString(),
          name: place.name || 'Unnamed Location',
          type: place.type || 'Location',
          description: place.description || '',
          geography: place.geography || '',
          climate: place.climate || '',
          culture: place.culture || '',
          history: place.history || '',
          inhabitants: place.inhabitants || '',
          significance: place.significance || '',
          notes: place.notes || '',
          tags: place.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        places.push(newPlace)
        this.store.set(`places.${projectKey}`, places)
        
        return { success: true, data: newPlace }
      } catch (error) {
        log.error('Create place error:', error)
        return { success: false, error: error.message }
      }
    })

    // Update place
    ipcMain.handle('place::update', async (event, { projectPath, id, updates }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const places = this.store.get(`places.${projectKey}`, [])
        
        const index = places.findIndex(p => p.id === id)
        if (index === -1) {
          return { success: false, error: 'Place not found' }
        }
        
        places[index] = {
          ...places[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        
        this.store.set(`places.${projectKey}`, places)
        
        return { success: true, data: places[index] }
      } catch (error) {
        log.error('Update place error:', error)
        return { success: false, error: error.message }
      }
    })

    // Delete place
    ipcMain.handle('place::delete', async (event, { projectPath, id }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const places = this.store.get(`places.${projectKey}`, [])
        
        const filtered = places.filter(p => p.id !== id)
        this.store.set(`places.${projectKey}`, filtered)
        
        return { success: true }
      } catch (error) {
        log.error('Delete place error:', error)
        return { success: false, error: error.message }
      }
    })

    // Search places
    ipcMain.handle('place::search', async (event, { projectPath, query }) => {
      try {
        const places = this.store.get(`places.${this.getProjectKey(projectPath)}`, [])
        const lowerQuery = query.toLowerCase()
        
        const results = places.filter(p => 
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
        
        return { success: true, data: results }
      } catch (error) {
        log.error('Search places error:', error)
        return { success: false, error: error.message }
      }
    })
  }

  getProjectKey (projectPath) {
    // Convert path to safe key
    return projectPath.replace(/[/\\:]/g, '_')
  }
}

export default new PlaceDatabase()
