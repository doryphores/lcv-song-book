import React from 'react'
import classnames from 'classnames'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

interface ProgressBarProps {
  readonly className: string
  readonly value: number
  readonly duration: number
  readonly markers: SongMarkers
  readonly onSeek: (seek: number) => void
  readonly onAddMarker: (position: number) => void
  readonly onRemoveMarker: (position: number) => void
}

interface ProgressBarState {
  readonly seeking: boolean
  readonly seek: number
}

export default class ProgressBar extends React.Component<ProgressBarProps, ProgressBarState> {
  private progressBar: React.RefObject<HTMLDivElement>

  constructor (props: ProgressBarProps) {
    super(props)
    this.state = {
      seeking: false,
      seek: props.value
    }
    this.progressBar = React.createRef()
  }

  handleWindowMouseMove = (e: MouseEvent) => {
    this.updateSeek(this.seekFromMouseEvent(e))
  }

  handleWindowMouseUp = () => {
    this.removeWindowListeners()
    this.setState({ seeking: false })
    this.props.onSeek(this.state.seek)
  }

  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return // left click only
    window.addEventListener('mousemove', this.handleWindowMouseMove)
    window.addEventListener('mouseup', this.handleWindowMouseUp)
    this.updateSeek(this.seekFromMouseEvent(e.nativeEvent))
  }

  handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 2) return // right click only
    this.props.onAddMarker(this.seekFromMouseEvent(e.nativeEvent))
  }

  componentWillUnmount () {
    this.removeWindowListeners()
  }

  removeWindowListeners () {
    window.removeEventListener('mousemove', this.handleWindowMouseMove)
    window.removeEventListener('mouseup', this.handleWindowMouseUp)
  }

  seekFromMouseEvent (e: MouseEvent) {
    if (this.progressBar.current === null) return 0
    const rect = this.progressBar.current.getBoundingClientRect()
    const seek = (e.clientX - rect.left) / rect.width * this.props.duration
    return Math.min(Math.max(0, seek), this.props.duration)
  }

  updateSeek (seek: number) {
    this.setState({
      seeking: true,
      seek
    })
  }

  removeMarker (position: number, e: React.MouseEvent<HTMLSpanElement>) {
    if (e.button !== 2) return // right click only
    e.stopPropagation()
    this.props.onRemoveMarker(position)
  }

  render () {
    return (
      <div ref={this.progressBar}
        className={classnames('progress', this.props.className)}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}>
        <progress className=' progress__bar'
          value={this.state.seeking ? this.state.seek : this.props.value}
          max={this.props.duration} />
        <TransitionGroup>
          {this.props.duration > 0 && this.props.markers.map((pos, i) => (
            <CSSTransition key={pos} timeout={200} classNames='progress__marker-'>
              <span className='progress__marker'
                onMouseUp={(e) => this.removeMarker(pos, e)}
                style={{ left: `${pos / this.props.duration * 100}%` }}>
                {i + 1}
              </span>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    )
  }
}
