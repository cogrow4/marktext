<template>
  <div class="character-manager">
    <div class="character-manager-header">
      <h3>Character Manager</h3>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="showCreateDialog = true">
          <i class="el-icon-plus"></i> Add Character
        </el-button>
        <el-button size="small" @click="refreshCharacters">
          <i class="el-icon-refresh"></i> Refresh
        </el-button>
      </div>
    </div>

    <div class="character-search">
      <el-input
        v-model="searchQuery"
        placeholder="Search characters..."
        prefix-icon="el-icon-search"
        size="small"
        clearable
        @input="filterCharacters"
      />
    </div>

    <div class="character-list">
      <div
        v-for="character in filteredCharacters"
        :key="character.id"
        class="character-item"
        @click="selectCharacter(character)"
        :class="{ active: selectedCharacter && selectedCharacter.id === character.id }"
      >
        <div class="character-avatar">
          <i class="el-icon-user-solid"></i>
        </div>
        <div class="character-info">
          <div class="character-name">{{ character.name }}</div>
          <div class="character-role">{{ character.role || 'No role specified' }}</div>
          <div class="character-description">{{ character.description || 'No description' }}</div>
        </div>
        <div class="character-actions">
          <el-button
            type="text"
            size="mini"
            @click.stop="editCharacter(character)"
            icon="el-icon-edit"
          />
          <el-button
            type="text"
            size="mini"
            @click.stop="deleteCharacter(character)"
            icon="el-icon-delete"
            style="color: #f56c6c"
          />
        </div>
      </div>
    </div>

    <!-- Character Detail Panel -->
    <div v-if="selectedCharacter" class="character-detail">
      <div class="detail-header">
        <h4>{{ selectedCharacter.name }}</h4>
        <el-button type="text" @click="selectedCharacter = null" icon="el-icon-close" />
      </div>
      
      <div class="detail-content">
        <div class="detail-section">
          <label>Role:</label>
          <span>{{ selectedCharacter.role || 'Not specified' }}</span>
        </div>
        
        <div class="detail-section">
          <label>Age:</label>
          <span>{{ selectedCharacter.age || 'Not specified' }}</span>
        </div>
        
        <div class="detail-section">
          <label>Gender:</label>
          <span>{{ selectedCharacter.gender || 'Not specified' }}</span>
        </div>
        
        <div class="detail-section">
          <label>Appearance:</label>
          <p>{{ selectedCharacter.appearance || 'No description' }}</p>
        </div>
        
        <div class="detail-section">
          <label>Personality:</label>
          <p>{{ selectedCharacter.personality || 'No description' }}</p>
        </div>
        
        <div class="detail-section">
          <label>Background:</label>
          <p>{{ selectedCharacter.background || 'No description' }}</p>
        </div>
        
        <div class="detail-section">
          <label>Relationships:</label>
          <div v-if="selectedCharacter.relationships && selectedCharacter.relationships.length > 0">
            <div
              v-for="relationship in selectedCharacter.relationships"
              :key="relationship.character"
              class="relationship-item"
            >
              <strong>{{ relationship.character }}:</strong> {{ relationship.type }}
            </div>
          </div>
          <p v-else>No relationships defined</p>
        </div>
        
        <div class="detail-section">
          <label>Notes:</label>
          <p>{{ selectedCharacter.notes || 'No notes' }}</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Character Dialog -->
    <el-dialog
      :title="editingCharacter ? 'Edit Character' : 'Create Character'"
      :visible.sync="showCreateDialog"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="characterForm" :rules="formRules" ref="characterForm" label-width="100px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="characterForm.name" placeholder="Character name" />
        </el-form-item>
        
        <el-form-item label="Role">
          <el-input v-model="characterForm.role" placeholder="e.g., Protagonist, Antagonist, Supporting" />
        </el-form-item>
        
        <el-form-item label="Age">
          <el-input-number v-model="characterForm.age" :min="0" :max="200" />
        </el-form-item>
        
        <el-form-item label="Gender">
          <el-select v-model="characterForm.gender" placeholder="Select gender">
            <el-option label="Male" value="Male" />
            <el-option label="Female" value="Female" />
            <el-option label="Non-binary" value="Non-binary" />
            <el-option label="Other" value="Other" />
            <el-option label="Not specified" value="" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Description">
          <el-input
            v-model="characterForm.description"
            type="textarea"
            :rows="3"
            placeholder="Brief character description"
          />
        </el-form-item>
        
        <el-form-item label="Appearance">
          <el-input
            v-model="characterForm.appearance"
            type="textarea"
            :rows="3"
            placeholder="Physical appearance description"
          />
        </el-form-item>
        
        <el-form-item label="Personality">
          <el-input
            v-model="characterForm.personality"
            type="textarea"
            :rows="3"
            placeholder="Personality traits and characteristics"
          />
        </el-form-item>
        
        <el-form-item label="Background">
          <el-input
            v-model="characterForm.background"
            type="textarea"
            :rows="3"
            placeholder="Character background and history"
          />
        </el-form-item>
        
        <el-form-item label="Notes">
          <el-input
            v-model="characterForm.notes"
            type="textarea"
            :rows="3"
            placeholder="Additional notes about the character"
          />
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCreateDialog = false">Cancel</el-button>
        <el-button type="primary" @click="saveCharacter">
          {{ editingCharacter ? 'Update' : 'Create' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'CharacterManager',
  data() {
    return {
      characters: [],
      filteredCharacters: [],
      selectedCharacter: null,
      showCreateDialog: false,
      editingCharacter: null,
      searchQuery: '',
      characterForm: {
        name: '',
        role: '',
        age: null,
        gender: '',
        description: '',
        appearance: '',
        personality: '',
        background: '',
        relationships: [],
        notes: ''
      },
      formRules: {
        name: [
          { required: true, message: 'Please enter character name', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.loadCharacters()
  },
  methods: {
    async loadCharacters() {
      try {
        const result = await ipcRenderer.invoke('db-get-characters', this.getProjectPath())
        if (result.success) {
          this.characters = result.characters
          this.filteredCharacters = [...this.characters]
        } else {
          this.$message.error('Failed to load characters: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error loading characters: ' + error.message)
      }
    },
    
    async refreshCharacters() {
      await this.loadCharacters()
      this.$message.success('Characters refreshed')
    },
    
    filterCharacters() {
      if (!this.searchQuery) {
        this.filteredCharacters = [...this.characters]
        return
      }
      
      const query = this.searchQuery.toLowerCase()
      this.filteredCharacters = this.characters.filter(character =>
        character.name.toLowerCase().includes(query) ||
        (character.role && character.role.toLowerCase().includes(query)) ||
        (character.description && character.description.toLowerCase().includes(query))
      )
    },
    
    selectCharacter(character) {
      this.selectedCharacter = character
    },
    
    editCharacter(character) {
      this.editingCharacter = character
      this.characterForm = { ...character }
      this.showCreateDialog = true
    },
    
    async deleteCharacter(character) {
      try {
        await this.$confirm(`Are you sure you want to delete "${character.name}"?`, 'Confirm Delete', {
          type: 'warning'
        })
        
        const result = await ipcRenderer.invoke('db-delete-character', this.getProjectPath(), character.id)
        if (result.success) {
          this.$message.success('Character deleted successfully')
          await this.loadCharacters()
          if (this.selectedCharacter && this.selectedCharacter.id === character.id) {
            this.selectedCharacter = null
          }
        } else {
          this.$message.error('Failed to delete character: ' + result.error)
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('Error deleting character: ' + error.message)
        }
      }
    },
    
    async saveCharacter() {
      try {
        await this.$refs.characterForm.validate()
        
        const result = this.editingCharacter
          ? await ipcRenderer.invoke('db-update-character', this.getProjectPath(), this.editingCharacter.id, this.characterForm)
          : await ipcRenderer.invoke('db-create-character', this.getProjectPath(), this.characterForm)
        
        if (result.success) {
          this.$message.success(this.editingCharacter ? 'Character updated successfully' : 'Character created successfully')
          this.showCreateDialog = false
          await this.loadCharacters()
        } else {
          this.$message.error('Failed to save character: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error saving character: ' + error.message)
      }
    },
    
    resetForm() {
      this.characterForm = {
        name: '',
        role: '',
        age: null,
        gender: '',
        description: '',
        appearance: '',
        personality: '',
        background: '',
        relationships: [],
        notes: ''
      }
      this.editingCharacter = null
    },
    
    getProjectPath() {
      // This should return the current project path
      // You'll need to implement this based on your project structure
      return this.$store.state.project.currentPath || ''
    }
  }
}
</script>

<style scoped>
.character-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.character-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.character-manager-header h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.character-search {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.character-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.character-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 4px;
}

.character-item:hover {
  background-color: #f5f7fa;
}

.character-item.active {
  background-color: #ecf5ff;
  border: 1px solid #b3d8ff;
}

.character-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
  flex-shrink: 0;
}

.character-info {
  flex: 1;
  min-width: 0;
}

.character-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.character-role {
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
}

.character-description {
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.character-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.character-item:hover .character-actions {
  opacity: 1;
}

.character-detail {
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

.relationship-item {
  font-size: 14px;
  margin-bottom: 4px;
}

.dialog-footer {
  text-align: right;
}
</style>