import { app, Menu, shell, BrowserWindow } from 'electron'

import { TOGGLE_SIDEBAR, TOGGLE_SETTINGS, TOGGLE_SHORTCUTS } from './store/actions'

let win: BrowserWindow

const template: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll'
      },
      {
        label: 'Preferences',
        click: () => win.webContents.send('dispatch-action', TOGGLE_SETTINGS),
        accelerator: 'CmdOrCtrl+,'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        role: 'togglefullscreen'
      },
      {
        label: 'Toggle Sidebar',
        click: () => win.webContents.send('dispatch-action', TOGGLE_SIDEBAR),
        accelerator: 'CmdOrCtrl+\\'
      },
      {
        type: 'separator'
      },
      {
        role: 'resetZoom'
      },
      {
        role: 'zoomIn'
      },
      {
        role: 'zoomOut'
      },
      {
        type: 'separator'
      },
      {
        label: 'Developer',
        submenu: [
          {
            role: 'reload'
          },
          {
            role: 'toggleDevTools'
          }
        ]
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: `Version ${app.getVersion()}`,
        enabled: false
      },
      {
        label: 'Learn More',
        click () { shell.openExternal('https://github.com/doryphores/lcv_resources') }
      },
      { type: 'separator' },
      {
        label: 'Keyboard shortcuts',
        click: () => win.webContents.send('dispatch-action', TOGGLE_SHORTCUTS),
        accelerator: '?'
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideOthers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
} else {
  template.unshift({
    label: 'File',
    submenu: [
      {
        role: 'quit'
      }
    ]
  })
}

export function setApplicationMenu (activeWindow: BrowserWindow) {
  win = activeWindow
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
