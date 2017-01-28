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
      track: 'voice',
      recordingURL: '',
      duration: 0,
      progress: 0,
      previousProgress: 0,
      startMarker: 0,
      playing: false,
      seeking: false,
      loading: false
    }
    this.cancelSeek = this.cancelSeek.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount () {
    if (this.props.voiceRecordingURL) {
      this.setState({
        recordingURL: this.recordingURL()
      })
    }
    window.addEventListener('mouseup', this.cancelSeek)
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    if (this.animationFrame) window.cancelAnimationFrame(this.animationFrame)
    if (this.howl) this.howl.unload()
    window.removeEventListener('mouseup', this.cancelSeek)
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.voiceRecordingURL !== nextProps.voiceRecordingURL) {
      this.setState({
        recordingURL: this.recordingURL({ props: nextProps })
      })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.recordingURL !== prevState.recordingURL) {
      this.loadRecording(prevProps.voiceRecordingURL === this.props.voiceRecordingURL)
    }
  }

  recordingURL ({ track, props } = {}) {
    return (props || this.props)[`${track || this.state.track}RecordingURL`]
  }

  loadRecording (retainProgress = false) {
    if (this.howl) this.howl.unload()

    let stateReset = {
      loading: true,
      playing: false,
      seeking: false
    }

    if (!retainProgress) {
      Object.assign(stateReset, {
        duration: 0,
        progress: 0,
        previousProgress: 0,
        startMarker: 0
      })
    }

    this.setState(stateReset)

    this.howl = new Howl({
      src: [this.state.recordingURL],
      onload: () => {
        this.howl.seek(this.state.progress)
        this.setState({
          loading: false,
          duration: this.howl.duration()
        })
      },
      onplay: () => {
        this.setState({
          playing: true,
          loading: false
        })
        this.step()
      },
      onpause: () => {
        this.setState({
          playing: false,
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

  handleKeyDown (e) {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
    switch (e.which) {
      case 32:
        this.togglePlay()
        e.preventDefault()
        break
      case 37:
        if (this.howl) {
          this.howl.seek(this.state.startMarker)
          if (!this.state.playing) {
            this.setState({ progress: this.state.startMarker })
          }
        }
        break
    }
  }

  togglePlay (e) {
    if (this.state.playing) {
      this.howl.pause()
    } else {
      this.howl.play()
    }
  }

  seekFromMouseEvent (e) {
    let rect = this.refs.progressBar.getBoundingClientRect()
    return (e.clientX - rect.left) / rect.width * this.state.duration
  }

  startSeek (e) {
    this.setState({
      previousProgress: this.state.progress,
      progress: this.seekFromMouseEvent(e),
      seeking: true
    })
  }

  updateSeek (e) {
    if (!this.state.seeking) return
    this.setState({ progress: this.seekFromMouseEvent(e) })
  }

  stopSeek (e) {
    e.stopPropagation()
    this.setState({
      seeking: false,
      startMarker: this.state.progress
    })
    this.howl.seek(this.state.progress)
  }

  cancelSeek (e) {
    if (!this.state.seeking) return
    this.setState({
      seeking: false,
      progress: this.state.previousProgress
    })
  }

  selectTrack (track) {
    this.setState({
      track: track,
      recordingURL: this.recordingURL({ track })
    })
  }

  classNames (classNames) {
    return classnames(this.props.className, classNames, {
      'player--loading': this.state.loading,
      'player--empty': this.state.recordingURL === ''
    })
  }

  toggleClassNames (t) {
    return classnames('toggle', {
      'toggle--selected': t === this.state.track
    })
  }

  markerStyles () {
    return {
      display: (this.state.startMarker === 0) ? 'none' : 'block',
      left: `${this.state.startMarker / this.state.duration * 100}%`
    }
  }

  render () {
    if (!this.props.voiceRecordingURL) return null

    return (
      <div className={this.classNames('player u-flex u-flex--horizontal')}>
        <button className='u-flex__panel player__button'
          onClick={this.togglePlay.bind(this)}
          disabled={this.state.loading}
          onKeyUp={(e) => e.preventDefault()}>
          <Icon className='player__button-icon' icon={this.state.playing ? 'pause_circle_filled' : 'play_circle_filled'} />
        </button>
        <div className='player__track-switcher'>
          {['voice', 'full'].map(t => (
            <button key={t}
              className={this.toggleClassNames(t)}
              title={t}
              onClick={this.selectTrack.bind(this, t)}>
              {t.charAt(0)}
            </button>
          ))}
        </div>
        <span className='u-flex__panel player__time'>
          {format(this.state.progress * 1000)}
        </span>
        <div ref='progressBar'
          className='player__progress progress u-flex__panel u-flex__panel--grow'
          onMouseMove={(e) => this.updateSeek(e)}
          onMouseDown={(e) => this.startSeek(e)}
          onMouseUp={(e) => this.stopSeek(e)}>
          <progress className=' progress__bar'
            value={this.state.progress}
            max={this.state.duration} />
          <span className='progress__marker'
            style={this.markerStyles()} />
        </div>
        <span className='u-flex__panel player__duration'>
          {format(this.state.duration * 1000)}
        </span>
      </div>
    )
  }
}
