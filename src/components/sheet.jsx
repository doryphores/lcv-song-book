import React from 'react'
import classnames from 'classnames'
import { PDFJS } from 'pdfjs-dist'

import { debounce, range } from '../utils'

PDFJS.workerSrc = '../node_modules/pdfjs-dist/build/pdf.worker.js'

export default class Sheet extends React.Component {
  constructor () {
    super()
    this.state = {
      numPages: 0,
      pageWidth: 0,
      pdfURL: ''
    }
  }

  componentDidMount () {
    this.loadPDF(this.props.pdfURL)
    this.onResize = debounce(this.handleResize.bind(this), 100)
    this.setState({ pageWidth: this.refs.container.clientWidth })
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResize)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.pdfURL !== nextProps.pdfURL) {
      this.loadPDF(nextProps.pdfURL)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      prevState.pdfURL !== this.state.pdfURL ||
      prevState.numPages !== this.state.numPages ||
      prevState.pageWidth !== this.state.pageWidth
    ) {
      this.renderPDF()
    }
  }

  loadPDF (pdfURL) {
    if (pdfURL === '') {
      this.setState({ numPages: 0 })
      return
    }

    PDFJS.getDocument(pdfURL)
      .then(pdfDocument => {
        this.pdfDocument = pdfDocument
        this.refs.container.parentNode.scrollTop = 0
        this.setState({
          pdfURL: pdfURL,
          numPages: this.pdfDocument.numPages
        })
      }).catch(console.error)
  }

  handleResize () {
    this.setState({ pageWidth: this.refs.container.clientWidth })
  }

  renderPDF () {
    if (this.state.numPages === 0) return

    range(this.state.numPages).forEach(i => {
      this.pdfDocument.getPage(i + 1).then(pdfPage => {
        let viewport = pdfPage.getViewport(1.0)
        let canvas = this.refs[`page-${i + 1}`]
        let scale = this.state.pageWidth / viewport.width
        viewport = pdfPage.getViewport(scale)
        canvas.width = viewport.width
        canvas.height = viewport.height
        pdfPage.render({
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        })
      })
    })
  }

  render () {
    return (
      <div className={classnames(this.props.className, 'sheet')}>
        <div ref='container'>
          {range(this.state.numPages).map(i => (
            <div key={`page-${i + 1}`} className='sheet__page'>
              <canvas ref={`page-${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}
