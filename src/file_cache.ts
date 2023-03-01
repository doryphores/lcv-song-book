import { app, protocol } from 'electron'
import path from 'path'
import { temporaryFile } from 'tempy';
import { createWriteStream, ensureDir, pathExists, move, WriteStream } from 'fs-extra'
import request from 'request'

export async function setupFileCache () {
  // this needs to be done before app is ready
  protocol.registerSchemesAsPrivileged([
    { scheme: 'lcvfile', privileges: { bypassCSP: true, stream: true } },
  ])

  await app.whenReady()

  const cachePath = path.join(app.getPath('userData'), 'lcv_files')

  const writeStreams: Record<string, WriteStream> = {}

  // and this needs to be done after app is ready
  protocol.registerFileProtocol('lcvfile', async (req, callback) => {
    const url = new URL(req.url)
    const filePath = path.join(cachePath, url.pathname)

    const cached = await pathExists(filePath)

    if (cached) return callback(filePath)

    await ensureDir(path.dirname(filePath))

    // close any previously open stream for this file
    if (writeStreams[filePath]) writeStreams[filePath].close()

    const tempFilePath = temporaryFile()
    const stream = writeStreams[filePath] = createWriteStream(tempFilePath)

    request(req.url.replace('lcvfile://', 'https://')).pipe(stream).on('finish', async () => {
      if (writeStreams[filePath] === stream) {
        await move(tempFilePath, filePath)
      }
      callback(filePath)
    })
  })
}
