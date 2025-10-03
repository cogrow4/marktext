<template>
  <el-dialog
    title="Create New Novel Project"
    :visible.sync="visible"
    width="600px"
    @close="resetForm"
  >
    <el-form :model="projectForm" :rules="formRules" ref="projectForm" label-width="120px">
      <el-form-item label="Project Name" prop="name">
        <el-input v-model="projectForm.name" placeholder="Enter project name" />
      </el-form-item>
      
      <el-form-item label="Description">
        <el-input
          v-model="projectForm.description"
          type="textarea"
          :rows="3"
          placeholder="Brief description of your novel"
        />
      </el-form-item>
      
      <el-form-item label="Project Location" prop="location">
        <div class="location-input">
          <el-input v-model="projectForm.location" placeholder="Select project location" readonly />
          <el-button @click="selectLocation">Browse</el-button>
        </div>
      </el-form-item>
      
      <el-form-item label="Word Goal">
        <el-input-number
          v-model="projectForm.wordGoal"
          :min="1000"
          :max="1000000"
          :step="1000"
        />
        <span class="form-help">Target word count for your novel</span>
      </el-form-item>
      
      <el-form-item label="Daily Goal">
        <el-input-number
          v-model="projectForm.dailyGoal"
          :min="100"
          :max="10000"
          :step="100"
        />
        <span class="form-help">Words to write per day</span>
      </el-form-item>
      
      <el-form-item label="Deadline">
        <el-date-picker
          v-model="projectForm.deadline"
          type="date"
          placeholder="Select deadline (optional)"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      
      <el-form-item label="Initialize Git">
        <el-checkbox v-model="projectForm.initGit">
          Initialize Git repository for version control
        </el-checkbox>
      </el-form-item>
      
      <el-form-item label="Create Sample Chapter">
        <el-checkbox v-model="projectForm.createSampleChapter">
          Create a sample chapter to get started
        </el-checkbox>
      </el-form-item>
    </el-form>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">Cancel</el-button>
      <el-button type="primary" @click="createProject" :loading="creating">
        Create Project
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ipcRenderer } from 'electron'
import { remote } from '@electron/remote'

export default {
  name: 'ProjectDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.value,
      creating: false,
      projectForm: {
        name: '',
        description: '',
        location: '',
        wordGoal: 80000,
        dailyGoal: 1000,
        deadline: null,
        initGit: true,
        createSampleChapter: true
      },
      formRules: {
        name: [
          { required: true, message: 'Please enter project name', trigger: 'blur' }
        ],
        location: [
          { required: true, message: 'Please select project location', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    value(newVal) {
      this.visible = newVal
    },
    visible(newVal) {
      this.$emit('input', newVal)
    }
  },
  methods: {
    async selectLocation() {
      try {
        const result = await remote.dialog.showOpenDialog({
          properties: ['openDirectory', 'createDirectory'],
          title: 'Select Project Location'
        })
        
        if (!result.canceled && result.filePaths.length > 0) {
          this.projectForm.location = result.filePaths[0]
        }
      } catch (error) {
        this.$message.error('Error selecting location: ' + error.message)
      }
    },
    
    async createProject() {
      try {
        await this.$refs.projectForm.validate()
        
        this.creating = true
        
        const projectPath = `${this.projectForm.location}/${this.projectForm.name}`
        
        const result = await ipcRenderer.invoke('project-init', projectPath, {
          name: this.projectForm.name,
          description: this.projectForm.description,
          wordGoal: this.projectForm.wordGoal,
          dailyGoal: this.projectForm.dailyGoal,
          deadline: this.projectForm.deadline,
          initGit: this.projectForm.initGit,
          createSampleChapter: this.projectForm.createSampleChapter
        })
        
        if (result.success) {
          this.$message.success('Project created successfully!')
          this.visible = false
          this.$emit('project-created', projectPath)
        } else {
          this.$message.error('Failed to create project: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error creating project: ' + error.message)
      } finally {
        this.creating = false
      }
    },
    
    resetForm() {
      this.projectForm = {
        name: '',
        description: '',
        location: '',
        wordGoal: 80000,
        dailyGoal: 1000,
        deadline: null,
        initGit: true,
        createSampleChapter: true
      }
      this.$refs.projectForm.resetFields()
    }
  }
}
</script>

<style scoped>
.location-input {
  display: flex;
  gap: 8px;
}

.location-input .el-input {
  flex: 1;
}

.form-help {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.dialog-footer {
  text-align: right;
}
</style>