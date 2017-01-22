import { app, BrowserWindow } from 'electron'
import path from 'path'

let win

app.on('ready', () => {
  // ========================================================
  // Window setup

  win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    center: true,
    show: false,
    autoHideMenuBar: true
  })

  win.once('ready-to-show', () => win.show())

  win.loadURL(`file://${path.join(app.getAppPath(), 'static', 'index.html')}`)
})
