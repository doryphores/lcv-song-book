import React from 'react'

import ToolbarPanel from './toolbar_panel'

type DownloaderProps = {
  className: string
  pdfURL: string
}

const Downloader: React.FC<DownloaderProps> = ({ pdfURL, className }) => (
  <ToolbarPanel className={className}
    onToggle={() => api.downloadFile(pdfURL)}
    disabled={pdfURL === ''}
    toggleIcon='cloud_download'
  />
)

export default Downloader
