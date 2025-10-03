<template>
  <div class="characters-panel">
    <div class="panel-header">
      <h3>Characters</h3>
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

    <div class="characters-list">
      <el-collapse v-model="activeRoles" accordion>
        <el-collapse-item 
          v-for="(chars, role) in charactersByRole" 
          :key="role"
          :title="`${role} (${chars.length})`"
          :name="role">
          <div 
            v-for="character in chars" 
            :key="character.id"
            class="character-item"
            @click="selectCharacter(character)">
            <div class="character-info">
              <h4>{{ character.name }}</h4>
              <p class="character-description">{{ character.description || 'No description' }}</p>
              <div class="character-tags">
                <el-tag 
                  v-for="tag in character.tags" 
                  :key="tag" 
                  size="mini">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div class="character-actions">
              <el-button 
                type="text" 
                icon="el-icon-edit"
                @click.stop="editCharacter(character)">
              </el-button>
              <el-button 
                type="text" 
                icon="el-icon-delete"
                @click.stop="deleteCharacter(character.id)">
              </el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
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
      inputValue: ''
    }
  },
  computed: {
    ...mapState('characters', ['characters', 'loading']),
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
    }
  }
}
</script>

<style scoped>
.characters-panel {
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

.characters-list {
  margin-top: 16px;
}

.character-item {
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

.character-item:hover {
  background-color: #f5f5f5;
}

.character-info {
  flex: 1;
}

.character-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
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
}

.character-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.character-actions {
  display: flex;
  gap: 4px;
}
</style>
