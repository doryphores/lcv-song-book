import { app, Menu, shell } from 'electron'

let win

const template = [
  {
    label: 'File',
    submenu: [
      {
        role: 'quit'
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
        click: () => win.webContents.send('toggle-sidebar'),
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
}

export function setApplicationMenu (activeWindow) {
  win = activeWindow
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
