import React from 'react'
import classnames from 'classnames'

export default class ProgressBar extends React.Component {
  constructor (props) {
    super()
    this.state = {
      seeking: false,
      seek: props.value
    }
    this.updateSeek = this.updateSeek.bind(this)
    this.stopSeek = this.stopSeek.bind(this)
  }

  componentWillUnmount () {
    window.removeEventListener('mousemove', this.updateSeek)
    window.removeEventListener('mouseup', this.stopSeek)
  }

  seekFromMouseEvent (e) {
    let rect = this.refs.progressBar.getBoundingClientRect()
    let seek = (e.clientX - rect.left) / rect.width * this.props.duration
    return Math.min(Math.max(0, seek), this.props.duration)
  }

  startSeek (e) {
    window.addEventListener('mousemove', this.updateSeek)
    window.addEventListener('mouseup', this.stopSeek)
    this.updateSeek(e)
  }

  updateSeek (e) {
    this.setState({
      seeking: true,
      seek: this.seekFromMouseEvent(e)
    })
  }

  stopSeek (e) {
    window.removeEventListener('mousemove', this.updateSeek)
    window.removeEventListener('mouseup', this.stopSeek)
    this.setState({ seeking: false })
    this.props.onSeek(this.state.seek)
  }

  renderMarker () {
    return this.props.marker && this.props.marker !== this.props.duration ? (
      <span className='progress__marker'
        style={{ left: `${this.props.marker / this.props.duration * 100}%` }} />
    ) : null
  }

  render () {
    return (
      <div ref='progressBar'
        className={classnames('progress', this.props.className)}
        onMouseDown={(e) => this.startSeek(e)}>
        <progress className=' progress__bar'
          value={this.state.seeking ? this.state.seek : this.props.value}
          max={this.props.duration} />
        {this.renderMarker()}
      </div>
    )
  }
}
