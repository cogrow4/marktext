<template>
  <div class="git-manager">
    <div class="git-header">
      <h3>Version Control</h3>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="initRepository" :loading="initializing">
          <i class="el-icon-plus"></i> Initialize Git
        </el-button>
        <el-button size="small" @click="refreshStatus">
          <i class="el-icon-refresh"></i> Refresh
        </el-button>
      </div>
    </div>

    <div class="git-content">
      <!-- Repository Status -->
      <div class="section" v-if="gitStatus">
        <h4>Repository Status</h4>
        <div class="status-info">
          <div class="status-item">
            <span class="label">Current Branch:</span>
            <el-tag type="primary">{{ gitStatus.current || 'main' }}</el-tag>
          </div>
          <div class="status-item">
            <span class="label">Modified Files:</span>
            <el-tag type="warning">{{ gitStatus.modified.length }}</el-tag>
          </div>
          <div class="status-item">
            <span class="label">New Files:</span>
            <el-tag type="success">{{ gitStatus.not_added.length }}</el-tag>
          </div>
          <div class="status-item">
            <span class="label">Staged Files:</span>
            <el-tag type="info">{{ gitStatus.staged.length }}</el-tag>
          </div>
        </div>
      </div>

      <!-- Commit Changes -->
      <div class="section">
        <h4>Commit Changes</h4>
        <div class="commit-form">
          <el-input
            v-model="commitMessage"
            type="textarea"
            :rows="3"
            placeholder="Enter commit message..."
          />
          <div class="commit-actions">
            <el-button @click="stageAllFiles" :loading="staging">
              <i class="el-icon-check"></i> Stage All
            </el-button>
            <el-button type="primary" @click="commitChanges" :loading="committing">
              <i class="el-icon-upload2"></i> Commit
            </el-button>
          </div>
        </div>
      </div>

      <!-- Branches -->
      <div class="section">
        <h4>Branches</h4>
        <div class="branch-controls">
          <el-input
            v-model="newBranchName"
            placeholder="New branch name"
            size="small"
          />
          <el-button @click="createBranch" :loading="creatingBranch">
            <i class="el-icon-plus"></i> Create Branch
          </el-button>
        </div>
        
        <div class="branch-list" v-if="branches.length > 0">
          <div
            v-for="branch in branches"
            :key="branch"
            class="branch-item"
            :class="{ active: branch === currentBranch }"
            @click="switchBranch(branch)"
          >
            <i class="el-icon-connection"></i>
            <span>{{ branch }}</span>
            <el-button
              v-if="branch !== 'main' && branch !== 'master'"
              type="text"
              size="mini"
              @click.stop="deleteBranch(branch)"
              icon="el-icon-delete"
              style="color: #f56c6c"
            />
          </div>
        </div>
      </div>

      <!-- Commit History -->
      <div class="section">
        <h4>Recent Commits</h4>
        <div class="commit-list" v-if="commitHistory.length > 0">
          <div
            v-for="commit in commitHistory"
            :key="commit.hash"
            class="commit-item"
            @click="showCommitDetails(commit)"
          >
            <div class="commit-header">
              <div class="commit-message">{{ commit.message }}</div>
              <div class="commit-hash">{{ commit.hash.substring(0, 7) }}</div>
            </div>
            <div class="commit-meta">
              <span class="commit-author">{{ commit.author_name }}</span>
              <span class="commit-date">{{ formatDate(commit.date) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="no-commits">
          No commits yet
        </div>
      </div>

      <!-- Tags -->
      <div class="section">
        <h4>Tags</h4>
        <div class="tag-controls">
          <el-input
            v-model="newTagName"
            placeholder="Tag name"
            size="small"
          />
          <el-input
            v-model="newTagMessage"
            placeholder="Tag message"
            size="small"
          />
          <el-button @click="createTag" :loading="creatingTag">
            <i class="el-icon-price-tag"></i> Create Tag
          </el-button>
        </div>
        
        <div class="tag-list" v-if="tags.length > 0">
          <div
            v-for="tag in tags"
            :key="tag"
            class="tag-item"
          >
            <i class="el-icon-price-tag"></i>
            <span>{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- Auto-commit Settings -->
      <div class="section">
        <h4>Auto-commit Settings</h4>
        <div class="auto-commit-settings">
          <el-checkbox v-model="autoCommitEnabled">
            Enable auto-commit on save
          </el-checkbox>
          <el-input
            v-model="autoCommitMessage"
            placeholder="Auto-commit message template"
            size="small"
            :disabled="!autoCommitEnabled"
          />
        </div>
      </div>
    </div>

    <!-- Commit Details Dialog -->
    <el-dialog
      title="Commit Details"
      :visible.sync="showCommitDialog"
      width="600px"
    >
      <div v-if="selectedCommit" class="commit-details">
        <div class="detail-section">
          <label>Hash:</label>
          <span>{{ selectedCommit.hash }}</span>
        </div>
        <div class="detail-section">
          <label>Message:</label>
          <p>{{ selectedCommit.message }}</p>
        </div>
        <div class="detail-section">
          <label>Author:</label>
          <span>{{ selectedCommit.author_name }} &lt;{{ selectedCommit.author_email }}&gt;</span>
        </div>
        <div class="detail-section">
          <label>Date:</label>
          <span>{{ formatDate(selectedCommit.date) }}</span>
        </div>
        <div class="detail-section" v-if="selectedCommit.diff">
          <label>Changes:</label>
          <pre class="diff-content">{{ selectedCommit.diff }}</pre>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import moment from 'moment'

export default {
  name: 'GitManager',
  data() {
    return {
      gitStatus: null,
      commitMessage: '',
      newBranchName: '',
      newTagName: '',
      newTagMessage: '',
      branches: [],
      currentBranch: 'main',
      commitHistory: [],
      tags: [],
      showCommitDialog: false,
      selectedCommit: null,
      
      // Loading states
      initializing: false,
      staging: false,
      committing: false,
      creatingBranch: false,
      creatingTag: false,
      
      // Settings
      autoCommitEnabled: false,
      autoCommitMessage: 'Auto-save: {filename}'
    }
  },
  mounted() {
    this.loadGitStatus()
    this.loadBranches()
    this.loadCommitHistory()
    this.loadTags()
  },
  methods: {
    async loadGitStatus() {
      try {
        const result = await ipcRenderer.invoke('git-status', this.getProjectPath())
        if (result.success) {
          this.gitStatus = result.status
          this.currentBranch = result.status.current || 'main'
        }
      } catch (error) {
        console.error('Error loading git status:', error)
      }
    },
    
    async loadBranches() {
      try {
        const result = await ipcRenderer.invoke('git-branches', this.getProjectPath())
        if (result.success) {
          this.branches = result.branches
        }
      } catch (error) {
        console.error('Error loading branches:', error)
      }
    },
    
    async loadCommitHistory() {
      try {
        const result = await ipcRenderer.invoke('git-log', this.getProjectPath(), { maxCount: 20 })
        if (result.success) {
          this.commitHistory = result.log
        }
      } catch (error) {
        console.error('Error loading commit history:', error)
      }
    },
    
    async loadTags() {
      try {
        const result = await ipcRenderer.invoke('git-tags', this.getProjectPath())
        if (result.success) {
          this.tags = result.tags
        }
      } catch (error) {
        console.error('Error loading tags:', error)
      }
    },
    
    async initRepository() {
      this.initializing = true
      try {
        const result = await ipcRenderer.invoke('git-init', this.getProjectPath())
        if (result.success) {
          this.$message.success('Git repository initialized successfully')
          await this.loadGitStatus()
        } else {
          this.$message.error('Failed to initialize repository: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error initializing repository: ' + error.message)
      } finally {
        this.initializing = false
      }
    },
    
    async refreshStatus() {
      await Promise.all([
        this.loadGitStatus(),
        this.loadBranches(),
        this.loadCommitHistory(),
        this.loadTags()
      ])
      this.$message.success('Git status refreshed')
    },
    
    async stageAllFiles() {
      this.staging = true
      try {
        const result = await ipcRenderer.invoke('git-commit', this.getProjectPath(), 'Staging files', [])
        if (result.success) {
          this.$message.success('All files staged')
          await this.loadGitStatus()
        } else {
          this.$message.error('Failed to stage files: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error staging files: ' + error.message)
      } finally {
        this.staging = false
      }
    },
    
    async commitChanges() {
      if (!this.commitMessage.trim()) {
        this.$message.warning('Please enter a commit message')
        return
      }
      
      this.committing = true
      try {
        const result = await ipcRenderer.invoke('git-commit', this.getProjectPath(), this.commitMessage)
        if (result.success) {
          this.$message.success('Changes committed successfully')
          this.commitMessage = ''
          await this.loadGitStatus()
          await this.loadCommitHistory()
        } else {
          this.$message.error('Failed to commit changes: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error committing changes: ' + error.message)
      } finally {
        this.committing = false
      }
    },
    
    async createBranch() {
      if (!this.newBranchName.trim()) {
        this.$message.warning('Please enter a branch name')
        return
      }
      
      this.creatingBranch = true
      try {
        const result = await ipcRenderer.invoke('git-branch-create', this.getProjectPath(), this.newBranchName)
        if (result.success) {
          this.$message.success(`Branch '${this.newBranchName}' created successfully`)
          this.newBranchName = ''
          await this.loadBranches()
        } else {
          this.$message.error('Failed to create branch: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error creating branch: ' + error.message)
      } finally {
        this.creatingBranch = false
      }
    },
    
    async switchBranch(branchName) {
      try {
        const result = await ipcRenderer.invoke('git-branch-switch', this.getProjectPath(), branchName)
        if (result.success) {
          this.$message.success(`Switched to branch '${branchName}'`)
          this.currentBranch = branchName
          await this.loadGitStatus()
        } else {
          this.$message.error('Failed to switch branch: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error switching branch: ' + error.message)
      }
    },
    
    async deleteBranch(branchName) {
      try {
        await this.$confirm(`Are you sure you want to delete branch '${branchName}'?`, 'Confirm Delete', {
          type: 'warning'
        })
        
        // Note: This would require implementing branch deletion in the git service
        this.$message.info('Branch deletion not implemented yet')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('Error deleting branch: ' + error.message)
        }
      }
    },
    
    async createTag() {
      if (!this.newTagName.trim()) {
        this.$message.warning('Please enter a tag name')
        return
      }
      
      this.creatingTag = true
      try {
        const result = await ipcRenderer.invoke('git-tag', this.getProjectPath(), this.newTagName, this.newTagMessage)
        if (result.success) {
          this.$message.success(`Tag '${this.newTagName}' created successfully`)
          this.newTagName = ''
          this.newTagMessage = ''
          await this.loadTags()
        } else {
          this.$message.error('Failed to create tag: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error creating tag: ' + error.message)
      } finally {
        this.creatingTag = false
      }
    },
    
    async showCommitDetails(commit) {
      try {
        const result = await ipcRenderer.invoke('git-diff', this.getProjectPath(), { from: commit.hash + '~1', to: commit.hash })
        if (result.success) {
          this.selectedCommit = {
            ...commit,
            diff: result.diff
          }
          this.showCommitDialog = true
        }
      } catch (error) {
        this.$message.error('Error loading commit details: ' + error.message)
      }
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
.git-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.git-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.git-header h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.git-content {
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

.status-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-item .label {
  font-weight: 500;
  color: #606266;
}

.commit-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.commit-actions {
  display: flex;
  gap: 8px;
}

.branch-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.branch-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.branch-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.branch-item:hover {
  background-color: #f5f7fa;
}

.branch-item.active {
  background-color: #ecf5ff;
  border: 1px solid #b3d8ff;
}

.commit-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.commit-item {
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.commit-item:hover {
  background-color: #f5f7fa;
}

.commit-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.commit-message {
  font-weight: 500;
  color: #303133;
  flex: 1;
}

.commit-hash {
  font-size: 12px;
  color: #909399;
  font-family: monospace;
}

.commit-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

.tag-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  font-size: 12px;
  color: #409eff;
}

.auto-commit-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.commit-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.diff-content {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
  font-family: monospace;
  font-size: 12px;
  color: #606266;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
}

.no-commits {
  text-align: center;
  color: #909399;
  font-style: italic;
  padding: 20px;
}
</style>