import { app, Menu, shell } from 'electron'

import { TOGGLE_SIDEBAR, TOGGLE_SETTINGS, TOGGLE_SHORTCUTS } from './actions'

let win

const template = [
  {
    label: 'Edit',
    submenu: [
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
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
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
            role: 'toggledevtools'
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
        role: 'hideothers'
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

export function setApplicationMenu (activeWindow) {
  win = activeWindow
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
