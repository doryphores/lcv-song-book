import React from 'react'
import classnames from 'classnames'
import format from 'format-duration'
import { Howl } from 'howler'

export default class Player extends React.Component {
  constructor () {
    super()
    this.howl = null
    this.state = {
      duration: 0,
      progress: 0,
      playing: false,
      paused: false,
      loading: false
    }
  }

  componentDidMount () {
    if (this.props.recordingURL) {
      this.loadRecording(this.props.recordingURL)
    }
  }

  componentWillUnmount () {
    if (this.animationFrame) window.cancelAnimationFrame(this.animationFrame)
    if (this.howl) this.howl.unload()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.recordingURL !== this.props.recordingURL) {
      this.loadRecording(nextProps.recordingURL)
    }
  }

  loadRecording (src) {
    if (this.howl) this.howl.unload()

    this.setState({
      progress: 0,
      loading: true,
      playing: false,
      paused: false
    })

    this.howl = new Howl({
      src: [`http://www.londoncityvoices.co.uk${src}`],
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
    this.setState({
      progress: this.howl.seek() || 0
    })

    if (this.howl.playing()) {
      this.animationFrame = window.requestAnimationFrame(this.step.bind(this))
    }
  }

  togglePlay () {
    if (this.state.playing) {
      this.howl.pause()
    } else {
      this.howl.play()
    }
  }

  render () {
    return (
      <div className={classnames(this.props.className, 'player')}>
        <button onClick={this.togglePlay.bind(this)}>
          {this.state.playing ? 'Pause' : 'Play'}
        </button>
        <span>
          {format(this.state.progress * 1000)} / {format(this.state.duration * 1000)}
        </span>
      </div>
    )
  }
}
