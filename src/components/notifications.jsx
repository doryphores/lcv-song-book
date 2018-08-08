import React, { ReactFragment } from 'react'
import { connect } from 'react-redux'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import Icon from './icon'
import { dismiss, addToCurrentPlaylist } from '../actions'

const Notifications = ({ notifications, onDismiss, onView }) => (
  <TransitionGroup className='notification-container' component='div'>
    {notifications.map(({ id, message, icon, song }) => (
      <CSSTransition key={id} timeout={320} classNames='grow' unmountOnExit mountOnEnter>
        <div className='notification u-flex u-flex--horizontal'
          onClick={() => onDismiss(id)}>
          <Icon icon={icon} className='notification__icon u-flex__panel' />
          <span className='u-flex__panel u-flex__panel--grow'>
            {message + ' '}
            {song && (
              <ReactFragment>
                {song + ' '}
                <span className='notification__song' onClick={() => onView(song)}>
                  Add to current playlist
                </span>
              </ReactFragment>
            )}
          </span>
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
    onView: (song) => dispatch(addToCurrentPlaylist(song))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
