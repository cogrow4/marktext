import { ipcRenderer } from 'electron'
import dayjs from 'dayjs'

const state = {
  dailyStats: {
    date: dayjs().format('YYYY-MM-DD'),
    wordCount: 0,
    duration: 0,
    sessions: 0
  },
  weeklyStats: [],
  monthlyStats: [],
  summary: {
    totalWords: 0,
    totalDuration: 0,
    totalSessions: 0,
    daysWritten: 0,
    avgWordsPerDay: 0,
    avgSessionDuration: 0
  },
  goals: {
    daily: 1000,
    weekly: 7000,
    monthly: 30000
  },
  sessionActive: false,
  loading: false
}

const getters = {
  dailyProgress: state => {
    if (!state.goals.daily) return 0
    return Math.min(100, (state.dailyStats.wordCount / state.goals.daily) * 100)
  },
  weeklyProgress: state => {
    if (!state.goals.weekly) return 0
    const weekTotal = state.weeklyStats.reduce((sum, day) => sum + day.wordCount, 0)
    return Math.min(100, (weekTotal / state.goals.weekly) * 100)
  },
  monthlyProgress: state => {
    if (!state.goals.monthly) return 0
    const monthTotal = state.monthlyStats.reduce((sum, day) => sum + day.wordCount, 0)
    return Math.min(100, (monthTotal / state.goals.monthly) * 100)
  },
  formattedDuration: state => {
    const hours = Math.floor(state.dailyStats.duration / 3600000)
    const minutes = Math.floor((state.dailyStats.duration % 3600000) / 60000)
    return `${hours}h ${minutes}m`
  }
}

const mutations = {
  SET_DAILY_STATS (state, stats) {
    state.dailyStats = stats
  },
  SET_WEEKLY_STATS (state, stats) {
    state.weeklyStats = stats
  },
  SET_MONTHLY_STATS (state, stats) {
    state.monthlyStats = stats
  },
  SET_SUMMARY (state, summary) {
    state.summary = summary
  },
  SET_GOALS (state, goals) {
    state.goals = { ...state.goals, ...goals }
  },
  SET_SESSION_ACTIVE (state, active) {
    state.sessionActive = active
  },
  SET_LOADING (state, loading) {
    state.loading = loading
  }
}

const actions = {
  async startSession ({ commit, rootState }, wordCount) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('stats::startSession', { 
      projectPath, 
      wordCount 
    })
    
    if (result.success) {
      commit('SET_SESSION_ACTIVE', true)
    }
    return result
  },

  async endSession ({ commit, dispatch, rootState }, wordCount) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('stats::endSession', { 
      projectPath, 
      wordCount 
    })
    
    if (result.success) {
      commit('SET_SESSION_ACTIVE', false)
      commit('SET_DAILY_STATS', result.data)
      await dispatch('loadWeeklyStats')
      await dispatch('loadSummary')
    }
    return result
  },

  async loadDailyStats ({ commit, rootState }, date) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('stats::getDaily', { 
      projectPath, 
      date 
    })
    
    if (result.success) {
      commit('SET_DAILY_STATS', result.data)
    }
    return result
  },

  async loadWeeklyStats ({ commit, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const endDate = dayjs().format('YYYY-MM-DD')
    const startDate = dayjs().subtract(6, 'days').format('YYYY-MM-DD')

    const result = await ipcRenderer.invoke('stats::getRange', { 
      projectPath, 
      startDate,
      endDate
    })
    
    if (result.success) {
      commit('SET_WEEKLY_STATS', result.data)
    }
    return result
  },

  async loadMonthlyStats ({ commit, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const endDate = dayjs().format('YYYY-MM-DD')
    const startDate = dayjs().subtract(29, 'days').format('YYYY-MM-DD')

    const result = await ipcRenderer.invoke('stats::getRange', { 
      projectPath, 
      startDate,
      endDate
    })
    
    if (result.success) {
      commit('SET_MONTHLY_STATS', result.data)
    }
    return result
  },

  async loadSummary ({ commit, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('stats::getSummary', { projectPath })
    commit('SET_LOADING', false)
    
    if (result.success) {
      commit('SET_SUMMARY', result.data)
    }
    return result
  },

  async loadGoals ({ commit, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('stats::getGoals', { projectPath })
    
    if (result.success) {
      commit('SET_GOALS', result.data)
    }
    return result
  },

  async setGoal ({ commit, dispatch, rootState }, { goalType, value }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('stats::setGoal', { 
      projectPath, 
      goalType, 
      value 
    })
    
    if (result.success) {
      await dispatch('loadGoals')
    }
    return result
  }
}

export default { namespaced: true, state, getters, mutations, actions }
