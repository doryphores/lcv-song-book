import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { PDFJS } from 'pdfjs-dist'

PDFJS.workerSrc = '../node_modules/pdfjs-dist/build/pdf.worker.js'

class Sheet extends React.Component {
  constructor () {
    super()
    this.state = {
      numPages: 0
    }
  }

  componentDidMount () {
    this.loadPDF(this.props.pdfURL)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.pdfURL !== nextProps.pdfURL) {
      this.loadPDF(nextProps.pdfURL)
    }
  }

  componentDidUpdate () {
    Array(this.state.numPages).fill().map((_, i) => {
      this.pdfDocument.getPage(i + 1).then(pdfPage => {
        let viewport = pdfPage.getViewport(1.0)
        let canvas = this.refs[`page-${i + 1}`]
        let scale = canvas.parentNode.offsetWidth / viewport.width
        viewport = pdfPage.getViewport(scale)
        canvas.width = viewport.width
        canvas.height = viewport.height
        let ctx = canvas.getContext('2d')
        let renderTask = pdfPage.render({
          canvasContext: ctx,
          viewport: viewport
        })
        return renderTask.promise
      })
    })
  }

  loadPDF (pdfURL) {
    if (pdfURL === '') return

    PDFJS.getDocument(pdfURL)
      .then(pdfDocument => {
        this.pdfDocument = pdfDocument
        this.setState({
          numPages: this.pdfDocument.numPages
        })
      }).catch(console.error)
  }

  render () {
    return (
      <div className={classnames(this.props.className, 'sheet')}>
        {Array(this.state.numPages).fill().map((_, i) => (
          <div key={`page-${i + 1}`} className='sheet__page'>
            <canvas ref={`page-${i + 1}`} />
          </div>
        ))}
      </div>
    )
  }
}

function mapStateToProps (state) {
  let selectedSong = state.songs.find(s => s.title === state.selectedSong)

  return {
    pdfURL: `http://www.londoncityvoices.co.uk${selectedSong.voices['Tenor'].sheet}`
  }
}

export default connect(mapStateToProps)(Sheet)
