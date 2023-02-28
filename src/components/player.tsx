import React from 'react'
import classnames from 'classnames'
import format from 'format-duration'
import { Howl } from 'howler'
import { last } from 'lodash'

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

type Track = 'voice' | 'full' | 'both'

type PlayerProps = {
  className: string
  markers: SongMarkers
  voiceRecordingURL: string
  fullRecordingURL: string
  onAddMarker: (position: number) => void
  onRemoveMarker: (position: number) => void
}

type PlayerState = {
  track: Track
  duration: number
  progress: number
  playing: boolean
  loading: number
}

type PlayHeads = {
  voice: Howl
  full: Howl
}

export default class Player extends React.Component<PlayerProps, PlayerState> {
  private playHeads?: PlayHeads
  private keyCapture: KeyCapture
  private animationFrame?: number

  constructor (props: PlayerProps) {
    super(props)

    this.state = {
      track: 'voice',
      duration: 0,
      progress: 0,
      playing: false,
      loading: 0
    }

    this.keyCapture = new KeyCapture({
      'Space': () => { this.togglePlay(); return false },
      'ArrowLeft': () => {
        const pos = last(this.props.markers.filter(m => m < this.state.progress - 0.5))
        this.jumpTo(pos || 0)
      },
      'ArrowRight': () => {
        const pos = this.props.markers.find(m => m > this.state.progress)
        if (pos) this.jumpTo(pos)
      },
      '1 2 3 4 5 6 7 8 9': (key: string) => {
        const pos = this.props.markers[parseInt(key, 10) - 1]
        if (pos) this.jumpTo(pos)
      },
      'm': () => this.props.onAddMarker(this.state.progress),
      'f': () => this.selectTrack('full'),
      'v': () => this.selectTrack('voice'),
      'b': () => this.selectTrack('both')
    })
  }

  componentDidMount () {
    this.loadRecordings()
  }

  componentWillUnmount () {
    if (this.animationFrame) window.cancelAnimationFrame(this.animationFrame)
    this.unloadRecordings()
  }

  componentDidUpdate (prevProps: PlayerProps, prevState: PlayerState) {
    if (this.props.voiceRecordingURL !== prevProps.voiceRecordingURL) {
      this.loadRecordings()
    }

    if (prevState.track !== this.state.track) {
      this.configureTrack('full', 'voice')
    }
  }

  forEachHowl (func: (h: Howl) => void) {
    if (this.playHeads === undefined) return
    func(this.playHeads.voice)
    func(this.playHeads.full)
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

    this.playHeads = {
      voice: new Howl({
        src: [this.props.voiceRecordingURL.replace('https://', 'lcvfile://')],
        html5: true,
        onload: () => {
          this.configureTrack('voice')
          if (this.playHeads === undefined) return
          this.playHeads.voice.seek(this.state.progress)
          this.setState((s) => ({
            loading: s.loading - 1,
            duration: this.playHeads.voice.duration()
          }))
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
      }),
      full: new Howl({
        src: [this.props.fullRecordingURL.replace('https://', 'lcvfile://')],
        html5: true,
        onload: () => {
          this.configureTrack('full')
          if (this.playHeads === undefined) return
          this.playHeads.full.seek(this.state.progress)
          this.setState((s) => ({ loading: s.loading - 1 }))
        }
      })
    }
  }

  configureTrack (...tracks: (keyof PlayHeads)[]) {
    tracks.forEach(track => {
      if (this.playHeads === undefined) return
      this.playHeads[track].stereo(TRACK_SETTINGS[track][this.state.track].stereo)
      this.playHeads[track].volume(TRACK_SETTINGS[track][this.state.track].volume)
    })
  }

  step () {
    if (this.playHeads !== undefined && this.playHeads.voice.playing()) {
      this.setState({ progress: this.playHeads['voice'].seek() as number || 0 })
      this.animationFrame = window.requestAnimationFrame(this.step.bind(this))
    }
  }

  togglePlay () {
    if (this.state.playing) {
      this.forEachHowl(h => h.pause())
    } else {
      this.forEachHowl(h => h.play())
    }
  }

  jumpTo (value: number) {
    if (value === this.state.duration) value = 0
    this.setState({ progress: value })
    this.forEachHowl(h => h.seek(value))
  }

  selectTrack (track: Track) {
    this.setState({ track: track })
  }

  isEmpty () {
    return !this.props.voiceRecordingURL
  }

  classNames (classNames: string) {
    return classnames(this.props.className, classNames, {
      'player--loading': this.state.loading > 0,
      'player--empty': this.isEmpty()
    })
  }

  toggleClassNames (track: string) {
    return classnames('toggle', {
      'toggle--selected': track === this.state.track
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
          {['voice', 'full', 'both'].map((t) => (
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
