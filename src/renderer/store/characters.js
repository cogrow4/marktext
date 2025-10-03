import { ipcRenderer } from 'electron'

const state = {
  characters: [],
  currentCharacter: null,
  loading: false,
  searchQuery: ''
}

const getters = {
  filteredCharacters: state => {
    if (!state.searchQuery) return state.characters
    
    const query = state.searchQuery.toLowerCase()
    return state.characters.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.role.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
    )
  },
  charactersByRole: state => {
    const roles = {}
    state.characters.forEach(char => {
      if (!roles[char.role]) {
        roles[char.role] = []
      }
      roles[char.role].push(char)
    })
    return roles
  }
}

const mutations = {
  SET_CHARACTERS (state, characters) {
    state.characters = characters
  },
  SET_CURRENT_CHARACTER (state, character) {
    state.currentCharacter = character
  },
  ADD_CHARACTER (state, character) {
    state.characters.push(character)
  },
  UPDATE_CHARACTER (state, character) {
    const index = state.characters.findIndex(c => c.id === character.id)
    if (index !== -1) {
      state.characters.splice(index, 1, character)
    }
  },
  DELETE_CHARACTER (state, id) {
    state.characters = state.characters.filter(c => c.id !== id)
  },
  SET_LOADING (state, loading) {
    state.loading = loading
  },
  SET_SEARCH_QUERY (state, query) {
    state.searchQuery = query
  }
}

const actions = {
  async loadCharacters ({ commit, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('character::getAll', { projectPath })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('SET_CHARACTERS', result.data)
    }
    return result
  },

  async createCharacter ({ commit, rootState }, characterData) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('character::create', { 
      projectPath, 
      character: characterData 
    })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('ADD_CHARACTER', result.data)
    }
    return result
  },

  async updateCharacter ({ commit, rootState }, { id, updates }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('character::update', { 
      projectPath, 
      id, 
      updates 
    })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('UPDATE_CHARACTER', result.data)
    }
    return result
  },

  async deleteCharacter ({ commit, rootState }, id) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('character::delete', { 
      projectPath, 
      id 
    })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('DELETE_CHARACTER', id)
    }
    return result
  },

  async searchCharacters ({ commit, rootState }, query) {
    commit('SET_SEARCH_QUERY', query)
    
    if (!query) {
      return dispatch('loadCharacters')
    }

    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('character::search', { 
      projectPath, 
      query 
    })
    
    if (result.success) {
      commit('SET_CHARACTERS', result.data)
    }
    return result
  },

  selectCharacter ({ commit }, character) {
    commit('SET_CURRENT_CHARACTER', character)
  }
}

export default { namespaced: true, state, getters, mutations, actions }
