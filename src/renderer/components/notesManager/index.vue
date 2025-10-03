<template>
  <div class="notes-manager">
    <div class="notes-manager-header">
      <h3>Notes Manager</h3>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="showCreateDialog = true">
          <i class="el-icon-plus"></i> Add Note
        </el-button>
        <el-button size="small" @click="refreshNotes">
          <i class="el-icon-refresh"></i> Refresh
        </el-button>
      </div>
    </div>

    <div class="notes-controls">
      <div class="notes-search">
        <el-input
          v-model="searchQuery"
          placeholder="Search notes..."
          prefix-icon="el-icon-search"
          size="small"
          clearable
          @input="filterNotes"
        />
      </div>
      
      <div class="notes-filters">
        <el-select
          v-model="selectedCategory"
          placeholder="Filter by category"
          size="small"
          clearable
          @change="filterNotes"
        >
          <el-option label="All Categories" value="" />
          <el-option label="Plot" value="plot" />
          <el-option label="Character" value="character" />
          <el-option label="World" value="world" />
          <el-option label="Research" value="research" />
          <el-option label="Ideas" value="ideas" />
          <el-option label="General" value="general" />
        </el-select>
        
        <el-select
          v-model="selectedTag"
          placeholder="Filter by tag"
          size="small"
          clearable
          @change="filterNotes"
        >
          <el-option label="All Tags" value="" />
          <el-option
            v-for="tag in availableTags"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
      </div>
    </div>

    <div class="notes-list">
      <div
        v-for="note in filteredNotes"
        :key="note.id"
        class="note-item"
        @click="selectNote(note)"
        :class="{ active: selectedNote && selectedNote.id === note.id }"
      >
        <div class="note-header">
          <div class="note-title">{{ note.title }}</div>
          <div class="note-meta">
            <span class="note-category">{{ note.category }}</span>
            <span class="note-date">{{ formatDate(note.updated_at) }}</span>
          </div>
        </div>
        
        <div class="note-content">
          {{ note.content || 'No content' }}
        </div>
        
        <div class="note-tags" v-if="note.tags && note.tags.length > 0">
          <el-tag
            v-for="tag in note.tags"
            :key="tag"
            size="mini"
            type="info"
          >
            {{ tag }}
          </el-tag>
        </div>
        
        <div class="note-actions">
          <el-button
            type="text"
            size="mini"
            @click.stop="editNote(note)"
            icon="el-icon-edit"
          />
          <el-button
            type="text"
            size="mini"
            @click.stop="deleteNote(note)"
            icon="el-icon-delete"
            style="color: #f56c6c"
          />
        </div>
      </div>
    </div>

    <!-- Note Detail Panel -->
    <div v-if="selectedNote" class="note-detail">
      <div class="detail-header">
        <h4>{{ selectedNote.title }}</h4>
        <el-button type="text" @click="selectedNote = null" icon="el-icon-close" />
      </div>
      
      <div class="detail-content">
        <div class="detail-section">
          <label>Category:</label>
          <span>{{ selectedNote.category }}</span>
        </div>
        
        <div class="detail-section" v-if="selectedNote.tags && selectedNote.tags.length > 0">
          <label>Tags:</label>
          <div class="tags-list">
            <el-tag
              v-for="tag in selectedNote.tags"
              :key="tag"
              size="small"
              type="info"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        
        <div class="detail-section">
          <label>Content:</label>
          <div class="note-content-full">{{ selectedNote.content || 'No content' }}</div>
        </div>
        
        <div class="detail-section">
          <label>Created:</label>
          <span>{{ formatDate(selectedNote.created_at) }}</span>
        </div>
        
        <div class="detail-section">
          <label>Updated:</label>
          <span>{{ formatDate(selectedNote.updated_at) }}</span>
        </div>
      </div>
    </div>

    <!-- Create/Edit Note Dialog -->
    <el-dialog
      :title="editingNote ? 'Edit Note' : 'Create Note'"
      :visible.sync="showCreateDialog"
      width="700px"
      @close="resetForm"
    >
      <el-form :model="noteForm" :rules="formRules" ref="noteForm" label-width="100px">
        <el-form-item label="Title" prop="title">
          <el-input v-model="noteForm.title" placeholder="Note title" />
        </el-form-item>
        
        <el-form-item label="Category">
          <el-select v-model="noteForm.category" placeholder="Select category">
            <el-option label="Plot" value="plot" />
            <el-option label="Character" value="character" />
            <el-option label="World" value="world" />
            <el-option label="Research" value="research" />
            <el-option label="Ideas" value="ideas" />
            <el-option label="General" value="general" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Tags">
          <el-select
            v-model="noteForm.tags"
            multiple
            filterable
            allow-create
            placeholder="Add tags"
            style="width: 100%"
          >
            <el-option
              v-for="tag in availableTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Content">
          <el-input
            v-model="noteForm.content"
            type="textarea"
            :rows="10"
            placeholder="Note content"
          />
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCreateDialog = false">Cancel</el-button>
        <el-button type="primary" @click="saveNote">
          {{ editingNote ? 'Update' : 'Create' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import moment from 'moment'

export default {
  name: 'NotesManager',
  data() {
    return {
      notes: [],
      filteredNotes: [],
      selectedNote: null,
      showCreateDialog: false,
      editingNote: null,
      searchQuery: '',
      selectedCategory: '',
      selectedTag: '',
      availableTags: [],
      noteForm: {
        title: '',
        content: '',
        tags: [],
        category: 'general'
      },
      formRules: {
        title: [
          { required: true, message: 'Please enter note title', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.loadNotes()
  },
  methods: {
    async loadNotes() {
      try {
        const result = await ipcRenderer.invoke('db-get-notes', this.getProjectPath())
        if (result.success) {
          this.notes = result.notes
          this.filteredNotes = [...this.notes]
          this.extractTags()
        } else {
          this.$message.error('Failed to load notes: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error loading notes: ' + error.message)
      }
    },
    
    async refreshNotes() {
      await this.loadNotes()
      this.$message.success('Notes refreshed')
    },
    
    extractTags() {
      const tagSet = new Set()
      this.notes.forEach(note => {
        if (note.tags && Array.isArray(note.tags)) {
          note.tags.forEach(tag => tagSet.add(tag))
        }
      })
      this.availableTags = Array.from(tagSet).sort()
    },
    
    filterNotes() {
      let filtered = [...this.notes]
      
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(note =>
          note.title.toLowerCase().includes(query) ||
          (note.content && note.content.toLowerCase().includes(query))
        )
      }
      
      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(note => note.category === this.selectedCategory)
      }
      
      // Filter by tag
      if (this.selectedTag) {
        filtered = filtered.filter(note =>
          note.tags && note.tags.includes(this.selectedTag)
        )
      }
      
      this.filteredNotes = filtered
    },
    
    selectNote(note) {
      this.selectedNote = note
    },
    
    editNote(note) {
      this.editingNote = note
      this.noteForm = { ...note }
      this.showCreateDialog = true
    },
    
    async deleteNote(note) {
      try {
        await this.$confirm(`Are you sure you want to delete "${note.title}"?`, 'Confirm Delete', {
          type: 'warning'
        })
        
        const result = await ipcRenderer.invoke('db-delete-note', this.getProjectPath(), note.id)
        if (result.success) {
          this.$message.success('Note deleted successfully')
          await this.loadNotes()
          if (this.selectedNote && this.selectedNote.id === note.id) {
            this.selectedNote = null
          }
        } else {
          this.$message.error('Failed to delete note: ' + result.error)
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('Error deleting note: ' + error.message)
        }
      }
    },
    
    async saveNote() {
      try {
        await this.$refs.noteForm.validate()
        
        const result = this.editingNote
          ? await ipcRenderer.invoke('db-update-note', this.getProjectPath(), this.editingNote.id, this.noteForm)
          : await ipcRenderer.invoke('db-create-note', this.getProjectPath(), this.noteForm)
        
        if (result.success) {
          this.$message.success(this.editingNote ? 'Note updated successfully' : 'Note created successfully')
          this.showCreateDialog = false
          await this.loadNotes()
        } else {
          this.$message.error('Failed to save note: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error saving note: ' + error.message)
      }
    },
    
    resetForm() {
      this.noteForm = {
        title: '',
        content: '',
        tags: [],
        category: 'general'
      }
      this.editingNote = null
    },
    
    formatDate(dateString) {
      return moment(dateString).format('MMM DD, YYYY HH:mm')
    },
    
    getProjectPath() {
      return this.$store.state.project.currentPath || ''
    }
  }
}
</script>

<style scoped>
.notes-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.notes-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.notes-manager-header h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.notes-controls {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.notes-search {
  margin-bottom: 12px;
}

.notes-filters {
  display: flex;
  gap: 12px;
}

.notes-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.note-item {
  padding: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 8px;
  border: 1px solid #e4e7ed;
}

.note-item:hover {
  background-color: #f5f7fa;
}

.note-item.active {
  background-color: #ecf5ff;
  border-color: #b3d8ff;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.note-title {
  font-weight: 600;
  color: #303133;
  font-size: 16px;
  flex: 1;
}

.note-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.note-category {
  font-size: 12px;
  color: #909399;
  text-transform: capitalize;
}

.note-date {
  font-size: 12px;
  color: #c0c4cc;
}

.note-content {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-tags {
  margin-bottom: 8px;
}

.note-tags .el-tag {
  margin-right: 6px;
  margin-bottom: 4px;
}

.note-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.note-item:hover .note-actions {
  opacity: 1;
}

.note-detail {
  border-top: 1px solid #e4e7ed;
  padding: 16px;
  background-color: #fafafa;
  max-height: 400px;
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
  gap: 16px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-section label {
  font-weight: 600;
  color: #606266;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-section span {
  color: #303133;
  font-size: 14px;
}

.note-content-full {
  color: #303133;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dialog-footer {
  text-align: right;
}
</style>