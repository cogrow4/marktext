import { ipcRenderer } from 'electron'

const state = {
  places: [],
  currentPlace: null,
  loading: false,
  searchQuery: ''
}

const getters = {
  filteredPlaces: state => {
    if (!state.searchQuery) return state.places
    
    const query = state.searchQuery.toLowerCase()
    return state.places.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  },
  placesByType: state => {
    const types = {}
    state.places.forEach(place => {
      if (!types[place.type]) {
        types[place.type] = []
      }
      types[place.type].push(place)
    })
    return types
  }
}

const mutations = {
  SET_PLACES (state, places) {
    state.places = places
  },
  SET_CURRENT_PLACE (state, place) {
    state.currentPlace = place
  },
  ADD_PLACE (state, place) {
    state.places.push(place)
  },
  UPDATE_PLACE (state, place) {
    const index = state.places.findIndex(p => p.id === place.id)
    if (index !== -1) {
      state.places.splice(index, 1, place)
    }
  },
  DELETE_PLACE (state, id) {
    state.places = state.places.filter(p => p.id !== id)
  },
  SET_LOADING (state, loading) {
    state.loading = loading
  },
  SET_SEARCH_QUERY (state, query) {
    state.searchQuery = query
  }
}

const actions = {
  async loadPlaces ({ commit, rootState }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('place::getAll', { projectPath })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('SET_PLACES', result.data)
    }
    return result
  },

  async createPlace ({ commit, rootState }, placeData) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('place::create', { 
      projectPath, 
      place: placeData 
    })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('ADD_PLACE', result.data)
    }
    return result
  },

  async updatePlace ({ commit, rootState }, { id, updates }) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('place::update', { 
      projectPath, 
      id, 
      updates 
    })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('UPDATE_PLACE', result.data)
    }
    return result
  },

  async deletePlace ({ commit, rootState }, id) {
    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    commit('SET_LOADING', true)
    const result = await ipcRenderer.invoke('place::delete', { 
      projectPath, 
      id 
    })
    commit('SET_LOADING', false)

    if (result.success) {
      commit('DELETE_PLACE', id)
    }
    return result
  },

  async searchPlaces ({ commit, rootState }, query) {
    commit('SET_SEARCH_QUERY', query)
    
    if (!query) {
      return dispatch('loadPlaces')
    }

    const projectPath = rootState.project.currentFile?.pathname
    if (!projectPath) return

    const result = await ipcRenderer.invoke('place::search', { 
      projectPath, 
      query 
    })
    
    if (result.success) {
      commit('SET_PLACES', result.data)
    }
    return result
  },

  selectPlace ({ commit }, place) {
    commit('SET_CURRENT_PLACE', place)
  }
}

export default { namespaced: true, state, getters, mutations, actions }
