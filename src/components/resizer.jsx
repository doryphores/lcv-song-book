import React from 'react'
import classnames from 'classnames'

export default class Resizer extends React.Component {
  constructor () {
    super()
    this.stopResize = this.stopResize.bind(this)
    this.handleResize = this.handleResize.bind(this)
  }

  startResize () {
    document.body.classList.add('u-resizing')
    window.addEventListener('mouseup', this.stopResize)
    window.addEventListener('mousemove', this.handleResize)
  }

  stopResize () {
    document.body.classList.remove('u-resizing')
    window.removeEventListener('mouseup', this.stopResize)
    window.removeEventListener('mousemove', this.handleResize)
  }

  handleResize (e) {
    this.props.onResize(e.clientX)
    window.dispatchEvent(new window.Event('resize'))
  }

  render () {
    return (
      <div className={classnames(this.props.className, 'resizer')}
        onMouseDown={this.startResize.bind(this)} />
    )
  }
}
