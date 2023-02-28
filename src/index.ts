import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'
import { outputJSONSync, readJSON, createWriteStream } from 'fs-extra'
import request from 'request'

import { getSongs } from './scraper';
import { setupFileCache } from './file_cache';
import { configureAppWindow } from './app_window';

let appWindow: BrowserWindow = null

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (appWindow) {
      if (appWindow.isMinimized()) appWindow.restore()
      appWindow.focus()
    }
  })

  setupFileCache().then(async () => {
    const STORE_PATH = path.join(
      app.getPath('userData'),
      'store.json'
    )

    ipcMain.handle('read-store', async () => {
      try {
        return await readJSON(STORE_PATH)
      } catch (err) {
        if (err.code === 'ENOENT') return {}
        throw err
      }
    })

    ipcMain.handle('write-store', (_event, data) => {
      outputJSONSync(STORE_PATH, data)
    })

    ipcMain.handle('get-name', () => app.getName())

    ipcMain.handle('download-file', (_event, fileUrl: string) => {
      const filename = decodeURIComponent(fileUrl.split('/').pop())
      const downloadPath = path.join(app.getPath('downloads'), filename)
      const stream = createWriteStream(downloadPath)
      request(fileUrl).pipe(stream).on('finish', () => {
        shell.openPath(downloadPath)
      })
    })

    ipcMain.handle('scrape', async (_event, creds: Credentials) => {
      const result: IPCResult = {}
      try {
        result.value = await getSongs(appWindow, creds)
      } catch (error) {
        result.error = error.message
      }
      return result
    })

    appWindow = await configureAppWindow()
  })
}
