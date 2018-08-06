import React from 'react'
import classnames from 'classnames'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

export default class ProgressBar extends React.Component {
  constructor (props) {
    super()
    this.state = {
      seeking: false,
      seek: props.value
    }
    this.updateSeek = this.updateSeek.bind(this)
    this.stopSeek = this.stopSeek.bind(this)
    this.startSeek = this.startSeek.bind(this)
    this.setMarker = this.setMarker.bind(this)
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
    if (e.button !== 0) return // left click only
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

  setMarker (e) {
    if (e.button !== 2) return // right click only
    this.props.onAddMarker(this.seekFromMouseEvent(e))
  }

  removeMarker (position, e) {
    if (e.button !== 2) return // right click only
    e.stopPropagation()
    this.props.onRemoveMarker(position)
  }

  beatGridStyles () {
    return this.props.beats && {
      backgroundPosition: (this.props.beats.offset / this.props.duration * 100).toString() + '%',
      backgroundSize: (60 / this.props.beats.bpm / this.props.duration * 400).toString() + '%'
    }
  }

  render () {
    return (
      <div ref='progressBar'
        className={classnames('progress', this.props.className)}
        style={this.beatGridStyles()}
        onMouseDown={this.startSeek}
        onMouseUp={this.setMarker}>
        <progress className=' progress__bar'
          value={this.state.seeking ? this.state.seek : this.props.value}
          max={this.props.duration} />
        <TransitionGroup>
          {this.props.duration > 0 && this.props.markers.map((m, i) => (
            <CSSTransition key={m} timeout={320} classNames='progress__marker-'>
              <span className='progress__marker'
                onMouseUp={this.removeMarker.bind(this, m)}
                style={{ left: `${m / this.props.duration * 100}%` }}>{i + 1}</span>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    )
  }
}
