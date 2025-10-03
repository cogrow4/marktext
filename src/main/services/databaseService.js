const { ipcMain } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs-extra')
const { v4: uuidv4 } = require('uuid')

class DatabaseService {
  constructor() {
    this.databases = new Map()
    this.setupIpcHandlers()
  }

  setupIpcHandlers() {
    // Initialize database for project
    ipcMain.handle('db-init', async (event, projectPath) => {
      try {
        const dbPath = path.join(projectPath, '.novelcraft', 'database.db')
        await fs.ensureDir(path.dirname(dbPath))
        
        const db = new sqlite3.Database(dbPath)
        this.databases.set(projectPath, db)
        
        await this.initializeTables(db)
        return { success: true, message: 'Database initialized' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Character management
    ipcMain.handle('db-create-character', async (event, projectPath, characterData) => {
      try {
        const db = this.getDatabase(projectPath)
        const id = uuidv4()
        
        await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO characters (id, name, description, age, gender, role, appearance, personality, background, relationships, notes, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
              id,
              characterData.name,
              characterData.description || '',
              characterData.age || null,
              characterData.gender || '',
              characterData.role || '',
              characterData.appearance || '',
              characterData.personality || '',
              characterData.background || '',
              JSON.stringify(characterData.relationships || []),
              characterData.notes || ''
            ],
            function(err) {
              if (err) reject(err)
              else resolve(this.lastID)
            }
          )
        })
        
        return { success: true, id }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db-get-characters', async (event, projectPath) => {
      try {
        const db = this.getDatabase(projectPath)
        const characters = await new Promise((resolve, reject) => {
          db.all('SELECT * FROM characters ORDER BY name', (err, rows) => {
            if (err) reject(err)
            else {
              const processed = rows.map(row => ({
                ...row,
                relationships: JSON.parse(row.relationships || '[]')
              }))
              resolve(processed)
            }
          })
        })
        return { success: true, characters }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db-update-character', async (event, projectPath, id, characterData) => {
      try {
        const db = this.getDatabase(projectPath)
        
        await new Promise((resolve, reject) => {
          db.run(
            `UPDATE characters SET 
             name = ?, description = ?, age = ?, gender = ?, role = ?, 
             appearance = ?, personality = ?, background = ?, 
             relationships = ?, notes = ?, updated_at = datetime('now')
             WHERE id = ?`,
            [
              characterData.name,
              characterData.description || '',
              characterData.age || null,
              characterData.gender || '',
              characterData.role || '',
              characterData.appearance || '',
              characterData.personality || '',
              characterData.background || '',
              JSON.stringify(characterData.relationships || []),
              characterData.notes || '',
              id
            ],
            function(err) {
              if (err) reject(err)
              else resolve(this.changes)
            }
          )
        })
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db-delete-character', async (event, projectPath, id) => {
      try {
        const db = this.getDatabase(projectPath)
        
        await new Promise((resolve, reject) => {
          db.run('DELETE FROM characters WHERE id = ?', [id], function(err) {
            if (err) reject(err)
            else resolve(this.changes)
          })
        })
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Place management
    ipcMain.handle('db-create-place', async (event, projectPath, placeData) => {
      try {
        const db = this.getDatabase(projectPath)
        const id = uuidv4()
        
        await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO places (id, name, description, type, location, atmosphere, history, significance, notes, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
              id,
              placeData.name,
              placeData.description || '',
              placeData.type || '',
              placeData.location || '',
              placeData.atmosphere || '',
              placeData.history || '',
              placeData.significance || '',
              placeData.notes || ''
            ],
            function(err) {
              if (err) reject(err)
              else resolve(this.lastID)
            }
          )
        })
        
        return { success: true, id }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db-get-places', async (event, projectPath) => {
      try {
        const db = this.getDatabase(projectPath)
        const places = await new Promise((resolve, reject) => {
          db.all('SELECT * FROM places ORDER BY name', (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
          })
        })
        return { success: true, places }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db-update-place', async (event, projectPath, id, placeData) => {
      try {
        const db = this.getDatabase(projectPath)
        
        await new Promise((resolve, reject) => {
          db.run(
            `UPDATE places SET 
             name = ?, description = ?, type = ?, location = ?, atmosphere = ?, 
             history = ?, significance = ?, notes = ?, updated_at = datetime('now')
             WHERE id = ?`,
            [
              placeData.name,
              placeData.description || '',
              placeData.type || '',
              placeData.location || '',
              placeData.atmosphere || '',
              placeData.history || '',
              placeData.significance || '',
              placeData.notes || '',
              id
            ],
            function(err) {
              if (err) reject(err)
              else resolve(this.changes)
            }
          )
        })
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db-delete-place', async (event, projectPath, id) => {
      try {
        const db = this.getDatabase(projectPath)
        
        await new Promise((resolve, reject) => {
          db.run('DELETE FROM places WHERE id = ?', [id], function(err) {
            if (err) reject(err)
            else resolve(this.changes)
          })
        })
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Notes management
    ipcMain.handle('db-create-note', async (event, projectPath, noteData) => {
      try {
        const db = this.getDatabase(projectPath)
        const id = uuidv4()
        
        await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO notes (id, title, content, tags, category, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
              id,
              noteData.title,
              noteData.content || '',
              JSON.stringify(noteData.tags || []),
              noteData.category || 'general'
            ],
            function(err) {
              if (err) reject(err)
              else resolve(this.lastID)
            }
          )
        })
        
        return { success: true, id }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db-get-notes', async (event, projectPath, filters = {}) => {
      try {
        const db = this.getDatabase(projectPath)
        let query = 'SELECT * FROM notes'
        const params = []
        
        if (filters.category) {
          query += ' WHERE category = ?'
          params.push(filters.category)
        }
        
        if (filters.tags && filters.tags.length > 0) {
          query += filters.category ? ' AND' : ' WHERE'
          query += ' tags LIKE ?'
          params.push(`%"${filters.tags[0]}"%`)
        }
        
        query += ' ORDER BY updated_at DESC'
        
        const notes = await new Promise((resolve, reject) => {
          db.all(query, params, (err, rows) => {
            if (err) reject(err)
            else {
              const processed = rows.map(row => ({
                ...row,
                tags: JSON.parse(row.tags || '[]')
              }))
              resolve(processed)
            }
          })
        })
        return { success: true, notes }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Writing statistics
    ipcMain.handle('db-save-writing-session', async (event, projectPath, sessionData) => {
      try {
        const db = this.getDatabase(projectPath)
        
        await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO writing_sessions (id, file_path, words_written, session_duration, date, created_at)
             VALUES (?, ?, ?, ?, ?, datetime('now'))`,
            [
              uuidv4(),
              sessionData.filePath,
              sessionData.wordsWritten,
              sessionData.duration,
              sessionData.date
            ],
            function(err) {
              if (err) reject(err)
              else resolve(this.lastID)
            }
          )
        })
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db-get-writing-stats', async (event, projectPath, dateRange) => {
      try {
        const db = this.getDatabase(projectPath)
        let query = 'SELECT * FROM writing_sessions'
        const params = []
        
        if (dateRange && dateRange.start && dateRange.end) {
          query += ' WHERE date BETWEEN ? AND ?'
          params.push(dateRange.start, dateRange.end)
        }
        
        query += ' ORDER BY date DESC'
        
        const sessions = await new Promise((resolve, reject) => {
          db.all(query, params, (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
          })
        })
        
        return { success: true, sessions }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })
  }

  async initializeTables(db) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // Characters table
        db.run(`
          CREATE TABLE IF NOT EXISTS characters (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            age INTEGER,
            gender TEXT,
            role TEXT,
            appearance TEXT,
            personality TEXT,
            background TEXT,
            relationships TEXT,
            notes TEXT,
            created_at DATETIME,
            updated_at DATETIME
          )
        `)

        // Places table
        db.run(`
          CREATE TABLE IF NOT EXISTS places (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            type TEXT,
            location TEXT,
            atmosphere TEXT,
            history TEXT,
            significance TEXT,
            notes TEXT,
            created_at DATETIME,
            updated_at DATETIME
          )
        `)

        // Notes table
        db.run(`
          CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT,
            tags TEXT,
            category TEXT,
            created_at DATETIME,
            updated_at DATETIME
          )
        `)

        // Writing sessions table
        db.run(`
          CREATE TABLE IF NOT EXISTS writing_sessions (
            id TEXT PRIMARY KEY,
            file_path TEXT,
            words_written INTEGER,
            session_duration INTEGER,
            date DATE,
            created_at DATETIME
          )
        `)

        // Projects table
        db.run(`
          CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            word_goal INTEGER,
            deadline DATE,
            created_at DATETIME,
            updated_at DATETIME
          )
        `, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    })
  }

  getDatabase(projectPath) {
    if (!this.databases.has(projectPath)) {
      throw new Error('Database not initialized for this project')
    }
    return this.databases.get(projectPath)
  }

  closeDatabase(projectPath) {
    if (this.databases.has(projectPath)) {
      this.databases.get(projectPath).close()
      this.databases.delete(projectPath)
    }
  }
}

module.exports = DatabaseService