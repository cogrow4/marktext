<template>
  <el-dialog
    title="Writing Goals"
    :visible.sync="visible"
    width="500px"
    @close="handleClose">
    
    <div class="goals-dialog">
      <div class="goals-header">
        <h3><i class="el-icon-target"></i> Set Your Writing Goals</h3>
        <p>Track your progress and stay motivated with daily, weekly, and monthly goals</p>
      </div>

      <el-form :model="goalsForm" label-width="120px">
        <el-form-item label="Daily Goal">
          <el-input-number 
            v-model="goalsForm.daily" 
            :min="100" 
            :max="10000" 
            :step="100"
            controls-position="right">
          </el-input-number>
          <span class="form-help">words per day</span>
        </el-form-item>

        <el-form-item label="Weekly Goal">
          <el-input-number 
            v-model="goalsForm.weekly" 
            :min="500" 
            :max="50000" 
            :step="500"
            controls-position="right">
          </el-input-number>
          <span class="form-help">words per week</span>
        </el-form-item>

        <el-form-item label="Monthly Goal">
          <el-input-number 
            v-model="goalsForm.monthly" 
            :min="2000" 
            :max="200000" 
            :step="1000"
            controls-position="right">
          </el-input-number>
          <span class="form-help">words per month</span>
        </el-form-item>
      </el-form>

      <div class="goals-preview">
        <h4>Goal Summary</h4>
        <div class="preview-stats">
          <div class="stat-item">
            <div class="stat-value">{{ goalsForm.daily.toLocaleString() }}</div>
            <div class="stat-label">Daily</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ goalsForm.weekly.toLocaleString() }}</div>
            <div class="stat-label">Weekly</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ goalsForm.monthly.toLocaleString() }}</div>
            <div class="stat-label">Monthly</div>
          </div>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Cancel</el-button>
      <el-button type="primary" @click="saveGoals">
        <i class="el-icon-check"></i> Save Goals
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'WritingGoalsDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      goalsForm: {
        daily: 1000,
        weekly: 7000,
        monthly: 30000
      }
    }
  },
  methods: {
    ...mapActions('writingStats', ['setGoal']),
    async saveGoals () {
      try {
        await Promise.all([
          this.setGoal({ goalType: 'daily', value: this.goalsForm.daily }),
          this.setGoal({ goalType: 'weekly', value: this.goalsForm.weekly }),
          this.setGoal({ goalType: 'monthly', value: this.goalsForm.monthly })
        ])
        
        this.$message.success('Writing goals updated successfully!')
        this.handleClose()
      } catch (error) {
        this.$message.error('Failed to save goals: ' + error.message)
      }
    },
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.goals-dialog {
  padding: 16px 0;
}

.goals-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.goals-header h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.goals-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.form-help {
  margin-left: 8px;
  color: #999;
  font-size: 12px;
}

.goals-preview {
  margin: 24px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.goals-preview h4 {
  margin: 0 0 16px 0;
  color: #2c3e50;
}

.preview-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
