<template>
  <div class="export-manager">
    <div class="export-header">
      <h3>Export & Publish</h3>
    </div>

    <div class="export-content">
      <!-- Export Options -->
      <div class="section">
        <h4>Export Options</h4>
        
        <div class="export-form">
          <div class="form-group">
            <label>Title:</label>
            <el-input v-model="exportOptions.title" placeholder="Book title" />
          </div>
          
          <div class="form-group">
            <label>Author:</label>
            <el-input v-model="exportOptions.author" placeholder="Author name" />
          </div>
          
          <div class="form-group">
            <label>Description:</label>
            <el-input
              v-model="exportOptions.description"
              type="textarea"
              :rows="3"
              placeholder="Book description"
            />
          </div>
          
          <div class="form-group">
            <label>Language:</label>
            <el-select v-model="exportOptions.language" placeholder="Select language">
              <el-option label="English" value="en" />
              <el-option label="Spanish" value="es" />
              <el-option label="French" value="fr" />
              <el-option label="German" value="de" />
              <el-option label="Italian" value="it" />
              <el-option label="Portuguese" value="pt" />
              <el-option label="Russian" value="ru" />
              <el-option label="Chinese" value="zh" />
              <el-option label="Japanese" value="ja" />
            </el-select>
          </div>
        </div>
      </div>

      <!-- Format Selection -->
      <div class="section">
        <h4>Export Formats</h4>
        
        <div class="format-grid">
          <div
            v-for="format in exportFormats"
            :key="format.id"
            class="format-card"
            :class="{ selected: selectedFormats.includes(format.id) }"
            @click="toggleFormat(format.id)"
          >
            <div class="format-icon">
              <i :class="format.icon"></i>
            </div>
            <div class="format-info">
              <div class="format-name">{{ format.name }}</div>
              <div class="format-description">{{ format.description }}</div>
            </div>
            <div class="format-checkbox">
              <el-checkbox
                :value="selectedFormats.includes(format.id)"
                @change="toggleFormat(format.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- PDF Options -->
      <div class="section" v-if="selectedFormats.includes('pdf')">
        <h4>PDF Options</h4>
        
        <div class="options-grid">
          <div class="option-group">
            <label>Page Size:</label>
            <el-select v-model="pdfOptions.pageSize">
              <el-option label="A4" value="A4" />
              <el-option label="Letter" value="Letter" />
              <el-option label="Legal" value="Legal" />
              <el-option label="A5" value="A5" />
            </el-select>
          </div>
          
          <div class="option-group">
            <label>Font Size:</label>
            <el-select v-model="pdfOptions.fontSize">
              <el-option label="10pt" value="10pt" />
              <el-option label="11pt" value="11pt" />
              <el-option label="12pt" value="12pt" />
              <el-option label="14pt" value="14pt" />
              <el-option label="16pt" value="16pt" />
            </el-select>
          </div>
          
          <div class="option-group">
            <label>Font Family:</label>
            <el-select v-model="pdfOptions.fontFamily">
              <el-option label="Times New Roman" value="Times New Roman" />
              <el-option label="Arial" value="Arial" />
              <el-option label="Georgia" value="Georgia" />
              <el-option label="Calibri" value="Calibri" />
              <el-option label="Garamond" value="Garamond" />
            </el-select>
          </div>
          
          <div class="option-group">
            <label>Line Height:</label>
            <el-select v-model="pdfOptions.lineHeight">
              <el-option label="1.0" value="1.0" />
              <el-option label="1.2" value="1.2" />
              <el-option label="1.4" value="1.4" />
              <el-option label="1.6" value="1.6" />
              <el-option label="1.8" value="1.8" />
            </el-select>
          </div>
        </div>
        
        <div class="checkbox-group">
          <el-checkbox v-model="pdfOptions.includeTOC">Include Table of Contents</el-checkbox>
          <el-checkbox v-model="pdfOptions.includePageNumbers">Include Page Numbers</el-checkbox>
        </div>
      </div>

      <!-- EPUB Options -->
      <div class="section" v-if="selectedFormats.includes('epub')">
        <h4>EPUB Options</h4>
        
        <div class="options-grid">
          <div class="option-group">
            <label>Cover Image:</label>
            <el-input v-model="epubOptions.coverImage" placeholder="Path to cover image" />
          </div>
          
          <div class="option-group">
            <label>Publisher:</label>
            <el-input v-model="epubOptions.publisher" placeholder="Publisher name" />
          </div>
        </div>
      </div>

      <!-- HTML Options -->
      <div class="section" v-if="selectedFormats.includes('html')">
        <h4>HTML Options</h4>
        
        <div class="checkbox-group">
          <el-checkbox v-model="htmlOptions.includeCSS">Include CSS Styles</el-checkbox>
          <el-checkbox v-model="htmlOptions.includeJS">Include JavaScript</el-checkbox>
          <el-checkbox v-model="htmlOptions.standalone">Standalone HTML</el-checkbox>
        </div>
      </div>

      <!-- Export Actions -->
      <div class="section">
        <h4>Export Actions</h4>
        
        <div class="export-actions">
          <el-button
            type="primary"
            size="large"
            @click="exportSelected"
            :loading="exporting"
            :disabled="selectedFormats.length === 0"
          >
            <i class="el-icon-download"></i>
            Export {{ selectedFormats.length }} Format{{ selectedFormats.length !== 1 ? 's' : '' }}
          </el-button>
          
          <el-button @click="previewExport" :disabled="selectedFormats.length === 0">
            <i class="el-icon-view"></i> Preview
          </el-button>
          
          <el-button @click="resetOptions">
            <i class="el-icon-refresh"></i> Reset Options
          </el-button>
        </div>
      </div>

      <!-- Export History -->
      <div class="section" v-if="exportHistory.length > 0">
        <h4>Recent Exports</h4>
        
        <div class="export-history">
          <div
            v-for="exportItem in exportHistory"
            :key="exportItem.id"
            class="history-item"
          >
            <div class="history-info">
              <div class="history-title">{{ exportItem.title }}</div>
              <div class="history-meta">
                <span>{{ exportItem.format.toUpperCase() }}</span>
                <span>{{ formatDate(exportItem.date) }}</span>
              </div>
            </div>
            <div class="history-actions">
              <el-button
                type="text"
                size="mini"
                @click="openExport(exportItem.path)"
                icon="el-icon-folder-opened"
              />
              <el-button
                type="text"
                size="mini"
                @click="deleteExport(exportItem.id)"
                icon="el-icon-delete"
                style="color: #f56c6c"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Progress Dialog -->
    <el-dialog
      title="Exporting..."
      :visible.sync="showExportDialog"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="export-progress">
        <div class="progress-info">
          <div class="current-format">{{ currentExportFormat }}</div>
          <div class="progress-text">{{ exportProgress }}%</div>
        </div>
        <el-progress :percentage="exportProgress" :show-text="false" />
        <div class="progress-details">{{ exportStatus }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import moment from 'moment'

export default {
  name: 'ExportManager',
  data() {
    return {
      selectedFormats: [],
      exportOptions: {
        title: '',
        author: '',
        description: '',
        language: 'en'
      },
      pdfOptions: {
        pageSize: 'A4',
        fontSize: '12pt',
        fontFamily: 'Times New Roman',
        lineHeight: '1.6',
        includeTOC: true,
        includePageNumbers: true
      },
      epubOptions: {
        coverImage: '',
        publisher: 'NovelCraft'
      },
      htmlOptions: {
        includeCSS: true,
        includeJS: false,
        standalone: true
      },
      exportFormats: [
        {
          id: 'pdf',
          name: 'PDF',
          description: 'Portable Document Format',
          icon: 'el-icon-document'
        },
        {
          id: 'epub',
          name: 'EPUB',
          description: 'Electronic Publication',
          icon: 'el-icon-reading'
        },
        {
          id: 'html',
          name: 'HTML',
          description: 'Web Page Format',
          icon: 'el-icon-link'
        },
        {
          id: 'txt',
          name: 'Text',
          description: 'Plain Text File',
          icon: 'el-icon-document-copy'
        },
        {
          id: 'latex',
          name: 'LaTeX',
          description: 'LaTeX Document',
          icon: 'el-icon-edit-outline'
        }
      ],
      exportHistory: [],
      exporting: false,
      showExportDialog: false,
      exportProgress: 0,
      exportStatus: '',
      currentExportFormat: ''
    }
  },
  mounted() {
    this.loadExportHistory()
    this.loadProjectInfo()
  },
  methods: {
    toggleFormat(formatId) {
      const index = this.selectedFormats.indexOf(formatId)
      if (index > -1) {
        this.selectedFormats.splice(index, 1)
      } else {
        this.selectedFormats.push(formatId)
      }
    },
    
    async exportSelected() {
      if (this.selectedFormats.length === 0) {
        this.$message.warning('Please select at least one format to export')
        return
      }
      
      if (!this.exportOptions.title) {
        this.$message.warning('Please enter a title')
        return
      }
      
      this.exporting = true
      this.showExportDialog = true
      this.exportProgress = 0
      
      try {
        const content = this.getCurrentContent()
        const basePath = this.getExportPath()
        
        for (let i = 0; i < this.selectedFormats.length; i++) {
          const format = this.selectedFormats[i]
          this.currentExportFormat = format.toUpperCase()
          this.exportStatus = `Exporting ${format.toUpperCase()}...`
          
          const outputPath = `${basePath}/${this.exportOptions.title}.${format}`
          const options = this.getFormatOptions(format)
          
          let result
          switch (format) {
            case 'pdf':
              result = await ipcRenderer.invoke('export-pdf', content, { ...this.exportOptions, ...options, outputPath })
              break
            case 'epub':
              result = await ipcRenderer.invoke('export-epub', content, { ...this.exportOptions, ...options, outputPath })
              break
            case 'html':
              result = await ipcRenderer.invoke('export-html', content, { ...this.exportOptions, ...options, outputPath })
              break
            case 'txt':
              result = await ipcRenderer.invoke('export-txt', content, { ...this.exportOptions, ...options, outputPath })
              break
            case 'latex':
              result = await ipcRenderer.invoke('export-latex', content, { ...this.exportOptions, ...options, outputPath })
              break
          }
          
          if (result.success) {
            this.addToHistory({
              title: this.exportOptions.title,
              format: format,
              path: outputPath,
              date: new Date().toISOString()
            })
          } else {
            this.$message.error(`Failed to export ${format.toUpperCase()}: ${result.error}`)
          }
          
          this.exportProgress = Math.round(((i + 1) / this.selectedFormats.length) * 100)
        }
        
        this.$message.success(`Successfully exported ${this.selectedFormats.length} format(s)`)
        this.showExportDialog = false
        
      } catch (error) {
        this.$message.error('Export failed: ' + error.message)
        this.showExportDialog = false
      } finally {
        this.exporting = false
      }
    },
    
    getFormatOptions(format) {
      switch (format) {
        case 'pdf':
          return this.pdfOptions
        case 'epub':
          return this.epubOptions
        case 'html':
          return this.htmlOptions
        default:
          return {}
      }
    },
    
    async previewExport() {
      // This would show a preview of the export
      this.$message.info('Preview feature coming soon')
    },
    
    resetOptions() {
      this.selectedFormats = []
      this.exportOptions = {
        title: '',
        author: '',
        description: '',
        language: 'en'
      }
      this.pdfOptions = {
        pageSize: 'A4',
        fontSize: '12pt',
        fontFamily: 'Times New Roman',
        lineHeight: '1.6',
        includeTOC: true,
        includePageNumbers: true
      }
      this.epubOptions = {
        coverImage: '',
        publisher: 'NovelCraft'
      }
      this.htmlOptions = {
        includeCSS: true,
        includeJS: false,
        standalone: true
      }
    },
    
    async loadExportHistory() {
      try {
        // Load export history from storage
        const history = localStorage.getItem('novelcraft-export-history')
        if (history) {
          this.exportHistory = JSON.parse(history)
        }
      } catch (error) {
        console.error('Error loading export history:', error)
      }
    },
    
    addToHistory(exportItem) {
      exportItem.id = Date.now()
      this.exportHistory.unshift(exportItem)
      
      // Keep only last 20 exports
      if (this.exportHistory.length > 20) {
        this.exportHistory = this.exportHistory.slice(0, 20)
      }
      
      localStorage.setItem('novelcraft-export-history', JSON.stringify(this.exportHistory))
    },
    
    async loadProjectInfo() {
      try {
        // Load project information for export
        const projectPath = this.getProjectPath()
        if (projectPath) {
          const projectName = projectPath.split('/').pop()
          this.exportOptions.title = projectName
        }
      } catch (error) {
        console.error('Error loading project info:', error)
      }
    },
    
    openExport(path) {
      // Open the exported file in the default application
      ipcRenderer.invoke('open-file', path)
    },
    
    deleteExport(id) {
      const index = this.exportHistory.findIndex(item => item.id === id)
      if (index > -1) {
        this.exportHistory.splice(index, 1)
        localStorage.setItem('novelcraft-export-history', JSON.stringify(this.exportHistory))
        this.$message.success('Export removed from history')
      }
    },
    
    formatDate(dateString) {
      return moment(dateString).format('MMM DD, YYYY HH:mm')
    },
    
    getCurrentContent() {
      return this.$store.state.editor.currentContent || ''
    },
    
    getProjectPath() {
      return this.$store.state.project.currentPath || ''
    },
    
    getExportPath() {
      const projectPath = this.getProjectPath()
      return projectPath ? `${projectPath}/exports` : '~/Downloads'
    }
  }
}
</script>

<style scoped>
.export-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.export-header {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.export-header h3 {
  margin: 0;
  color: #303133;
}

.export-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.section h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.export-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.format-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.format-card:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.format-card.selected {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.format-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.format-info {
  flex: 1;
}

.format-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.format-description {
  font-size: 12px;
  color: #909399;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.option-group label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.export-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.export-history {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
}

.history-info {
  flex: 1;
}

.history-title {
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.history-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

.history-actions {
  display: flex;
  gap: 4px;
}

.export-progress {
  text-align: center;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.current-format {
  font-weight: 600;
  color: #409eff;
}

.progress-text {
  font-weight: 600;
  color: #303133;
}

.progress-details {
  margin-top: 12px;
  font-size: 14px;
  color: #606266;
}
</style>