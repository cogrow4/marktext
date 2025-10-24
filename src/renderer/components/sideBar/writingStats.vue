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
    <div class="stats-card today-card">
      <div class="card-header">
        <h4><i class="el-icon-calendar"></i> Today's Progress</h4>
        <div class="session-indicator" :class="{ 'active': sessionActive }">
          <i class="el-icon-video-play"></i>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon">
            <i class="el-icon-edit-outline"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ dailyStats.wordCount.toLocaleString() }}</div>
            <div class="stat-label">Words Written</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <i class="el-icon-time"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formattedDuration }}</div>
            <div class="stat-label">Writing Time</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <i class="el-icon-refresh"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ dailyStats.sessions }}</div>
            <div class="stat-label">Sessions</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <i class="el-icon-trophy"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ Math.round(dailyProgress) }}%</div>
            <div class="stat-label">Goal Progress</div>
          </div>
        </div>
      </div>
      <div class="progress-section">
        <el-progress 
          :percentage="dailyProgress"
          :color="progressColor"
          :stroke-width="8">
        </el-progress>
        <div class="goal-text">
          <span class="goal-target">{{ goals.daily.toLocaleString() }} words/day</span>
          <span class="goal-remaining" v-if="dailyStats.wordCount < goals.daily">
            {{ (goals.daily - dailyStats.wordCount).toLocaleString() }} remaining
          </span>
          <span class="goal-exceeded" v-else>
            +{{ (dailyStats.wordCount - goals.daily).toLocaleString() }} over goal! 🎉
          </span>
        </div>
      </div>
    </div>

    <!-- Weekly Stats -->
    <div class="stats-card weekly-card">
      <div class="card-header">
        <h4><i class="el-icon-data-line"></i> This Week</h4>
        <div class="week-summary">
          {{ getWeekTotal() }} words
        </div>
      </div>
      <div class="mini-chart">
        <div 
          v-for="(day, index) in weeklyStats" 
          :key="day.date"
          class="chart-bar"
          :class="{ 'today': isToday(day.date) }"
          :style="{ height: getBarHeight(day.wordCount, weeklyStats) }"
          :title="`${formatFullDate(day.date)}: ${day.wordCount} words`">
          <div class="bar-value">{{ day.wordCount }}</div>
          <div class="bar-label">{{ formatDayLabel(day.date) }}</div>
        </div>
      </div>
      <div class="progress-section">
        <el-progress 
          :percentage="weeklyProgress"
          :color="progressColor"
          :stroke-width="6">
        </el-progress>
        <div class="goal-text">
          <span class="goal-target">{{ goals.weekly.toLocaleString() }} words/week</span>
          <span class="goal-remaining" v-if="getWeekTotal() < goals.weekly">
            {{ (goals.weekly - getWeekTotal()).toLocaleString() }} remaining
          </span>
          <span class="goal-exceeded" v-else>
            +{{ (getWeekTotal() - goals.weekly).toLocaleString() }} over goal! 🎉
          </span>
        </div>
      </div>
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
    },
    formatFullDate (date) {
      return dayjs(date).format('MMM D, YYYY')
    },
    isToday (date) {
      return dayjs(date).isSame(dayjs(), 'day')
    },
    getWeekTotal () {
      return this.weeklyStats.reduce((sum, day) => sum + day.wordCount, 0)
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
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e8f4fd;
}

.today-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.today-card .card-header h4,
.today-card .stat-label,
.today-card .goal-text {
  color: white;
}

.today-card .stat-value {
  color: white;
  font-weight: 700;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.session-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e8f4fd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409eff;
  transition: all 0.3s ease;
}

.session-indicator.active {
  background: #67c23a;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
}

.today-card .stat-item {
  background: rgba(255,255,255,0.2);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-section {
  margin-top: 16px;
}

.goal-text {
  margin-top: 12px;
  font-size: 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.goal-target {
  font-weight: 600;
  color: #666;
}

.goal-remaining {
  color: #e6a23c;
  font-size: 12px;
}

.goal-exceeded {
  color: #67c23a;
  font-size: 12px;
  font-weight: 600;
}

.week-summary {
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
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
  height: 140px;
  margin-bottom: 20px;
  padding: 16px 8px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.chart-bar {
  flex: 1;
  margin: 0 3px;
  background: linear-gradient(to top, #409eff, #67c23a);
  border-radius: 6px 6px 0 0;
  position: relative;
  min-height: 8%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-bar:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.chart-bar.today {
  background: linear-gradient(to top, #e6a23c, #f56c6c);
  box-shadow: 0 4px 8px rgba(230, 162, 60, 0.3);
}

.bar-value {
  font-size: 11px;
  font-weight: bold;
  color: white;
  padding: 4px 2px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.bar-label {
  position: absolute;
  bottom: -24px;
  font-size: 11px;
  color: #666;
  white-space: nowrap;
  font-weight: 500;
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
