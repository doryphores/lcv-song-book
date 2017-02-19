import { app, BrowserWindow } from 'electron'
import path from 'path'
import { outputJSON, readJSON } from 'fs-extra'

import './application_menu'

let win

const CONFIG_PATH = path.join(
  app.getPath('userData'),
  'window.json'
)

app.on('ready', () => {
  // ========================================================
  // Window setup

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

    win = new BrowserWindow(opts)

    win.once('ready-to-show', () => win.show())

    win.on('close', () => {
      let [ width, height ] = win.getSize()
      let [ x, y ] = win.getPosition()
      outputJSON(CONFIG_PATH, {
        width,
        height,
        x,
        y
      })
    })

    win.loadURL(`file://${path.join(app.getAppPath(), 'static', 'index.html')}`)
  })
})
