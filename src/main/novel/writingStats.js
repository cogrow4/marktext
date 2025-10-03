import { ipcMain } from 'electron'
import Store from 'electron-store'
import log from 'electron-log'
import dayjs from 'dayjs'

class WritingStatsService {
  constructor () {
    this.store = new Store({
      name: 'writing-stats',
      defaults: {
        stats: {},
        goals: {}
      }
    })
    this.sessionStartTime = null
    this.sessionStartWordCount = 0
    this.setupIpcHandlers()
  }

  setupIpcHandlers () {
    // Start writing session
    ipcMain.handle('stats::startSession', async (event, { projectPath, wordCount }) => {
      try {
        this.sessionStartTime = Date.now()
        this.sessionStartWordCount = wordCount || 0
        return { success: true }
      } catch (error) {
        log.error('Start session error:', error)
        return { success: false, error: error.message }
      }
    })

    // End writing session
    ipcMain.handle('stats::endSession', async (event, { projectPath, wordCount }) => {
      try {
        if (!this.sessionStartTime) {
          return { success: false, error: 'No active session' }
        }

        const duration = Date.now() - this.sessionStartTime
        const wordsWritten = wordCount - this.sessionStartWordCount
        const today = dayjs().format('YYYY-MM-DD')
        
        const projectKey = this.getProjectKey(projectPath)
        const dailyStats = this.store.get(`stats.${projectKey}.${today}`, {
          date: today,
          wordCount: 0,
          duration: 0,
          sessions: 0
        })

        dailyStats.wordCount += wordsWritten
        dailyStats.duration += duration
        dailyStats.sessions += 1

        this.store.set(`stats.${projectKey}.${today}`, dailyStats)

        this.sessionStartTime = null
        this.sessionStartWordCount = 0

        return { success: true, data: dailyStats }
      } catch (error) {
        log.error('End session error:', error)
        return { success: false, error: error.message }
      }
    })

    // Get daily stats
    ipcMain.handle('stats::getDaily', async (event, { projectPath, date }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const dateStr = date || dayjs().format('YYYY-MM-DD')
        const stats = this.store.get(`stats.${projectKey}.${dateStr}`, {
          date: dateStr,
          wordCount: 0,
          duration: 0,
          sessions: 0
        })
        return { success: true, data: stats }
      } catch (error) {
        log.error('Get daily stats error:', error)
        return { success: false, error: error.message }
      }
    })

    // Get stats for date range
    ipcMain.handle('stats::getRange', async (event, { projectPath, startDate, endDate }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const allStats = this.store.get(`stats.${projectKey}`, {})
        
        const start = dayjs(startDate)
        const end = dayjs(endDate)
        const rangeStats = []

        for (let date = start; date.isBefore(end) || date.isSame(end); date = date.add(1, 'day')) {
          const dateStr = date.format('YYYY-MM-DD')
          const stats = allStats[dateStr] || {
            date: dateStr,
            wordCount: 0,
            duration: 0,
            sessions: 0
          }
          rangeStats.push(stats)
        }

        return { success: true, data: rangeStats }
      } catch (error) {
        log.error('Get range stats error:', error)
        return { success: false, error: error.message }
      }
    })

    // Set writing goal
    ipcMain.handle('stats::setGoal', async (event, { projectPath, goalType, value }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        this.store.set(`goals.${projectKey}.${goalType}`, value)
        return { success: true }
      } catch (error) {
        log.error('Set goal error:', error)
        return { success: false, error: error.message }
      }
    })

    // Get goals
    ipcMain.handle('stats::getGoals', async (event, { projectPath }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const goals = this.store.get(`goals.${projectKey}`, {
          daily: 1000,
          weekly: 7000,
          monthly: 30000
        })
        return { success: true, data: goals }
      } catch (error) {
        log.error('Get goals error:', error)
        return { success: false, error: error.message }
      }
    })

    // Get total stats summary
    ipcMain.handle('stats::getSummary', async (event, { projectPath }) => {
      try {
        const projectKey = this.getProjectKey(projectPath)
        const allStats = this.store.get(`stats.${projectKey}`, {})
        
        let totalWords = 0
        let totalDuration = 0
        let totalSessions = 0
        let daysWritten = 0

        Object.values(allStats).forEach(day => {
          if (day.wordCount > 0) {
            totalWords += day.wordCount
            totalDuration += day.duration
            totalSessions += day.sessions
            daysWritten++
          }
        })

        const avgWordsPerDay = daysWritten > 0 ? Math.round(totalWords / daysWritten) : 0
        const avgSessionDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0

        return { 
          success: true, 
          data: {
            totalWords,
            totalDuration,
            totalSessions,
            daysWritten,
            avgWordsPerDay,
            avgSessionDuration
          }
        }
      } catch (error) {
        log.error('Get summary error:', error)
        return { success: false, error: error.message }
      }
    })
  }

  getProjectKey (projectPath) {
    return projectPath.replace(/[/\\:]/g, '_')
  }
}

export default new WritingStatsService()
