<template>
  <div class="places-panel">
    <div class="panel-header">
      <h3>Places & Locations</h3>
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

    <div class="places-list">
      <el-collapse v-model="activeTypes" accordion>
        <el-collapse-item 
          v-for="(places, type) in placesByType" 
          :key="type"
          :title="`${type} (${places.length})`"
          :name="type">
          <div 
            v-for="place in places" 
            :key="place.id"
            class="place-item"
            @click="selectPlace(place)">
            <div class="place-info">
              <h4>{{ place.name }}</h4>
              <p class="place-description">{{ place.description || 'No description' }}</p>
              <div class="place-tags">
                <el-tag 
                  v-for="tag in place.tags" 
                  :key="tag" 
                  size="mini">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div class="place-actions">
              <el-button 
                type="text" 
                icon="el-icon-edit"
                @click.stop="editPlace(place)">
              </el-button>
              <el-button 
                type="text" 
                icon="el-icon-delete"
                @click.stop="deletePlace(place.id)">
              </el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
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
      inputValue: ''
    }
  },
  computed: {
    ...mapState('places', ['places', 'loading']),
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
    }
  }
}
</script>

<style scoped>
.places-panel {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 0;
}

.search-box {
  margin-bottom: 16px;
}

.places-list {
  margin-top: 16px;
}

.place-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.place-item:hover {
  background-color: #f5f5f5;
}

.place-info {
  flex: 1;
}

.place-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
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
}

.place-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.place-actions {
  display: flex;
  gap: 4px;
}
</style>
