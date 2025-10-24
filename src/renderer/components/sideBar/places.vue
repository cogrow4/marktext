<template>
  <div class="places-panel">
    <div class="panel-header">
      <div class="header-content">
        <h3><i class="el-icon-location"></i> Places & Locations</h3>
        <div class="header-stats">
          <span class="stat-badge">{{ places.length }} total</span>
        </div>
      </div>
      <el-button 
        type="primary" 
        size="small" 
        icon="el-icon-plus"
        @click="showCreateDialog = true">
        Add Place
      </el-button>
    </div>

    <div class="search-box">
      <el-input
        v-model="searchQuery"
        placeholder="Search places..."
        prefix-icon="el-icon-search"
        clearable
        @input="handleSearch">
      </el-input>
    </div>

    <div class="view-controls">
      <el-radio-group v-model="viewMode" size="mini">
        <el-radio-button label="grouped">Grouped</el-radio-button>
        <el-radio-button label="list">List</el-radio-button>
      </el-radio-group>
    </div>

    <div class="places-list">
      <!-- Grouped View -->
      <el-collapse v-if="viewMode === 'grouped'" v-model="activeTypes" accordion>
        <el-collapse-item 
          v-for="(places, type) in placesByType" 
          :key="type"
          :title="`${type} (${places.length})`"
          :name="type">
          <div 
            v-for="place in places" 
            :key="place.id"
            class="place-item"
            :class="{ 'selected': currentPlace && currentPlace.id === place.id }"
            @click="selectPlace(place)">
            <div class="place-icon">
              <i :class="getPlaceIcon(place.type)"></i>
            </div>
            <div class="place-info">
              <h4>{{ place.name }}</h4>
              <p class="place-description">{{ place.description || 'No description' }}</p>
              <div class="place-tags">
                <el-tag 
                  v-for="tag in place.tags" 
                  :key="tag" 
                  size="mini"
                  type="info">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div class="place-actions">
              <el-button 
                type="text" 
                icon="el-icon-edit"
                size="mini"
                @click.stop="editPlace(place)">
              </el-button>
              <el-button 
                type="text" 
                icon="el-icon-delete"
                size="mini"
                @click.stop="deletePlace(place.id)">
              </el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <!-- List View -->
      <div v-else class="place-list-view">
        <div 
          v-for="place in filteredPlaces" 
          :key="place.id"
          class="place-item list-item"
          :class="{ 'selected': currentPlace && currentPlace.id === place.id }"
          @click="selectPlace(place)">
          <div class="place-icon">
            <i :class="getPlaceIcon(place.type)"></i>
          </div>
          <div class="place-info">
            <div class="place-header">
              <h4>{{ place.name }}</h4>
              <el-tag size="mini" :type="getTypeColor(place.type)">{{ place.type }}</el-tag>
            </div>
            <p class="place-description">{{ place.description || 'No description' }}</p>
            <div class="place-tags">
              <el-tag 
                v-for="tag in place.tags" 
                :key="tag" 
                size="mini"
                type="info">
                {{ tag }}
              </el-tag>
            </div>
          </div>
          <div class="place-actions">
            <el-button 
              type="text" 
              icon="el-icon-edit"
              size="mini"
              @click.stop="editPlace(place)">
            </el-button>
            <el-button 
              type="text" 
              icon="el-icon-delete"
              size="mini"
              @click.stop="deletePlace(place.id)">
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Place Dialog -->
    <el-dialog
      :title="editingPlace ? 'Edit Place' : 'Create Place'"
      :visible.sync="showCreateDialog"
      width="600px">
      <el-form :model="placeForm" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="placeForm.name" placeholder="Place name"></el-input>
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="placeForm.type" placeholder="Select type">
            <el-option label="City" value="City"></el-option>
            <el-option label="Town" value="Town"></el-option>
            <el-option label="Building" value="Building"></el-option>
            <el-option label="Natural" value="Natural"></el-option>
            <el-option label="Region" value="Region"></el-option>
            <el-option label="Other" value="Other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Description">
          <el-input 
            type="textarea" 
            v-model="placeForm.description"
            :rows="3"
            placeholder="Brief description">
          </el-input>
        </el-form-item>
        <el-form-item label="Geography">
          <el-input 
            type="textarea" 
            v-model="placeForm.geography"
            :rows="2"
            placeholder="Geography and landscape">
          </el-input>
        </el-form-item>
        <el-form-item label="Climate">
          <el-input 
            type="textarea" 
            v-model="placeForm.climate"
            :rows="2"
            placeholder="Climate and weather">
          </el-input>
        </el-form-item>
        <el-form-item label="Culture">
          <el-input 
            type="textarea" 
            v-model="placeForm.culture"
            :rows="2"
            placeholder="Culture and customs">
          </el-input>
        </el-form-item>
        <el-form-item label="History">
          <el-input 
            type="textarea" 
            v-model="placeForm.history"
            :rows="3"
            placeholder="Historical background">
          </el-input>
        </el-form-item>
        <el-form-item label="Inhabitants">
          <el-input 
            type="textarea" 
            v-model="placeForm.inhabitants"
            :rows="2"
            placeholder="Who lives here">
          </el-input>
        </el-form-item>
        <el-form-item label="Significance">
          <el-input 
            type="textarea" 
            v-model="placeForm.significance"
            :rows="2"
            placeholder="Significance to the story">
          </el-input>
        </el-form-item>
        <el-form-item label="Notes">
          <el-input 
            type="textarea" 
            v-model="placeForm.notes"
            :rows="3"
            placeholder="Additional notes">
          </el-input>
        </el-form-item>
        <el-form-item label="Tags">
          <el-tag
            v-for="tag in placeForm.tags"
            :key="tag"
            closable
            @close="removeTag(tag)">
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm">
          </el-input>
          <el-button v-else size="small" @click="showInput">+ New Tag</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCreateDialog = false">Cancel</el-button>
        <el-button type="primary" @click="savePlace">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'PlacesPanel',
  data () {
    return {
      showCreateDialog: false,
      editingPlace: null,
      placeForm: this.getEmptyForm(),
      searchQuery: '',
      activeTypes: [],
      inputVisible: false,
      inputValue: '',
      viewMode: 'grouped'
    }
  },
  computed: {
    ...mapState('places', ['places', 'loading', 'currentPlace']),
    ...mapGetters('places', ['placesByType', 'filteredPlaces'])
  },
  mounted () {
    this.loadPlaces()
  },
  methods: {
    ...mapActions('places', [
      'loadPlaces',
      'createPlace',
      'updatePlace',
      'deletePlace',
      'searchPlaces',
      'selectPlace'
    ]),
    getEmptyForm () {
      return {
        name: '',
        type: 'Location',
        description: '',
        geography: '',
        climate: '',
        culture: '',
        history: '',
        inhabitants: '',
        significance: '',
        notes: '',
        tags: []
      }
    },
    handleSearch (query) {
      this.searchPlaces(query)
    },
    editPlace (place) {
      this.editingPlace = place
      this.placeForm = { ...place }
      this.showCreateDialog = true
    },
    async savePlace () {
      if (this.editingPlace) {
        await this.updatePlace({
          id: this.editingPlace.id,
          updates: this.placeForm
        })
      } else {
        await this.createPlace(this.placeForm)
      }
      this.showCreateDialog = false
      this.editingPlace = null
      this.placeForm = this.getEmptyForm()
    },
    async deletePlace (id) {
      const confirmed = await this.$confirm('Delete this place?', 'Confirm', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(() => false)
      
      if (confirmed) {
        await this.deletePlace(id)
      }
    },
    removeTag (tag) {
      this.placeForm.tags = this.placeForm.tags.filter(t => t !== tag)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      if (this.inputValue && !this.placeForm.tags.includes(this.inputValue)) {
        this.placeForm.tags.push(this.inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    getPlaceIcon (type) {
      const icons = {
        'City': 'el-icon-location-outline',
        'Town': 'el-icon-location',
        'Building': 'el-icon-office-building',
        'Natural': 'el-icon-mountain',
        'Region': 'el-icon-map-location',
        'Other': 'el-icon-place'
      }
      return icons[type] || 'el-icon-place'
    },
    getTypeColor (type) {
      const colors = {
        'City': 'success',
        'Town': 'warning',
        'Building': 'info',
        'Natural': 'success',
        'Region': 'primary',
        'Other': 'info'
      }
      return colors[type] || 'info'
    }
  }
}
</script>

<style scoped>
.places-panel {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  background: #fafafa;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e8f4fd;
}

.header-content {
  flex: 1;
}

.panel-header h3 {
  margin: 0 0 4px 0;
  color: #2c3e50;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-stats {
  display: flex;
  gap: 8px;
}

.stat-badge {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.search-box {
  margin-bottom: 12px;
}

.view-controls {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

.places-list {
  margin-top: 16px;
}

.place-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.place-item:hover {
  background: #f8f9fa;
  border-color: #67c23a;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.place-item.selected {
  background: #e8f5e8;
  border-color: #2e7d32;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.2);
}

.place-icon {
  margin-right: 12px;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.place-info {
  flex: 1;
  min-width: 0;
}

.place-info h4 {
  margin: 0 0 6px 0;
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
}

.place-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.place-description {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.place-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.place-actions {
  display: flex;
  gap: 4px;
  align-items: flex-start;
  margin-left: 8px;
}

.place-list-view .place-item {
  margin-bottom: 6px;
}

.place-list-view .place-item.list-item {
  padding: 10px;
}

/* Collapse customization */
.places-list .el-collapse {
  border: none;
}

.places-list .el-collapse-item__header {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 8px;
  padding: 0 16px;
  font-weight: 600;
  color: #2c3e50;
}

.places-list .el-collapse-item__content {
  padding: 0;
}

.places-list .el-collapse-item__wrap {
  border: none;
  background: transparent;
}
</style>
