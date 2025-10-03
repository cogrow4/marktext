const { ipcMain } = require('electron')

class FindReplaceService {
  constructor() {
    this.setupIpcHandlers()
  }

  setupIpcHandlers() {
    // Basic find and replace
    ipcMain.handle('find-replace-basic', async (event, content, searchTerm, replaceTerm, options = {}) => {
      try {
        const { caseSensitive = false, wholeWord = false, regex = false } = options
        
        let searchPattern
        if (regex) {
          searchPattern = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi')
        } else {
          let escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          if (wholeWord) {
            escapedTerm = `\\b${escapedTerm}\\b`
          }
          searchPattern = new RegExp(escapedTerm, caseSensitive ? 'g' : 'gi')
        }
        
        const newContent = content.replace(searchPattern, replaceTerm)
        const matches = [...content.matchAll(searchPattern)]
        
        return {
          success: true,
          newContent,
          matchCount: matches.length,
          matches: matches.map(match => ({
            text: match[0],
            index: match.index,
            length: match[0].length
          }))
        }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Find all matches with context
    ipcMain.handle('find-all-matches', async (event, content, searchTerm, options = {}) => {
      try {
        const { caseSensitive = false, wholeWord = false, regex = false, contextLines = 2 } = options
        
        let searchPattern
        if (regex) {
          searchPattern = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi')
        } else {
          let escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          if (wholeWord) {
            escapedTerm = `\\b${escapedTerm}\\b`
          }
          searchPattern = new RegExp(escapedTerm, caseSensitive ? 'g' : 'gi')
        }
        
        const lines = content.split('\n')
        const matches = []
        
        lines.forEach((line, lineIndex) => {
          const lineMatches = [...line.matchAll(searchPattern)]
          lineMatches.forEach(match => {
            const startLine = Math.max(0, lineIndex - contextLines)
            const endLine = Math.min(lines.length - 1, lineIndex + contextLines)
            const context = lines.slice(startLine, endLine + 1).join('\n')
            
            matches.push({
              line: lineIndex + 1,
              column: match.index + 1,
              text: match[0],
              context,
              fullLine: line
            })
          })
        })
        
        return { success: true, matches }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Advanced find and replace with multiple patterns
    ipcMain.handle('find-replace-advanced', async (event, content, patterns) => {
      try {
        let newContent = content
        const results = []
        
        for (const pattern of patterns) {
          const { search, replace, options = {} } = pattern
          const { caseSensitive = false, wholeWord = false, regex = false } = options
          
          let searchPattern
          if (regex) {
            searchPattern = new RegExp(search, caseSensitive ? 'g' : 'gi')
          } else {
            let escapedTerm = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            if (wholeWord) {
              escapedTerm = `\\b${escapedTerm}\\b`
            }
            searchPattern = new RegExp(escapedTerm, caseSensitive ? 'g' : 'gi')
          }
          
          const beforeCount = (newContent.match(searchPattern) || []).length
          newContent = newContent.replace(searchPattern, replace)
          const afterCount = (newContent.match(searchPattern) || []).length
          
          results.push({
            search,
            replace,
            matchesReplaced: beforeCount - afterCount,
            remainingMatches: afterCount
          })
        }
        
        return { success: true, newContent, results }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Find and replace in specific sections
    ipcMain.handle('find-replace-sections', async (event, content, searchTerm, replaceTerm, sections, options = {}) => {
      try {
        const { caseSensitive = false, wholeWord = false, regex = false } = options
        
        let searchPattern
        if (regex) {
          searchPattern = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi')
        } else {
          let escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          if (wholeWord) {
            escapedTerm = `\\b${escapedTerm}\\b`
          }
          searchPattern = new RegExp(escapedTerm, caseSensitive ? 'g' : 'gi')
        }
        
        const lines = content.split('\n')
        let newContent = content
        const results = []
        
        sections.forEach(section => {
          const { startLine, endLine } = section
          const sectionContent = lines.slice(startLine - 1, endLine).join('\n')
          const matches = [...sectionContent.matchAll(searchPattern)]
          
          if (matches.length > 0) {
            const newSectionContent = sectionContent.replace(searchPattern, replaceTerm)
            lines.splice(startLine - 1, endLine - startLine + 1, ...newSectionContent.split('\n'))
            newContent = lines.join('\n')
            
            results.push({
              section: `${startLine}-${endLine}`,
              matchesReplaced: matches.length
            })
          }
        })
        
        return { success: true, newContent, results }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Find similar words (fuzzy search)
    ipcMain.handle('find-similar-words', async (event, content, searchTerm, threshold = 0.8) => {
      try {
        const words = content.match(/\b\w+\b/g) || []
        const similarWords = []
        
        words.forEach(word => {
          const similarity = this.calculateSimilarity(searchTerm.toLowerCase(), word.toLowerCase())
          if (similarity >= threshold && word.toLowerCase() !== searchTerm.toLowerCase()) {
            similarWords.push({
              word,
              similarity: Math.round(similarity * 100) / 100
            })
          }
        })
        
        // Remove duplicates and sort by similarity
        const uniqueWords = [...new Map(similarWords.map(item => [item.word, item])).values()]
          .sort((a, b) => b.similarity - a.similarity)
        
        return { success: true, similarWords: uniqueWords }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Find overused words
    ipcMain.handle('find-overused-words', async (event, content, threshold = 5) => {
      try {
        const words = content.toLowerCase().match(/\b\w+\b/g) || []
        const wordCount = {}
        
        // Count word frequency
        words.forEach(word => {
          if (word.length > 3) { // Ignore short words
            wordCount[word] = (wordCount[word] || 0) + 1
          }
        })
        
        // Find overused words
        const overusedWords = Object.entries(wordCount)
          .filter(([, count]) => count >= threshold)
          .sort(([,a], [,b]) => b - a)
          .map(([word, count]) => ({ word, count }))
        
        return { success: true, overusedWords }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Find and replace with character/place references
    ipcMain.handle('find-replace-references', async (event, content, references) => {
      try {
        let newContent = content
        const results = []
        
        references.forEach(ref => {
          const { type, oldName, newName, options = {} } = ref
          const { caseSensitive = false, wholeWord = true } = options
          
          let searchPattern
          if (wholeWord) {
            const escapedName = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            searchPattern = new RegExp(`\\b${escapedName}\\b`, caseSensitive ? 'g' : 'gi')
          } else {
            const escapedName = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            searchPattern = new RegExp(escapedName, caseSensitive ? 'g' : 'gi')
          }
          
          const matches = [...newContent.matchAll(searchPattern)]
          newContent = newContent.replace(searchPattern, newName)
          
          results.push({
            type,
            oldName,
            newName,
            matchesReplaced: matches.length
          })
        })
        
        return { success: true, newContent, results }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Find inconsistencies in formatting
    ipcMain.handle('find-formatting-inconsistencies', async (event, content) => {
      try {
        const inconsistencies = []
        
        // Check for inconsistent dialogue formatting
        const dialoguePatterns = [
          /"[^"]*"/g,
          /'[^']*'/g,
          /"[^"]*'/g,
          /'[^']*"/g
        ]
        
        dialoguePatterns.forEach((pattern, index) => {
          const matches = content.match(pattern) || []
          if (matches.length > 0) {
            inconsistencies.push({
              type: 'dialogue',
              pattern: index,
              count: matches.length,
              examples: matches.slice(0, 3)
            })
          }
        })
        
        // Check for inconsistent spacing
        const spacingIssues = [
          { pattern: /  +/g, type: 'multiple-spaces' },
          { pattern: /\t/g, type: 'tabs' },
          { pattern: /[ \t]+$/gm, type: 'trailing-whitespace' }
        ]
        
        spacingIssues.forEach(({ pattern, type }) => {
          const matches = content.match(pattern) || []
          if (matches.length > 0) {
            inconsistencies.push({
              type,
              count: matches.length,
              examples: matches.slice(0, 3)
            })
          }
        })
        
        return { success: true, inconsistencies }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })
  }

  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  levenshteinDistance(str1, str2) {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }
}

module.exports = FindReplaceService