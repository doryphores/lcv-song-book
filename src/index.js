import { app, BrowserWindow } from 'electron'
import path from 'path'

let win

app.on('ready', () => {
  // ========================================================
  // Window setup

  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false
  })

  win.once('ready-to-show', () => win.show())

  win.loadURL(`file://${path.join(app.getAppPath(), 'static', 'index.html')}`)
})
