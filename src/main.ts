import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'
import { outputJSONSync, readJSON, createWriteStream } from 'fs-extra'
import request from 'request'

import { getSongs } from './scraper'
import { setupFileCache } from './file_cache'
import { createAppWindow } from './app_window'

async function start () {
  await setupFileCache()

  const appWindow: BrowserWindow = await createAppWindow()

  const STORE_PATH = path.join(
    app.getPath('userData'),
    'store.json',
  )

  ipcMain.handle('read-store', async () => {
    return await readJSON(STORE_PATH, { throws: false }) || {}
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
}

start()
