import { remote, shell } from 'electron'
import fs from 'fs'
import { last } from 'lodash'
import path from 'path'
import React from 'react'
import request from 'request'

import ToolbarPanel from './toolbar_panel'

interface DownloaderProps {
  readonly className: string
  readonly pdfURL: string
}

function download (pdfURL: string) {
  const filename = decodeURIComponent(last(pdfURL.split('/'))!)
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
