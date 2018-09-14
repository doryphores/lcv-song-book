import { app, BrowserWindow } from 'electron'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import path from 'path'
import { outputJSON, readJSON } from 'fs-extra'

import { setApplicationMenu } from './application_menu'

let appWindow: BrowserWindow

const CONFIG_PATH = path.join(
  app.getPath('userData'),
  'window.json'
)

const isDevMode = /[\\/]electron/.test(process.execPath)

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
  const defaultWindowOpts = {
    minWidth: 800,
    minHeight: 600,
    center: true,
    show: false,
    autoHideMenuBar: true,
    icon: `${__dirname}/static/icon.png`
  }

  readJSON(CONFIG_PATH, (_, savedWindowOpts: {} | undefined) => {
    appWindow = new BrowserWindow({
      ...defaultWindowOpts,
      ...savedWindowOpts
    })

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
      }).catch(err => console.error(err))
      app.quit()
    })

    appWindow.loadURL(`file://${__dirname}/static/index.html`)

    if (isDevMode) installExtension(REACT_DEVELOPER_TOOLS)
  })
})
