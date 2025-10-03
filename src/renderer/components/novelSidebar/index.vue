<template>
  <div class="novel-sidebar">
    <div class="sidebar-header">
      <h2>NovelCraft</h2>
      <div class="project-info">
        <div class="project-name">{{ currentProject.name || 'Untitled Project' }}</div>
        <div class="project-stats">
          <span>{{ projectStats.wordCount || 0 }} words</span>
          <span>{{ projectStats.chapterCount || 0 }} chapters</span>
        </div>
      </div>
    </div>

    <div class="sidebar-content">
      <el-tabs v-model="activeTab" type="card" class="novel-tabs">
        <!-- Project Overview -->
        <el-tab-pane label="Project" name="project">
          <div class="tab-content">
            <div class="project-overview">
              <div class="overview-stats">
                <div class="stat-item">
                  <div class="stat-value">{{ projectStats.wordCount || 0 }}</div>
                  <div class="stat-label">Total Words</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ projectStats.chapterCount || 0 }}</div>
                  <div class="stat-label">Chapters</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ projectStats.characterCount || 0 }}</div>
                  <div class="stat-label">Characters</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ projectStats.placeCount || 0 }}</div>
                  <div class="stat-label">Places</div>
                </div>
              </div>
              
              <div class="writing-goals">
                <h4>Writing Goals</h4>
                <div class="goal-item">
                  <div class="goal-header">
                    <span>Daily: {{ dailyProgress }}%</span>
                    <span>{{ dailyWords }}/{{ dailyGoal }} words</span>
                  </div>
                  <el-progress :percentage="dailyProgress" :show-text="false" />
                </div>
                <div class="goal-item">
                  <div class="goal-header">
                    <span>Total: {{ totalProgress }}%</span>
                    <span>{{ projectStats.wordCount || 0 }}/{{ totalGoal }} words</span>
                  </div>
                  <el-progress :percentage="totalProgress" :show-text="false" />
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- Characters -->
        <el-tab-pane label="Characters" name="characters">
          <div class="tab-content">
            <CharacterManager />
          </div>
        </el-tab-pane>

        <!-- Places -->
        <el-tab-pane label="Places" name="places">
          <div class="tab-content">
            <PlaceManager />
          </div>
        </el-tab-pane>

        <!-- Notes -->
        <el-tab-pane label="Notes" name="notes">
          <div class="tab-content">
            <NotesManager />
          </div>
        </el-tab-pane>

        <!-- Writing Stats -->
        <el-tab-pane label="Stats" name="stats">
          <div class="tab-content">
            <WritingStats />
          </div>
        </el-tab-pane>

        <!-- Find & Replace -->
        <el-tab-pane label="Find & Replace" name="find-replace">
          <div class="tab-content">
            <AdvancedFindReplace @go-to-line="goToLine" @update-content="updateContent" />
          </div>
        </el-tab-pane>

        <!-- Git Version Control -->
        <el-tab-pane label="Version Control" name="git">
          <div class="tab-content">
            <GitManager />
          </div>
        </el-tab-pane>

        <!-- Export -->
        <el-tab-pane label="Export" name="export">
          <div class="tab-content">
            <ExportManager />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Quick Actions -->
    <div class="sidebar-footer">
      <div class="quick-actions">
        <el-button type="primary" size="small" @click="createNewChapter">
          <i class="el-icon-plus"></i> New Chapter
        </el-button>
        <el-button size="small" @click="saveProject">
          <i class="el-icon-check"></i> Save
        </el-button>
        <el-button size="small" @click="exportProject">
          <i class="el-icon-download"></i> Export
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import CharacterManager from '../characterManager/index.vue'
import PlaceManager from '../placeManager/index.vue'
import NotesManager from '../notesManager/index.vue'
import WritingStats from '../writingStats/index.vue'
import AdvancedFindReplace from '../advancedFindReplace/index.vue'
import GitManager from '../gitManager/index.vue'
import ExportManager from '../exportManager/index.vue'

export default {
  name: 'NovelSidebar',
  components: {
    CharacterManager,
    PlaceManager,
    NotesManager,
    WritingStats,
    AdvancedFindReplace,
    GitManager,
    ExportManager
  },
  data() {
    return {
      activeTab: 'project',
      currentProject: {
        name: '',
        path: '',
        wordGoal: 80000,
        dailyGoal: 1000
      },
      projectStats: {
        wordCount: 0,
        chapterCount: 0,
        characterCount: 0,
        placeCount: 0
      },
      dailyWords: 0,
      totalGoal: 80000,
      dailyGoal: 1000
    }
  },
  computed: {
    dailyProgress() {
      return Math.min((this.dailyWords / this.dailyGoal) * 100, 100)
    },
    totalProgress() {
      return Math.min((this.projectStats.wordCount / this.totalGoal) * 100, 100)
    }
  },
  mounted() {
    this.loadProjectData()
    this.loadProjectStats()
  },
  methods: {
    async loadProjectData() {
      try {
        // Load current project data
        const projectPath = this.getProjectPath()
        if (projectPath) {
          this.currentProject.path = projectPath
          this.currentProject.name = this.getProjectName(projectPath)
        }
      } catch (error) {
        console.error('Error loading project data:', error)
      }
    },
    
    async loadProjectStats() {
      try {
        // Load project statistics
        const [charResult, placeResult] = await Promise.all([
          this.$ipcRenderer.invoke('db-get-characters', this.getProjectPath()),
          this.$ipcRenderer.invoke('db-get-places', this.getProjectPath())
        ])
        
        if (charResult.success) {
          this.projectStats.characterCount = charResult.characters.length
        }
        
        if (placeResult.success) {
          this.projectStats.placeCount = placeResult.places.length
        }
        
        // Update word count and chapter count from current content
        this.updateWordCount()
      } catch (error) {
        console.error('Error loading project stats:', error)
      }
    },
    
    updateWordCount() {
      // This should get the current word count from the editor
      const content = this.getCurrentContent()
      if (content) {
        const words = content.match(/\b\w+\b/g) || []
        this.projectStats.wordCount = words.length
      }
    },
    
    createNewChapter() {
      // This should create a new chapter in the editor
      this.$emit('create-chapter')
    },
    
    async saveProject() {
      try {
        // Save current project state
        await this.$ipcRenderer.invoke('project-save', this.currentProject)
        this.$message.success('Project saved successfully')
      } catch (error) {
        this.$message.error('Error saving project: ' + error.message)
      }
    },
    
    exportProject() {
      // Open export dialog
      this.activeTab = 'export'
    },
    
    goToLine(line, column) {
      // Navigate to specific line in editor
      this.$emit('go-to-line', line, column)
    },
    
    updateContent(newContent) {
      // Update editor content
      this.$emit('update-content', newContent)
    },
    
    getCurrentContent() {
      return this.$store.state.editor.currentContent || ''
    },
    
    getProjectPath() {
      return this.$store.state.project.currentPath || ''
    },
    
    getProjectName(path) {
      return path ? path.split('/').pop() : 'Untitled Project'
    }
  }
}
</script>

<style scoped>
.novel-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border-right: 1px solid #e4e7ed;
}

.sidebar-header {
  padding: 16px;
  background: #409eff;
  color: white;
  border-bottom: 1px solid #e4e7ed;
}

.sidebar-header h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
}

.project-info {
  font-size: 14px;
}

.project-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.project-stats {
  opacity: 0.8;
  font-size: 12px;
}

.project-stats span {
  margin-right: 12px;
}

.sidebar-content {
  flex: 1;
  overflow: hidden;
}

.novel-tabs {
  height: 100%;
}

.novel-tabs >>> .el-tabs__content {
  height: calc(100% - 40px);
  overflow: hidden;
}

.novel-tabs >>> .el-tab-pane {
  height: 100%;
  overflow: hidden;
}

.tab-content {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
}

.project-overview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.overview-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.writing-goals h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.goal-item {
  margin-bottom: 16px;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e4e7ed;
  background: white;
}

.quick-actions {
  display: flex;
  gap: 8px;
}

.quick-actions .el-button {
  flex: 1;
}
</style>