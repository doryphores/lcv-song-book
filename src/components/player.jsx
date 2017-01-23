import React from 'react'
import classnames from 'classnames'
import format from 'format-duration'
import { Howl } from 'howler'

import Icon from './icon'

export default class Player extends React.Component {
  constructor () {
    super()
    this.howl = null
    this.state = {
      duration: 0,
      progress: 0,
      playing: false,
      paused: false,
      seeking: false,
      loading: false
    }
    this.cancelSeek = this.cancelSeek.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentDidMount () {
    if (this.props.recordingURL) {
      this.loadRecording(this.props.recordingURL)
    }
    window.addEventListener('mouseup', this.cancelSeek)
    window.addEventListener('keypress', this.handleKeyPress)
  }

  componentWillUnmount () {
    if (this.animationFrame) window.cancelAnimationFrame(this.animationFrame)
    if (this.howl) this.howl.unload()
    window.removeEventListener('mouseup', this.cancelSeek)
    window.removeEventListener('keypress', this.handleKeyPress)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.recordingURL !== this.props.recordingURL) {
      this.loadRecording(nextProps.recordingURL)
    }
  }

  loadRecording (src) {
    if (this.howl) this.howl.unload()

    this.setState({
      duration: 0,
      progress: 0,
      loading: true,
      playing: false,
      paused: false,
      seeking: false
    })

    this.howl = new Howl({
      src: [src],
      onload: () => {
        this.setState({
          loading: false,
          duration: this.howl.duration()
        })
      },
      onplay: () => {
        this.setState({
          playing: true,
          paused: false,
          loading: false
        })
        this.step()
      },
      onpause: () => {
        this.setState({
          playing: false,
          paused: true,
          loading: false
        })
      }
    })
  }

  step () {
    if (!this.state.seeking) {
      this.setState({ progress: this.howl.seek() || 0 })
    }

    if (this.howl.playing()) {
      this.animationFrame = window.requestAnimationFrame(this.step.bind(this))
    }
  }

  handleKeyPress (e) {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
    switch (e.which) {
      case 32:
        this.togglePlay()
        e.preventDefault()
        break
    }
  }

  togglePlay () {
    if (this.state.playing) {
      this.howl.pause()
    } else {
      this.howl.play()
    }
  }

  seekFromMouseEvent (e) {
    return (e.clientX - e.target.offsetLeft) / e.target.offsetWidth * this.state.duration
  }

  startSeek (e) {
    this.setState({
      progress: this.seekFromMouseEvent(e),
      seeking: true
    })
  }

  updateSeek (e) {
    if (!this.state.seeking) return
    this.setState({ progress: this.seekFromMouseEvent(e) })
  }

  stopSeek (e) {
    this.setState({ seeking: false })
    this.howl.seek(this.state.progress)
  }

  cancelSeek (e) {
    this.setState({ seeking: false })
  }

  render () {
    if (!this.props.recordingURL) return null

    return (
      <div className={classnames(this.props.className, 'player u-flex u-flex--horizontal')}>
        <button className='u-flex__panel player__button' onClick={this.togglePlay.bind(this)}>
          <Icon className='player__button-icon' icon={this.state.playing ? 'pause_circle_filled' : 'play_circle_filled'} />
        </button>
        <span className='u-flex__panel player__time'>
          {format(this.state.progress * 1000)}
        </span>
        <progress className='player__progress u-flex__panel u-flex__panel--grow'
          onMouseMove={(e) => this.updateSeek(e)}
          onMouseDown={(e) => this.startSeek(e)}
          onMouseUp={(e) => this.stopSeek(e)}
          value={this.state.progress}
          max={this.state.duration} />
        <span className='u-flex__panel player__duration'>
          {format(this.state.duration * 1000)}
        </span>
      </div>
    )
  }
}
