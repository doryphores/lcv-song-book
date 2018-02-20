import React from 'react'
import classnames from 'classnames'
import format from 'format-duration'
import { Howl } from 'howler'
import _ from 'lodash'

import ProgressBar from './progress_bar'
import Icon from './icon'
import KeyCapture from '../key_capture'

const TRACK_SETTINGS = {
  voice: {
    voice: {
      stereo: 0,
      volume: 1
    },
    full: {
      stereo: 0,
      volume: 0
    },
    both: {
      stereo: -1,
      volume: 0.5
    }
  },
  full: {
    voice: {
      stereo: 0,
      volume: 0
    },
    full: {
      stereo: 0,
      volume: 1
    },
    both: {
      stereo: 1,
      volume: 0.5
    }
  }
}

export default class Player extends React.Component {
  constructor (props) {
    super()
    this.howls = {}
    this.state = {
      track: 'voice',
      duration: 0,
      progress: 0,
      playing: false,
      loading: 0
    }

    this.keyCapture = new KeyCapture({
      'space': () => this.togglePlay(),
      'left': () => {
        let pos = _.last(this.props.markers.filter(m => m < Math.floor(this.state.progress)))
        this.jumpTo(pos || 0)
      },
      'right': () => {
        let pos = this.props.markers.find(m => m > this.state.progress)
        if (pos) this.jumpTo(pos)
      },
      'M': () => this.props.onAddMarker(this.state.progress),
      'F': () => this.selectTrack('full'),
      'V': () => this.selectTrack('voice'),
      'B': () => this.selectTrack('both')
    })
  }

  componentDidMount () {
    this.loadRecordings()
  }

  componentWillUnmount () {
    if (this.animationFrame) window.cancelAnimationFrame(this.animationFrame)
    this.unloadRecordings()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.voiceRecordingURL !== prevProps.voiceRecordingURL) {
      this.loadRecordings()
    }

    if (prevState.track !== this.state.track) {
      this.configureTrack('full', 'voice')
    }
  }

  forEachHowl (func) {
    Object.keys(this.howls).forEach(k => func(this.howls[k]))
  }

  unloadRecordings () {
    this.keyCapture.deactivate()
    this.forEachHowl(h => h.unload())
  }

  loadRecordings () {
    this.unloadRecordings()

    if (this.props.fullRecordingURL === '') return

    this.keyCapture.activate()

    this.setState({
      loading: 2,
      playing: false,
      duration: 0,
      progress: 0
    })

    this.howls.voice = new Howl({
      src: [this.props.voiceRecordingURL],
      onload: () => {
        this.configureTrack('voice')
        this.howls.voice.seek(this.state.progress)
        this.setState({
          loading: this.state.loading - 1,
          duration: this.howls.voice.duration()
        })
      },
      onplay: () => {
        this.setState({
          playing: true
        })
        this.step()
      },
      onpause: () => {
        this.setState({
          playing: false
        })
      },
      onend: () => {
        this.setState({
          progress: 0,
          playing: false
        })
      }
    })

    this.howls.full = new Howl({
      src: [this.props.fullRecordingURL],
      onload: () => {
        this.configureTrack('full')
        this.howls.full.seek(this.state.progress)
        this.setState({
          loading: this.state.loading - 1
        })
      }
    })
  }

  configureTrack (...tracks) {
    tracks.forEach(track => {
      this.howls[track].stereo(TRACK_SETTINGS[track][this.state.track].stereo)
      this.howls[track].volume(TRACK_SETTINGS[track][this.state.track].volume)
    })
  }

  step () {
    if (this.howls.voice.playing()) {
      this.setState({ progress: this.howls.voice.seek() || 0 })
      this.animationFrame = window.requestAnimationFrame(this.step.bind(this))
    }
  }

  togglePlay (e) {
    if (this.state.playing) {
      this.forEachHowl(h => h.pause())
    } else {
      this.forEachHowl(h => h.play())
    }
  }

  jumpTo (value) {
    if (value === this.state.duration) value = 0
    this.setState({ progress: value })
    this.forEachHowl(h => h.seek(value))
  }

  selectTrack (track) {
    this.setState({ track: track })
  }

  isEmpty () {
    return !this.props.voiceRecordingURL
  }

  classNames (classNames) {
    return classnames(this.props.className, classNames, {
      'player--loading': this.state.loading > 0,
      'player--empty': this.isEmpty()
    })
  }

  toggleClassNames (t) {
    return classnames('toggle', {
      'toggle--selected': t === this.state.track
    })
  }

  render () {
    if (this.isEmpty()) return null

    return (
      <div className={this.classNames('player u-flex u-flex--horizontal')}>
        <button className='u-flex__panel player__button'
          onClick={this.togglePlay.bind(this)}
          disabled={this.state.loading > 0}
          onKeyUp={(e) => e.preventDefault()}>
          <Icon className='player__button-icon' icon={this.state.playing ? 'pause_circle_filled' : 'play_circle_filled'} />
        </button>
        <div className='player__track-switcher'>
          {['voice', 'full', 'both'].map(t => (
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
        <ProgressBar className='player__progress u-flex__panel u-flex__panel--grow'
          duration={this.state.duration}
          value={this.state.progress}
          markers={this.props.markers}
          onSeek={this.jumpTo.bind(this)}
          onAddMarker={this.props.onAddMarker}
          onRemoveMarker={this.props.onRemoveMarker} />
        <span className='u-flex__panel player__duration'>
          {format(this.state.duration * 1000)}
        </span>
      </div>
    )
  }
}
