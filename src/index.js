import { app, BrowserWindow } from 'electron'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import path from 'path'
import { outputJSON, readJSON } from 'fs-extra'

import { setApplicationMenu } from './application_menu'

let appWindow

const CONFIG_PATH = path.join(
  app.getPath('userData'),
  'window.json'
)

const isDevMode = process.execPath.match(/[\\/]electron/)

const shouldQuit = app.makeSingleInstance(() => {
  if (appWindow) {
    if (appWindow.isMinimized()) appWindow.restore()
    appWindow.focus()
  }
})

if (shouldQuit) {
  app.quit()
}

if (process.platform === 'linux') {
  app.disableHardwareAcceleration()
}

app.on('ready', () => {
  let opts = {
    minWidth: 800,
    minHeight: 600,
    center: true,
    show: false,
    autoHideMenuBar: true,
    icon: path.join(app.getAppPath(), 'static', 'icon.png')
  }

  readJSON(CONFIG_PATH, (_, config) => {
    if (config) Object.assign(opts, config)

    appWindow = new BrowserWindow(opts)

    setApplicationMenu(appWindow)

    appWindow.once('ready-to-show', () => appWindow.show())

    appWindow.on('close', () => {
      let [ width, height ] = appWindow.getSize()
      let [ x, y ] = appWindow.getPosition()
      outputJSON(CONFIG_PATH, {
        width,
        height,
        x,
        y
      })
      app.quit()
    })

    appWindow.loadURL(`file://${path.join(app.getAppPath(), 'static', 'index.html')}`)

    if (isDevMode) installExtension(REACT_DEVELOPER_TOOLS)
  })
})
