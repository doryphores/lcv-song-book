import EventEmitter from 'events'
import { Howl } from 'howler'

import {
  SONG_SELECTED, TOGGLE_PLAY,
  PLAYER_LOADED, PLAYER_PLAYING, PLAYER_PAUSED, PLAYER_PROGRESS
} from '../actions'

class Player extends EventEmitter {
  constructor () {
    super()
    this.howl = null
  }

  load (src) {
    this.unload()
    this.howl = new Howl({
      src: [src],
      onload: () => this.emit('loaded', {
        duration: this.howl.duration()
      }),
      onplay: () => {
        this.emit('playing')
        this.step()
      },
      onpause: () => this.emit('paused')
    })
  }

  unload () {
    if (this.howl) {
      this.howl.unload()
      delete this.howl
    }
  }

  play () {
    this.howl.play()
  }

  pause () {
    if (this.howl) this.howl.pause()
  }

  togglePlay () {
    if (this.playing()) {
      this.pause()
    } else {
      this.play()
    }
  }

  step () {
    this.emit('progress', this.howl.seek() || 0)

    if (this.playing()) {
      window.requestAnimationFrame(this.step.bind(this))
    }
  }

  playing () {
    return this.howl && this.howl.playing()
  }

  loaded () {
    return this.howl && this.howl.state() !== 'unloaded'
  }
}

let player = new Player()

const adapter = store => next => action => {
  switch (action.type) {
    case SONG_SELECTED:
      player.load(`http://www.londoncityvoices.co.uk${action.payload.recordings.voice}`)
      break
    case TOGGLE_PLAY:

      player.togglePlay()
      break
  }
  return next(action)
}

const connect = store => {
  player.on('progress', time => {
    store.dispatch({
      type: PLAYER_PROGRESS,
      payload: time
    })
  })

  player.on('loaded', ({ duration }) => {
    store.dispatch({
      type: PLAYER_LOADED,
      payload: duration
    })
  })

  player.on('play', () => {
    store.dispatch({ type: PLAYER_PLAYING })
  })

  player.on('paused', () => {
    store.dispatch({ type: PLAYER_PAUSED })
  })
}

export { adapter, connect }
