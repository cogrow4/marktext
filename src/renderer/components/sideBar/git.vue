<template>
  <div class="git-panel">
    <div class="panel-header">
      <h3>Version Control</h3>
      <el-button 
        v-if="!isRepo"
        type="primary" 
        size="small" 
        @click="initRepository">
        Initialize Git
      </el-button>
    </div>

    <div v-if="isRepo" class="git-content">
      <!-- Current Branch -->
      <div class="current-branch">
        <el-tag type="info">
          <i class="el-icon-s-flag"></i> {{ currentBranch }}
        </el-tag>
        <el-button 
          size="mini" 
          @click="showBranchDialog = true">
          Branches
        </el-button>
      </div>

      <!-- Changes Section -->
      <div class="changes-section">
        <h4>Changes ({{ totalChanges }})</h4>
        
        <div v-if="status.modified.length > 0" class="file-group">
          <div class="group-header">Modified ({{ status.modified.length }})</div>
          <div 
            v-for="file in status.modified" 
            :key="file"
            class="file-item modified">
            <i class="el-icon-document"></i>
            <span>{{ file }}</span>
            <el-button 
              type="text" 
              size="mini"
              @click="stageFile(file)">
              Stage
            </el-button>
          </div>
        </div>

        <div v-if="status.untracked.length > 0" class="file-group">
          <div class="group-header">Untracked ({{ status.untracked.length }})</div>
          <div 
            v-for="file in status.untracked" 
            :key="file"
            class="file-item untracked">
            <i class="el-icon-document"></i>
            <span>{{ file }}</span>
            <el-button 
              type="text" 
              size="mini"
              @click="stageFile(file)">
              Stage
            </el-button>
          </div>
        </div>

        <div v-if="status.added.length > 0" class="file-group">
          <div class="group-header">Staged ({{ status.added.length }})</div>
          <div 
            v-for="file in status.added" 
            :key="file"
            class="file-item added">
            <i class="el-icon-document"></i>
            <span>{{ file }}</span>
          </div>
        </div>

        <div v-if="status.deleted.length > 0" class="file-group">
          <div class="group-header">Deleted ({{ status.deleted.length }})</div>
          <div 
            v-for="file in status.deleted" 
            :key="file"
            class="file-item deleted">
            <i class="el-icon-document"></i>
            <span>{{ file }}</span>
          </div>
        </div>

        <div v-if="totalChanges === 0" class="no-changes">
          <i class="el-icon-success"></i>
          <p>No changes</p>
        </div>
      </div>

      <!-- Commit Section -->
      <div v-if="hasChanges" class="commit-section">
        <el-input
          v-model="commitMessage"
          type="textarea"
          :rows="3"
          placeholder="Commit message...">
        </el-input>
        <el-button 
          type="primary" 
          :disabled="!commitMessage"
          @click="commitChanges">
          Commit
        </el-button>
      </div>

      <!-- Commit History -->
      <div class="history-section">
        <h4>Recent Commits</h4>
        <div class="commits-list">
          <div 
            v-for="commit in commits" 
            :key="commit.oid"
            class="commit-item">
            <div class="commit-message">{{ commit.commit.message }}</div>
            <div class="commit-meta">
              <span class="commit-author">{{ commit.commit.author.name }}</span>
              <span class="commit-date">{{ formatDate(commit.commit.author.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="actions-section">
        <el-button size="small" @click="refreshAll">
          <i class="el-icon-refresh"></i> Refresh
        </el-button>
        <el-button size="small" @click="showPushPullDialog = true">
          <i class="el-icon-upload"></i> Push/Pull
        </el-button>
      </div>
    </div>

    <!-- Branch Management Dialog -->
    <el-dialog
      title="Branch Management"
      :visible.sync="showBranchDialog"
      width="500px">
      <div class="branches-content">
        <div class="branch-list">
          <div 
            v-for="branch in branches" 
            :key="branch"
            class="branch-item"
            :class="{ active: branch === currentBranch }">
            <span>{{ branch }}</span>
            <el-button 
              v-if="branch !== currentBranch"
              type="text" 
              size="mini"
              @click="checkoutBranch(branch)">
              Checkout
            </el-button>
          </div>
        </div>
        <el-divider></el-divider>
        <el-input
          v-model="newBranchName"
          placeholder="New branch name"
          @keyup.enter.native="createNewBranch">
          <el-button 
            slot="append" 
            @click="createNewBranch">
            Create
          </el-button>
        </el-input>
      </div>
    </el-dialog>

    <!-- Push/Pull Dialog -->
    <el-dialog
      title="Push/Pull"
      :visible.sync="showPushPullDialog"
      width="400px">
      <el-form label-width="100px">
        <el-form-item label="Remote">
          <el-input v-model="remoteName" placeholder="origin"></el-input>
        </el-form-item>
        <el-form-item label="Branch">
          <el-input v-model="remoteBranch" placeholder="main"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="pullChanges">Pull</el-button>
        <el-button type="primary" @click="pushChanges">Push</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import dayjs from 'dayjs'

export default {
  name: 'GitPanel',
  data () {
    return {
      commitMessage: '',
      showBranchDialog: false,
      showPushPullDialog: false,
      newBranchName: '',
      remoteName: 'origin',
      remoteBranch: 'main'
    }
  },
  computed: {
    ...mapState('git', ['isRepo', 'status', 'branches', 'currentBranch', 'commits', 'loading']),
    ...mapGetters('git', ['hasChanges', 'totalChanges'])
  },
  mounted () {
    this.checkRepo()
    if (this.isRepo) {
      this.refreshAll()
    }
  },
  methods: {
    ...mapActions('git', [
      'checkRepo',
      'initRepo',
      'refreshStatus',
      'addFile',
      'commit',
      'refreshLog',
      'refreshBranches',
      'createBranch',
      'checkoutBranch',
      'push',
      'pull'
    ]),
    async initRepository () {
      const result = await this.initRepo()
      if (result.success) {
        this.$message.success('Git repository initialized')
        this.refreshAll()
      } else {
        this.$message.error('Failed to initialize repository')
      }
    },
    async stageFile (filepath) {
      const result = await this.addFile(filepath)
      if (result.success) {
        this.$message.success(`Staged ${filepath}`)
      }
    },
    async commitChanges () {
      if (!this.commitMessage) return
      
      const result = await this.commit({
        message: this.commitMessage,
        author: {
          name: 'Writer',
          email: 'writer@novel.local'
        }
      })
      
      if (result.success) {
        this.$message.success('Changes committed')
        this.commitMessage = ''
      } else {
        this.$message.error('Commit failed')
      }
    },
    async createNewBranch () {
      if (!this.newBranchName) return
      
      const result = await this.createBranch({
        name: this.newBranchName,
        checkout: true
      })
      
      if (result.success) {
        this.$message.success(`Branch ${this.newBranchName} created`)
        this.newBranchName = ''
        this.showBranchDialog = false
      }
    },
    async checkoutBranch (branch) {
      const result = await this.checkoutBranch(branch)
      if (result.success) {
        this.$message.success(`Switched to ${branch}`)
        this.showBranchDialog = false
      }
    },
    async pushChanges () {
      const result = await this.push({
        remote: this.remoteName,
        remoteRef: this.remoteBranch
      })
      
      if (result.success) {
        this.$message.success('Changes pushed')
        this.showPushPullDialog = false
      } else {
        this.$message.error('Push failed: ' + result.error)
      }
    },
    async pullChanges () {
      const result = await this.pull({
        remote: this.remoteName,
        remoteRef: this.remoteBranch,
        author: {
          name: 'Writer',
          email: 'writer@novel.local'
        }
      })
      
      if (result.success) {
        this.$message.success('Changes pulled')
        this.showPushPullDialog = false
      } else {
        this.$message.error('Pull failed: ' + result.error)
      }
    },
    async refreshAll () {
      await this.refreshStatus()
      await this.refreshLog()
      await this.refreshBranches()
    },
    formatDate (timestamp) {
      return dayjs(timestamp * 1000).format('MMM D, YYYY HH:mm')
    }
  }
}
</script>

<style scoped>
.git-panel {
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

.current-branch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.changes-section {
  margin-bottom: 16px;
}

.changes-section h4 {
  margin: 0 0 12px 0;
}

.file-group {
  margin-bottom: 12px;
}

.group-header {
  font-weight: bold;
  margin-bottom: 8px;
  color: #666;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 4px;
}

.file-item.modified {
  background-color: #fff3e0;
}

.file-item.untracked {
  background-color: #e8f5e9;
}

.file-item.added {
  background-color: #e3f2fd;
}

.file-item.deleted {
  background-color: #ffebee;
}

.file-item span {
  flex: 1;
  font-size: 14px;
}

.no-changes {
  text-align: center;
  padding: 32px;
  color: #999;
}

.no-changes i {
  font-size: 48px;
  color: #4caf50;
}

.commit-section {
  margin-bottom: 16px;
}

.commit-section .el-button {
  width: 100%;
  margin-top: 8px;
}

.history-section h4 {
  margin: 0 0 12px 0;
}

.commits-list {
  max-height: 300px;
  overflow-y: auto;
}

.commit-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.commit-message {
  font-weight: bold;
  margin-bottom: 4px;
}

.commit-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.actions-section {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.actions-section .el-button {
  flex: 1;
}

.branches-content {
  padding: 16px;
}

.branch-list {
  max-height: 300px;
  overflow-y: auto;
}

.branch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.branch-item.active {
  background-color: #e3f2fd;
  border-color: #2196f3;
}
</style>
