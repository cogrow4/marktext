<template>
  <div class="writing-stats-panel">
    <div class="panel-header">
      <h3>Writing Statistics</h3>
      <el-button 
        size="small" 
        icon="el-icon-refresh"
        @click="refreshStats">
      </el-button>
    </div>

    <!-- Session Control -->
    <div class="session-control">
      <el-button 
        v-if="!sessionActive"
        type="primary"
        @click="startWritingSession">
        <i class="el-icon-video-play"></i> Start Session
      </el-button>
      <el-button 
        v-else
        type="danger"
        @click="endWritingSession">
        <i class="el-icon-video-pause"></i> End Session
      </el-button>
    </div>

    <!-- Today's Stats -->
    <div class="stats-card">
      <h4>Today's Progress</h4>
      <div class="stat-item">
        <div class="stat-label">Words Written</div>
        <div class="stat-value">{{ dailyStats.wordCount }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Writing Time</div>
        <div class="stat-value">{{ formattedDuration }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Sessions</div>
        <div class="stat-value">{{ dailyStats.sessions }}</div>
      </div>
      <el-progress 
        :percentage="dailyProgress"
        :color="progressColor">
      </el-progress>
      <div class="goal-text">Goal: {{ goals.daily }} words/day</div>
    </div>

    <!-- Weekly Stats -->
    <div class="stats-card">
      <h4>This Week</h4>
      <div class="mini-chart">
        <div 
          v-for="day in weeklyStats" 
          :key="day.date"
          class="chart-bar"
          :style="{ height: getBarHeight(day.wordCount, weeklyStats) }">
          <div class="bar-value">{{ day.wordCount }}</div>
          <div class="bar-label">{{ formatDayLabel(day.date) }}</div>
        </div>
      </div>
      <el-progress 
        :percentage="weeklyProgress"
        :color="progressColor">
      </el-progress>
      <div class="goal-text">Goal: {{ goals.weekly }} words/week</div>
    </div>

    <!-- Monthly Progress -->
    <div class="stats-card">
      <h4>This Month</h4>
      <el-progress 
        type="circle"
        :percentage="monthlyProgress"
        :color="progressColor"
        :width="120">
      </el-progress>
      <div class="goal-text">Goal: {{ goals.monthly }} words/month</div>
    </div>

    <!-- Overall Summary -->
    <div class="stats-card">
      <h4>All Time</h4>
      <div class="stat-item">
        <div class="stat-label">Total Words</div>
        <div class="stat-value">{{ summary.totalWords.toLocaleString() }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Days Written</div>
        <div class="stat-value">{{ summary.daysWritten }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Avg Words/Day</div>
        <div class="stat-value">{{ summary.avgWordsPerDay }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Total Sessions</div>
        <div class="stat-value">{{ summary.totalSessions }}</div>
      </div>
    </div>

    <!-- Goals Settings -->
    <div class="stats-card">
      <h4>Writing Goals</h4>
      <el-form label-width="100px" size="small">
        <el-form-item label="Daily">
          <el-input-number 
            v-model="goals.daily" 
            :step="100"
            @change="updateGoal('daily', goals.daily)">
          </el-input-number>
        </el-form-item>
        <el-form-item label="Weekly">
          <el-input-number 
            v-model="goals.weekly" 
            :step="500"
            @change="updateGoal('weekly', goals.weekly)">
          </el-input-number>
        </el-form-item>
        <el-form-item label="Monthly">
          <el-input-number 
            v-model="goals.monthly" 
            :step="1000"
            @change="updateGoal('monthly', goals.monthly)">
          </el-input-number>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import dayjs from 'dayjs'

export default {
  name: 'WritingStatsPanel',
  data () {
    return {
      progressColor: [
        { color: '#f56c6c', percentage: 30 },
        { color: '#e6a23c', percentage: 60 },
        { color: '#5cb87a', percentage: 80 },
        { color: '#1989fa', percentage: 100 }
      ]
    }
  },
  computed: {
    ...mapState('writingStats', [
      'dailyStats',
      'weeklyStats',
      'monthlyStats',
      'summary',
      'goals',
      'sessionActive',
      'loading'
    ]),
    ...mapGetters('writingStats', [
      'dailyProgress',
      'weeklyProgress',
      'monthlyProgress',
      'formattedDuration'
    ])
  },
  mounted () {
    this.refreshStats()
  },
  methods: {
    ...mapActions('writingStats', [
      'startSession',
      'endSession',
      'loadDailyStats',
      'loadWeeklyStats',
      'loadMonthlyStats',
      'loadSummary',
      'loadGoals',
      'setGoal'
    ]),
    async startWritingSession () {
      // Get current word count from editor
      const wordCount = this.getCurrentWordCount()
      await this.startSession(wordCount)
      this.$message.success('Writing session started')
    },
    async endWritingSession () {
      const wordCount = this.getCurrentWordCount()
      await this.endSession(wordCount)
      this.$message.success('Writing session ended')
    },
    async refreshStats () {
      await Promise.all([
        this.loadDailyStats(),
        this.loadWeeklyStats(),
        this.loadMonthlyStats(),
        this.loadSummary(),
        this.loadGoals()
      ])
    },
    async updateGoal (goalType, value) {
      await this.setGoal({ goalType, value })
    },
    getCurrentWordCount () {
      // Get word count from the editor
      const editor = this.$store.state.editor
      if (editor && editor.currentFile) {
        const content = editor.currentFile.markdown || ''
        return content.split(/\s+/).filter(word => word.length > 0).length
      }
      return 0
    },
    getBarHeight (value, data) {
      const maxValue = Math.max(...data.map(d => d.wordCount), 1)
      const height = (value / maxValue) * 100
      return `${Math.max(height, 5)}%`
    },
    formatDayLabel (date) {
      return dayjs(date).format('ddd')
    }
  }
}
</script>

<style scoped>
.writing-stats-panel {
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

.session-control {
  margin-bottom: 16px;
}

.session-control .el-button {
  width: 100%;
}

.stats-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.stats-card h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.goal-text {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
  text-align: center;
}

.mini-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 120px;
  margin-bottom: 16px;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.chart-bar {
  flex: 1;
  margin: 0 2px;
  background: linear-gradient(to top, #1989fa, #5cb87a);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 5%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.chart-bar:hover {
  opacity: 0.8;
}

.bar-value {
  font-size: 10px;
  font-weight: bold;
  color: white;
  padding: 2px;
}

.bar-label {
  position: absolute;
  bottom: -20px;
  font-size: 10px;
  color: #666;
  white-space: nowrap;
}

.stats-card .el-progress {
  margin-top: 12px;
}

.stats-card .el-progress--circle {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}
</style>
