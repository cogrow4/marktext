import { ipcRenderer } from 'electron'

const state = {
  scenes: [],
  currentScene: null,
  timeline: {},
  loading: false
}

const getters = {
  scenesByChapter: state => {
    const chapters = {}
    state.scenes.forEach(scene => {
      const chapter = scene.chapter || 'Unassigned'
      if (!chapters[chapter]) {
        chapters[chapter] = []
      }
      chapters[chapter].push(scene)
    })
    return chapters
  },
  scenesByStatus: state => {
    const statuses = {}
    state.scenes.forEach(scene => {
      if (!statuses[scene.status]) {
        statuses[scene.status] = []
      }
      statuses[scene.status].push(scene)
    })
    return statuses
  },
  totalWordCount: state => {
    return state.scenes.reduce((sum, scene) => sum + (scene.wordCount || 0), 0)
  }
}

const mutations = {
  SET_SCENES (state, scenes) {
    state.scenes = scenes
  },
  SET_CURRENT_SCENE (state, scene) {
    state.currentScene = scene
  },
  SET_TIMELINE (state, timeline) {
    state.timeline = timeline
  },
  ADD_SCENE (state, scene) {
    state.scenes.push(scene)
  },
  UPDATE_SCENE (state, scene) {
    const index = state.scenes.findIndex(s => s.id === scene.id)
    if (index !== -1) {
      state.scenes.splice(index, 1, scene)
    }
  },
  DELETE_SCENE (state, id) {
    state.scenes = state.scenes.filter(s => s.id !== id)
  },
  SET_LOADING (state, loading) {
    state.loading = loading
  }
}

const actions = {
  async loadScenes ({ commit, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('scene::getAll', { projectPath })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('SET_SCENES', result.data)
    }
    return result
  },

  async loadTimeline ({ commit, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('scene::getTimeline', { projectPath })
    
    if (result.success) {
      commit('SET_TIMELINE', result.data)
    }
    return result
  },

  async createScene ({ commit, rootState }, sceneData) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('scene::create', { 
      projectPath, 
      scene: sceneData 
    })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('ADD_SCENE', result.data)
    }
    return result
  },

  async updateScene ({ commit, rootState }, { id, updates }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('scene::update', { 
      projectPath, 
      id, 
      updates 
    })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('UPDATE_SCENE', result.data)
    }
    return result
  },

  async deleteScene ({ commit, rootState }, id) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('scene::delete', { 
      projectPath, 
      id 
    })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('DELETE_SCENE', id)
    }
    return result
  },

  async reorderScenes ({ commit, dispatch, rootState }, sceneIds) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('scene::reorder', { 
      projectPath, 
      sceneIds 
    })
    
    if (result.success) {
      commit('SET_SCENES', result.data)
    }
    return result
  },

  async getScenesByChapter ({ rootState }, chapter) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('scene::getByChapter', { 
      projectPath, 
      chapter 
    })
    
    return result
  },

  selectScene ({ commit }, scene) {
    commit('SET_CURRENT_SCENE', scene)
  }
}

export default { namespaced: true, state, getters, mutations, actions }
