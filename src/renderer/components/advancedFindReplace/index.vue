<template>
  <div class="advanced-find-replace">
    <div class="find-replace-header">
      <h3>Advanced Find & Replace</h3>
    </div>

    <div class="find-replace-content">
      <!-- Basic Find & Replace -->
      <div class="section">
        <h4>Find & Replace</h4>
        <div class="input-group">
          <div class="input-row">
            <label>Find:</label>
            <el-input
              v-model="searchTerm"
              placeholder="Enter search term"
              @keyup.enter="findAllMatches"
            />
          </div>
          <div class="input-row">
            <label>Replace:</label>
            <el-input
              v-model="replaceTerm"
              placeholder="Enter replacement text"
            />
          </div>
        </div>
        
        <div class="options-row">
          <el-checkbox v-model="options.caseSensitive">Case Sensitive</el-checkbox>
          <el-checkbox v-model="options.wholeWord">Whole Word</el-checkbox>
          <el-checkbox v-model="options.regex">Regular Expression</el-checkbox>
        </div>
        
        <div class="actions-row">
          <el-button type="primary" @click="findAllMatches" :loading="searching">
            <i class="el-icon-search"></i> Find All
          </el-button>
          <el-button type="success" @click="replaceAll" :loading="replacing">
            <i class="el-icon-refresh"></i> Replace All
          </el-button>
          <el-button @click="clearResults">
            <i class="el-icon-delete"></i> Clear
          </el-button>
        </div>
      </div>

      <!-- Search Results -->
      <div class="section" v-if="searchResults.length > 0">
        <h4>Search Results ({{ searchResults.length }} matches)</h4>
        <div class="results-list">
          <div
            v-for="(result, index) in searchResults"
            :key="index"
            class="result-item"
            @click="goToMatch(result)"
          >
            <div class="result-line">Line {{ result.line }}</div>
            <div class="result-context">{{ result.context }}</div>
            <div class="result-match">{{ result.text }}</div>
          </div>
        </div>
      </div>

      <!-- Advanced Features -->
      <div class="section">
        <h4>Advanced Features</h4>
        
        <!-- Similar Words -->
        <div class="feature-group">
          <h5>Find Similar Words</h5>
          <div class="input-row">
            <el-input
              v-model="similarWordQuery"
              placeholder="Enter word to find similar words"
              @keyup.enter="findSimilarWords"
            />
            <el-button @click="findSimilarWords" :loading="findingSimilar">
              Find Similar
            </el-button>
          </div>
          <div v-if="similarWords.length > 0" class="similar-words">
            <div
              v-for="word in similarWords"
              :key="word.word"
              class="similar-word-item"
              @click="selectSimilarWord(word.word)"
            >
              <span class="word">{{ word.word }}</span>
              <span class="similarity">{{ Math.round(word.similarity * 100) }}%</span>
            </div>
          </div>
        </div>

        <!-- Overused Words -->
        <div class="feature-group">
          <h5>Overused Words</h5>
          <div class="input-row">
            <el-input-number
              v-model="overuseThreshold"
              :min="1"
              :max="100"
              placeholder="Threshold"
            />
            <el-button @click="findOverusedWords" :loading="findingOverused">
              Find Overused
            </el-button>
          </div>
          <div v-if="overusedWords.length > 0" class="overused-words">
            <div
              v-for="word in overusedWords"
              :key="word.word"
              class="overused-word-item"
              @click="selectOverusedWord(word.word)"
            >
              <span class="word">{{ word.word }}</span>
              <span class="count">{{ word.count }} times</span>
            </div>
          </div>
        </div>

        <!-- Formatting Issues -->
        <div class="feature-group">
          <h5>Formatting Issues</h5>
          <el-button @click="findFormattingIssues" :loading="findingIssues">
            Check Formatting
          </el-button>
          <div v-if="formattingIssues.length > 0" class="formatting-issues">
            <div
              v-for="(issue, index) in formattingIssues"
              :key="index"
              class="issue-item"
            >
              <div class="issue-type">{{ issue.type }}</div>
              <div class="issue-count">{{ issue.count }} instances</div>
              <div class="issue-examples">
                <span v-for="example in issue.examples" :key="example" class="example">
                  "{{ example }}"
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Character/Place References -->
      <div class="section">
        <h4>Character & Place References</h4>
        <div class="references-grid">
          <div class="reference-group">
            <h5>Character References</h5>
            <div class="reference-list">
              <div
                v-for="character in characters"
                :key="character.id"
                class="reference-item"
              >
                <el-input
                  v-model="character.newName"
                  :placeholder="`Rename "${character.oldName}"`"
                  size="small"
                />
              </div>
            </div>
          </div>
          
          <div class="reference-group">
            <h5>Place References</h5>
            <div class="reference-list">
              <div
                v-for="place in places"
                :key="place.id"
                class="reference-item"
              >
                <el-input
                  v-model="place.newName"
                  :placeholder="`Rename "${place.oldName}"`"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="actions-row">
          <el-button type="warning" @click="replaceReferences" :loading="replacingReferences">
            <i class="el-icon-refresh"></i> Replace All References
          </el-button>
        </div>
      </div>

      <!-- Multiple Patterns -->
      <div class="section">
        <h4>Multiple Patterns</h4>
        <div class="patterns-list">
          <div
            v-for="(pattern, index) in patterns"
            :key="index"
            class="pattern-item"
          >
            <div class="pattern-inputs">
              <el-input
                v-model="pattern.search"
                placeholder="Search term"
                size="small"
              />
              <el-input
                v-model="pattern.replace"
                placeholder="Replace with"
                size="small"
              />
            </div>
            <div class="pattern-options">
              <el-checkbox v-model="pattern.options.caseSensitive">Case</el-checkbox>
              <el-checkbox v-model="pattern.options.wholeWord">Whole Word</el-checkbox>
              <el-checkbox v-model="pattern.options.regex">Regex</el-checkbox>
            </div>
            <el-button
              type="danger"
              size="mini"
              @click="removePattern(index)"
              icon="el-icon-delete"
            />
          </div>
        </div>
        
        <div class="actions-row">
          <el-button @click="addPattern">
            <i class="el-icon-plus"></i> Add Pattern
          </el-button>
          <el-button type="primary" @click="replaceMultiplePatterns" :loading="replacingMultiple">
            <i class="el-icon-refresh"></i> Replace All Patterns
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'AdvancedFindReplace',
  data() {
    return {
      searchTerm: '',
      replaceTerm: '',
      options: {
        caseSensitive: false,
        wholeWord: false,
        regex: false
      },
      searchResults: [],
      searching: false,
      replacing: false,
      
      // Similar words
      similarWordQuery: '',
      similarWords: [],
      findingSimilar: false,
      
      // Overused words
      overuseThreshold: 5,
      overusedWords: [],
      findingOverused: false,
      
      // Formatting issues
      formattingIssues: [],
      findingIssues: false,
      
      // References
      characters: [],
      places: [],
      replacingReferences: false,
      
      // Multiple patterns
      patterns: [
        {
          search: '',
          replace: '',
          options: {
            caseSensitive: false,
            wholeWord: false,
            regex: false
          }
        }
      ],
      replacingMultiple: false
    }
  },
  mounted() {
    this.loadReferences()
  },
  methods: {
    async findAllMatches() {
      if (!this.searchTerm) {
        this.$message.warning('Please enter a search term')
        return
      }
      
      this.searching = true
      try {
        const content = this.getCurrentContent()
        const result = await ipcRenderer.invoke('find-all-matches', content, this.searchTerm, this.options)
        
        if (result.success) {
          this.searchResults = result.matches
          this.$message.success(`Found ${result.matches.length} matches`)
        } else {
          this.$message.error('Search failed: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error searching: ' + error.message)
      } finally {
        this.searching = false
      }
    },
    
    async replaceAll() {
      if (!this.searchTerm) {
        this.$message.warning('Please enter a search term')
        return
      }
      
      this.replacing = true
      try {
        const content = this.getCurrentContent()
        const result = await ipcRenderer.invoke('find-replace-basic', content, this.searchTerm, this.replaceTerm, this.options)
        
        if (result.success) {
          this.updateContent(result.newContent)
          this.$message.success(`Replaced ${result.matchCount} matches`)
          this.searchResults = []
        } else {
          this.$message.error('Replace failed: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error replacing: ' + error.message)
      } finally {
        this.replacing = false
      }
    },
    
    async findSimilarWords() {
      if (!this.similarWordQuery) {
        this.$message.warning('Please enter a word to find similar words')
        return
      }
      
      this.findingSimilar = true
      try {
        const content = this.getCurrentContent()
        const result = await ipcRenderer.invoke('find-similar-words', content, this.similarWordQuery)
        
        if (result.success) {
          this.similarWords = result.similarWords
        } else {
          this.$message.error('Failed to find similar words: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error finding similar words: ' + error.message)
      } finally {
        this.findingSimilar = false
      }
    },
    
    async findOverusedWords() {
      this.findingOverused = true
      try {
        const content = this.getCurrentContent()
        const result = await ipcRenderer.invoke('find-overused-words', content, this.overuseThreshold)
        
        if (result.success) {
          this.overusedWords = result.overusedWords
        } else {
          this.$message.error('Failed to find overused words: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error finding overused words: ' + error.message)
      } finally {
        this.findingOverused = false
      }
    },
    
    async findFormattingIssues() {
      this.findingIssues = true
      try {
        const content = this.getCurrentContent()
        const result = await ipcRenderer.invoke('find-formatting-inconsistencies', content)
        
        if (result.success) {
          this.formattingIssues = result.inconsistencies
        } else {
          this.$message.error('Failed to find formatting issues: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error finding formatting issues: ' + error.message)
      } finally {
        this.findingIssues = false
      }
    },
    
    async replaceReferences() {
      const references = []
      
      this.characters.forEach(char => {
        if (char.newName && char.newName !== char.oldName) {
          references.push({
            type: 'character',
            oldName: char.oldName,
            newName: char.newName
          })
        }
      })
      
      this.places.forEach(place => {
        if (place.newName && place.newName !== place.oldName) {
          references.push({
            type: 'place',
            oldName: place.oldName,
            newName: place.newName
          })
        }
      })
      
      if (references.length === 0) {
        this.$message.warning('No references to replace')
        return
      }
      
      this.replacingReferences = true
      try {
        const content = this.getCurrentContent()
        const result = await ipcRenderer.invoke('find-replace-references', content, references)
        
        if (result.success) {
          this.updateContent(result.newContent)
          this.$message.success(`Replaced ${result.results.length} reference types`)
        } else {
          this.$message.error('Failed to replace references: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error replacing references: ' + error.message)
      } finally {
        this.replacingReferences = false
      }
    },
    
    async replaceMultiplePatterns() {
      const validPatterns = this.patterns.filter(p => p.search && p.replace)
      
      if (validPatterns.length === 0) {
        this.$message.warning('Please add at least one valid pattern')
        return
      }
      
      this.replacingMultiple = true
      try {
        const content = this.getCurrentContent()
        const result = await ipcRenderer.invoke('find-replace-advanced', content, validPatterns)
        
        if (result.success) {
          this.updateContent(result.newContent)
          this.$message.success(`Applied ${result.results.length} patterns`)
        } else {
          this.$message.error('Failed to replace patterns: ' + result.error)
        }
      } catch (error) {
        this.$message.error('Error replacing patterns: ' + error.message)
      } finally {
        this.replacingMultiple = false
      }
    },
    
    selectSimilarWord(word) {
      this.searchTerm = word
      this.findAllMatches()
    },
    
    selectOverusedWord(word) {
      this.searchTerm = word
      this.findAllMatches()
    },
    
    goToMatch(match) {
      // This should navigate to the specific line in the editor
      // You'll need to implement this based on your editor integration
      this.$emit('go-to-line', match.line, match.column)
    },
    
    clearResults() {
      this.searchResults = []
      this.similarWords = []
      this.overusedWords = []
      this.formattingIssues = []
    },
    
    addPattern() {
      this.patterns.push({
        search: '',
        replace: '',
        options: {
          caseSensitive: false,
          wholeWord: false,
          regex: false
        }
      })
    },
    
    removePattern(index) {
      this.patterns.splice(index, 1)
    },
    
    async loadReferences() {
      try {
        // Load characters and places for reference replacement
        const [charResult, placeResult] = await Promise.all([
          ipcRenderer.invoke('db-get-characters', this.getProjectPath()),
          ipcRenderer.invoke('db-get-places', this.getProjectPath())
        ])
        
        if (charResult.success) {
          this.characters = charResult.characters.map(char => ({
            id: char.id,
            oldName: char.name,
            newName: char.name
          }))
        }
        
        if (placeResult.success) {
          this.places = placeResult.places.map(place => ({
            id: place.id,
            oldName: place.name,
            newName: place.name
          }))
        }
      } catch (error) {
        console.error('Error loading references:', error)
      }
    },
    
    getCurrentContent() {
      return this.$store.state.editor.currentContent || ''
    },
    
    updateContent(newContent) {
      // This should update the editor content
      // You'll need to implement this based on your editor integration
      this.$emit('update-content', newContent)
    },
    
    getProjectPath() {
      return this.$store.state.project.currentPath || ''
    }
  }
}
</script>

<style scoped>
.advanced-find-replace {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.find-replace-header {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.find-replace-header h3 {
  margin: 0;
  color: #303133;
}

.find-replace-content {
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

.input-group {
  margin-bottom: 16px;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.input-row label {
  min-width: 80px;
  font-weight: 500;
  color: #606266;
}

.input-row .el-input {
  flex: 1;
}

.options-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.actions-row {
  display: flex;
  gap: 8px;
}

.results-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
}

.result-item {
  padding: 12px;
  border-bottom: 1px solid #e4e7ed;
  cursor: pointer;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: #f5f7fa;
}

.result-item:last-child {
  border-bottom: none;
}

.result-line {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.result-context {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.result-match {
  font-weight: 600;
  color: #409eff;
  background: #ecf5ff;
  padding: 2px 4px;
  border-radius: 4px;
  display: inline-block;
}

.feature-group {
  margin-bottom: 20px;
}

.feature-group h5 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
}

.similar-words,
.overused-words {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.similar-word-item,
.overused-word-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.similar-word-item:hover,
.overused-word-item:hover {
  background-color: #e1f3ff;
}

.word {
  font-weight: 500;
  color: #303133;
}

.similarity,
.count {
  font-size: 12px;
  color: #409eff;
  background: #ecf5ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.formatting-issues {
  margin-top: 12px;
}

.issue-item {
  padding: 12px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 6px;
  margin-bottom: 8px;
}

.issue-type {
  font-weight: 600;
  color: #d46b08;
  margin-bottom: 4px;
}

.issue-count {
  font-size: 12px;
  color: #8c4a00;
  margin-bottom: 8px;
}

.issue-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.example {
  font-size: 12px;
  color: #8c4a00;
  background: #fff2e8;
  padding: 2px 6px;
  border-radius: 4px;
}

.references-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.reference-group h5 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
}

.reference-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reference-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.patterns-list {
  margin-bottom: 16px;
}

.pattern-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  margin-bottom: 8px;
}

.pattern-inputs {
  display: flex;
  gap: 8px;
  flex: 1;
}

.pattern-inputs .el-input {
  flex: 1;
}

.pattern-options {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
</style>