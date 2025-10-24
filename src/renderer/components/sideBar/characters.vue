<template>
  <div class="characters-panel">
    <div class="panel-header">
      <div class="header-content">
        <h3><i class="el-icon-user"></i> Characters</h3>
        <div class="header-stats">
          <span class="stat-badge">{{ characters.length }} total</span>
        </div>
      </div>
      <el-button 
        type="primary" 
        size="small" 
        icon="el-icon-plus"
        @click="showCreateDialog = true">
        Add Character
      </el-button>
    </div>

    <div class="search-box">
      <el-input
        v-model="searchQuery"
        placeholder="Search characters..."
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

    <div class="characters-list">
      <!-- Grouped View -->
      <el-collapse v-if="viewMode === 'grouped'" v-model="activeRoles" accordion>
        <el-collapse-item 
          v-for="(chars, role) in charactersByRole" 
          :key="role"
          :title="`${role} (${chars.length})`"
          :name="role">
          <div 
            v-for="character in chars" 
            :key="character.id"
            class="character-item"
            :class="{ 'selected': currentCharacter && currentCharacter.id === character.id }"
            @click="selectCharacter(character)">
            <div class="character-avatar">
              <div class="avatar-circle">
                {{ character.name.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="character-info">
              <h4>{{ character.name }}</h4>
              <p class="character-description">{{ character.description || 'No description' }}</p>
              <div class="character-tags">
                <el-tag 
                  v-for="tag in character.tags" 
                  :key="tag" 
                  size="mini"
                  type="info">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div class="character-actions">
              <el-button 
                type="text" 
                icon="el-icon-edit"
                size="mini"
                @click.stop="editCharacter(character)">
              </el-button>
              <el-button 
                type="text" 
                icon="el-icon-delete"
                size="mini"
                @click.stop="deleteCharacter(character.id)">
              </el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <!-- List View -->
      <div v-else class="character-list-view">
        <div 
          v-for="character in filteredCharacters" 
          :key="character.id"
          class="character-item list-item"
          :class="{ 'selected': currentCharacter && currentCharacter.id === character.id }"
          @click="selectCharacter(character)">
          <div class="character-avatar">
            <div class="avatar-circle">
              {{ character.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="character-info">
            <div class="character-header">
              <h4>{{ character.name }}</h4>
              <el-tag size="mini" :type="getRoleType(character.role)">{{ character.role }}</el-tag>
            </div>
            <p class="character-description">{{ character.description || 'No description' }}</p>
            <div class="character-tags">
              <el-tag 
                v-for="tag in character.tags" 
                :key="tag" 
                size="mini"
                type="info">
                {{ tag }}
              </el-tag>
            </div>
          </div>
          <div class="character-actions">
            <el-button 
              type="text" 
              icon="el-icon-edit"
              size="mini"
              @click.stop="editCharacter(character)">
            </el-button>
            <el-button 
              type="text" 
              icon="el-icon-delete"
              size="mini"
              @click.stop="deleteCharacter(character.id)">
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Character Dialog -->
    <el-dialog
      :title="editingCharacter ? 'Edit Character' : 'Create Character'"
      :visible.sync="showCreateDialog"
      width="600px">
      <el-form :model="characterForm" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="characterForm.name" placeholder="Character name"></el-input>
        </el-form-item>
        <el-form-item label="Role">
          <el-select v-model="characterForm.role" placeholder="Select role">
            <el-option label="Protagonist" value="Protagonist"></el-option>
            <el-option label="Antagonist" value="Antagonist"></el-option>
            <el-option label="Supporting" value="Supporting"></el-option>
            <el-option label="Minor" value="Minor"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Description">
          <el-input 
            type="textarea" 
            v-model="characterForm.description"
            :rows="3"
            placeholder="Brief description">
          </el-input>
        </el-form-item>
        <el-form-item label="Appearance">
          <el-input 
            type="textarea" 
            v-model="characterForm.appearance"
            :rows="2"
            placeholder="Physical appearance">
          </el-input>
        </el-form-item>
        <el-form-item label="Personality">
          <el-input 
            type="textarea" 
            v-model="characterForm.personality"
            :rows="2"
            placeholder="Personality traits">
          </el-input>
        </el-form-item>
        <el-form-item label="Background">
          <el-input 
            type="textarea" 
            v-model="characterForm.background"
            :rows="3"
            placeholder="Character background">
          </el-input>
        </el-form-item>
        <el-form-item label="Goals">
          <el-input 
            type="textarea" 
            v-model="characterForm.goals"
            :rows="2"
            placeholder="Character goals and motivations">
          </el-input>
        </el-form-item>
        <el-form-item label="Notes">
          <el-input 
            type="textarea" 
            v-model="characterForm.notes"
            :rows="3"
            placeholder="Additional notes">
          </el-input>
        </el-form-item>
        <el-form-item label="Tags">
          <el-tag
            v-for="tag in characterForm.tags"
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
        <el-button type="primary" @click="saveCharacter">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'CharactersPanel',
  data () {
    return {
      showCreateDialog: false,
      editingCharacter: null,
      characterForm: this.getEmptyForm(),
      searchQuery: '',
      activeRoles: [],
      inputVisible: false,
      inputValue: '',
      viewMode: 'grouped'
    }
  },
  computed: {
    ...mapState('characters', ['characters', 'loading', 'currentCharacter']),
    ...mapGetters('characters', ['charactersByRole', 'filteredCharacters'])
  },
  mounted () {
    this.loadCharacters()
  },
  methods: {
    ...mapActions('characters', [
      'loadCharacters',
      'createCharacter',
      'updateCharacter',
      'deleteCharacter',
      'searchCharacters',
      'selectCharacter'
    ]),
    getEmptyForm () {
      return {
        name: '',
        role: 'Supporting',
        description: '',
        appearance: '',
        personality: '',
        background: '',
        goals: '',
        notes: '',
        tags: []
      }
    },
    handleSearch (query) {
      this.searchCharacters(query)
    },
    editCharacter (character) {
      this.editingCharacter = character
      this.characterForm = { ...character }
      this.showCreateDialog = true
    },
    async saveCharacter () {
      if (this.editingCharacter) {
        await this.updateCharacter({
          id: this.editingCharacter.id,
          updates: this.characterForm
        })
      } else {
        await this.createCharacter(this.characterForm)
      }
      this.showCreateDialog = false
      this.editingCharacter = null
      this.characterForm = this.getEmptyForm()
    },
    async deleteCharacter (id) {
      const confirmed = await this.$confirm('Delete this character?', 'Confirm', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(() => false)
      
      if (confirmed) {
        await this.deleteCharacter(id)
      }
    },
    removeTag (tag) {
      this.characterForm.tags = this.characterForm.tags.filter(t => t !== tag)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      if (this.inputValue && !this.characterForm.tags.includes(this.inputValue)) {
        this.characterForm.tags.push(this.inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    getRoleType (role) {
      const types = {
        'Protagonist': 'success',
        'Antagonist': 'danger',
        'Supporting': 'warning',
        'Minor': 'info'
      }
      return types[role] || 'info'
    }
  }
}
</script>

<style scoped>
.characters-panel {
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
  background: #e3f2fd;
  color: #1976d2;
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

.characters-list {
  margin-top: 16px;
}

.character-item {
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

.character-item:hover {
  background: #f8f9fa;
  border-color: #409eff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.character-item.selected {
  background: #e3f2fd;
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
}

.character-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.character-info {
  flex: 1;
  min-width: 0;
}

.character-info h4 {
  margin: 0 0 6px 0;
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
}

.character-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.character-description {
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

.character-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.character-actions {
  display: flex;
  gap: 4px;
  align-items: flex-start;
  margin-left: 8px;
}

.character-list-view .character-item {
  margin-bottom: 6px;
}

.character-list-view .character-item.list-item {
  padding: 10px;
}

/* Collapse customization */
.characters-list .el-collapse {
  border: none;
}

.characters-list .el-collapse-item__header {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 8px;
  padding: 0 16px;
  font-weight: 600;
  color: #2c3e50;
}

.characters-list .el-collapse-item__content {
  padding: 0;
}

.characters-list .el-collapse-item__wrap {
  border: none;
  background: transparent;
}
</style>
