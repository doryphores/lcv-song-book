import React from 'react'
import { connect } from 'react-redux'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import Icon from './icon'
import { dismiss, addToCurrentPlaylist } from '../actions'

const Notifications = ({ notifications, onDismiss, onAddToPlaylist }) => (
  <TransitionGroup className='notification-container' component='div'>
    {notifications.map(({ id, message, icon, song }) => (
      <CSSTransition key={id} timeout={320} classNames='slide-left' unmountOnExit mountOnEnter>
        <div className='notification theme--dark u-flex u-flex--horizontal'
          onClick={() => onDismiss(id)}>
          <Icon icon={icon} className='notification__icon u-flex__panel' />
          <span className='u-flex__panel u-flex__panel--grow'>
            {message}
          </span>
          {song && (
            <button className='button notification__action'
              onClick={() => { onAddToPlaylist(song) }}>
              Add to playlist
            </button>
          )}
        </div>
      </CSSTransition>
    ))}
  </TransitionGroup>
)

function mapStateToProps ({ notifications }) {
  return { notifications }
}

function mapDispatchToProps (dispatch) {
  return {
    onDismiss: (message) => dispatch(dismiss(message)),
    onAddToPlaylist: (song) => dispatch(addToCurrentPlaylist(song))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
