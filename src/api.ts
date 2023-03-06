import { ipcRenderer, IpcRendererEvent } from 'electron'

export default {
  platform: process.platform,
  readStore: async () => await ipcRenderer.invoke('read-store'),
  writeStore: (data: ApplicationState) => ipcRenderer.invoke('write-store', data),
  downloadFile: (fileUrl: string) => ipcRenderer.invoke('download-file', fileUrl),
  onActionDispatch: (cb: (actionType: string) => void) => {
    ipcRenderer.on('dispatch-action', (_e: Electron.IpcRendererEvent, actionType: string) => {
      cb(actionType)
    })
  },
  getAppName: () => ipcRenderer.invoke('get-name'),
  scrape: async (creds: Credentials, onProgress: (progress: ScraperProgress) => void) => {
    const callback = (event: IpcRendererEvent, progress: ScraperProgress) => onProgress(progress)
    try{
      ipcRenderer.on('scraper-progress', callback)
      const result = await ipcRenderer.invoke('scrape', creds)
      if (result.error) throw new Error(result.error)
      return result.value
    } finally {
      ipcRenderer.off('scraper-progress', callback)
    }
  },
}
