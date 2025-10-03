<template>
  <div class="writing-stats">
    <div class="stats-header">
      <h3>Writing Statistics</h3>
      <div class="header-actions">
        <el-button size="small" @click="refreshStats">
          <i class="el-icon-refresh"></i> Refresh
        </el-button>
      </div>
    </div>

    <div class="stats-content">
      <!-- Basic Stats -->
      <div class="stats-section">
        <h4>Current Document</h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ basicStats.wordCount || 0 }}</div>
            <div class="stat-label">Words</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ basicStats.characterCount || 0 }}</div>
            <div class="stat-label">Characters</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ basicStats.paragraphCount || 0 }}</div>
            <div class="stat-label">Paragraphs</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ basicStats.sentenceCount || 0 }}</div>
            <div class="stat-label">Sentences</div>
          </div>
        </div>
      </div>

      <!-- Reading Time -->
      <div class="stats-section">
        <h4>Reading Time</h4>
        <div class="reading-time">
          <div class="time-display">{{ basicStats.readingTime || '0 min read' }}</div>
        </div>
      </div>

      <!-- Advanced Stats -->
      <div class="stats-section" v-if="advancedStats">
        <h4>Writing Analysis</h4>
        <div class="analysis-grid">
          <div class="analysis-item">
            <label>Average Words per Sentence:</label>
            <span>{{ advancedStats.averageWordsPerSentence || 0 }}</span>
          </div>
          <div class="analysis-item">
            <label>Average Characters per Word:</label>
            <span>{{ advancedStats.averageCharactersPerWord || 0 }}</span>
          </div>
          <div class="analysis-item">
            <label>Readability Score:</label>
            <span>{{ advancedStats.readabilityScore?.score || 0 }} ({{ advancedStats.readabilityScore?.level || 'Unknown' }})</span>
          </div>
          <div class="analysis-item">
            <label>Passive Voice Count:</label>
            <span>{{ advancedStats.passiveVoiceCount || 0 }}</span>
          </div>
          <div class="analysis-item">
            <label>Adverb Count:</label>
            <span>{{ advancedStats.adverbCount || 0 }}</span>
          </div>
          <div class="analysis-item">
            <label>Dialogue Percentage:</label>
            <span>{{ advancedStats.dialoguePercentage || 0 }}%</span>
          </div>
          <div class="analysis-item">
            <label>Unique Words:</label>
            <span>{{ advancedStats.uniqueWords || 0 }}</span>
          </div>
          <div class="analysis-item">
            <label>Lexical Diversity:</label>
            <span>{{ Math.round((advancedStats.lexicalDiversity || 0) * 100) }}%</span>
          </div>
        </div>
      </div>

      <!-- Most Used Words -->
      <div class="stats-section" v-if="advancedStats && advancedStats.mostUsedWords">
        <h4>Most Used Words</h4>
        <div class="word-list">
          <div
            v-for="word in advancedStats.mostUsedWords.slice(0, 10)"
            :key="word.word"
            class="word-item"
          >
            <span class="word">{{ word.word }}</span>
            <span class="count">{{ word.count }}</span>
          </div>
        </div>
      </div>

      <!-- Writing Goals -->
      <div class="stats-section">
        <h4>Writing Goals</h4>
        <div class="goals-grid">
          <div class="goal-item">
            <div class="goal-header">
              <span class="goal-label">Daily Goal</span>
              <span class="goal-progress">{{ Math.round(goalsProgress.daily || 0) }}%</span>
            </div>
            <el-progress :percentage="goalsProgress.daily || 0" :show-text="false" />
          </div>
          <div class="goal-item">
            <div class="goal-header">
              <span class="goal-label">Weekly Goal</span>
              <span class="goal-progress">{{ Math.round(goalsProgress.weekly || 0) }}%</span>
            </div>
            <el-progress :percentage="goalsProgress.weekly || 0" :show-text="false" />
          </div>
          <div class="goal-item">
            <div class="goal-header">
              <span class="goal-label">Monthly Goal</span>
              <span class="goal-progress">{{ Math.round(goalsProgress.monthly || 0) }}%</span>
            </div>
            <el-progress :percentage="goalsProgress.monthly || 0" :show-text="false" />
          </div>
          <div class="goal-item">
            <div class="goal-header">
              <span class="goal-label">Total Goal</span>
              <span class="goal-progress">{{ Math.round(goalsProgress.total || 0) }}%</span>
            </div>
            <el-progress :percentage="goalsProgress.total || 0" :show-text="false" />
          </div>
        </div>
      </div>

      <!-- Writing Streak -->
      <div class="stats-section">
        <h4>Writing Streak</h4>
        <div class="streak-info">
          <div class="streak-current">
            <div class="streak-number">{{ streak.current || 0 }}</div>
            <div class="streak-label">Current Streak</div>
          </div>
          <div class="streak-longest">
            <div class="streak-number">{{ streak.longest || 0 }}</div>
            <div class="streak-label">Longest Streak</div>
          </div>
        </div>
      </div>

      <!-- Productivity Insights -->
      <div class="stats-section" v-if="productivityInsights">
        <h4>Productivity Insights</h4>
        <div class="insights-grid">
          <div class="insight-item">
            <label>Best Writing Time:</label>
            <span>{{ productivityInsights.bestWritingTime || 'Unknown' }}</span>
          </div>
          <div class="insight-item">
            <label>Average Session Length:</label>
            <span>{{ productivityInsights.averageSessionLength || 0 }} minutes</span>
          </div>
          <div class="insight-item">
            <label>Words per Hour:</label>
            <span>{{ productivityInsights.wordsPerHour || 0 }}</span>
          </div>
          <div class="insight-item">
            <label>Most Productive Day:</label>
            <span>{{ productivityInsights.mostProductiveDay || 'Unknown' }}</span>
          </div>
          <div class="insight-item">
            <label>Consistency Score:</label>
            <span>{{ productivityInsights.consistencyScore || 0 }}%</span>
          </div>
        </div>
      </div>

      <!-- Style Analysis -->
      <div class="stats-section" v-if="styleAnalysis">
        <h4>Writing Style</h4>
        <div class="style-grid">
          <div class="style-item">
            <label>Tone:</label>
            <span>{{ styleAnalysis.tone || 'Unknown' }}</span>
          </div>
          <div class="style-item">
            <label>Complexity:</label>
            <span>{{ styleAnalysis.complexity || 'Unknown' }}</span>
          </div>
          <div class="style-item">
            <label>Pacing:</label>
            <span>{{ styleAnalysis.pacing || 'Unknown' }}</span>
          </div>
          <div class="style-item">
            <label>Dialogue Style:</label>
            <span>{{ styleAnalysis.dialogueStyle || 'Unknown' }}</span>
          </div>
          <div class="style-item">
            <label>Description Level:</label>
            <span>{{ styleAnalysis.descriptionLevel || 'Unknown' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'WritingStats',
  data() {
    return {
      basicStats: {},
      advancedStats: null,
      goalsProgress: {},
      streak: {},
      productivityInsights: null,
      styleAnalysis: null,
      refreshInterval: null
    }
  },
  mounted() {
    this.loadStats()
    // Refresh stats every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadBasicStats()
    }, 30000)
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
    async loadStats() {
      await Promise.all([
        this.loadBasicStats(),
        this.loadAdvancedStats(),
        this.loadGoalsProgress(),
        this.loadStreak(),
        this.loadProductivityInsights(),
        this.loadStyleAnalysis()
      ])
    },
    
    async loadBasicStats() {
      try {
        const content = this.getCurrentContent()
        if (content) {
          const result = await ipcRenderer.invoke('stats-get-basic', content)
          if (result.success) {
            this.basicStats = result.stats
          }
        }
      } catch (error) {
        console.error('Error loading basic stats:', error)
      }
    },
    
    async loadAdvancedStats() {
      try {
        const content = this.getCurrentContent()
        if (content) {
          const result = await ipcRenderer.invoke('stats-get-advanced', content)
          if (result.success) {
            this.advancedStats = result.stats
          }
        }
      } catch (error) {
        console.error('Error loading advanced stats:', error)
      }
    },
    
    async loadGoalsProgress() {
      try {
        const currentWordCount = this.basicStats.wordCount || 0
        const result = await ipcRenderer.invoke('stats-get-goals-progress', this.getProjectPath(), currentWordCount)
        if (result.success) {
          this.goalsProgress = result.progress
        }
      } catch (error) {
        console.error('Error loading goals progress:', error)
      }
    },
    
    async loadStreak() {
      try {
        const result = await ipcRenderer.invoke('stats-get-streak', this.getProjectPath())
        if (result.success) {
          this.streak = result.streak
        }
      } catch (error) {
        console.error('Error loading streak:', error)
      }
    },
    
    async loadProductivityInsights() {
      try {
        const result = await ipcRenderer.invoke('stats-get-productivity', this.getProjectPath())
        if (result.success) {
          this.productivityInsights = result.insights
        }
      } catch (error) {
        console.error('Error loading productivity insights:', error)
      }
    },
    
    async loadStyleAnalysis() {
      try {
        const content = this.getCurrentContent()
        if (content) {
          const result = await ipcRenderer.invoke('stats-analyze-style', content)
          if (result.success) {
            this.styleAnalysis = result.analysis
          }
        }
      } catch (error) {
        console.error('Error loading style analysis:', error)
      }
    },
    
    async refreshStats() {
      await this.loadStats()
      this.$message.success('Statistics refreshed')
    },
    
    getCurrentContent() {
      // This should get the current editor content
      // You'll need to implement this based on your editor integration
      return this.$store.state.editor.currentContent || ''
    },
    
    getProjectPath() {
      return this.$store.state.project.currentPath || ''
    }
  }
}
</script>

<style scoped>
.writing-stats {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.stats-header h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.stats-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.stats-section {
  margin-bottom: 24px;
}

.stats-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
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

.reading-time {
  text-align: center;
  padding: 20px;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #b3d8ff;
}

.time-display {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.analysis-item label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.analysis-item span {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.word-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

.word-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.word {
  font-weight: 500;
  color: #303133;
}

.count {
  font-weight: 600;
  color: #409eff;
  background: #ecf5ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.goal-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.goal-label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.goal-progress {
  font-weight: 600;
  color: #409eff;
  font-size: 14px;
}

.streak-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.streak-current,
.streak-longest {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.streak-number {
  font-size: 32px;
  font-weight: 600;
  color: #67c23a;
  margin-bottom: 8px;
}

.streak-label {
  font-size: 14px;
  color: #909399;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.insights-grid,
.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.insight-item,
.style-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.insight-item label,
.style-item label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.insight-item span,
.style-item span {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}
</style>