import React from 'react'
import request from 'request'
import { remote, shell } from 'electron'
import fs from 'fs'
import path from 'path'

import ToolbarPanel from './toolbar_panel'

interface DownloaderProps {
  readonly className: string
  readonly pdfURL: string
}

function download (pdfURL: string) {
  const filename = decodeURIComponent(pdfURL.split('/').pop())
  const downloadPath = path.join(remote.app.getPath('downloads'), filename)
  const stream = fs.createWriteStream(downloadPath)
  request(pdfURL).pipe(stream).on('finish', () => {
    shell.openItem(downloadPath)
  })
}

const Downloader: React.SFC<DownloaderProps> = ({ pdfURL, className }) => (
  <ToolbarPanel className={className}
    onToggle={() => download(pdfURL)}
    disabled={pdfURL === ''}
    toggleIcon='cloud_download' />
)

export default Downloader
