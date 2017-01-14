import React from 'react'
import classnames from 'classnames'
import { PDFJS } from 'pdfjs-dist'

PDFJS.workerSrc = '../node_modules/pdfjs-dist/build/pdf.worker.js'

export default class Sheet extends React.Component {
  componentDidMount () {
    PDFJS.getDocument('http://www.londoncityvoices.co.uk/resources/sheetmusic/50-Ways-To-Leave-Your-Lover-Bass.pdf').
      promise.then(pdfDocument => {
        return pdfDocument.getPage(1).then(pdfPage => {
          // Display page on the existing canvas with 100% scale.
          let viewport = pdfPage.getViewport(1.0)
          let canvas = this.refs.canvas
          canvas.width = viewport.width
          canvas.height = viewport.height
          let ctx = canvas.getContext('2d')
          let renderTask = pdfPage.render({
            canvasContext: ctx,
            viewport: viewport
          })
          return renderTask.promise
        })
      }).catch(console.error)
  }

  render () {
    return (
      <div className={classnames(this.props.className, 'sheet')}>
        <canvas ref='canvas' />
      </div>
    )
  }
}
