import { ipcMain, dialog } from 'electron'
import fs from 'fs-extra'
import path from 'path'
import log from 'electron-log'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

class ExportService {
  constructor () {
    this.setupIpcHandlers()
  }

  setupIpcHandlers () {
    // Export to DOCX
    ipcMain.handle('export::docx', async (event, { content, outputPath, metadata }) => {
      try {
        // Create temporary markdown file
        const tempMd = path.join(require('os').tmpdir(), 'temp_export.md')
        await fs.writeFile(tempMd, content)

        // Use pandoc to convert
        let pandocCmd = `pandoc "${tempMd}" -o "${outputPath}"`
        
        if (metadata) {
          // Add metadata
          if (metadata.title) pandocCmd += ` --metadata title="${metadata.title}"`
          if (metadata.author) pandocCmd += ` --metadata author="${metadata.author}"`
        }

        await execAsync(pandocCmd)
        await fs.remove(tempMd)

        return { success: true, path: outputPath }
      } catch (error) {
        log.error('DOCX export error:', error)
        return { success: false, error: error.message }
      }
    })

    // Export to EPUB
    ipcMain.handle('export::epub', async (event, { content, outputPath, metadata }) => {
      try {
        const tempMd = path.join(require('os').tmpdir(), 'temp_export.md')
        await fs.writeFile(tempMd, content)

        let pandocCmd = `pandoc "${tempMd}" -o "${outputPath}" --toc --epub-cover-image="${metadata?.coverImage || ''}"`
        
        if (metadata) {
          if (metadata.title) pandocCmd += ` --metadata title="${metadata.title}"`
          if (metadata.author) pandocCmd += ` --metadata author="${metadata.author}"`
          if (metadata.language) pandocCmd += ` --metadata lang="${metadata.language}"`
        }

        await execAsync(pandocCmd)
        await fs.remove(tempMd)

        return { success: true, path: outputPath }
      } catch (error) {
        log.error('EPUB export error:', error)
        return { success: false, error: error.message }
      }
    })

    // Export to PDF (enhanced)
    ipcMain.handle('export::pdf', async (event, { content, outputPath, metadata }) => {
      try {
        const tempMd = path.join(require('os').tmpdir(), 'temp_export.md')
        await fs.writeFile(tempMd, content)

        let pandocCmd = `pandoc "${tempMd}" -o "${outputPath}" --pdf-engine=xelatex`
        
        if (metadata) {
          if (metadata.title) pandocCmd += ` --metadata title="${metadata.title}"`
          if (metadata.author) pandocCmd += ` --metadata author="${metadata.author}"`
          if (metadata.fontSize) pandocCmd += ` -V fontsize=${metadata.fontSize}pt`
          if (metadata.margin) pandocCmd += ` -V geometry:margin=${metadata.margin}in`
        }

        await execAsync(pandocCmd)
        await fs.remove(tempMd)

        return { success: true, path: outputPath }
      } catch (error) {
        log.error('PDF export error:', error)
        return { success: false, error: error.message }
      }
    })

    // Check if Pandoc is installed
    ipcMain.handle('export::checkPandoc', async () => {
      try {
        await execAsync('pandoc --version')
        return { success: true, installed: true }
      } catch (error) {
        return { success: true, installed: false }
      }
    })

    // Combine multiple files for export
    ipcMain.handle('export::combineFiles', async (event, { files }) => {
      try {
        let combined = ''
        for (const file of files) {
          const content = await fs.readFile(file.path, 'utf8')
          if (file.addPageBreak) {
            combined += content + '\n\n\\newpage\n\n'
          } else {
            combined += content + '\n\n'
          }
        }
        return { success: true, data: combined }
      } catch (error) {
        log.error('Combine files error:', error)
        return { success: false, error: error.message }
      }
    })
  }
}

export default new ExportService()
