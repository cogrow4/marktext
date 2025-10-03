const { ipcMain } = require('electron')
const simpleGit = require('simple-git')
const path = require('path')
const fs = require('fs-extra')

class GitService {
  constructor() {
    this.gitInstances = new Map()
    this.setupIpcHandlers()
  }

  setupIpcHandlers() {
    // Initialize git repository
    ipcMain.handle('git-init', async (event, projectPath) => {
      try {
        const git = simpleGit(projectPath)
        const isRepo = await git.checkIsRepo()
        
        if (!isRepo) {
          await git.init()
          await git.addConfig('user.name', 'NovelCraft User')
          await git.addConfig('user.email', 'user@novelcraft.app')
          
          // Create initial commit
          await git.add('.')
          await git.commit('Initial commit - NovelCraft project')
        }
        
        this.gitInstances.set(projectPath, git)
        return { success: true, message: 'Git repository initialized' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Get git status
    ipcMain.handle('git-status', async (event, projectPath) => {
      try {
        const git = this.getGitInstance(projectPath)
        const status = await git.status()
        return { success: true, status }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Commit changes
    ipcMain.handle('git-commit', async (event, projectPath, message, files = []) => {
      try {
        const git = this.getGitInstance(projectPath)
        
        if (files.length > 0) {
          await git.add(files)
        } else {
          await git.add('.')
        }
        
        const commit = await git.commit(message)
        return { success: true, commit }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Get commit history
    ipcMain.handle('git-log', async (event, projectPath, options = {}) => {
      try {
        const git = this.getGitInstance(projectPath)
        const log = await git.log({
          maxCount: options.maxCount || 50,
          from: options.from,
          to: options.to
        })
        return { success: true, log: log.all }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Create branch
    ipcMain.handle('git-branch-create', async (event, projectPath, branchName) => {
      try {
        const git = this.getGitInstance(projectPath)
        await git.checkoutLocalBranch(branchName)
        return { success: true, message: `Branch '${branchName}' created` }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Switch branch
    ipcMain.handle('git-branch-switch', async (event, projectPath, branchName) => {
      try {
        const git = this.getGitInstance(projectPath)
        await git.checkout(branchName)
        return { success: true, message: `Switched to branch '${branchName}'` }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Get branches
    ipcMain.handle('git-branches', async (event, projectPath) => {
      try {
        const git = this.getGitInstance(projectPath)
        const branches = await git.branch()
        return { success: true, branches: branches.all }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Show diff
    ipcMain.handle('git-diff', async (event, projectPath, options = {}) => {
      try {
        const git = this.getGitInstance(projectPath)
        const diff = await git.diff(options)
        return { success: true, diff }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Revert changes
    ipcMain.handle('git-revert', async (event, projectPath, commitHash) => {
      try {
        const git = this.getGitInstance(projectPath)
        await git.revert(commitHash)
        return { success: true, message: 'Changes reverted' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Auto-commit on save (configurable)
    ipcMain.handle('git-auto-commit', async (event, projectPath, filePath, message) => {
      try {
        const git = this.getGitInstance(projectPath)
        await git.add(filePath)
        await git.commit(message || `Auto-save: ${path.basename(filePath)}`)
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Get file history
    ipcMain.handle('git-file-history', async (event, projectPath, filePath) => {
      try {
        const git = this.getGitInstance(projectPath)
        const log = await git.log({ file: filePath })
        return { success: true, history: log.all }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Create tag
    ipcMain.handle('git-tag', async (event, projectPath, tagName, message) => {
      try {
        const git = this.getGitInstance(projectPath)
        await git.addAnnotatedTag(tagName, message || `Tag: ${tagName}`)
        return { success: true, message: `Tag '${tagName}' created` }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Get tags
    ipcMain.handle('git-tags', async (event, projectPath) => {
      try {
        const git = this.getGitInstance(projectPath)
        const tags = await git.tags()
        return { success: true, tags: tags.all }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })
  }

  getGitInstance(projectPath) {
    if (!this.gitInstances.has(projectPath)) {
      this.gitInstances.set(projectPath, simpleGit(projectPath))
    }
    return this.gitInstances.get(projectPath)
  }

  // Clean up git instances when projects are closed
  removeGitInstance(projectPath) {
    this.gitInstances.delete(projectPath)
  }
}

module.exports = GitService