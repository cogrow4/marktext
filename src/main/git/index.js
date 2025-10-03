import git from 'isomorphic-git'
import fs from 'fs-extra'
import path from 'path'
import { ipcMain } from 'electron'
import log from 'electron-log'

class GitService {
  constructor () {
    this.setupIpcHandlers()
  }

  setupIpcHandlers () {
    // Git status
    ipcMain.handle('git::status', async (event, { dir }) => {
      try {
        const status = await this.getStatus(dir)
        return { success: true, data: status }
      } catch (error) {
        log.error('Git status error:', error)
        return { success: false, error: error.message }
      }
    })

    // Git init
    ipcMain.handle('git::init', async (event, { dir }) => {
      try {
        await git.init({ fs, dir, defaultBranch: 'main' })
        return { success: true }
      } catch (error) {
        log.error('Git init error:', error)
        return { success: false, error: error.message }
      }
    })

    // Git add
    ipcMain.handle('git::add', async (event, { dir, filepath }) => {
      try {
        await git.add({ fs, dir, filepath })
        return { success: true }
      } catch (error) {
        log.error('Git add error:', error)
        return { success: false, error: error.message }
      }
    })

    // Git commit
    ipcMain.handle('git::commit', async (event, { dir, message, author }) => {
      try {
        const sha = await git.commit({
          fs,
          dir,
          message,
          author: {
            name: author.name || 'NovelWriter',
            email: author.email || 'writer@novelwriter.local'
          }
        })
        return { success: true, data: sha }
      } catch (error) {
        log.error('Git commit error:', error)
        return { success: false, error: error.message }
      }
    })

    // Git log
    ipcMain.handle('git::log', async (event, { dir, depth = 10 }) => {
      try {
        const commits = await git.log({ fs, dir, depth })
        return { success: true, data: commits }
      } catch (error) {
        log.error('Git log error:', error)
        return { success: false, error: error.message }
      }
    })

    // Git branch list
    ipcMain.handle('git::listBranches', async (event, { dir }) => {
      try {
        const branches = await git.listBranches({ fs, dir })
        return { success: true, data: branches }
      } catch (error) {
        log.error('Git list branches error:', error)
        return { success: false, error: error.message }
      }
    })

    // Git checkout branch
    ipcMain.handle('git::checkout', async (event, { dir, ref }) => {
      try {
        await git.checkout({ fs, dir, ref })
        return { success: true }
      } catch (error) {
        log.error('Git checkout error:', error)
        return { success: false, error: error.message }
      }
    })

    // Git create branch
    ipcMain.handle('git::branch', async (event, { dir, ref, checkout = false }) => {
      try {
        await git.branch({ fs, dir, ref, checkout })
        return { success: true }
      } catch (error) {
        log.error('Git branch error:', error)
        return { success: false, error: error.message }
      }
    })

    // Git push
    ipcMain.handle('git::push', async (event, { dir, remote, remoteRef, corsProxy }) => {
      try {
        await git.push({
          fs,
          dir,
          remote: remote || 'origin',
          remoteRef: remoteRef || 'main',
          corsProxy: corsProxy || 'https://cors.isomorphic-git.org'
        })
        return { success: true }
      } catch (error) {
        log.error('Git push error:', error)
        return { success: false, error: error.message }
      }
    })

    // Git pull
    ipcMain.handle('git::pull', async (event, { dir, remote, remoteRef, corsProxy, author }) => {
      try {
        await git.pull({
          fs,
          dir,
          remote: remote || 'origin',
          remoteRef: remoteRef || 'main',
          corsProxy: corsProxy || 'https://cors.isomorphic-git.org',
          author: {
            name: author?.name || 'NovelWriter',
            email: author?.email || 'writer@novelwriter.local'
          }
        })
        return { success: true }
      } catch (error) {
        log.error('Git pull error:', error)
        return { success: false, error: error.message }
      }
    })

    // Git diff
    ipcMain.handle('git::diff', async (event, { dir, filepath }) => {
      try {
        // Get file content from working directory
        const workdirContent = await fs.readFile(path.join(dir, filepath), 'utf8')
        
        // Get file content from HEAD
        let headContent = ''
        try {
          const { blob } = await git.readBlob({ fs, dir, oid: 'HEAD', filepath })
          headContent = new TextDecoder().decode(blob)
        } catch (e) {
          // File might not exist in HEAD
        }

        return { 
          success: true, 
          data: { 
            workdir: workdirContent,
            head: headContent,
            filepath 
          } 
        }
      } catch (error) {
        log.error('Git diff error:', error)
        return { success: false, error: error.message }
      }
    })

    // Check if directory is a git repository
    ipcMain.handle('git::isRepo', async (event, { dir }) => {
      try {
        const gitDir = path.join(dir, '.git')
        const exists = await fs.pathExists(gitDir)
        return { success: true, data: exists }
      } catch (error) {
        return { success: true, data: false }
      }
    })
  }

  async getStatus (dir) {
    const FILE = 0
    const WORKDIR = 2
    const STAGE = 3

    const statusMatrix = await git.statusMatrix({ fs, dir })
    
    const status = {
      modified: [],
      added: [],
      deleted: [],
      untracked: []
    }

    for (const [filepath, headStatus, workdirStatus, stageStatus] of statusMatrix) {
      if (headStatus === 1 && workdirStatus === 2 && stageStatus === 1) {
        // Modified
        status.modified.push(filepath)
      } else if (headStatus === 0 && workdirStatus === 2 && stageStatus === 0) {
        // Untracked
        status.untracked.push(filepath)
      } else if (headStatus === 0 && workdirStatus === 2 && stageStatus === 2) {
        // Added (staged)
        status.added.push(filepath)
      } else if (headStatus === 1 && workdirStatus === 0 && stageStatus === 1) {
        // Deleted
        status.deleted.push(filepath)
      } else if (headStatus === 1 && workdirStatus === 2 && stageStatus === 2) {
        // Modified and staged
        status.modified.push(filepath)
      }
    }

    return status
  }
}

export default new GitService()
