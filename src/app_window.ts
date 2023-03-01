import { app, BrowserWindow, Rectangle } from 'electron'
import { outputJSON, readJSON } from 'fs-extra'
import path from 'path'
import { setApplicationMenu } from './application_menu'

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const WINDOW_BOUNDS_SAVE_PATH = path.join(app.getPath('userData'), 'window.json')

export async function createAppWindow(): Promise<BrowserWindow> {
  // quit if another window is open
  if (!app.requestSingleInstanceLock()) {
    app.quit()
    return
  }

  const appWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    center: true,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  await restoreWindowBounds(appWindow)

  setApplicationMenu(appWindow)

  app.on('second-instance', () => {
    if (appWindow.isMinimized()) appWindow.restore()
    appWindow.focus()
  })

  appWindow.once('ready-to-show', () => appWindow.show())

  appWindow.on('close', async () => {
    await saveWindowBounds(appWindow)
    app.quit()
  })

  appWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  return appWindow
}

async function restoreWindowBounds (appWindow: BrowserWindow): Promise<void> {
  const bounds: Rectangle = await readJSON(WINDOW_BOUNDS_SAVE_PATH, { throws: false })
  if (bounds) appWindow.setBounds(bounds)
}

async function saveWindowBounds (appWindow: BrowserWindow) {
  try {
    await outputJSON(WINDOW_BOUNDS_SAVE_PATH, appWindow.getBounds())
  } catch (error) {
    console.error(error)
  }
}
