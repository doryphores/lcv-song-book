import React from 'react'
import classnames from 'classnames'
import PDFJS, { PDFDocument } from 'pdfjs-dist'

import KeyCapture from '../key_capture'
import { debounce, range } from '../utils'
import Icon from './icon'

PDFJS.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js'

interface SheetProps {
  readonly className: string
  readonly pdfURL: string
}

interface SheetState {
  readonly numPages: number
  readonly pdfURL: string
  readonly loading: boolean
  readonly pageRatio: number
}

export default class Sheet extends React.Component<SheetProps, SheetState> {
  private keyCapture: KeyCapture
  private scrollerElement: HTMLDivElement | null = null
  private containerElement: HTMLDivElement | null = null
  private pdfDocument: PDFDocument | null = null
  private pages: HTMLDivElement[] = []

  constructor (props: SheetProps) {
    super(props)
    this.state = {
      numPages: 0,
      pdfURL: '',
      pageRatio: 0,
      loading: false
    }

    this.keyCapture = new KeyCapture({
      'PageUp PageDown': () => {
        this.scrollerElement!.focus()
        return true
      }
    })
  }

  onResize = debounce(() => this.renderPDF(), 250)

  componentDidMount () {
    this.loadPDF(this.props.pdfURL)
    window.addEventListener('resize', () => this.onResize())
    this.keyCapture.activate()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', () => this.onResize())
    this.keyCapture.deactivate()
  }

  componentWillReceiveProps (nextProps: SheetProps) {
    if (this.props.pdfURL !== nextProps.pdfURL) {
      this.loadPDF(nextProps.pdfURL)
    }
  }

  componentDidUpdate (prevProps: SheetProps, prevState: SheetState) {
    if (
      this.state.pdfURL !== '' &&
      (
        prevState.pdfURL !== this.state.pdfURL ||
        prevState.numPages !== this.state.numPages
      )
    ) {
      this.renderPDF()
    }
  }

  loadPDF (pdfURL: string) {
    this.setState({
      numPages: 0,
      loading: true
    })

    this.pdfDocument = null

    this.scrollerElement!.scrollTop = 0

    PDFJS.getDocument(pdfURL).then(pdfDocument => {
      this.pdfDocument = pdfDocument

      return pdfDocument.getPage(1).then(pdfPage => {
        const viewport = pdfPage.getViewport(1.0)

        this.setState({
          pdfURL: pdfURL,
          pageRatio: viewport.height / viewport.width,
          numPages: pdfDocument.numPages
        })
      })
    }).catch(err => console.error(err))
  }

  renderPDF () {
    if (this.state.numPages === 0) return

    const promises = range(this.state.numPages).map(i => {
      return this.pdfDocument!.getPage(i + 1).then(pdfPage => {
        let viewport = pdfPage.getViewport(1.0)
        let canvas = document.createElement('canvas')
        let scale = this.containerElement!.clientWidth / viewport.width

        viewport = pdfPage.getViewport(scale)

        canvas.width = viewport.width
        canvas.height = viewport.height

        return pdfPage.render({
          canvasContext: canvas.getContext('2d')!,
          viewport: viewport
        }).then(() => {
          let page = this.pages[i]

          if (page.firstChild) {
            page.replaceChild(canvas, page.firstChild)
          } else {
            page.appendChild(canvas)
          }
        })
      })
    })

    Promise.all(promises)
           .then(() => this.setState({ loading: false }))
           .catch(err => console.log(err))
  }

  classNames (classNames: string) {
    return classnames(this.props.className, classNames, {
      'sheet--loading': this.state.loading
    })
  }

  render () {
    let paddingBottom = (this.state.pageRatio * 100) + '%'

    return (
      <div className={this.classNames('sheet')}>
        <div className='sheet__scroller'
          tabIndex={-1}
          ref={(el) => this.scrollerElement = el}>
          <div className='sheet__page-container'
            ref={(el) => this.containerElement = el}>
            {range(this.state.numPages).map(i => (
              <div key={this.state.pdfURL + i}
                ref={(el) => this.pages[i] = el!}
                className='sheet__page'
                style={{ paddingBottom }} />
            ))}
          </div>
          <span className='sheet__loading-message'>
            <Icon icon='refresh' className='sheet__loading-icon' />
            <span>LOADING…</span>
          </span>
        </div>
      </div>
    )
  }
}
