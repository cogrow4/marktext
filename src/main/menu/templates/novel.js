export default function () {
  return {
    label: '&Novel',
    submenu: [{
      label: 'Characters',
      click: (menuItem, browserWindow) => {
        if (browserWindow) {
          browserWindow.webContents.send('mt::show-sidebar-panel', 'characters')
        }
      }
    }, {
      label: 'Places & Locations',
      click: (menuItem, browserWindow) => {
        if (browserWindow) {
          browserWindow.webContents.send('mt::show-sidebar-panel', 'places')
        }
      }
    }, {
      label: 'Scenes & Timeline',
      click: (menuItem, browserWindow) => {
        if (browserWindow) {
          browserWindow.webContents.send('mt::show-sidebar-panel', 'scenes')
        }
      }
    }, {
      type: 'separator'
    }, {
      label: 'Writing Statistics',
      click: (menuItem, browserWindow) => {
        if (browserWindow) {
          browserWindow.webContents.send('mt::show-sidebar-panel', 'stats')
        }
      }
    }, {
      label: 'Set Writing Goals',
      click: (menuItem, browserWindow) => {
        if (browserWindow) {
          browserWindow.webContents.send('mt::show-writing-goals-dialog')
        }
      }
    }, {
      type: 'separator'
    }, {
      label: 'Version Control',
      submenu: [{
        label: 'Show Git Panel',
        click: (menuItem, browserWindow) => {
          if (browserWindow) {
            browserWindow.webContents.send('mt::show-sidebar-panel', 'git')
          }
        }
      }, {
        label: 'Initialize Repository',
        click: (menuItem, browserWindow) => {
          if (browserWindow) {
            browserWindow.webContents.send('mt::git-init')
          }
        }
      }, {
        label: 'Commit Changes',
        click: (menuItem, browserWindow) => {
          if (browserWindow) {
            browserWindow.webContents.send('mt::git-commit-dialog')
          }
        }
      }]
    }, {
      type: 'separator'
    }, {
      label: 'Export Novel',
      submenu: [{
        label: 'Export to DOCX',
        click: (menuItem, browserWindow) => {
          if (browserWindow) {
            browserWindow.webContents.send('mt::export-novel', 'docx')
          }
        }
      }, {
        label: 'Export to EPUB',
        click: (menuItem, browserWindow) => {
          if (browserWindow) {
            browserWindow.webContents.send('mt::export-novel', 'epub')
          }
        }
      }, {
        label: 'Export to PDF',
        click: (menuItem, browserWindow) => {
          if (browserWindow) {
            browserWindow.webContents.send('mt::export-novel', 'pdf')
          }
        }
      }]
    }]
  }
}
