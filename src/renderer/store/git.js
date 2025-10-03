import { ipcRenderer } from 'electron'

const state = {
  isRepo: false,
  status: {
    modified: [],
    added: [],
    deleted: [],
    untracked: []
  },
  branches: [],
  currentBranch: 'main',
  commits: [],
  loading: false
}

const getters = {
  hasChanges: state => {
    return state.status.modified.length > 0 ||
           state.status.added.length > 0 ||
           state.status.deleted.length > 0 ||
           state.status.untracked.length > 0
  },
  totalChanges: state => {
    return state.status.modified.length +
           state.status.added.length +
           state.status.deleted.length +
           state.status.untracked.length
  }
}

const mutations = {
  SET_IS_REPO (state, isRepo) {
    state.isRepo = isRepo
  },
  SET_STATUS (state, status) {
    state.status = status
  },
  SET_BRANCHES (state, branches) {
    state.branches = branches
  },
  SET_CURRENT_BRANCH (state, branch) {
    state.currentBranch = branch
  },
  SET_COMMITS (state, commits) {
    state.commits = commits
  },
  SET_LOADING (state, loading) {
    state.loading = loading
  }
}

const actions = {
  async checkRepo ({ commit, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('git::isRepo', { dir: projectPath })
    if (result.success) {
      commit('SET_IS_REPO', result.data)
    }
  },

  async initRepo ({ dispatch, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('git::init', { dir: projectPath })
    commit('SET_LOADING', false)

    if (result.success) {
      await dispatch('checkRepo')
      await dispatch('refreshStatus')
    }
    return result
  },

  async refreshStatus ({ commit, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('git::status', { dir: projectPath })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('SET_STATUS', result.data)
    }
  },

  async addFile ({ dispatch, rootState }, filepath) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('git::add', { dir: projectPath, filepath })
    if (result.success) {
      await dispatch('refreshStatus')
    }
    return result
  },

  async commit ({ dispatch, rootState }, { message, author }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('git::commit', { 
      dir: projectPath, 
      message,
      author 
    })
    commit('SET_LOADING', false)

    if (result.success) {
      await dispatch('refreshStatus')
      await dispatch('refreshLog')
    }
    return result
  },

  async refreshLog ({ commit, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('git::log', { dir: projectPath })
    if (result.success) {
      commit('SET_COMMITS', result.data)
    }
  },

  async refreshBranches ({ commit, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('git::listBranches', { dir: projectPath })
    if (result.success) {
      commit('SET_BRANCHES', result.data)
    }
  },

  async createBranch ({ dispatch, rootState }, { name, checkout }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('git::branch', { 
      dir: projectPath, 
      ref: name,
      checkout 
    })
    
    if (result.success) {
      await dispatch('refreshBranches')
      if (checkout) {
        commit('SET_CURRENT_BRANCH', name)
      }
    }
    return result
  },

  async checkoutBranch ({ commit, dispatch, rootState }, branch) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('git::checkout', { 
      dir: projectPath, 
      ref: branch 
    })
    
    if (result.success) {
      commit('SET_CURRENT_BRANCH', branch)
      await dispatch('refreshStatus')
    }
    return result
  },

  async push ({ rootState }, { remote, remoteRef }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('git::push', { 
      dir: projectPath,
      remote,
      remoteRef
    })
    commit('SET_LOADING', false)
    
    return result
  },

  async pull ({ dispatch, rootState }, { remote, remoteRef, author }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('git::pull', { 
      dir: projectPath,
      remote,
      remoteRef,
      author
    })
    commit('SET_LOADING', false)

    if (result.success) {
      await dispatch('refreshStatus')
      await dispatch('refreshLog')
    }
    return result
  }
}

export default { namespaced: true, state, getters, mutations, actions }
