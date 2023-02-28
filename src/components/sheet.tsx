import React, { useCallback, useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import * as PDFJS from 'pdfjs-dist'
import { debounce, range } from 'lodash'

import KeyCapture from '../key_capture'
import Icon from './icon'
import PDFWorker from '../static/pdf.worker.min.worker'

type SheetProps = {
  className: string
  pdfURL: string
}

PDFJS.GlobalWorkerOptions.workerSrc = PDFWorker;

const Sheet: React.FC<SheetProps> = ({
  className,
  pdfURL
}) => {
  const [numPages, setNumPages] = useState(0)
  const [pageRatio, setPageRatio] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadedPDF, setLoadedPDF] = useState('')

  const containerElement = useRef<HTMLDivElement>(null)
  const pdfDocument = useRef<PDFJS.PDFDocumentProxy>(null)
  const pages = useRef<HTMLDivElement[]>([])

  if (pages.current.length !== numPages) {
    pages.current = Array(numPages).fill(null).map((_, i) => pages.current[i]);
  }

  const scrollerElement = useRef<HTMLDivElement>()
  const keyCapture = useRef<KeyCapture>()

  useEffect(() => {
    keyCapture.current = new KeyCapture({
      'PageUp PageDown': () => {
        scrollerElement.current.focus()
        return true
      }
    })
    keyCapture.current.activate()

    return () => keyCapture.current.deactivate()
  }, [])

  useEffect(() => {
    loadPDF(pdfURL)
  }, [pdfURL])

  useEffect(() => {
    renderPDF()
  }, [loadedPDF, numPages])

  const loadPDF = async (pdfURL: string) => {
    setNumPages(0)
    setLoading(true)

    pdfDocument.current = null

    scrollerElement.current.scrollTop = 0

    pdfDocument.current = await PDFJS.getDocument(pdfURL.replace('https://', 'lcvfile://')).promise

    const pdfPage = await pdfDocument.current.getPage(1)
    const viewport = pdfPage.getViewport({ scale: 1.0 })

    setLoadedPDF(pdfURL)
    setPageRatio(viewport.height / viewport.width)
    setNumPages(pdfDocument.current.numPages)
  }

  const renderPDF = () => {
    if (numPages === 0) return

    const promises = range(numPages).map(i => {
      return pdfDocument.current.getPage(i + 1).then(pdfPage => {
        let viewport = pdfPage.getViewport({ scale: 1.0 })
        const canvas = document.createElement('canvas')
        const scale = containerElement.current.clientWidth / viewport.width

        viewport = pdfPage.getViewport({ scale })

        canvas.width = viewport.width
        canvas.height = viewport.height

        return pdfPage.render({
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        }).promise.then(() => {
          const page = pages.current[i]

          if (page.firstChild) {
            page.replaceChild(canvas, page.firstChild)
          } else {
            page.appendChild(canvas)
          }
        })
      })
    })

    Promise.all(promises)
           .then(() => setLoading(false))
           .catch(err => console.log(err))
  }

  useEffect(() => {
    const onResize = debounce(renderPDF, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [renderPDF])

  const classNames = useCallback((classNames: string) => {
    return classnames(className, classNames, {
      'sheet--loading': loading
    })
  }, [className, loading])

  const paddingBottom = (pageRatio * 100) + '%'

  return (
    <div className={classNames('sheet')}>
      <div className='sheet__scroller' tabIndex={-1} ref={scrollerElement}>
        <div className='sheet__page-container' ref={containerElement}>
          {range(numPages).map(i => (
            <div key={loadedPDF + i}
              ref={(el) => pages.current[i] = el}
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

export default Sheet
