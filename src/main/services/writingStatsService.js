const { ipcMain } = require('electron')
const wordCount = require('word-count')
const readingTime = require('reading-time')
const natural = require('natural')
const moment = require('moment')

class WritingStatsService {
  constructor() {
    this.setupIpcHandlers()
  }

  setupIpcHandlers() {
    // Get word count and reading time
    ipcMain.handle('stats-get-basic', async (event, content) => {
      try {
        const stats = {
          wordCount: wordCount(content),
          characterCount: content.length,
          characterCountNoSpaces: content.replace(/\s/g, '').length,
          paragraphCount: content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
          sentenceCount: this.countSentences(content),
          readingTime: readingTime(content).text,
          readingTimeMinutes: readingTime(content).minutes
        }
        
        return { success: true, stats }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Get advanced writing statistics
    ipcMain.handle('stats-get-advanced', async (event, content) => {
      try {
        const words = content.toLowerCase().match(/\b\w+\b/g) || []
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
        
        const stats = {
          averageWordsPerSentence: words.length / sentences.length || 0,
          averageCharactersPerWord: content.replace(/\s/g, '').length / words.length || 0,
          mostUsedWords: this.getMostUsedWords(words, 20),
          readabilityScore: this.calculateReadability(content),
          passiveVoiceCount: this.countPassiveVoice(content),
          adverbCount: this.countAdverbs(content),
          dialoguePercentage: this.calculateDialoguePercentage(content),
          uniqueWords: new Set(words).size,
          totalWords: words.length,
          lexicalDiversity: new Set(words).size / words.length || 0
        }
        
        return { success: true, stats }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Get writing goals progress
    ipcMain.handle('stats-get-goals-progress', async (event, projectPath, currentWordCount) => {
      try {
        // This would typically fetch from database
        const goals = {
          daily: 1000,
          weekly: 7000,
          monthly: 30000,
          total: 80000
        }
        
        const progress = {
          daily: Math.min((currentWordCount / goals.daily) * 100, 100),
          weekly: Math.min((currentWordCount / goals.weekly) * 100, 100),
          monthly: Math.min((currentWordCount / goals.monthly) * 100, 100),
          total: Math.min((currentWordCount / goals.total) * 100, 100)
        }
        
        return { success: true, goals, progress }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Get writing streak
    ipcMain.handle('stats-get-streak', async (event, projectPath) => {
      try {
        // This would typically fetch from database
        const streak = {
          current: 5,
          longest: 23,
          lastWriteDate: moment().subtract(1, 'day').format('YYYY-MM-DD')
        }
        
        return { success: true, streak }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Get productivity insights
    ipcMain.handle('stats-get-productivity', async (event, projectPath, dateRange) => {
      try {
        const insights = {
          bestWritingTime: '10:00 AM - 12:00 PM',
          averageSessionLength: 45,
          wordsPerHour: 1200,
          mostProductiveDay: 'Tuesday',
          consistencyScore: 85
        }
        
        return { success: true, insights }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Analyze writing style
    ipcMain.handle('stats-analyze-style', async (event, content) => {
      try {
        const analysis = {
          tone: this.analyzeTone(content),
          complexity: this.analyzeComplexity(content),
          pacing: this.analyzePacing(content),
          dialogueStyle: this.analyzeDialogueStyle(content),
          descriptionLevel: this.analyzeDescriptionLevel(content)
        }
        
        return { success: true, analysis }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Get chapter statistics
    ipcMain.handle('stats-get-chapter-stats', async (event, chapters) => {
      try {
        const stats = chapters.map((chapter, index) => {
          const wordCount = wordCount(chapter.content)
          const readingTime = readingTime(chapter.content)
          
          return {
            chapter: index + 1,
            title: chapter.title,
            wordCount,
            readingTime: readingTime.text,
            readingTimeMinutes: readingTime.minutes,
            averageWordsPerSentence: this.getAverageWordsPerSentence(chapter.content),
            dialoguePercentage: this.calculateDialoguePercentage(chapter.content)
          }
        })
        
        return { success: true, stats }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })
  }

  countSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  }

  getMostUsedWords(words, limit = 20) {
    const wordCount = {}
    words.forEach(word => {
      if (word.length > 3) { // Ignore short words
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    })
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([word, count]) => ({ word, count }))
  }

  calculateReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = text.match(/\b\w+\b/g) || []
    const syllables = words.reduce((total, word) => total + this.countSyllables(word), 0)
    
    // Flesch Reading Ease Score
    const score = 206.835 - (1.015 * (words.length / sentences.length)) - (84.6 * (syllables / words.length))
    
    return {
      score: Math.round(score),
      level: this.getReadabilityLevel(score)
    }
  }

  countSyllables(word) {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    
    const vowels = 'aeiouy'
    let count = 0
    let previousWasVowel = false
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i])
      if (isVowel && !previousWasVowel) count++
      previousWasVowel = isVowel
    }
    
    if (word.endsWith('e')) count--
    return Math.max(1, count)
  }

  getReadabilityLevel(score) {
    if (score >= 90) return 'Very Easy'
    if (score >= 80) return 'Easy'
    if (score >= 70) return 'Fairly Easy'
    if (score >= 60) return 'Standard'
    if (score >= 50) return 'Fairly Difficult'
    if (score >= 30) return 'Difficult'
    return 'Very Difficult'
  }

  countPassiveVoice(text) {
    const passivePatterns = [
      /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/g,
      /\b(am|is|are|was|were|be|been|being)\s+\w+en\b/g
    ]
    
    let count = 0
    passivePatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) count += matches.length
    })
    
    return count
  }

  countAdverbs(text) {
    const adverbPattern = /\b\w+ly\b/g
    const matches = text.match(adverbPattern)
    return matches ? matches.length : 0
  }

  calculateDialoguePercentage(text) {
    const dialoguePattern = /"[^"]*"/g
    const dialogueMatches = text.match(dialoguePattern)
    const dialogueLength = dialogueMatches ? dialogueMatches.join('').length : 0
    
    return Math.round((dialogueLength / text.length) * 100)
  }

  getAverageWordsPerSentence(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = text.match(/\b\w+\b/g) || []
    return Math.round((words.length / sentences.length) * 10) / 10
  }

  analyzeTone(text) {
    // Simple tone analysis based on word patterns
    const positiveWords = ['happy', 'joy', 'love', 'beautiful', 'wonderful', 'amazing']
    const negativeWords = ['sad', 'angry', 'hate', 'terrible', 'awful', 'horrible']
    const neutralWords = ['said', 'went', 'came', 'looked', 'thought']
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || []
    const positiveCount = words.filter(word => positiveWords.includes(word)).length
    const negativeCount = words.filter(word => negativeWords.includes(word)).length
    
    if (positiveCount > negativeCount) return 'Positive'
    if (negativeCount > positiveCount) return 'Negative'
    return 'Neutral'
  }

  analyzeComplexity(text) {
    const words = text.match(/\b\w+\b/g) || []
    const longWords = words.filter(word => word.length > 6).length
    const complexity = (longWords / words.length) * 100
    
    if (complexity > 20) return 'High'
    if (complexity > 10) return 'Medium'
    return 'Low'
  }

  analyzePacing(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgLength = sentences.reduce((sum, sentence) => sum + sentence.length, 0) / sentences.length
    
    if (avgLength > 100) return 'Slow'
    if (avgLength > 50) return 'Medium'
    return 'Fast'
  }

  analyzeDialogueStyle(text) {
    const dialoguePattern = /"[^"]*"/g
    const dialogueMatches = text.match(dialoguePattern) || []
    const avgDialogueLength = dialogueMatches.reduce((sum, dialogue) => sum + dialogue.length, 0) / dialogueMatches.length
    
    if (avgDialogueLength > 50) return 'Verbose'
    if (avgDialogueLength > 25) return 'Balanced'
    return 'Concise'
  }

  analyzeDescriptionLevel(text) {
    const descriptiveWords = text.match(/\b(beautiful|gorgeous|stunning|magnificent|breathtaking|vivid|detailed|elaborate)\b/gi) || []
    const level = descriptiveWords.length / (text.match(/\b\w+\b/g) || []).length * 100
    
    if (level > 2) return 'High'
    if (level > 1) return 'Medium'
    return 'Low'
  }
}

module.exports = WritingStatsService