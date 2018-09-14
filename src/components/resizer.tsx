import React from 'react'
import classnames from 'classnames'

interface ResizerProps {
  readonly className: string
  readonly onResize: (x: number) => void
}

export default class Resizer extends React.Component<ResizerProps> {
  constructor (props: ResizerProps) {
    super(props)
  }

  stopResize = () => {
    document.body.classList.remove('u-resizing')
    window.removeEventListener('mouseup', this.stopResize)
    window.removeEventListener('mousemove', this.handleResize)
  }

  handleResize = (e: MouseEvent) => {
    this.props.onResize(e.clientX)
    window.dispatchEvent(new UIEvent('resize'))
  }

  startResize () {
    document.body.classList.add('u-resizing')
    window.addEventListener('mouseup', this.stopResize)
    window.addEventListener('mousemove', this.handleResize)
  }

  render () {
    return (
      <div className={classnames(this.props.className, 'resizer')}
        onMouseDown={this.startResize.bind(this)} />
    )
  }
}
