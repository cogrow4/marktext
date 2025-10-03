<template>
  <div class="place-manager">
    <div class="place-manager-header">
      <h3>Place Manager</h3>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="showCreateDialog = true">
          <i class="el-icon-plus"></i> Add Place
        </el-button>
        <el-button size="small" @click="refreshPlaces">
          <i class="el-icon-refresh"></i> Refresh
        </el-button>
      </div>
    </div>

    <div class="place-search">
      <el-input
        v-model="searchQuery"
        placeholder="Search places..."
        prefix-icon="el-icon-search"
        size="small"
        clearable
        @input="filterPlaces"
      />
    </div>

    <div class="place-filters">
      <el-select
        v-model="selectedType"
        placeholder="Filter by type"
        size="small"
        clearable
        @change="filterPlaces"
      >
        <el-option label="All Types" value="" />
        <el-option label="City" value="City" />
        <el-option label="Town" value="Town" />
        <el-option label="Village" value="Village" />
        <el-option label="Building" value="Building" />
        <el-option label="Room" value="Room" />
        <el-option label="Landmark" value="Landmark" />
        <el-option label="Natural" value="Natural" />
        <el-option label="Other" value="Other" />
      </el-select>
    </div>

    <div class="place-list">
      <div
        v-for="place in filteredPlaces"
        :key="place.id"
        class="place-item"
        @click="selectPlace(place)"
        :class="{ active: selectedPlace && selectedPlace.id === place.id }"
      >
        <div class="place-icon">
          <i :class="getPlaceIcon(place.type)"></i>
        </div>
        <div class="place-info">
          <div class="place-name">{{ place.name }}</div>
          <div class="place-type">{{ place.type || 'No type specified' }}</div>
          <div class="place-location">{{ place.location || 'No location specified' }}</div>
          <div class="place-description">{{ place.description || 'No description' }}</div>
        </div>
        <div class="place-actions">
          <el-button
            type="text"
            size="mini"
            @click.stop="editPlace(place)"
            icon="el-icon-edit"
          />
          <el-button
            type="text"
            size="mini"
            @click.stop="deletePlace(place)"
            icon="el-icon-delete"
            style="color: #f56c6c"
          />
        </div>
      </div>
    </div>

    <!-- Place Detail Panel -->
    <div v-if="selectedPlace" class="place-detail">
      <div class="detail-header">
        <h4>{{ selectedPlace.name }}</h4>
        <el-button type="text" @click="selectedPlace = null" icon="el-icon-close" />
      </div>
      
      <div class="detail-content">
        <div class="detail-section">
          <label>Type:</label>
          <span>{{ selectedPlace.type || 'Not specified' }}</span>
        </div>
        
        <div class="detail-section">
          <label>Location:</label>
          <span>{{ selectedPlace.location || 'Not specified' }}</span>
        </div>
        
        <div class="detail-section">
          <label>Atmosphere:</label>
          <p>{{ selectedPlace.atmosphere || 'No description' }}</p>
        </div>
        
        <div class="detail-section">
          <label>History:</label>
          <p>{{ selectedPlace.history || 'No description' }}</p>
        </div>
        
        <div class="detail-section">
          <label>Significance:</label>
          <p>{{ selectedPlace.significance || 'No description' }}</p>
        </div>
        
        <div class="detail-section">
          <label>Notes:</label>
          <p>{{ selectedPlace.notes || 'No notes' }}</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Place Dialog -->
    <el-dialog
      :title="editingPlace ? 'Edit Place' : 'Create Place'"
      :visible.sync="showCreateDialog"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="placeForm" :rules="formRules" ref="placeForm" label-width="100px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="placeForm.name" placeholder="Place name" />
        </el-form-item>
        
        <el-form-item label="Type">
          <el-select v-model="placeForm.type" placeholder="Select type">
            <el-option label="City" value="City" />
            <el-option label="Town" value="Town" />
            <el-option label="Village" value="Village" />
            <el-option label="Building" value="Building" />
            <el-option label="Room" value="Room" />
            <el-option label="Landmark" value="Landmark" />
            <el-option label="Natural" value="Natural" />
            <el-option label="Other" value="Other" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Location">
          <el-input v-model="placeForm.location" placeholder="Geographic location or address" />
        </el-form-item>
        
        <el-form-item label="Description">
          <el-input
            v-model="placeForm.description"
            type="textarea"
            :rows="3"
            placeholder="Brief place description"
          />
        </el-form-item>
        
        <el-form-item label="Atmosphere">
          <el-input
            v-model="placeForm.atmosphere"
            type="textarea"
            :rows="3"
            placeholder="Describe the atmosphere and mood"
          />
        </el-form-item>
        
        <el-form-item label="History">
          <el-input
            v-model="placeForm.history"
            type="textarea"
            :rows="3"
            placeholder="Historical background of the place"
          />
        </el-form-item>
        
        <el-form-item label="Significance">
          <el-input
            v-model="placeForm.significance"
            type="textarea"
            :rows="3"
            placeholder="Why is this place important to the story?"
          />
        </el-form-item>
        
        <el-form-item label="Notes">
          <el-input
            v-model="placeForm.notes"
            type="textarea"
            :rows="3"
            placeholder="Additional notes about the place"
          />
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCreateDialog = false">Cancel</el-button>
        <el-button type="primary" @click="savePlace">
          {{ editingPlace ? 'Update' : 'Create' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'PlaceManager',
  data() {
    return {
      places: [],
      filteredPlaces: [],
      selectedPlace: null,
      showCreateDialog: false,
      editingPlace: null,
      searchQuery: '',
      selectedType: '',
      placeForm: {
        name: '',
        type: '',
        location: '',
        description: '',
        atmosphere: '',
        history: '',
        significance: '',
        notes: ''
      },
      formRules: {
        name: [
          { required: true, message: 'Please enter place name', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.loadPlaces()
  },
  methods: {
    async loadPlaces() {
      try {
        const result = await ipcRenderer.invoke('db-get-places', this.getProjectPath())
        if (result.success) {
          this.places = result.places
          this.filteredPlaces = [...this.places]
        } else {
          this.$message.error('Failed to load places: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error loading places: ' + error.message)
      }
    },
    
    async refreshPlaces() {
      await this.loadPlaces()
      this.$message.success('Places refreshed')
    },
    
    filterPlaces() {
      let filtered = [...this.places]
      
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(place =>
          place.name.toLowerCase().includes(query) ||
          (place.type && place.type.toLowerCase().includes(query)) ||
          (place.location && place.location.toLowerCase().includes(query)) ||
          (place.description && place.description.toLowerCase().includes(query))
        )
      }
      
      // Filter by type
      if (this.selectedType) {
        filtered = filtered.filter(place => place.type === this.selectedType)
      }
      
      this.filteredPlaces = filtered
    },
    
    selectPlace(place) {
      this.selectedPlace = place
    },
    
    editPlace(place) {
      this.editingPlace = place
      this.placeForm = { ...place }
      this.showCreateDialog = true
    },
    
    async deletePlace(place) {
      try {
        await this.$confirm(`Are you sure you want to delete "${place.name}"?`, 'Confirm Delete', {
          type: 'warning'
        })
        
        const result = await ipcRenderer.invoke('db-delete-place', this.getProjectPath(), place.id)
        if (result.success) {
          this.$message.success('Place deleted successfully')
          await this.loadPlaces()
          if (this.selectedPlace && this.selectedPlace.id === place.id) {
            this.selectedPlace = null
          }
        } else {
          this.$message.error('Failed to delete place: ' + result.error)
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('Error deleting place: ' + error.message)
        }
      }
    },
    
    async savePlace() {
      try {
        await this.$refs.placeForm.validate()
        
        const result = this.editingPlace
          ? await ipcRenderer.invoke('db-update-place', this.getProjectPath(), this.editingPlace.id, this.placeForm)
          : await ipcRenderer.invoke('db-create-place', this.getProjectPath(), this.placeForm)
        
        if (result.success) {
          this.$message.success(this.editingPlace ? 'Place updated successfully' : 'Place created successfully')
          this.showCreateDialog = false
          await this.loadPlaces()
        } else {
          this.$message.error('Failed to save place: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error saving place: ' + error.message)
      }
    },
    
    resetForm() {
      this.placeForm = {
        name: '',
        type: '',
        location: '',
        description: '',
        atmosphere: '',
        history: '',
        significance: '',
        notes: ''
      }
      this.editingPlace = null
    },
    
    getPlaceIcon(type) {
      const iconMap = {
        'City': 'el-icon-office-building',
        'Town': 'el-icon-house',
        'Village': 'el-icon-home',
        'Building': 'el-icon-office-building',
        'Room': 'el-icon-s-home',
        'Landmark': 'el-icon-location',
        'Natural': 'el-icon-place',
        'Other': 'el-icon-location-outline'
      }
      return iconMap[type] || 'el-icon-location-outline'
    },
    
    getProjectPath() {
      return this.$store.state.project.currentPath || ''
    }
  }
}
</script>

<style scoped>
.place-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.place-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.place-manager-header h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.place-search {
  padding: 16px 16px 8px 16px;
}

.place-filters {
  padding: 0 16px 16px 16px;
}

.place-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.place-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 4px;
}

.place-item:hover {
  background-color: #f5f7fa;
}

.place-item.active {
  background-color: #ecf5ff;
  border: 1px solid #b3d8ff;
}

.place-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #67c23a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
  flex-shrink: 0;
  font-size: 18px;
}

.place-info {
  flex: 1;
  min-width: 0;
}

.place-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.place-type {
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
}

.place-location {
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
}

.place-description {
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.place-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.place-item:hover .place-actions {
  opacity: 1;
}

.place-detail {
  border-top: 1px solid #e4e7ed;
  padding: 16px;
  background-color: #fafafa;
  max-height: 300px;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.detail-header h4 {
  margin: 0;
  color: #303133;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-section label {
  font-weight: 600;
  color: #606266;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-section span,
.detail-section p {
  color: #303133;
  margin: 0;
  font-size: 14px;
}

.dialog-footer {
  text-align: right;
}
</style>