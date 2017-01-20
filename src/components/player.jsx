import React from 'react'
import classnames from 'classnames'
import format from 'format-duration'

const Player = ({ className, playing, progress, duration, togglePlay }) => (
  <div className={classnames(className, 'player')}>
    <button onClick={togglePlay}>
      {playing ? 'Pause' : 'Play'}
    </button>
    <span>
      {format(progress * 1000)} / {format(duration * 1000)}
    </span>
  </div>
)

export default Player
