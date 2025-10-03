<template>
  <div class="scenes-panel">
    <div class="panel-header">
      <h3>Scenes & Timeline</h3>
      <el-button 
        type="primary" 
        size="small" 
        icon="el-icon-plus"
        @click="showCreateDialog = true">
        Add Scene
      </el-button>
    </div>

    <div class="view-toggle">
      <el-radio-group v-model="viewMode" size="small">
        <el-radio-button label="list">List</el-radio-button>
        <el-radio-button label="timeline">Timeline</el-radio-button>
        <el-radio-button label="status">Status</el-radio-button>
      </el-radio-group>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="scenes-list">
      <draggable v-model="sortedScenes" @end="handleReorder">
        <div 
          v-for="scene in sortedScenes" 
          :key="scene.id"
          class="scene-item"
          :class="`status-${scene.status}`"
          @click="selectScene(scene)">
          <div class="scene-info">
            <div class="scene-header">
              <h4>{{ scene.title }}</h4>
              <el-tag size="mini" :type="getStatusType(scene.status)">
                {{ scene.status }}
              </el-tag>
            </div>
            <div class="scene-meta">
              <span v-if="scene.chapter" class="meta-item">
                <i class="el-icon-folder"></i> {{ scene.chapter }}
              </span>
              <span v-if="scene.wordCount" class="meta-item">
                <i class="el-icon-document"></i> {{ scene.wordCount }} words
              </span>
              <span v-if="scene.pov" class="meta-item">
                <i class="el-icon-view"></i> {{ scene.pov }}
              </span>
            </div>
            <p class="scene-summary">{{ scene.summary || 'No summary' }}</p>
          </div>
          <div class="scene-actions">
            <el-button 
              type="text" 
              icon="el-icon-edit"
              @click.stop="editScene(scene)">
            </el-button>
            <el-button 
              type="text" 
              icon="el-icon-delete"
              @click.stop="deleteScene(scene.id)">
            </el-button>
          </div>
        </div>
      </draggable>
    </div>

    <!-- Timeline View -->
    <div v-else-if="viewMode === 'timeline'" class="timeline-view">
      <div 
        v-for="(scenes, chapter) in scenesByChapter" 
        :key="chapter"
        class="chapter-group">
        <h4 class="chapter-title">{{ chapter }}</h4>
        <div class="timeline">
          <div 
            v-for="(scene, index) in scenes" 
            :key="scene.id"
            class="timeline-item"
            @click="selectScene(scene)">
            <div class="timeline-marker">{{ index + 1 }}</div>
            <div class="timeline-content">
              <div class="scene-title">{{ scene.title }}</div>
              <div class="scene-details">
                <span v-if="scene.setting">📍 {{ scene.setting }}</span>
                <span v-if="scene.timeOfDay">🕐 {{ scene.timeOfDay }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status View -->
    <div v-else-if="viewMode === 'status'" class="status-view">
      <div 
        v-for="(scenes, status) in scenesByStatus" 
        :key="status"
        class="status-group">
        <h4 class="status-title">
          {{ status }} ({{ scenes.length }})
        </h4>
        <div 
          v-for="scene in scenes" 
          :key="scene.id"
          class="scene-card"
          @click="selectScene(scene)">
          <h5>{{ scene.title }}</h5>
          <p>{{ scene.summary }}</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Scene Dialog -->
    <el-dialog
      :title="editingScene ? 'Edit Scene' : 'Create Scene'"
      :visible.sync="showCreateDialog"
      width="700px">
      <el-form :model="sceneForm" label-width="120px">
        <el-form-item label="Title">
          <el-input v-model="sceneForm.title" placeholder="Scene title"></el-input>
        </el-form-item>
        <el-form-item label="Chapter">
          <el-input v-model="sceneForm.chapter" placeholder="Chapter name"></el-input>
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="sceneForm.status">
            <el-option label="Draft" value="draft"></el-option>
            <el-option label="In Progress" value="in_progress"></el-option>
            <el-option label="Complete" value="complete"></el-option>
            <el-option label="Revision" value="revision"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="POV">
          <el-input v-model="sceneForm.pov" placeholder="Point of view character"></el-input>
        </el-form-item>
        <el-form-item label="Setting">
          <el-input v-model="sceneForm.setting" placeholder="Where does this scene take place?"></el-input>
        </el-form-item>
        <el-form-item label="Time of Day">
          <el-select v-model="sceneForm.timeOfDay">
            <el-option label="Morning" value="morning"></el-option>
            <el-option label="Afternoon" value="afternoon"></el-option>
            <el-option label="Evening" value="evening"></el-option>
            <el-option label="Night" value="night"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Weather/Mood">
          <el-input v-model="sceneForm.mood" placeholder="Atmosphere and mood"></el-input>
        </el-form-item>
        <el-form-item label="Summary">
          <el-input 
            type="textarea" 
            v-model="sceneForm.summary"
            :rows="3"
            placeholder="Brief scene summary">
          </el-input>
        </el-form-item>
        <el-form-item label="Characters">
          <el-input 
            v-model="sceneForm.characters"
            placeholder="Characters in this scene (comma-separated)">
          </el-input>
        </el-form-item>
        <el-form-item label="Goals">
          <el-input 
            type="textarea" 
            v-model="sceneForm.goals"
            :rows="2"
            placeholder="What are the characters trying to achieve?">
          </el-input>
        </el-form-item>
        <el-form-item label="Conflict">
          <el-input 
            type="textarea" 
            v-model="sceneForm.conflict"
            :rows="2"
            placeholder="What obstacles or conflicts arise?">
          </el-input>
        </el-form-item>
        <el-form-item label="Outcome">
          <el-input 
            type="textarea" 
            v-model="sceneForm.outcome"
            :rows="2"
            placeholder="How does the scene end?">
          </el-input>
        </el-form-item>
        <el-form-item label="Notes">
          <el-input 
            type="textarea" 
            v-model="sceneForm.notes"
            :rows="3"
            placeholder="Additional notes">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCreateDialog = false">Cancel</el-button>
        <el-button type="primary" @click="saveScene">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'

export default {
  name: 'ScenesPanel',
  components: {
    draggable
  },
  data () {
    return {
      viewMode: 'list',
      showCreateDialog: false,
      editingScene: null,
      sceneForm: this.getEmptyForm()
    }
  },
  computed: {
    ...mapState('scenes', ['scenes', 'loading']),
    ...mapGetters('scenes', ['scenesByChapter', 'scenesByStatus', 'totalWordCount']),
    sortedScenes: {
      get () {
        return [...this.scenes].sort((a, b) => a.order - b.order)
      },
      set (value) {
        // Will be handled by reorder action
      }
    }
  },
  mounted () {
    this.loadScenes()
    this.loadTimeline()
  },
  methods: {
    ...mapActions('scenes', [
      'loadScenes',
      'loadTimeline',
      'createScene',
      'updateScene',
      'deleteScene',
      'reorderScenes',
      'selectScene'
    ]),
    getEmptyForm () {
      return {
        title: '',
        chapter: '',
        summary: '',
        setting: '',
        characters: '',
        timeOfDay: '',
        weather: '',
        mood: '',
        pov: '',
        goals: '',
        conflict: '',
        outcome: '',
        notes: '',
        status: 'draft',
        wordCount: 0
      }
    },
    editScene (scene) {
      this.editingScene = scene
      this.sceneForm = { 
        ...scene,
        characters: Array.isArray(scene.characters) ? scene.characters.join(', ') : scene.characters
      }
      this.showCreateDialog = true
    },
    async saveScene () {
      const formData = {
        ...this.sceneForm,
        characters: typeof this.sceneForm.characters === 'string' 
          ? this.sceneForm.characters.split(',').map(c => c.trim()).filter(c => c)
          : this.sceneForm.characters
      }

      if (this.editingScene) {
        await this.updateScene({
          id: this.editingScene.id,
          updates: formData
        })
      } else {
        await this.createScene(formData)
      }
      this.showCreateDialog = false
      this.editingScene = null
      this.sceneForm = this.getEmptyForm()
    },
    async deleteScene (id) {
      const confirmed = await this.$confirm('Delete this scene?', 'Confirm', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(() => false)
      
      if (confirmed) {
        await this.deleteScene(id)
      }
    },
    async handleReorder () {
      const sceneIds = this.sortedScenes.map(s => s.id)
      await this.reorderScenes(sceneIds)
    },
    getStatusType (status) {
      const types = {
        draft: 'info',
        in_progress: 'warning',
        complete: 'success',
        revision: 'danger'
      }
      return types[status] || 'info'
    }
  }
}
</script>

<style scoped>
.scenes-panel {
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

.view-toggle {
  margin-bottom: 16px;
}

.view-toggle .el-radio-group {
  width: 100%;
}

.scenes-list {
  margin-top: 16px;
}

.scene-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 8px;
  border-left: 4px solid #e0e0e0;
  background: #f9f9f9;
  border-radius: 4px;
  cursor: move;
  transition: all 0.3s;
}

.scene-item:hover {
  background: #f0f0f0;
}

.scene-item.status-draft {
  border-left-color: #909399;
}

.scene-item.status-in_progress {
  border-left-color: #e6a23c;
}

.scene-item.status-complete {
  border-left-color: #67c23a;
}

.scene-item.status-revision {
  border-left-color: #f56c6c;
}

.scene-info {
  flex: 1;
}

.scene-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.scene-header h4 {
  margin: 0;
  font-size: 16px;
}

.scene-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.scene-summary {
  margin: 0;
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.scene-actions {
  display: flex;
  gap: 4px;
  align-items: flex-start;
}

.timeline-view {
  margin-top: 16px;
}

.chapter-group {
  margin-bottom: 24px;
}

.chapter-title {
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
  color: #333;
}

.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ddd;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
  cursor: pointer;
}

.timeline-marker {
  position: absolute;
  left: -40px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.timeline-content {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.timeline-content:hover {
  background: #f0f0f0;
}

.scene-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.scene-details {
  font-size: 12px;
  color: #666;
  display: flex;
  gap: 12px;
}

.status-view {
  margin-top: 16px;
}

.status-group {
  margin-bottom: 24px;
}

.status-title {
  margin: 0 0 12px 0;
  color: #333;
}

.scene-card {
  background: #f9f9f9;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.scene-card:hover {
  background: #f0f0f0;
}

.scene-card h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.scene-card p {
  margin: 0;
  font-size: 12px;
  color: #666;
}
</style>
