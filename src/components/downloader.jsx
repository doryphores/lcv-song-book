import React from 'react'
import request from 'request'
import { remote, shell } from 'electron'
import fs from 'fs'
import path from 'path'

import ToolbarPanel from './toolbar_panel'

function download (pdfURL) {
  let filename = pdfURL.split('/').pop()
  let downloadPath = path.join(remote.app.getPath('downloads'), filename)
  let stream = fs.createWriteStream(downloadPath)
  request(pdfURL).pipe(stream).on('finish', () => {
    shell.openExternal('file://' + downloadPath)
  })
}

const Downloader = ({ pdfURL, className }) => (
  <ToolbarPanel className={className}
    onToggle={() => download(pdfURL)}
    disabled={!pdfURL}
    toggleIcon='cloud_download' />
)

export default Downloader
