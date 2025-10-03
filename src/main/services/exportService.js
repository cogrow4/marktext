const { ipcMain } = require('electron')
const fs = require('fs-extra')
const path = require('path')
const puppeteer = require('puppeteer')
const Epub = require('epub-gen')

class ExportService {
  constructor() {
    this.setupIpcHandlers()
  }

  setupIpcHandlers() {
    // Export to PDF
    ipcMain.handle('export-pdf', async (event, content, options = {}) => {
      try {
        const {
          outputPath,
          title = 'Novel',
          author = 'Author',
          fontSize = '12pt',
          fontFamily = 'Times New Roman',
          lineHeight = '1.6',
          margin = '1in',
          pageSize = 'A4',
          includeTOC = true,
          includePageNumbers = true
        } = options

        const html = this.generateHTML(content, {
          title,
          author,
          fontSize,
          fontFamily,
          lineHeight,
          margin,
          includeTOC,
          includePageNumbers
        })

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        
        await page.setContent(html, { waitUntil: 'networkidle0' })
        
        const pdfOptions = {
          path: outputPath,
          format: pageSize,
          printBackground: true,
          margin: {
            top: margin,
            right: margin,
            bottom: margin,
            left: margin
          }
        }
        
        await page.pdf(pdfOptions)
        await browser.close()
        
        return { success: true, message: 'PDF exported successfully' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Export to EPUB
    ipcMain.handle('export-epub', async (event, content, options = {}) => {
      try {
        const {
          outputPath,
          title = 'Novel',
          author = 'Author',
          description = '',
          language = 'en',
          chapters = []
        } = options

        const epubOptions = {
          title,
          author,
          description,
          publisher: 'NovelCraft',
          language,
          output: outputPath,
          content: chapters.length > 0 ? chapters : [{
            title: 'Chapter 1',
            data: content
          }]
        }

        await new Epub(epubOptions).promise
        
        return { success: true, message: 'EPUB exported successfully' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Export to HTML
    ipcMain.handle('export-html', async (event, content, options = {}) => {
      try {
        const {
          outputPath,
          title = 'Novel',
          author = 'Author',
          includeCSS = true,
          includeJS = false,
          theme = 'default'
        } = options

        const html = this.generateHTML(content, {
          title,
          author,
          includeCSS,
          includeJS,
          theme
        })

        await fs.writeFile(outputPath, html, 'utf8')
        
        return { success: true, message: 'HTML exported successfully' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Export to DOCX (using HTML as intermediate)
    ipcMain.handle('export-docx', async (event, content, options = {}) => {
      try {
        const {
          outputPath,
          title = 'Novel',
          author = 'Author'
        } = options

        // For now, we'll export as HTML that can be opened in Word
        // In a full implementation, you'd use a library like docx
        const html = this.generateHTML(content, { title, author })
        const docxPath = outputPath.replace('.docx', '.html')
        
        await fs.writeFile(docxPath, html, 'utf8')
        
        return { 
          success: true, 
          message: 'HTML version created (can be opened in Word)',
          actualPath: docxPath
        }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Export to plain text
    ipcMain.handle('export-txt', async (event, content, options = {}) => {
      try {
        const {
          outputPath,
          includeMetadata = true,
          title = 'Novel',
          author = 'Author'
        } = options

        let text = content
        
        if (includeMetadata) {
          text = `${title}\nby ${author}\n\n${'='.repeat(50)}\n\n${content}`
        }
        
        await fs.writeFile(outputPath, text, 'utf8')
        
        return { success: true, message: 'Text file exported successfully' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Export to LaTeX
    ipcMain.handle('export-latex', async (event, content, options = {}) => {
      try {
        const {
          outputPath,
          title = 'Novel',
          author = 'Author',
          documentClass = 'book',
          fontSize = '12pt',
          paperSize = 'a4paper'
        } = options

        const latex = this.generateLaTeX(content, {
          title,
          author,
          documentClass,
          fontSize,
          paperSize
        })
        
        await fs.writeFile(outputPath, latex, 'utf8')
        
        return { success: true, message: 'LaTeX file exported successfully' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    // Batch export multiple formats
    ipcMain.handle('export-batch', async (event, content, formats, options = {}) => {
      try {
        const results = []
        const basePath = options.basePath || path.dirname(options.outputPath)
        const baseName = path.basename(options.outputPath, path.extname(options.outputPath))
        
        for (const format of formats) {
          const outputPath = path.join(basePath, `${baseName}.${format}`)
          let result
          
          switch (format.toLowerCase()) {
            case 'pdf':
              result = await this.exportPDF(content, { ...options, outputPath })
              break
            case 'epub':
              result = await this.exportEPUB(content, { ...options, outputPath })
              break
            case 'html':
              result = await this.exportHTML(content, { ...options, outputPath })
              break
            case 'txt':
              result = await this.exportTXT(content, { ...options, outputPath })
              break
            case 'latex':
              result = await this.exportLaTeX(content, { ...options, outputPath })
              break
            default:
              result = { success: false, error: `Unsupported format: ${format}` }
          }
          
          results.push({
            format,
            outputPath,
            ...result
          })
        }
        
        return { success: true, results }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })
  }

  generateHTML(content, options = {}) {
    const {
      title = 'Novel',
      author = 'Author',
      fontSize = '12pt',
      fontFamily = 'Times New Roman',
      lineHeight = '1.6',
      margin = '1in',
      includeCSS = true,
      includeJS = false,
      theme = 'default',
      includeTOC = false,
      includePageNumbers = false
    } = options

    const css = includeCSS ? `
      <style>
        body {
          font-family: ${fontFamily}, serif;
          font-size: ${fontSize};
          line-height: ${lineHeight};
          margin: ${margin};
          color: #333;
          background: #fff;
        }
        
        h1, h2, h3, h4, h5, h6 {
          color: #2c3e50;
          margin-top: 2em;
          margin-bottom: 1em;
        }
        
        h1 { font-size: 2em; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.3em; }
        
        p {
          margin-bottom: 1em;
          text-align: justify;
        }
        
        blockquote {
          margin: 1em 2em;
          padding-left: 1em;
          border-left: 3px solid #ddd;
          font-style: italic;
        }
        
        .toc {
          page-break-after: always;
        }
        
        .toc h2 {
          margin-bottom: 1em;
        }
        
        .toc ul {
          list-style: none;
          padding-left: 0;
        }
        
        .toc li {
          margin-bottom: 0.5em;
        }
        
        .toc a {
          text-decoration: none;
          color: #2c3e50;
        }
        
        @media print {
          .page-break {
            page-break-before: always;
          }
          
          @page {
            margin: ${margin};
            @bottom-center {
              content: counter(page);
            }
          }
        }
      </style>
    ` : ''

    const js = includeJS ? `
      <script>
        // Add any JavaScript functionality here
        document.addEventListener('DOMContentLoaded', function() {
          // Initialize any interactive features
        });
      </script>
    ` : ''

    const toc = includeTOC ? this.generateTOC(content) : ''

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${css}
      </head>
      <body>
        <div class="book">
          <header>
            <h1>${title}</h1>
            <p class="author">by ${author}</p>
          </header>
          
          ${toc}
          
          <main>
            ${this.markdownToHTML(content)}
          </main>
        </div>
        ${js}
      </body>
      </html>
    `
  }

  generateLaTeX(content, options = {}) {
    const {
      title = 'Novel',
      author = 'Author',
      documentClass = 'book',
      fontSize = '12pt',
      paperSize = 'a4paper'
    } = options

    return `
\\documentclass[${fontSize},${paperSize}]{${documentClass}}

\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\usepackage{setspace}
\\usepackage{fancyhdr}

\\geometry{margin=1in}
\\onehalfspacing

\\title{${title}}
\\author{${author}}
\\date{\\today}

\\begin{document}

\\maketitle

\\tableofcontents

\\mainmatter

${this.markdownToLaTeX(content)}

\\end{document}
    `
  }

  generateTOC(content) {
    const headings = content.match(/^#{1,6}\s+(.+)$/gm) || []
    
    if (headings.length === 0) return ''
    
    const tocItems = headings.map(heading => {
      const level = heading.match(/^#+/)[0].length
      const title = heading.replace(/^#+\s+/, '')
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      
      return `<li style="margin-left: ${(level - 1) * 1}em;"><a href="#${id}">${title}</a></li>`
    }).join('\n')
    
    return `
      <div class="toc">
        <h2>Table of Contents</h2>
        <ul>
          ${tocItems}
        </ul>
      </div>
    `
  }

  markdownToHTML(content) {
    // Simple markdown to HTML conversion
    // In a full implementation, you'd use a proper markdown parser
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*)`/gim, '<code>$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/^(?!<[h|b|d])/gim, '<p>')
      .replace(/(?![h|b|d]>)$/gim, '</p>')
  }

  markdownToLaTeX(content) {
    // Simple markdown to LaTeX conversion
    return content
      .replace(/^# (.*$)/gim, '\\chapter{$1}')
      .replace(/^## (.*$)/gim, '\\section{$1}')
      .replace(/^### (.*$)/gim, '\\subsection{$1}')
      .replace(/\*\*(.*)\*\*/gim, '\\textbf{$1}')
      .replace(/\*(.*)\*/gim, '\\textit{$1}')
      .replace(/`(.*)`/gim, '\\texttt{$1}')
      .replace(/^> (.*$)/gim, '\\begin{quote}\n$1\n\\end{quote}')
      .replace(/\n\n/gim, '\n\n')
  }
}

module.exports = ExportService