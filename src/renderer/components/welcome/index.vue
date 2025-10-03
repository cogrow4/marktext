<template>
  <div class="welcome-screen">
    <div class="welcome-content">
      <div class="welcome-header">
        <img src="@/assets/images/logo.png" alt="NovelCraft" class="logo" />
        <h1>Welcome to NovelCraft</h1>
        <p class="subtitle">Professional novel writing software with advanced tools for authors</p>
      </div>
      
      <div class="welcome-actions">
        <div class="action-card" @click="createNewProject">
          <div class="action-icon">
            <i class="el-icon-plus"></i>
          </div>
          <div class="action-content">
            <h3>Create New Project</h3>
            <p>Start a new novel with character management, version control, and writing tools</p>
          </div>
        </div>
        
        <div class="action-card" @click="openExistingProject">
          <div class="action-icon">
            <i class="el-icon-folder-opened"></i>
          </div>
          <div class="action-content">
            <h3>Open Existing Project</h3>
            <p>Continue working on an existing NovelCraft project</p>
          </div>
        </div>
        
        <div class="action-card" @click="openRecentProject" v-if="recentProjects.length > 0">
          <div class="action-icon">
            <i class="el-icon-time"></i>
          </div>
          <div class="action-content">
            <h3>Recent Projects</h3>
            <p>Quickly access your recently opened projects</p>
          </div>
        </div>
      </div>
      
      <div class="recent-projects" v-if="recentProjects.length > 0">
        <h3>Recent Projects</h3>
        <div class="project-list">
          <div
            v-for="project in recentProjects"
            :key="project.path"
            class="project-item"
            @click="openProject(project.path)"
          >
            <div class="project-info">
              <div class="project-name">{{ project.name }}</div>
              <div class="project-path">{{ project.path }}</div>
              <div class="project-meta">
                <span>{{ project.wordCount || 0 }} words</span>
                <span>{{ formatDate(project.lastOpened) }}</span>
              </div>
            </div>
            <div class="project-actions">
              <el-button
                type="text"
                size="mini"
                @click.stop="removeFromRecent(project.path)"
                icon="el-icon-close"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="welcome-features">
        <h3>Key Features</h3>
        <div class="features-grid">
          <div class="feature-item">
            <i class="el-icon-user"></i>
            <span>Character Management</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-location"></i>
            <span>Place & World Building</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-edit-outline"></i>
            <span>Advanced Writing Tools</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-connection"></i>
            <span>Git Version Control</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-data-analysis"></i>
            <span>Writing Statistics</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-download"></i>
            <span>Export & Publishing</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Project Creation Dialog -->
    <ProjectDialog v-model="showProjectDialog" @project-created="onProjectCreated" />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { remote } from '@electron/remote'
import moment from 'moment'
import ProjectDialog from '../projectDialog/index.vue'

export default {
  name: 'Welcome',
  components: {
    ProjectDialog
  },
  data() {
    return {
      showProjectDialog: false,
      recentProjects: []
    }
  },
  mounted() {
    this.loadRecentProjects()
  },
  methods: {
    createNewProject() {
      this.showProjectDialog = true
    },
    
    async openExistingProject() {
      try {
        const result = await remote.dialog.showOpenDialog({
          properties: ['openDirectory'],
          title: 'Open NovelCraft Project'
        })
        
        if (!result.canceled && result.filePaths.length > 0) {
          await this.openProject(result.filePaths[0])
        }
      } catch (error) {
        this.$message.error('Error opening project: ' + error.message)
      }
    },
    
    async openRecentProject() {
      // This would show a dropdown or modal with recent projects
      // For now, just open the first recent project
      if (this.recentProjects.length > 0) {
        await this.openProject(this.recentProjects[0].path)
      }
    },
    
    async openProject(projectPath) {
      try {
        const result = await ipcRenderer.invoke('project-load', projectPath)
        
        if (result.success) {
          this.addToRecent(projectPath, result.project)
          this.$emit('project-opened', projectPath)
        } else {
          this.$message.error('Failed to open project: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error opening project: ' + error.message)
      }
    },
    
    onProjectCreated(projectPath) {
      this.$emit('project-opened', projectPath)
    },
    
    loadRecentProjects() {
      try {
        const recent = localStorage.getItem('novelcraft-recent-projects')
        if (recent) {
          this.recentProjects = JSON.parse(recent)
        }
      } catch (error) {
        console.error('Error loading recent projects:', error)
      }
    },
    
    addToRecent(projectPath, projectData) {
      const project = {
        name: projectData.name || projectPath.split('/').pop(),
        path: projectPath,
        wordCount: projectData.wordCount || 0,
        lastOpened: new Date().toISOString()
      }
      
      // Remove if already exists
      this.recentProjects = this.recentProjects.filter(p => p.path !== projectPath)
      
      // Add to beginning
      this.recentProjects.unshift(project)
      
      // Keep only last 10
      this.recentProjects = this.recentProjects.slice(0, 10)
      
      localStorage.setItem('novelcraft-recent-projects', JSON.stringify(this.recentProjects))
    },
    
    removeFromRecent(projectPath) {
      this.recentProjects = this.recentProjects.filter(p => p.path !== projectPath)
      localStorage.setItem('novelcraft-recent-projects', JSON.stringify(this.recentProjects))
    },
    
    formatDate(dateString) {
      return moment(dateString).format('MMM DD, YYYY')
    }
  }
}
</script>

<style scoped>
.welcome-screen {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.welcome-content {
  max-width: 800px;
  width: 100%;
  padding: 40px;
  text-align: center;
}

.welcome-header {
  margin-bottom: 40px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.welcome-header h1 {
  font-size: 48px;
  font-weight: 300;
  margin: 0 0 16px 0;
  color: white;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}

.welcome-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.action-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.action-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.action-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
}

.action-content h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 500;
}

.action-content p {
  margin: 0;
  opacity: 0.8;
  font-size: 14px;
  line-height: 1.5;
}

.recent-projects {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
}

.recent-projects h3 {
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 500;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.project-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.project-info {
  flex: 1;
  text-align: left;
}

.project-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.project-path {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 4px;
}

.project-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  opacity: 0.7;
}

.welcome-features {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.welcome-features h3 {
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 500;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: background-color 0.2s;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.feature-item i {
  font-size: 24px;
}

.feature-item span {
  font-size: 14px;
  text-align: center;
}
</style>